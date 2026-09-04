import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";

const values = [
  ["Jesus no centro", "A nossa fé, ensino e decisões começam e terminam em Jesus Cristo."],
  ["Pessoas primeiro", "Cada história importa. Criamos espaço para pertencer antes mesmo de compreender tudo."],
  ["Fé em movimento", "A igreja não termina ao domingo: servimos a cidade, as famílias e a próxima geração."],
  ["Excelência com propósito", "Damos o nosso melhor porque cada detalhe pode ajudar alguém a encontrar esperança."],
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Quem somos"
        title="Uma igreja para a cidade. Uma casa para si."
        description="Somos uma comunidade cristã em Luanda que ajuda pessoas a conhecer Jesus, construir relações verdadeiras e viver uma fé com impacto."
        accent="gold"
      />

      <section className="bg-white px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="eyebrow">A nossa missão</p>
            <h2 className="section-heading mt-4">Ajudar cada pessoa a dar o próximo passo com Deus.</h2>
          </div>
          <div className="space-y-8 text-lg leading-8 text-[var(--muted)]">
            <p>Existimos para criar uma comunidade onde a fé é vivida com autenticidade, as perguntas são bem-vindas e ninguém precisa de caminhar sozinho.</p>
            <p>Somos uma família cristã comprometida em servir Luanda, acolher pessoas e partilhar a mensagem de Jesus com clareza e amor.</p>
            <div className="flex flex-wrap gap-6 pt-2">
              <Link href="/sobre/equipa" className="text-link">Conhecer a liderança <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              <Link href="/sobre/conectar" className="text-link">Como conectar-se <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--ivory)] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">O que nos orienta</p>
          <h2 className="section-heading mt-4 max-w-3xl">Valores visíveis na forma como acolhemos, servimos e crescemos.</h2>
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
