import { NextResponse } from "next/server";
import { setAdminCookie, verifyAdminPassword } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";
  if (!(await verifyAdminPassword(password))) {
    return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });
  }
  await setAdminCookie();
  return NextResponse.json({ ok: true });
}
