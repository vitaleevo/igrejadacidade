"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Eye, Film, Image as ImageIcon, Mail, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminTestimony } from "../_data";
import { shortId, timeAgo } from "./format";

const CONSENT_LABEL: Record<string, string> = {
  publish: "Autoriza publicar",
  internal: "Só uso interno",
};

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-emerald-100 text-emerald-800",
    rejected: "bg-rose-100 text-rose-800",
  };
  const labels: Record<string, string> = {
    pending: "Pendente",
    approved: "Aprovado",
    rejected: "Rejeitado",
  };
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", styles[status] ?? "bg-slate-100 text-slate-600")}>
      {labels[status] ?? status}
    </span>
  );
}

export function TestimonyCard({ testimony }: { testimony: AdminTestimony }) {
  const router = useRouter();
  const [busy, setBusy] = useState<"approved" | "rejected" | null>(null);
  const [done, setDone] = useState<"approved" | "rejected" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function moderate(status: "approved" | "rejected") {
    setBusy(status);
    setError(null);
    try {
      const res = await fetch("/api/admin/testimonies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: testimony.id, status }),
      });
      if (!res.ok) throw new Error("request failed");
      setDone(status);
      router.refresh();
    } catch {
      setError("Não foi possível atualizar. Tenta novamente.");
    } finally {
      setBusy(null);
    }
  }

  const MediaIcon = testimony.media_type === "video" ? Film : ImageIcon;

  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-[family-name:var(--font-sora)] text-[15px] font-bold text-slate-900">
          {testimony.full_name}
        </h3>
        <span className="text-xs text-slate-400" title={testimony.id}>#{shortId(testimony.id)}</span>
        <span className="ml-auto flex items-center gap-2">
          <StatusBadge status={testimony.status} />
          <span className="text-xs text-slate-400">{timeAgo(testimony.created_at)}</span>
        </span>
      </div>

      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">{testimony.story}</p>

      <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <dt className="font-semibold text-slate-400">Categoria:</dt>
          <dd>{testimony.category}</dd>
        </div>
        {testimony.happened_at && (
          <div className="flex items-center gap-1.5">
            <dt className="font-semibold text-slate-400">Quando:</dt>
            <dd>{testimony.happened_at}</dd>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <dt className="font-semibold text-slate-400">Uso:</dt>
          <dd>{CONSENT_LABEL[testimony.publication_consent] ?? testimony.publication_consent}</dd>
        </div>
        {testimony.email && (
          <div className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" aria-hidden />
            <dd>{testimony.email}</dd>
          </div>
        )}
        {testimony.phone && (
          <div className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" aria-hidden />
            <dd>{testimony.phone}</dd>
          </div>
        )}
        {testimony.media_url && (
          <div className="flex items-center gap-1.5">
            <MediaIcon className="h-3.5 w-3.5" aria-hidden />
            <dd>
              <a
                href={testimony.media_url}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[#1F5AA6] underline underline-offset-2 hover:text-[#0B3B82]"
              >
                Ver anexo <Eye className="inline h-3.5 w-3.5" aria-hidden />
              </a>
            </dd>
          </div>
        )}
      </dl>

      {testimony.status === "pending" && done === null && (
        <div className="mt-4 flex gap-2">
          <button
            disabled={busy !== null}
            onClick={() => moderate("approved")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            <Check className="h-4 w-4" aria-hidden />
            {busy === "approved" ? "A aprovar…" : "Aprovar"}
          </button>
          <button
            disabled={busy !== null}
            onClick={() => moderate("rejected")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-rose-700 ring-1 ring-rose-200 transition hover:bg-rose-50 disabled:opacity-50"
          >
            <X className="h-4 w-4" aria-hidden />
            {busy === "rejected" ? "A rejeitar…" : "Rejeitar"}
          </button>
        </div>
      )}
      {done && (
        <p className={cn("mt-4 rounded-xl px-3 py-2 text-sm font-medium", done === "approved" ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800")}>
          {done === "approved" ? "Aprovado — já visível no site (se autorizou publicar)." : "Rejeitado — removido da fila."}
        </p>
      )}
      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
    </article>
  );
}
