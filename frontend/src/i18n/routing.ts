import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pt", "en", "fr"],
  defaultLocale: "pt",
  // Prefixo sempre (/pt, /en, /fr): consistente no export estático e no runtime.
  // URLs antigas sem prefixo redirecionam automaticamente.
  localePrefix: "always",
});

export type AppLocale = (typeof routing.locales)[number];
