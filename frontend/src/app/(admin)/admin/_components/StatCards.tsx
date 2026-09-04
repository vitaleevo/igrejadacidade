import { CircleCheck, CircleX, Inbox } from "lucide-react";

export function StatCards({
  pending,
  approved,
  rejected,
}: {
  pending: number;
  approved: number;
  rejected: number;
}) {
  const cards = [
    {
      label: "Por rever",
      value: pending,
      icon: Inbox,
      accent: "bg-amber-100 text-amber-700",
      href: "/admin",
    },
    {
      label: "Aprovados",
      value: approved,
      icon: CircleCheck,
      accent: "bg-emerald-100 text-emerald-700",
      href: "/admin/aprovados",
    },
    {
      label: "Rejeitados",
      value: rejected,
      icon: CircleX,
      accent: "bg-rose-100 text-rose-700",
      href: "/admin/rejeitados",
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {cards.map((c) => (
        <a
          key={c.label}
          href={c.href}
          className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70 transition hover:shadow"
        >
          <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.accent}`}>
            <c.icon className="h-5 w-5" aria-hidden />
          </span>
          <span>
            <span className="block font-[family-name:var(--font-sora)] text-2xl font-bold leading-none text-slate-900">
              {c.value}
            </span>
            <span className="mt-1 block text-xs font-medium text-slate-500">{c.label}</span>
          </span>
        </a>
      ))}
    </div>
  );
}
