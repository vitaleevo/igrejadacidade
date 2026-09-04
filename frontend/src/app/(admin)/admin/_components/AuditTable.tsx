import type { AuditRow } from "../_data";
import { timeAgo } from "./format";

const ACTION_LABEL: Record<string, string> = {
  "testimony.approved": "Aprovou",
  "testimony.rejected": "Rejeitou",
  "testimony.pending": "Reabriu",
  "testimony.consent_updated": "Mudou consentimento",
};

export function AuditTable({ rows }: { rows: AuditRow[] }) {
  if (!rows.length) {
    return <p className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200/70">Sem atividade registada.</p>;
  }
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
              <th scope="col" className="px-4 py-3 font-semibold">Ação</th>
              <th scope="col" className="px-4 py-3 font-semibold">Testemunho</th>
              <th scope="col" className="px-4 py-3 font-semibold">Detalhe</th>
              <th scope="col" className="px-4 py-3 font-semibold">Quando</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                <td className="px-4 py-3 font-medium text-slate-800">{ACTION_LABEL[r.action] ?? r.action}</td>
                <td className="px-4 py-3 text-slate-500">{r.testimony_id ? `#${r.testimony_id.slice(0, 6)}…` : "—"}</td>
                <td className="px-4 py-3 text-slate-500">
                  {[r.old_value, r.new_value].filter(Boolean).join(" → ") || "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-slate-500">{timeAgo(new Date(r.created_at).toISOString())}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
