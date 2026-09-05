import { ArrowRight, Home, MapPin, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/shared/PageHero";

export default async function GroupsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Grupos");

  const benefits = [
    { icon: Home, title: t("item1_title"), text: t("item1_text") },
    { icon: Users, title: t("item2_title"), text: t("item2_text") },
    { icon: MapPin, title: t("item3_title"), text: t("item3_text") },
  ];

  return <>
    <PageHero image="community" eyebrow={t("hero_eyebrow")} title={t("hero_title")} description={t("hero_desc")} cta={{ label: t("hero_cta"), href: "/contacto" }} accent="aqua" />
    <section className="bg-[var(--ivory)] px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="eyebrow">{t("section_eyebrow")}</p>
          <h2 className="section-heading mt-4">{t("section_title")}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted)]">{t("section_text")}</p>
          <Link href="/contacto" className="primary-cta mt-9">{t("section_cta")} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
        <div className="grid gap-px bg-[var(--ink)]/15 sm:grid-cols-3 lg:grid-cols-1">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-5 bg-white p-7"><Icon className="h-6 w-6 shrink-0 text-[var(--coral)]" aria-hidden="true" /><div><h3 className="font-serif text-2xl text-[var(--ink)]">{title}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p></div></div>
          ))}
        </div>
      </div>
    </section>
  </>;
}
