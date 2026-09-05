import { Link } from "@/i18n/navigation";
import { ArrowRight, ShieldCheck, Smile, Sparkles } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/shared/PageHero";

export default async function ChildrenPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Criancas");
  const promises = [
    { icon: ShieldCheck, title: t("item1_title"), text: t("item1_text") },
    { icon: Sparkles, title: t("item2_title"), text: t("item2_text") },
    { icon: Smile, title: t("item3_title"), text: t("item3_text") },
  ];
  return <>
    <PageHero eyebrow={t("hero_eyebrow")} title={t("hero_title")} description={t("hero_desc")} cta={{ label: t("hero_cta"), href: "/contacto" }} accent="gold" />
    <section className="bg-[var(--ivory)] px-5 py-20 sm:px-8 lg:py-28"><div className="mx-auto max-w-7xl">
      <div className="grid gap-px bg-[var(--ink)]/15 md:grid-cols-3">{promises.map(({ icon: Icon, title, text }) => <article key={title} className="bg-white p-8 sm:p-10"><Icon className="h-9 w-9 text-[var(--coral)]" strokeWidth={1.5} aria-hidden="true" /><h2 className="mt-8 font-serif text-3xl text-[var(--ink)]">{title}</h2><p className="mt-4 leading-7 text-[var(--muted)]">{text}</p></article>)}</div>
      <div className="mt-12 text-center"><Link href="/contacto" className="primary-cta">{t("cta_button")} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
    </div></section>
  </>;
}
