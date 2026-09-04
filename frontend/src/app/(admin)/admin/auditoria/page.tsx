import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getAudit } from "../_data";
import { AuditTable } from "../_components/AuditTable";
import { PageHeader } from "../_components/ui";

export const metadata: Metadata = { title: "Auditoria" };

export default async function AuditPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const rows = await getAudit(50);
  return (
    <main>
      <PageHeader title="Auditoria" subtitle="Quem aprovou, rejeitou ou alterou cada testemunho." />
      <AuditTable rows={rows} />
    </main>
  );
}
