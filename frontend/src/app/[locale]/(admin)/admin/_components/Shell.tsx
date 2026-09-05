"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Sidebar } from "./Sidebar";

export function Shell({
  pendingCount,
  children,
}: {
  pendingCount: number;
  children: React.ReactNode;
}) {
  const t = useTranslations("Admin");
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-screen lg:block" aria-label={t("menu_label")}>
        <Sidebar pendingCount={pendingCount} />
      </aside>

      {/* Topbar mobile */}
      <div className="sticky top-0 z-30 flex items-center gap-2 border-b border-slate-200 bg-[#071A3D] px-4 py-3 text-white lg:hidden">
        <button
          onClick={() => setOpen(true)}
          aria-label={t("menu_open")}
          aria-expanded={open}
          className="rounded-lg p-2 hover:bg-white/10"
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>
        <p className="min-w-0 flex-1 truncate font-[family-name:var(--font-sora)] text-sm font-bold">
          Igreja da Cidade <span className="font-normal text-slate-300">· {t("brand_management")}</span>
        </p>
        <LanguageSwitcher tone="dark" compact />
      </div>

      {/* Drawer mobile */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label={t("menu_label")}>
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw]">
            <button
              onClick={() => setOpen(false)}
              aria-label={t("menu_close")}
              className="absolute right-2 top-2 z-10 rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
            <div className="h-full" onClick={(e) => { if ((e.target as HTMLElement).closest("a,button")) setOpen(false); }}>
              <Sidebar pendingCount={pendingCount} />
            </div>
          </div>
        </div>
      )}

      <div className="min-w-0">
        {/* Barra utilitária desktop: seletor de idioma no canto superior direito */}
        <div className="sticky top-0 z-20 hidden justify-end border-b border-slate-200/70 bg-slate-100/90 px-10 py-2.5 backdrop-blur lg:flex">
          <LanguageSwitcher compact />
        </div>
        <main className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
