import { NextResponse } from "next/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { isAdmin } from "@/lib/admin-auth";
import { api } from "../../../../../convex/_generated/api";

export const dynamic = "force-static";

const PREVIEW = process.env.NEXT_PUBLIC_APPROVAL_PREVIEW === "true";
const ADMIN_KEY = process.env.ADMIN_API_KEY || "";

function shape(t: {
  id: string;
  fullName: string;
  story: string;
  happenedAt?: string;
  category: string;
  mediaUrl: string | null;
  mediaType?: "image" | "video";
  createdAt: number;
  phone: string | null;
  email: string | null;
  allowContact: boolean;
  publicationConsent: string;
  status: string;
  moderatedAt: number | null;
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
    phone: t.phone,
    email: t.email,
    allow_contact: t.allowContact,
    publication_consent: t.publicationConsent,
    status: t.status,
    moderated_at: t.moderatedAt ? new Date(t.moderatedAt).toISOString() : null,
  };
}

// GET /api/admin/testimonies?status=pending&limit=50
export async function GET(request: Request) {
  if (PREVIEW) return NextResponse.json({ preview: true, data: [] });
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 50, 1), 100);
    const list = await fetchQuery(api.testimonies.adminList, {
      adminKey: ADMIN_KEY,
      status:
        status === "pending" || status === "approved" || status === "rejected"
          ? status
          : undefined,
      limit,
    });
    return NextResponse.json(list.map(shape));
  } catch {
    return NextResponse.json({ error: "Erro ao carregar." }, { status: 500 });
  }
}

// PATCH /api/admin/testimonies {id, status?, publication_consent?}
export async function PATCH(request: Request) {
  if (PREVIEW) return NextResponse.json({ preview: true }, { status: 403 });
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  const body = await request.json().catch(() => null);
  const id = body?.id;
  if (typeof id !== "string" || !id) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }
  const payload: { status?: "pending" | "approved" | "rejected"; publicationConsent?: "publish" | "internal" } = {};
  if (body.status === "approved" || body.status === "rejected" || body.status === "pending") {
    payload.status = body.status;
  }
  if (body.publication_consent === "publish" || body.publication_consent === "internal") {
    payload.publicationConsent = body.publication_consent;
  }
  if (!payload.status && !payload.publicationConsent) {
    return NextResponse.json({ error: "Nada para atualizar." }, { status: 400 });
  }
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined;
    const updated = await fetchMutation(api.testimonies.moderate, {
      adminKey: ADMIN_KEY,
      id,
      ...payload,
      ip,
    });
    return NextResponse.json(shape(updated));
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar." }, { status: 500 });
  }
}
