import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getAdminList } from "../_data";
import { TestimonyCard } from "../_components/TestimonyCard";
import { EmptyState, PageHeader } from "../_components/ui";

export const metadata: Metadata = { title: "Aprovados" };

export default async function ApprovedPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const list = await getAdminList("approved");
  return (
    <main>
      <PageHeader title="Aprovados" subtitle="Testemunhos visíveis no site (com consentimento de publicação)." />
      {list.length ? (
        <div className="space-y-3">
          {list.map((t) => (
            <TestimonyCard key={t.id} testimony={t} />
          ))}
        </div>
      ) : (
        <EmptyState title="Nenhum aprovado" hint="Os testemunhos que aprovar aparecem aqui e no site." />
      )}
    </main>
  );
}
