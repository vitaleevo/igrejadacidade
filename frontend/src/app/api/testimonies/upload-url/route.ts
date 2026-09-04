import { NextResponse } from "next/server";
import { fetchMutation } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";

export const dynamic = "force-static";

const PREVIEW = process.env.NEXT_PUBLIC_APPROVAL_PREVIEW === "true";

// GET /api/testimonies/upload-url?contentType=&sizeBytes= — URL curta para upload direto ao Convex.
export async function GET(request: Request) {
  if (PREVIEW || !process.env.NEXT_PUBLIC_CONVEX_URL) {
    return NextResponse.json({ detail: "Not available in preview." }, { status: 403 });
  }
  try {
    const url = new URL(request.url);
    const contentType = url.searchParams.get("contentType") || "";
    const sizeBytes = Number(url.searchParams.get("sizeBytes")) || 0;
    const uploadUrl = await fetchMutation(api.testimonies.generateUploadUrl, {
      contentType,
      sizeBytes,
    });
    return NextResponse.json({ uploadUrl });
  } catch (e) {
    const status = (e as { data?: { code?: unknown } })?.data?.code;
    const message = typeof (e as Error)?.message === "string" ? (e as Error).message : "Upload not allowed.";
    return NextResponse.json(
      { detail: typeof status === "number" && status < 500 ? message : "Upload not allowed." },
      { status: typeof status === "number" ? status : 500 }
    );
  }
}
