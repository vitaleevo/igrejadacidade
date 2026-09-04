import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";

const ministries = [
  { number: "01", title: "Crianças", text: "Um ambiente seguro, alegre e bíblico onde as crianças descobrem que são amadas por Deus.", href: "/ministerios/criancas", color: "bg-[var(--gold)]" },
  { number: "02", title: "Jovens", text: "Amizades, conversas honestas e experiências que ajudam uma nova geração a viver uma fé própria.", href: "/contacto", color: "bg-[var(--aqua)]" },
  { number: "03", title: "Mulheres", text: "Encontros de cuidado, crescimento e encorajamento para cada estação da vida.", href: "/contacto", color: "bg-[var(--coral)] text-white" },
  { number: "04", title: "Homens", text: "Relacionamentos que desafiam homens a liderar, servir e crescer com integridade.", href: "/contacto", color: "bg-[var(--teal)] text-white" },
  { number: "05", title: "Música & Criativos", text: "Talentos colocados ao serviço da igreja para criar encontros belos, claros e centrados em Jesus.", href: "/contacto", color: "bg-white" },
  { number: "06", title: "Impacto social", text: "A fé transformada em ação através de iniciativas que cuidam das necessidades reais da cidade.", href: "/contacto", color: "bg-[var(--ink)] text-white" },
];

export default function MinistriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Ministérios"
        title="Há um lugar para os seus dons e para a sua história."
        description="Descubra comunidades pensadas para cada fase da vida e oportunidades práticas para servir pessoas."
        cta={{ label: "Quero participar", href: "/contacto" }}
        accent="aqua"
      />

      <section className="bg-[var(--ivory)] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {ministries.map((ministry) => (
              <Link key={ministry.title} href={ministry.href} className={`${ministry.color} group flex min-h-80 flex-col justify-between p-8 transition-transform duration-300 hover:-translate-y-1 sm:p-10`}>
                <div className="flex items-start justify-between">
                  <span className="font-mono text-sm opacity-65">{ministry.number}</span>
                  <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-serif text-4xl">{ministry.title}</h2>
                  <p className="mt-4 leading-7 opacity-75">{ministry.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
