import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getAdminList, getAudit } from "./_data";
import { StatCards } from "./_components/StatCards";
import { TestimonyCard } from "./_components/TestimonyCard";
import { AuditTable } from "./_components/AuditTable";
import { EmptyState, PageHeader } from "./_components/ui";

export const metadata: Metadata = { title: "Visão geral" };

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Admin");
  if (process.env.NEXT_PUBLIC_APPROVAL_PREVIEW === "true") {
    return (
      <main>
        <PageHeader title={t("preview_title")} subtitle={t("preview_subtitle")} />
      </main>
    );
  }
  if (!(await isAdmin())) redirect(`/${locale}/admin/login`);
  const [pending, approved, rejected, audit] = await Promise.all([
    getAdminList("pending"),
    getAdminList("approved", 100),
    getAdminList("rejected", 100),
    getAudit(5),
  ]);

  return (
    <main className="space-y-6">
      <PageHeader title={t("dash_title")} subtitle={t("dash_subtitle")} />
      <StatCards pending={pending.length} approved={approved.length} rejected={rejected.length} />

      <section aria-labelledby="fila">
        <h2 id="fila" className="mb-3 font-[family-name:var(--font-sora)] text-lg font-bold text-slate-900">
          {t("queue_title")}
        </h2>
        {pending.length ? (
          <div className="space-y-3">
            {pending.map((item) => (
              <TestimonyCard key={item.id} testimony={item} />
            ))}
          </div>
        ) : (
          <EmptyState title={t("empty_done_title")} hint={t("empty_done_hint")} />
        )}
      </section>

      <section aria-labelledby="atividade">
        <h2 id="atividade" className="mb-3 font-[family-name:var(--font-sora)] text-lg font-bold text-slate-900">
          {t("activity_title")}
        </h2>
        <AuditTable rows={audit} />
      </section>
    </main>
  );
}
