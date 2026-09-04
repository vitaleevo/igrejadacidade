import Link from "next/link";
import { ArrowRight, Home, MapPin, Users } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";

const benefits = [
  { icon: Home, title: "Casas acolhedoras", text: "Encontros próximos de si." },
  { icon: Users, title: "Grupos pequenos", text: "Espaço para ser conhecido." },
  { icon: MapPin, title: "Em toda a cidade", text: "Uma comunidade na sua zona." },
];

export default function GroupsPage() {
  return <>
    <PageHero image="community" eyebrow="Vida em comunidade" title="A vida é melhor quando não caminhamos sozinhos." description="Os grupos são pequenos encontros em diferentes zonas de Luanda para construir amizades, orar e crescer na fé." cta={{ label: "Encontrar um grupo", href: "/contacto" }} accent="aqua" />
    <section className="bg-[var(--ivory)] px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="eyebrow">O seu lugar à mesa</p>
          <h2 className="section-heading mt-4">Pessoas reais. Conversas honestas. Fé para a semana.</h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted)]">Diga-nos a sua zona, fase de vida e disponibilidade. A nossa equipa ajudará a encontrar um grupo onde se possa sentir em casa.</p>
          <Link href="/contacto" className="primary-cta mt-9">Quero participar <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
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
