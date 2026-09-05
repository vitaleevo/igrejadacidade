"use client";

import { useLocale } from "next-intl";
import { Globe } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { routing } from "@/i18n/routing";

const LABELS: Record<string, string> = { pt: "PT", en: "EN", fr: "FR" };

export function LanguageSwitcher({ compact = false, tone = "light" }: { compact?: boolean; tone?: "light" | "dark" }) {
  const locale = useLocale();
  const pathname = usePathname();
  const dark = tone === "dark";

  return (
    <div
      role="group"
      aria-label="Idioma / Language / Langue"
      className={cn(
        "flex items-center gap-0.5 rounded-full border p-0.5",
        dark ? "border-white/20" : "border-[#071a3d]/15",
        compact ? "text-[11px]" : "text-xs"
      )}
    >
      <Globe className={cn("ml-1.5 h-3.5 w-3.5", dark ? "text-[#F5BD42]" : "text-[#0b3b82]")} aria-hidden="true" />
      {routing.locales.map((loc) => (
        <Link
          key={loc}
          href={pathname}
          locale={loc}
          aria-current={locale === loc ? "true" : undefined}
          aria-label={loc === "pt" ? "Português" : loc === "en" ? "English" : "Français"}
          className={cn(
            "rounded-full px-2 py-1 font-bold transition",
            locale === loc
              ? dark
                ? "bg-[#F5BD42] text-[#071A3D]"
                : "bg-[#0b3b82] text-white"
              : dark
                ? "text-slate-300 hover:bg-white/10 hover:text-white"
                : "text-[#0b3b82] hover:bg-[#eef3fa]"
          )}
        >
          {LABELS[loc]}
        </Link>
      ))}
    </div>
  );
}
