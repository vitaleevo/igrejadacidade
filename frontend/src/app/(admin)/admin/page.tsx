import { redirect } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { isAdmin } from "@/lib/admin-auth";
import { api } from "../../../../convex/_generated/api";
import { AdminDashboard } from "./AdminDashboard";

const PREVIEW = process.env.NEXT_PUBLIC_APPROVAL_PREVIEW === "true";
const ADMIN_KEY = process.env.ADMIN_API_KEY || "";

function shape(t: {
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
}) {
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

async function getAdminList(status: "pending" | "approved" | "rejected") {
  try {
    const list = await fetchQuery(api.testimonies.adminList, {
      adminKey: ADMIN_KEY,
      status,
      limit: 50,
    });
    return list.map(shape);
  } catch {
    return [];
  }
}

async function getAudit() {
  try {
    return await fetchQuery(api.testimonies.auditList, { adminKey: ADMIN_KEY, limit: 20 });
  } catch {
    return [];
  }
}

function PreviewNotice() {
  return (
    <main>
      <h1 className="text-3xl font-bold">Gestão do site</h1>
      <p className="mt-2 text-sm text-slate-600">
        Pré-visualização para aprovação — a gestão está desativada nesta cópia.
      </p>
    </main>
  );
}

export default async function AdminPage() {
  if (PREVIEW || !process.env.NEXT_PUBLIC_CONVEX_URL) return <PreviewNotice />;
  if (!(await isAdmin())) redirect("/admin/login");
  const [pending, approved, rejected, audit] = await Promise.all([
    getAdminList("pending"),
    getAdminList("approved"),
    getAdminList("rejected"),
    getAudit(),
  ]);
  return <AdminDashboard initial={{ pending, approved, rejected, audit }} />;
}
