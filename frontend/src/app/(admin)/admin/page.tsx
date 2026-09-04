import { redirect } from "next/navigation";
import { adminHeaders, backendUrl, isAdmin } from "@/lib/admin-auth";
import { AdminDashboard } from "./AdminDashboard";

async function getAdminList(status: string) {
  const res = await fetch(`${backendUrl()}/api/testimonies/admin?status=${status}&limit=50`, {
    headers: adminHeaders(),
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

async function getAudit() {
  const res = await fetch(`${backendUrl()}/api/testimonies/admin/audit?limit=20`, {
    headers: adminHeaders(),
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const [pending, approved, rejected, audit] = await Promise.all([
    getAdminList("pending"),
    getAdminList("approved"),
    getAdminList("rejected"),
    getAudit(),
  ]);
  return <AdminDashboard initial={{ pending, approved, rejected, audit }} />;
}
