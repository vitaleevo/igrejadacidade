import { ArrowRight, CalendarDays, Clock3, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/shared/PageHero";

export default async function EventsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Eventos");

  const events = [
    { day: t("event1_day"), date: t("event1_date"), title: t("event1_title"), time: t("event1_time"), place: t("event1_place"), tone: "bg-[var(--gold)]" },
    { day: t("event2_day"), date: t("event2_date"), title: t("event2_title"), time: t("event2_time"), place: t("event2_place"), tone: "bg-[var(--aqua)]" },
    { day: t("event3_day"), date: t("event3_date"), title: t("event3_title"), time: t("event3_time"), place: t("event3_place"), tone: "bg-[var(--coral)] text-white" },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("hero_eyebrow")}
        title={t("hero_title")}
        description={t("hero_desc")}
        accent="coral"
      />

      <section className="bg-white px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">{t("list_eyebrow")}</p>
              <h2 className="section-heading mt-4">{t("list_title")}</h2>
            </div>
            <CalendarDays className="hidden h-12 w-12 text-[var(--teal)] sm:block" aria-hidden="true" />
          </div>

          <div className="mt-14 space-y-4">
            {events.map((event) => (
              <article key={event.title} className="grid overflow-hidden border border-[var(--ink)]/15 md:grid-cols-[220px_1fr]">
                <div className={`${event.tone} flex items-center justify-between p-7 md:flex-col md:items-start md:justify-center md:p-9`}>
                  <span className="font-mono text-sm tracking-[0.18em] opacity-70">{event.day}</span>
                  <p className="max-w-32 text-right font-serif text-2xl leading-tight md:mt-4 md:text-left">{event.date}</p>
                </div>
                <div className="grid gap-6 p-7 sm:grid-cols-[1fr_auto] sm:items-center md:p-9">
                  <div>
                    <h3 className="font-serif text-3xl text-[var(--ink)] sm:text-4xl">{event.title}</h3>
                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[var(--muted)]">
                      <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4" aria-hidden="true" />{event.time}</span>
                      <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" aria-hidden="true" />{event.place}</span>
                    </div>
                  </div>
                  <Link href="/contacto" className="text-link">{t("card_cta")} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
