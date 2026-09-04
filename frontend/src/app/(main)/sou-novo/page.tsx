import Link from "next/link";
import { ArrowRight, Clock3, MapPin, Smile } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";

const visitSteps = [
  {
    number: "01",
    title: "Chegue como está",
    text: "Não existe um código de roupa ou uma forma certa de chegar. A nossa equipa estará à porta para o receber e ajudar em tudo o que precisar.",
  },
  {
    number: "02",
    title: "Viva a celebração",
    text: "Espere música, oração e uma mensagem bíblica prática. O encontro é vibrante, acolhedor e pensado para toda a família.",
  },
  {
    number: "03",
    title: "Conheça pessoas",
    text: "Depois da celebração, fique um pouco. Queremos ouvir a sua história, apresentar a comunidade e ajudá-lo a encontrar o próximo passo.",
  },
];

export default function NewHerePage() {
  return (
    <>
      <PageHero
        eyebrow="Sou novo"
        title="A sua primeira visita começa aqui."
        description="Visitar uma igreja pela primeira vez pode trazer perguntas. Preparamos tudo para que se sinta em casa desde o primeiro minuto."
        cta={{ label: "Falar connosco", href: "/contacto" }}
        accent="coral"
      />

      <section className="bg-[var(--ivory)] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="eyebrow">O que esperar</p>
            <h2 className="section-heading mt-4">Um domingo simples, verdadeiro e cheio de vida.</h2>
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
            <p className="eyebrow text-[var(--aqua)]">Planeie a visita</p>
            <h2 className="mt-4 max-w-xl font-serif text-4xl leading-tight sm:text-5xl">Tudo o que precisa antes de sair de casa.</h2>
          </div>
          <div className="grid gap-px overflow-hidden bg-white/15 sm:grid-cols-3">
            <div className="bg-[var(--ink)] p-6">
              <Clock3 className="h-6 w-6 text-[var(--gold)]" aria-hidden="true" />
              <p className="mt-5 text-sm uppercase tracking-[0.16em] text-white/55">Domingo</p>
              <p className="mt-2 text-xl">08:00 e 10:30</p>
            </div>
            <div className="bg-[var(--ink)] p-6">
              <MapPin className="h-6 w-6 text-[var(--gold)]" aria-hidden="true" />
              <p className="mt-5 text-sm uppercase tracking-[0.16em] text-white/55">Local</p>
              <p className="mt-2 text-xl">Luanda, Angola</p>
            </div>
            <div className="bg-[var(--ink)] p-6">
              <Smile className="h-6 w-6 text-[var(--gold)]" aria-hidden="true" />
              <p className="mt-5 text-sm uppercase tracking-[0.16em] text-white/55">Famílias</p>
              <p className="mt-2 text-xl">Espaço para crianças</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--aqua)] px-5 py-16 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
          <h2 className="max-w-2xl font-serif text-4xl leading-tight text-[var(--ink)] sm:text-5xl">Quer que alguém o receba pessoalmente?</h2>
          <Link href="/contacto" className="primary-cta shrink-0 bg-[var(--ink)] text-white hover:bg-[var(--teal)]">
            Preparar a minha visita <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
