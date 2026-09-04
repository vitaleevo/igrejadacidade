import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, MapPin } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";

const events = [
  { day: "DOM", date: "Todos os domingos", title: "Celebração de domingo", time: "08:00 e 10:30", place: "Auditório principal", tone: "bg-[var(--gold)]" },
  { day: "QUA", date: "Todas as quartas", title: "Noite de oração", time: "18:30", place: "Sala de oração", tone: "bg-[var(--aqua)]" },
  { day: "SEX", date: "Última sexta do mês", title: "Encontro de jovens", time: "18:00", place: "Espaço jovem", tone: "bg-[var(--coral)] text-white" },
];

export default function EventsPage() {
  return (
    <>
      <PageHero
        eyebrow="Agenda"
        title="Encontros que aproximam pessoas."
        description="Celebre, cresça e construa relações durante a semana. Veja os próximos encontros da nossa comunidade."
        accent="coral"
      />

      <section className="bg-white px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Próximos encontros</p>
              <h2 className="section-heading mt-4">Reserve espaço na sua semana.</h2>
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
                  <Link href="/contacto" className="text-link">Pedir informações <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
