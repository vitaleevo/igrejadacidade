import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/admin-auth";

export async function POST() {
  if (process.env.NEXT_PUBLIC_APPROVAL_PREVIEW === "true") {
    return NextResponse.json({ preview: true });
  }
  await clearAdminCookie();
  return NextResponse.json({ ok: true });
}
