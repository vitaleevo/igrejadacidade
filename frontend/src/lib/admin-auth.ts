import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE = "rccg_admin";
const ADMIN_KEY = process.env.ADMIN_API_KEY || "";

function sign(value: string): string {
  const secret = process.env.SECRET_KEY || process.env.ADMIN_API_KEY || "dev-only";
  return createHmac("sha256", secret).update(value).digest("hex");
}

export async function isAdmin(): Promise<boolean> {
  if (!ADMIN_KEY) return false;
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return false;
  const [marker, sig] = raw.split(".");
  if (marker !== "1" || !sig) return false;
  const expected = sign("1");
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  if (!ADMIN_KEY || !password) return false;
  try {
    return timingSafeEqual(Buffer.from(password), Buffer.from(ADMIN_KEY));
  } catch {
    return false;
  }
}

export async function setAdminCookie(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE, `1.${sign("1")}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8h
  });
}

export async function clearAdminCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export function backendUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || process.env.API_INTERNAL_URL || "http://localhost:8000";
}

export function adminHeaders(): Record<string, string> {
  return { "X-Admin-Key": ADMIN_KEY };
}
