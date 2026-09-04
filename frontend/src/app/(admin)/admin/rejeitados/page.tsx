import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getAdminList } from "../_data";
import { TestimonyCard } from "../_components/TestimonyCard";
import { EmptyState, PageHeader } from "../_components/ui";

export const metadata: Metadata = { title: "Rejeitados" };

export default async function RejectedPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const list = await getAdminList("rejected");
  return (
    <main>
      <PageHeader title="Rejeitados" subtitle="Testemunhos recusados — invisíveis no site, guardados para registo." />
      {list.length ? (
        <div className="space-y-3">
          {list.map((t) => (
            <TestimonyCard key={t.id} testimony={t} />
          ))}
        </div>
      ) : (
        <EmptyState title="Nenhum rejeitado" hint="Os testemunhos que rejeitar ficam guardados aqui." />
      )}
    </main>
  );
}
