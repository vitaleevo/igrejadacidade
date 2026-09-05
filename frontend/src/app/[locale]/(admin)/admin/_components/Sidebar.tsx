"use client";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  CircleCheck,
  CircleX,
  Inbox,
  LayoutDashboard,
  LogOut,
  ScrollText,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar({ pendingCount }: { pendingCount: number }) {
  const t = useTranslations("Admin");
  const pathname = usePathname();
  const router = useRouter();

  const NAV = [
    { href: "/admin", label: t("nav_overview"), icon: LayoutDashboard, exact: true },
    { href: "/admin/aprovados", label: t("nav_approved"), icon: CircleCheck },
    { href: "/admin/rejeitados", label: t("nav_rejected"), icon: CircleX },
    { href: "/admin/auditoria", label: t("nav_audit"), icon: ScrollText },
  ];

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const nav = (
    <nav aria-label={t("menu_label")} className="space-y-1">
      {NAV.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
            <span className="flex-1">{item.label}</span>
            {item.exact && pendingCount > 0 && (
              <span className="rounded-full bg-[#F5BD42] px-2 py-0.5 text-xs font-bold text-[#071A3D]">
                {pendingCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex h-full flex-col bg-[#071A3D] text-white">
      <div className="flex items-center gap-3 px-5 pb-6 pt-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5BD42] font-[family-name:var(--font-sora)] text-lg font-bold text-[#071A3D]" aria-hidden>
          IC
        </span>
        <div className="leading-tight">
          <p className="font-[family-name:var(--font-sora)] text-[15px] font-bold">Igreja da Cidade</p>
          <p className="text-xs text-slate-400">{t("brand_subtitle")}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 mx-4 mb-4 text-xs text-slate-300">
        <Inbox className="h-4 w-4 shrink-0 text-[#F5BD42]" aria-hidden />
        <span>{t("pending_review", { count: pendingCount })}</span>
      </div>

      <div className="flex-1 px-3">{nav}</div>

      <div className="p-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-[18px] w-[18px]" aria-hidden />
          {t("logout")}
        </button>
      </div>
    </div>
  );
}
