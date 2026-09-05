import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getAdminList } from "../_data";
import { TestimonyCard } from "../_components/TestimonyCard";
import { EmptyState, PageHeader } from "../_components/ui";

export const metadata: Metadata = { title: "Aprovados" };

export default async function ApprovedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Admin");
  if (!(await isAdmin())) redirect(`/${locale}/admin/login`);
  const list = await getAdminList("approved");
  return (
    <main>
      <PageHeader title={t("approved_title")} subtitle={t("approved_subtitle")} />
      {list.length ? (
        <div className="space-y-3">
          {list.map((item) => (
            <TestimonyCard key={item.id} testimony={item} />
          ))}
        </div>
      ) : (
        <EmptyState title={t("empty_approved_title")} hint={t("empty_approved_hint")} />
      )}
    </main>
  );
}
