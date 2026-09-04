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
    const m = String((e as Error)?.message ?? "");
    const found = m.match(/Uncaught ConvexError:\s*(\{[\s\S]*?\})/);
    let status = 500;
    let message = "Upload not allowed.";
    if (found) {
      try {
        const data = JSON.parse(found[1]) as { code?: unknown; message?: unknown };
        if (typeof data.code === "number") status = data.code;
        if (status < 500 && typeof data.message === "string" && data.message.length < 300) {
          message = data.message;
        }
      } catch {
        /* genérico */
      }
    }
    return NextResponse.json({ detail: message }, { status });
  }
}
