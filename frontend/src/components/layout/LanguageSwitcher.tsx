"use client";

import { useLocale } from "next-intl";
import { Globe } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { routing } from "@/i18n/routing";

const LABELS: Record<string, string> = { pt: "PT", en: "EN", fr: "FR" };

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div
      role="group"
      aria-label="Idioma / Language / Langue"
      className={cn(
        "flex items-center gap-0.5 rounded-full border border-[#071a3d]/15 p-0.5",
        compact ? "text-[11px]" : "text-xs"
      )}
    >
      <Globe className="ml-1.5 h-3.5 w-3.5 text-[#0b3b82]" aria-hidden="true" />
      {routing.locales.map((loc) => (
        <Link
          key={loc}
          href={pathname}
          locale={loc}
          aria-current={locale === loc ? "true" : undefined}
          aria-label={loc === "pt" ? "Português" : loc === "en" ? "English" : "Français"}
          className={cn(
            "rounded-full px-2 py-1 font-bold transition",
            locale === loc ? "bg-[#0b3b82] text-white" : "text-[#0b3b82] hover:bg-[#eef3fa]"
          )}
        >
          {LABELS[loc]}
        </Link>
      ))}
    </div>
  );
}
