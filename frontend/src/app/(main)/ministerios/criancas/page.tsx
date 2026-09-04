import Link from "next/link";
import { ArrowRight, ShieldCheck, Smile, Sparkles } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";

const promises = [
  { icon: ShieldCheck, title: "Segurança primeiro", text: "Check-in acompanhado e equipa preparada para cuidar de cada criança." },
  { icon: Sparkles, title: "Aprender brincando", text: "Histórias bíblicas, música e atividades adequadas a cada idade." },
  { icon: Smile, title: "Uma equipa que cuida", text: "Voluntários acolhedores para que pais e crianças se sintam tranquilos." },
];

export default function ChildrenPage() {
  return <>
    <PageHero eyebrow="Ministério infantil" title="Um grande lugar para os mais pequenos." description="Enquanto os adultos participam na celebração, as crianças aprendem sobre Deus num ambiente seguro, criativo e cheio de alegria." cta={{ label: "Preparar a visita", href: "/contacto" }} accent="gold" />
    <section className="bg-[var(--ivory)] px-5 py-20 sm:px-8 lg:py-28"><div className="mx-auto max-w-7xl">
      <div className="grid gap-px bg-[var(--ink)]/15 md:grid-cols-3">{promises.map(({ icon: Icon, title, text }) => <article key={title} className="bg-white p-8 sm:p-10"><Icon className="h-9 w-9 text-[var(--coral)]" strokeWidth={1.5} aria-hidden="true" /><h2 className="mt-8 font-serif text-3xl text-[var(--ink)]">{title}</h2><p className="mt-4 leading-7 text-[var(--muted)]">{text}</p></article>)}</div>
      <div className="mt-12 text-center"><Link href="/contacto" className="primary-cta">Falar com a equipa infantil <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
    </div></section>
  </>;
}
