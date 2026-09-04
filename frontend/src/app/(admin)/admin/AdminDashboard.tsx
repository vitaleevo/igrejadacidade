"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type T = {
  id: string;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  story: string;
  category: string;
  status: string;
  publication_consent: string;
  created_at: string;
};

export function AdminDashboard({ initial }: { initial: { pending: T[]; approved: T[]; rejected: T[]; audit: unknown[] } }) {
  const router = useRouter();
  const [tab, setTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [lists, setLists] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);

  async function moderate(id: string, status: "approved" | "rejected") {
    setBusy(id);
    await fetch("/api/admin/testimonies", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    // Recarrega via proxy (sem expor ADMIN_API_KEY)
    const res = await fetch(`/api/admin/testimonies?status=${tab}&limit=50`);
    const data = res.ok ? await res.json() : [];
    setLists((s) => ({ ...s, [tab]: data }));
    setBusy(null);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const rows = lists[tab];

  return (
    <main>
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão do site</h1>
          <p className="text-sm text-slate-600">
            {lists.pending.length} pendentes · {lists.approved.length} aprovados · {lists.rejected.length} rejeitados
          </p>
        </div>
        <button onClick={logout} className="rounded-lg border px-4 py-2 text-sm font-semibold">
          Sair
        </button>
      </header>

      <nav className="mt-6 flex gap-2">
        {(["pending", "approved", "rejected"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === t ? "bg-[#0B3B82] text-white" : "bg-white"}`}
          >
            {t === "pending" ? "Pendentes" : t === "approved" ? "Aprovados" : "Rejeitados"}
          </button>
        ))}
      </nav>

      <section className="mt-4 space-y-3">
        {rows.map((t) => (
          <article key={t.id} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <strong>#{t.id} — {t.full_name}</strong>
              <span className="text-xs text-slate-500">{t.category} · {t.publication_consent}</span>
            </div>
            <p className="mt-2 text-sm leading-6">{t.story}</p>
            {(t.email || t.phone) && (
              <p className="mt-1 text-xs text-slate-500">
                {t.email || ""} {t.phone ? `· ${t.phone}` : ""}
              </p>
            )}
            <div className="mt-3 flex gap-2">
              <button
                disabled={busy === t.id}
                onClick={() => moderate(t.id, "approved")}
                className="rounded-lg bg-green-700 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                Aprovar
              </button>
              <button
                disabled={busy === t.id}
                onClick={() => moderate(t.id, "rejected")}
                className="rounded-lg bg-red-700 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                Rejeitar
              </button>
            </div>
          </article>
        ))}
        {!rows.length && <p className="text-sm text-slate-500">Nada aqui.</p>}
      </section>

      <section className="mt-8">
        <h2 className="font-bold">Auditoria recente</h2>
        <pre className="mt-2 overflow-auto rounded-xl bg-[#0b1e3a] p-4 text-xs text-white">
          {JSON.stringify(initial.audit, null, 2)}
        </pre>
      </section>
    </main>
  );
}
