import { NextResponse } from "next/server";
import { fetchQuery } from "convex/nextjs";
import { isAdmin } from "@/lib/admin-auth";
import { api } from "../../../../../convex/_generated/api";

export const dynamic = "force-static";

const PREVIEW = process.env.NEXT_PUBLIC_APPROVAL_PREVIEW === "true";

export async function GET() {
  if (PREVIEW) return NextResponse.json({ preview: true, data: [] });
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  try {
    const rows = await fetchQuery(api.testimonies.auditList, {
      adminKey: process.env.ADMIN_API_KEY || "",
      limit: 50,
    });
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "Erro ao carregar." }, { status: 500 });
  }
}
