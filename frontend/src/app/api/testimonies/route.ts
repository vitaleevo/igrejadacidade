import { after, NextResponse } from "next/server";
import { headers } from "next/headers";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import nodemailer from "nodemailer";
import { api } from "../../../../convex/_generated/api";
import { EN_MSGS, type TestimonyMsgKey } from "@/lib/testimony-submission";

const PREVIEW = process.env.NEXT_PUBLIC_APPROVAL_PREVIEW === "true";
const CONVEX_MISSING = !process.env.NEXT_PUBLIC_CONVEX_URL;

/** Mensagens no idioma do pedido (header definido pelo middleware next-intl). */
async function loadMsgs(): Promise<(key: TestimonyMsgKey) => string> {
  try {
    const h = await headers();
    const loc = h.get("x-next-intl-locale");
    const locale = loc === "en" || loc === "fr" ? loc : "pt";
    const dict = (await import(`../../../../messages/${locale}.json`)).default as {
      TestimonyErrors?: Record<string, string>;
    };
    const errs = dict?.TestimonyErrors ?? {};
    return (key) => (typeof errs[key] === "string" && errs[key] ? errs[key] : EN_MSGS[key]);
  } catch {
    return (key) => EN_MSGS[key];
  }
}

/** Cloudflare Turnstile server-side. Sem secret configurado = passa (dev). */
async function verifyTurnstile(token: string | undefined, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, ...(ip ? { remoteip: ip } : {}) }),
      signal: AbortSignal.timeout(10_000),
    });
    const data = (await res.json().catch(() => null)) as { success?: unknown } | null;
    return data?.success === true;
  } catch {
    return false;
  }
}

function convexError(e: unknown): { status: number; message: string } {
  // fetchMutation/fetchQuery re-lançam ConvexError dentro da message:
  // "...Uncaught ConvexError: {\"code\":400,...}\n at ...". Extrair sem vazar stack.
  const m = String((e as Error)?.message ?? "");
  const found = m.match(/Uncaught ConvexError:\s*(\{[\s\S]*?\})/);
  if (found) {
    try {
      const data = JSON.parse(found[1]) as { code?: unknown; message?: unknown };
      const status = typeof data.code === "number" ? data.code : 500;
      const message =
        typeof data.message === "string" && data.message.length < 300
          ? data.message
          : null;
      if (status >= 400 && status < 500 && message) return { status, message };
      return { status: status >= 500 ? 500 : status, message: "" };
    } catch {
      /* cai no genérico */
    }
  }
  const code = (e as { data?: { code?: unknown } })?.data?.code;
  if (typeof code === "number" && code >= 400 && code < 500) {
    return { status: code, message: "" };
  }
  return { status: 500, message: "" };
}

function toPublicShape(t: {
  id: string;
  fullName: string;
  story: string;
  happenedAt?: string;
  category: string;
  mediaUrl: string | null;
  mediaType?: "image" | "video";
  createdAt: number;
}) {
  return {
    id: t.id,
    full_name: t.fullName,
    story: t.story,
    happened_at: t.happenedAt ?? null,
    category: t.category,
    media_url: t.mediaUrl,
    media_type: t.mediaType ?? null,
    created_at: new Date(t.createdAt).toISOString(),
  };
}

function notifyNewTestimony(id: string, fullName: string, category: string) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, NOTIFY_EMAIL } =
    process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD || !NOTIFY_EMAIL) return;
  after(async () => {
    try {
      const transport = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT || 465),
        secure: Number(SMTP_PORT || 465) === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
      });
      await transport.sendMail({
        from: SMTP_FROM || SMTP_USER,
        to: NOTIFY_EMAIL,
        subject: `Novo testemunho — ${fullName}`,
        text:
          `Novo testemunho recebido e pendente de moderação.\n\nID: ${id}\nNome: ${fullName}\nCategoria: ${category}\n\n` +
          `Moderar em: ${process.env.NEXT_PUBLIC_SITE_URL || "https://igrejadacidadeluanda.org"}/admin\n\nNão responda a este email automático.`,
      });
    } catch (e) {
      console.warn("notify email failed", (e as Error)?.message);
    }
  });
}

// GET /api/testimonies?category=&limit= — só aprovados publicados.
export async function GET(request: Request) {
  if (PREVIEW || CONVEX_MISSING) return NextResponse.json({ preview: PREVIEW, data: [] });
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category") || undefined;
    const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 20, 1), 100);
    const list = await fetchQuery(api.testimonies.listPublic, { category, limit });
    return NextResponse.json(list.map(toPublicShape));
  } catch (e) {
    const err = convexError(e);
    const msg = await loadMsgs().catch(() => (key: TestimonyMsgKey) => EN_MSGS[key]);
    return NextResponse.json(
      { detail: err.message || msg("api_err_load") },
      { status: err.status }
    );
  }
}

// POST /api/testimonies — FormData (ficheiro já subido ao Convex; só segue o storageId).
export async function POST(request: Request) {
  if (PREVIEW) {
    return NextResponse.json({ detail: "Approval preview. No testimony has been sent." }, { status: 403 });
  }
  if (CONVEX_MISSING) {
    return NextResponse.json({ detail: "Service not configured." }, { status: 503 });
  }
  try {
    const msg = await loadMsgs();
    const form = await request.formData();
    const str = (k: string) => {
      const v = form.get(k);
      return typeof v === "string" ? v : undefined;
    };
    const allowContact = str("allow_contact");
    if (allowContact !== "true" && allowContact !== "false") {
      return NextResponse.json({ detail: msg("err_contact_required") }, { status: 422 });
    }
    if (str("age_confirm") !== "true") {
      return NextResponse.json({ detail: msg("err_age_required") }, { status: 422 });
    }
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined;
    if (!(await verifyTurnstile(str("cf-turnstile-response"), ip))) {
      return NextResponse.json({ detail: msg("err_antirobot") }, { status: 400 });
    }
    const mediaType = str("mediaType");
    const result = await fetchMutation(api.testimonies.submit, {
      fullName: str("full_name") ?? "",
      phone: str("phone") || undefined,
      email: str("email") || undefined,
      story: str("story") ?? "",
      happenedAt: str("happened_at") || undefined,
      category: str("category") ?? "Other",
      mediaStorageId: (str("mediaStorageId") as never) || undefined,
      mediaType: mediaType === "image" || mediaType === "video" ? mediaType : undefined,
      allowContact: allowContact === "true",
      publicationConsent: str("publication_consent") ?? "internal",
      ageConfirm: true,
    });
    notifyNewTestimony(result.id, str("full_name") ?? "", str("category") ?? "Other");
    return NextResponse.json({ id: result.id, status: "pending" }, { status: 201 });
  } catch (e) {
    const err = convexError(e);
    const msg = await loadMsgs().catch(() => (key: TestimonyMsgKey) => EN_MSGS[key]);
    return NextResponse.json(
      { detail: err.message || msg("err_generic") },
      { status: err.status }
    );
  }
}
