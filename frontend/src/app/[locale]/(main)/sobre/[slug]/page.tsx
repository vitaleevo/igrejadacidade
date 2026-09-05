import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/shared/PageHero";

export function generateStaticParams() {
  return ["equipa", "conectar"].map((slug) => ({ slug }));
}

export default async function AboutDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("SobreSlug");
  const pages: Record<string, { title: string; body: string }> = {
    equipa: {
      title: t("equipa_title"),
      body: t("equipa_body"),
    },
    conectar: {
      title: t("conectar_title"),
      body: t("conectar_body"),
    },
  };
  const page = pages[slug];
  if (!page) notFound();
  return <>
    <PageHero eyebrow={t("hero_eyebrow")} title={page.title} description={page.body} accent="gold" />
    <section className="bg-[var(--ivory)] px-5 py-20 text-center sm:px-8 lg:py-28"><h2 className="mx-auto max-w-3xl font-serif text-4xl leading-tight text-[var(--ink)] sm:text-5xl">{t("cta_title")}</h2><Link href="/contacto" className="primary-cta mt-9">{t("cta_button")} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></section>
  </>;
}
