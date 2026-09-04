import Link from "next/link";
import { ArrowRight, HeartHandshake } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";

export default function GivePage() {
  return <>
    <PageHero eyebrow="Generosidade" title="Dar é participar na transformação." description="Cada contribuição apoia o cuidado de pessoas, o crescimento de famílias e o alcance da nossa cidade." cta={{ label: "Como contribuir", href: "/contacto" }} accent="coral" titleFont="sans" />
    <section className="bg-white px-5 py-20 sm:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
      <div className="flex aspect-square max-w-md items-center justify-center bg-[var(--gold)]"><HeartHandshake className="h-24 w-24 text-[var(--ink)]" strokeWidth={1.25} aria-hidden="true" /></div>
      <div><p className="eyebrow">Uma decisão com propósito</p><h2 className="section-heading mt-4">Generosidade segura, simples e transparente.</h2>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">Para proteger os seus dados, os métodos de contribuição são confirmados diretamente com a equipa da igreja. Nunca solicitamos palavras-passe ou códigos pessoais.</p>
        <Link href="/contacto" className="primary-cta mt-9">Pedir dados para contribuir <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
      </div>
    </div></section>
  </>;
}
