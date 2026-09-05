import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getAdminList } from "../_data";
import { TestimonyCard } from "../_components/TestimonyCard";
import { EmptyState, PageHeader } from "../_components/ui";

export const metadata: Metadata = { title: "Rejeitados" };

export default async function RejectedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Admin");
  if (!(await isAdmin())) redirect(`/${locale}/admin/login`);
  const list = await getAdminList("rejected");
  return (
    <main>
      <PageHeader title={t("rejected_title")} subtitle={t("rejected_subtitle")} />
      {list.length ? (
        <div className="space-y-3">
          {list.map((item) => (
            <TestimonyCard key={item.id} testimony={item} />
          ))}
        </div>
      ) : (
        <EmptyState title={t("empty_rejected_title")} hint={t("empty_rejected_hint")} />
      )}
    </main>
  );
}
