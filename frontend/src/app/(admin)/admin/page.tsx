import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getAdminList, getAudit } from "./_data";
import { StatCards } from "./_components/StatCards";
import { TestimonyCard } from "./_components/TestimonyCard";
import { AuditTable } from "./_components/AuditTable";
import { EmptyState, PageHeader } from "./_components/ui";

export const metadata: Metadata = { title: "Visão geral" };

export default async function AdminPage() {
  if (process.env.NEXT_PUBLIC_APPROVAL_PREVIEW === "true") {
    return (
      <main>
        <PageHeader title="Gestão do site" subtitle="Pré-visualização para aprovação — a gestão está desativada nesta cópia." />
      </main>
    );
  }
  if (!(await isAdmin())) redirect("/admin/login");
  const [pending, approved, rejected, audit] = await Promise.all([
    getAdminList("pending"),
    getAdminList("approved", 100),
    getAdminList("rejected", 100),
    getAudit(5),
  ]);

  return (
    <main className="space-y-6">
      <PageHeader
        title="Visão geral"
        subtitle="Reveja os testemunhos enviados no site antes de os publicar."
      />
      <StatCards pending={pending.length} approved={approved.length} rejected={rejected.length} />

      <section aria-labelledby="fila">
        <h2 id="fila" className="mb-3 font-[family-name:var(--font-sora)] text-lg font-bold text-slate-900">
          Fila de moderação
        </h2>
        {pending.length ? (
          <div className="space-y-3">
            {pending.map((t) => (
              <TestimonyCard key={t.id} testimony={t} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Tudo em dia"
            hint="Não há testemunhos por rever. As novas submissões do formulário aparecem aqui automaticamente."
          />
        )}
      </section>

      <section aria-labelledby="atividade">
        <h2 id="atividade" className="mb-3 font-[family-name:var(--font-sora)] text-lg font-bold text-slate-900">
          Atividade recente
        </h2>
        <AuditTable rows={audit} />
      </section>
    </main>
  );
}
