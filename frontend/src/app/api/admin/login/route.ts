import { NextResponse } from "next/server";
import { setAdminCookie, verifyAdminPassword } from "@/lib/admin-auth";

export const dynamic = "force-static";

export async function POST(request: Request) {
  if (process.env.NEXT_PUBLIC_APPROVAL_PREVIEW === "true") {
    return NextResponse.json({ preview: true }, { status: 403 });
  }
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";
  if (!(await verifyAdminPassword(password))) {
    return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });
  }
  await setAdminCookie();
  return NextResponse.json({ ok: true });
}
