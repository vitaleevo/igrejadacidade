"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
      setError("Credenciais inválidas.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="mx-auto mt-16 max-w-md rounded-2xl bg-white p-8 shadow">
      <h1 className="text-2xl font-bold">Gestão do site</h1>
      <p className="mt-2 text-sm text-slate-600">
        Área reservada. Os testemunhos enviados em <strong>/testimonies</strong> chegam aqui para moderação.
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-medium">
          Chave de administração
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2"
            autoComplete="current-password"
            required
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#0B3B82] px-4 py-2 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "A entrar…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
