import { after, NextResponse } from "next/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import nodemailer from "nodemailer";
import { api } from "../../../../convex/_generated/api";

export const dynamic = "force-static";

const PREVIEW = process.env.NEXT_PUBLIC_APPROVAL_PREVIEW === "true";
const CONVEX_MISSING = !process.env.NEXT_PUBLIC_CONVEX_URL;

function errStatus(e: unknown): number {
  const code = (e as { data?: { code?: unknown } })?.data?.code;
  return typeof code === "number" ? code : 500;
}

function errMessage(e: unknown, status: number, fallback: string): string {
  if (status === 422 || status === 400) {
    const m = (e as Error)?.message;
    if (typeof m === "string" && m.length < 300) return m;
  }
  return fallback;
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
    const status = errStatus(e);
    return NextResponse.json(
      { detail: errMessage(e, status, "Erro ao carregar testemunhos") },
      { status }
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
    const form = await request.formData();
    const str = (k: string) => {
      const v = form.get(k);
      return typeof v === "string" ? v : undefined;
    };
    const allowContact = str("allow_contact");
    if (allowContact !== "true" && allowContact !== "false") {
      return NextResponse.json({ detail: "Please choose whether we may contact you." }, { status: 422 });
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
    });
    notifyNewTestimony(result.id, str("full_name") ?? "", str("category") ?? "Other");
    return NextResponse.json({ id: result.id, status: "pending" }, { status: 201 });
  } catch (e) {
    const status = errStatus(e);
    return NextResponse.json(
      { detail: errMessage(e, status, "We could not confirm receipt. Please try again later.") },
      { status }
    );
  }
}
