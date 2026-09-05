import { ArrowRight, HeartHandshake } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/shared/PageHero";

export default async function GivePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Doar");

  return <>
    <PageHero eyebrow={t("hero_eyebrow")} title={t("hero_title")} description={t("hero_desc")} cta={{ label: t("hero_cta"), href: "/contacto" }} accent="coral" titleFont="sans" />
    <section className="bg-white px-5 py-20 sm:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
      <div className="flex aspect-square max-w-md items-center justify-center bg-[var(--gold)]"><HeartHandshake className="h-24 w-24 text-[var(--ink)]" strokeWidth={1.25} aria-hidden="true" /></div>
      <div><p className="eyebrow">{t("section_eyebrow")}</p><h2 className="section-heading mt-4">{t("section_title")}</h2>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{t("section_text")}</p>
        <Link href="/contacto" className="primary-cta mt-9">{t("section_cta")} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
      </div>
    </div></section>
  </>;
}
