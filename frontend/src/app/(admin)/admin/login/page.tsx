"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Chave incorreta. Tenta novamente.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#071A3D] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5BD42] font-[family-name:var(--font-sora)] text-xl font-bold text-[#071A3D]" aria-hidden>
            IC
          </span>
          <div className="leading-tight text-white">
            <p className="font-[family-name:var(--font-sora)] text-lg font-bold">Igreja da Cidade</p>
            <p className="text-xs text-slate-300">Gestão do site</p>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-3xl bg-white p-7 shadow-2xl sm:p-8"
          aria-labelledby="login-title"
        >
          <h1 id="login-title" className="font-[family-name:var(--font-sora)] text-xl font-bold text-slate-900">
            Entrar na gestão
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Os testemunhos enviados no site chegam aqui para moderação.
          </p>

          <label className="mt-5 block text-sm font-medium text-slate-700" htmlFor="admin-key">
            Chave de administração
          </label>
          <div className="relative mt-1.5">
            <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              id="admin-key"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1F5AA6] focus:bg-white focus:ring-2 focus:ring-[#1F5AA6]/20"
              placeholder="••••••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p role="alert" className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B3B82] px-4 py-2.5 font-semibold text-white transition hover:bg-[#071A3D] disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {loading ? "A entrar…" : "Entrar"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          Área reservada · atividade registada em auditoria
        </p>
      </div>
    </main>
  );
}
