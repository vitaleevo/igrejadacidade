import { Inbox } from "lucide-react";

export function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white px-6 py-12 text-center shadow-sm ring-1 ring-slate-200/70">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Inbox className="h-6 w-6" aria-hidden />
      </span>
      <p className="mt-3 font-[family-name:var(--font-sora)] font-bold text-slate-800">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{hint}</p>
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="mb-5">
      <h1 className="font-[family-name:var(--font-sora)] text-2xl font-bold text-slate-900 sm:text-[28px]">
        {title}
      </h1>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
    </header>
  );
}
