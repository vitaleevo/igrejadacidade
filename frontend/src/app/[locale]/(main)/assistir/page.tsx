import { ArrowRight, Play } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/shared/PageHero";
import { siteConfig } from "@/lib/config";

export default async function WatchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Assistir");

  return <>
    <PageHero image="message" eyebrow={t("hero_eyebrow")} title={t("hero_title")} description={t("hero_desc")} accent="gold" />
    <section className="bg-[var(--ivory)] px-5 py-20 sm:px-8 lg:py-28"><div className="mx-auto max-w-7xl">
      <div className="pattern-lines relative flex min-h-[460px] items-end overflow-hidden bg-[var(--ink)] p-7 text-white sm:p-12 lg:p-16"><div className="relative z-10 max-w-2xl">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--coral)]"><Play className="ml-1 h-6 w-6 fill-current" aria-hidden="true" /></span>
        <p className="eyebrow mt-10 text-[var(--aqua)]">{t("card_eyebrow")}</p><h2 className="mt-4 font-serif text-4xl sm:text-6xl">{t("card_title")}</h2>
        <p className="mt-5 text-lg text-white/70">{t("card_text")}</p>
        <a href={siteConfig.social.youtube} target="_blank" rel="noreferrer" className="secondary-cta mt-8 bg-white text-[var(--ink)]">{t("card_cta")} <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
      </div></div>
      <Link href="/contacto" className="text-link mt-8">{t("info_link")} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
    </div></section>
  </>;
}
