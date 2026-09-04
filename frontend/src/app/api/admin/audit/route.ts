import { NextResponse } from "next/server";
import { adminHeaders, backendUrl, isAdmin } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  const res = await fetch(`${backendUrl()}/api/testimonies/admin/audit?limit=50`, {
    headers: adminHeaders(),
    cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
