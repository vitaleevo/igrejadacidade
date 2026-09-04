"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CircleCheck,
  CircleX,
  Inbox,
  LayoutDashboard,
  LogOut,
  ScrollText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard, exact: true },
  { href: "/admin/aprovados", label: "Aprovados", icon: CircleCheck },
  { href: "/admin/rejeitados", label: "Rejeitados", icon: CircleX },
  { href: "/admin/auditoria", label: "Auditoria", icon: ScrollText },
];

function NavLinks({ pendingCount, onNavigate }: { pendingCount: number; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Gestão" className="space-y-1">
      {NAV.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
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
            {item.href === "/admin" && pendingCount > 0 && (
              <span className="rounded-full bg-[#F5BD42] px-2 py-0.5 text-xs font-bold text-[#071A3D]">
                {pendingCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar({ pendingCount }: { pendingCount: number }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex h-full flex-col bg-[#071A3D] text-white">
      <div className="flex items-center gap-3 px-5 pb-6 pt-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5BD42] font-[family-name:var(--font-sora)] text-lg font-bold text-[#071A3D]" aria-hidden>
          IC
        </span>
        <div className="leading-tight">
          <p className="font-[family-name:var(--font-sora)] text-[15px] font-bold">Igreja da Cidade</p>
          <p className="text-xs text-slate-400">Gestão do site</p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 mx-4 mb-4 text-xs text-slate-300">
        <Inbox className="h-4 w-4 shrink-0 text-[#F5BD42]" aria-hidden />
        <span>
          <strong className="text-white">{pendingCount}</strong> testemunho{pendingCount === 1 ? "" : "s"} por rever
        </span>
      </div>

      <div className="flex-1 px-3">
        <NavLinks pendingCount={pendingCount} />
      </div>

      <div className="p-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-[18px] w-[18px]" aria-hidden />
          Sair
        </button>
      </div>
    </div>
  );
}

export { NavLinks };
