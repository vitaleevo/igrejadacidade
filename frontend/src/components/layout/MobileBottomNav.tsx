"use client";

import { CalendarDays, Home, MapPin, PlayCircle, UsersRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export function MobileBottomNav() {
  const t = useTranslations("MobileNav");
  const pathname = usePathname();

  const items = [
    { label: t("tab_home"), href: "/", icon: Home },
    { label: t("tab_visit"), href: "/sou-novo", icon: MapPin },
    { label: t("tab_schedule"), href: "/eventos", icon: CalendarDays },
    { label: t("tab_watch"), href: "/assistir", icon: PlayCircle },
    { label: t("tab_groups"), href: "/grupos", icon: UsersRound },
  ];

  return (
    <nav aria-label={t("aria_main")} className="fixed inset-x-0 bottom-0 z-[60] border-t border-[#071a3d]/10 bg-white/95 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_30px_rgba(7,26,61,.10)] backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {items.map(({ label, href, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-bold transition ${active ? "bg-[#eaf1fb] text-[#0b3b82]" : "text-[#65748d]"}`}>
              <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
