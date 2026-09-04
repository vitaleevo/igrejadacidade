import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

export type AdminTestimony = {
  id: string;
  full_name: string;
  story: string;
  happened_at: string | null;
  category: string;
  media_url: string | null;
  media_type: string | null;
  created_at: string;
  phone: string | null;
  email: string | null;
  allow_contact: boolean;
  publication_consent: string;
  status: string;
  moderated_at: string | null;
};

export type AuditRow = {
  id: string;
  action: string;
  testimony_id: string | null;
  actor: string;
  ip: string | null;
  old_value: string | null;
  new_value: string | null;
  created_at: number;
};

type RawTestimony = {
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
};

const ADMIN_KEY = process.env.ADMIN_API_KEY || "";

function shape(t: RawTestimony): AdminTestimony {
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

export async function getAdminList(
  status: "pending" | "approved" | "rejected",
  limit = 50
): Promise<AdminTestimony[]> {
  try {
    const list = await fetchQuery(api.testimonies.adminList, {
      adminKey: ADMIN_KEY,
      status,
      limit,
    });
    return list.map(shape);
  } catch {
    return [];
  }
}

export async function getAudit(limit = 30): Promise<AuditRow[]> {
  try {
    return await fetchQuery(api.testimonies.auditList, { adminKey: ADMIN_KEY, limit });
  } catch {
    return [];
  }
}
