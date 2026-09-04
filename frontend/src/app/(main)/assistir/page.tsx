import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";

export default function WatchPage() {
  return <>
    <PageHero image="message" eyebrow="Assista" title="Uma mensagem para levar consigo." description="Acompanhe as celebrações e reveja mensagens que ajudam a viver uma fé prática durante a semana." accent="gold" />
    <section className="bg-[var(--ivory)] px-5 py-20 sm:px-8 lg:py-28"><div className="mx-auto max-w-7xl">
      <div className="pattern-lines relative flex min-h-[460px] items-end overflow-hidden bg-[var(--ink)] p-7 text-white sm:p-12 lg:p-16"><div className="relative z-10 max-w-2xl">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--coral)]"><Play className="ml-1 h-6 w-6 fill-current" aria-hidden="true" /></span>
        <p className="eyebrow mt-10 text-[var(--aqua)]">Em breve nos canais oficiais</p><h2 className="mt-4 font-serif text-4xl sm:text-6xl">Celebrações todos os domingos.</h2>
        <p className="mt-5 text-lg text-white/70">Participe presencialmente às 08:00 ou 10:30. As transmissões e mensagens serão publicadas no YouTube.</p>
        <a href="https://youtube.com/@igrejadacidadeluanda" target="_blank" rel="noreferrer" className="secondary-cta mt-8 bg-white text-[var(--ink)]">Abrir YouTube <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
      </div></div>
      <Link href="/contacto" className="text-link mt-8">Confirmar programação <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
    </div></section>
  </>;
}
