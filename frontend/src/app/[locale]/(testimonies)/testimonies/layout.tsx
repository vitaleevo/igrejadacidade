import { Link } from "@/i18n/navigation";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function TestimoniesLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Testimony");
  return (
    <div className="min-h-screen bg-[var(--ivory)]">
      <header className="sticky top-0 z-40 border-b border-[#071a3d]/10 bg-white/95 text-[#071a3d] backdrop-blur-xl">
        <div className="mx-auto flex min-h-20 max-w-[1280px] items-center justify-between gap-4 px-6 py-3 lg:px-12">
          <Link href="/" className="flex items-center gap-3">
            <BrandLogo size={52} priority className="h-10 w-10 sm:h-12 sm:w-12" />
            <div className="leading-tight">
              <div className="font-sans text-xs font-bold uppercase tracking-[.08em] sm:text-sm">{t("brand_name")}</div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-[.28em] text-[var(--teal)]">{t("brand_city")}</div>
            </div>
          </Link>
          <Link href="/" className="hidden min-h-11 items-center rounded-full border border-[#071a3d]/15 px-5 text-sm font-semibold text-[#071a3d] transition hover:bg-[#eef3fa] md:inline-flex">
            ← {t("home_link")}
          </Link>
          <Link href="/" className="inline-flex min-h-11 shrink-0 items-center text-sm font-semibold text-[#071a3d] md:hidden">
            {t("home_link")}
          </Link>
        </div>
      </header>
      <main id="conteudo-principal" lang={locale}>{children}</main>
      <footer className="bg-[var(--ink)] text-white/75">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-6 px-6 py-10 text-sm sm:flex-row sm:items-center lg:px-12">
          <div><p className="font-semibold text-white">{t("brand_full")}</p><p className="mt-1 text-xs">{t("footer_tagline")}</p></div>
          <Link href="/privacidade" className="inline-flex min-h-11 items-center underline decoration-white/30 underline-offset-4 hover:text-white">{t("privacy_footer_link")}</Link>
        </div>
      </footer>
    </div>
  );
}
