import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/shared/PageHero";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Sobre");
  const values = [
    [t("value1_title"), t("value1_text")],
    [t("value2_title"), t("value2_text")],
    [t("value3_title"), t("value3_text")],
    [t("value4_title"), t("value4_text")],
  ];
  return (
    <>
      <PageHero
        eyebrow={t("hero_eyebrow")}
        title={t("hero_title")}
        description={t("hero_desc")}
        accent="gold"
      />

      <section className="bg-white px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="eyebrow">{t("mission_eyebrow")}</p>
            <h2 className="section-heading mt-4">{t("mission_title")}</h2>
          </div>
          <div className="space-y-8 text-lg leading-8 text-[var(--muted)]">
            <p>{t("mission_p1")}</p>
            <p>{t("mission_p2")}</p>
            <div className="flex flex-wrap gap-6 pt-2">
              <Link href="/sobre/equipa" className="text-link">{t("link_team")} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              <Link href="/sobre/conectar" className="text-link">{t("link_connect")} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--ivory)] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">{t("values_eyebrow")}</p>
          <h2 className="section-heading mt-4 max-w-3xl">{t("values_title")}</h2>
          <div className="mt-14 grid gap-px overflow-hidden bg-[var(--ink)]/15 sm:grid-cols-2">
            {values.map(([title, text], index) => (
              <article key={title} className="bg-[var(--ivory)] p-8 sm:p-10">
                <span className="font-mono text-sm text-[var(--coral)]">0{index + 1}</span>
                <h3 className="mt-6 font-serif text-3xl text-[var(--ink)]">{title}</h3>
                <p className="mt-4 max-w-lg leading-7 text-[var(--muted)]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
