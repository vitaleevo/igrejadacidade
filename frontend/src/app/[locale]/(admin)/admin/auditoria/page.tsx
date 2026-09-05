import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getAudit } from "../_data";
import { AuditTable } from "../_components/AuditTable";
import { PageHeader } from "../_components/ui";

export const metadata: Metadata = { title: "Auditoria" };

export default async function AuditPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Admin");
  if (!(await isAdmin())) redirect(`/${locale}/admin/login`);
  const rows = await getAudit(50);
  return (
    <main>
      <PageHeader title={t("audit_title")} subtitle={t("audit_subtitle")} />
      <AuditTable rows={rows} />
    </main>
  );
}
