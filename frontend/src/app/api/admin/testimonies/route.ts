import { NextResponse } from "next/server";
import { adminHeaders, backendUrl, isAdmin } from "@/lib/admin-auth";

// Proxy server-side: o browser nunca vê ADMIN_API_KEY.
// GET /api/admin/testimonies?status=pending&limit=50
export async function GET(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  const url = new URL(request.url);
  const qs = new URLSearchParams();
  const status = url.searchParams.get("status");
  if (status) qs.set("status", status);
  qs.set("limit", url.searchParams.get("limit") || "50");
  const res = await fetch(`${backendUrl()}/api/testimonies/admin?${qs.toString()}`, {
    headers: adminHeaders(),
    cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

// PATCH /api/admin/testimonies/:id  {status|publication_consent}
export async function PATCH(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  const body = await request.json().catch(() => null);
  const id = body?.id;
  if (!Number.isInteger(id)) return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  const payload: Record<string, string> = {};
  if (body.status === "approved" || body.status === "rejected" || body.status === "pending") {
    payload.status = body.status;
  }
  if (body.publication_consent === "publish" || body.publication_consent === "internal") {
    payload.publication_consent = body.publication_consent;
  }
  if (!Object.keys(payload).length) {
    return NextResponse.json({ error: "Nada para atualizar." }, { status: 400 });
  }
  const res = await fetch(`${backendUrl()}/api/testimonies/${id}`, {
    method: "PATCH",
    headers: { ...adminHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
