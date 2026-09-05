import { Link } from "@/i18n/navigation";
import { ArrowRight, Clock3, MapPin, Smile } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/shared/PageHero";

export default async function NewHerePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("SouNovo");
  const visitSteps = [
    {
      number: "01",
      title: t("step1_title"),
      text: t("step1_text"),
    },
    {
      number: "02",
      title: t("step2_title"),
      text: t("step2_text"),
    },
    {
      number: "03",
      title: t("step3_title"),
      text: t("step3_text"),
    },
  ];
  return (
    <>
      <PageHero
        eyebrow={t("hero_eyebrow")}
        title={t("hero_title")}
        description={t("hero_desc")}
        cta={{ label: t("hero_cta"), href: "/contacto" }}
        accent="coral"
      />

      <section className="bg-[var(--ivory)] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="eyebrow">{t("expect_eyebrow")}</p>
            <h2 className="section-heading mt-4">{t("expect_title")}</h2>
          </div>

          <div className="mt-14 grid border-t border-[var(--ink)]/15 lg:grid-cols-3">
            {visitSteps.map((step) => (
              <article key={step.number} className="border-b border-[var(--ink)]/15 py-10 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0">
                <span className="font-mono text-sm text-[var(--coral)]">{step.number}</span>
                <h3 className="mt-7 font-serif text-3xl text-[var(--ink)]">{step.title}</h3>
                <p className="mt-4 max-w-sm text-base leading-7 text-[var(--muted)]">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--ink)] px-5 py-16 text-white sm:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="eyebrow text-[var(--aqua)]">{t("plan_eyebrow")}</p>
            <h2 className="mt-4 max-w-xl font-serif text-4xl leading-tight sm:text-5xl">{t("plan_title")}</h2>
          </div>
          <div className="grid gap-px overflow-hidden bg-white/15 sm:grid-cols-3">
            <div className="bg-[var(--ink)] p-6">
              <Clock3 className="h-6 w-6 text-[var(--gold)]" aria-hidden="true" />
              <p className="mt-5 text-sm uppercase tracking-[0.16em] text-white/55">{t("card1_label")}</p>
              <p className="mt-2 text-xl">{t("card1_value")}</p>
            </div>
            <div className="bg-[var(--ink)] p-6">
              <MapPin className="h-6 w-6 text-[var(--gold)]" aria-hidden="true" />
              <p className="mt-5 text-sm uppercase tracking-[0.16em] text-white/55">{t("card2_label")}</p>
              <p className="mt-2 text-xl">{t("card2_value")}</p>
            </div>
            <div className="bg-[var(--ink)] p-6">
              <Smile className="h-6 w-6 text-[var(--gold)]" aria-hidden="true" />
              <p className="mt-5 text-sm uppercase tracking-[0.16em] text-white/55">{t("card3_label")}</p>
              <p className="mt-2 text-xl">{t("card3_value")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--aqua)] px-5 py-16 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
          <h2 className="max-w-2xl font-serif text-4xl leading-tight text-[var(--ink)] sm:text-5xl">{t("cta_title")}</h2>
          <Link href="/contacto" className="primary-cta shrink-0 bg-[var(--ink)] text-white hover:bg-[var(--teal)]">
            {t("cta_button")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
