import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Mapa do site",
  description: "Todas as páginas do site da Igreja da Cidade Luanda num só lugar.",
  alternates: { canonical: "/sitemap" },
};

const GROUPS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Principal",
    links: [
      { label: "Página inicial", href: "/" },
      { label: "Sou novo", href: "/sou-novo" },
      { label: "Sobre nós", href: "/sobre" },
      { label: "Nossa equipa", href: "/sobre/equipa" },
      { label: "Conecte-se", href: "/sobre/conectar" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
  {
    title: "Ministérios",
    links: [
      { label: "Todos os ministérios", href: "/ministerios" },
      { label: "Ministério infantil", href: "/ministerios/criancas" },
    ],
  },
  {
    title: "Comunidade",
    links: [
      { label: "Grupos de conexão", href: "/grupos" },
      { label: "Eventos", href: "/eventos" },
      { label: "Testemunhos", href: "/testimonies" },
      { label: "Pedir oração", href: "/oracao" },
      { label: "Batismo", href: "/batismo" },
      { label: "Aconselhamento matrimonial", href: "/casamento" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Assistir", href: "/assistir" },
      { label: "Contribuir", href: "/doar" },
    ],
  },
  {
    title: "Informação legal",
    links: [
      { label: "Política de Privacidade", href: "/privacidade" },
      { label: "Termos de Utilização", href: "/termos" },
      { label: "Política de Cookies", href: "/cookies" },
      { label: "Mapa do site", href: "/sitemap" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <>
      <PageHero eyebrow="NAVEGAÇÃO" title="Mapa do site" accent="teal" />
      <section className="bg-[var(--ivory)] px-5 py-14 sm:px-8 lg:py-20">
        <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {GROUPS.map((g) => (
            <nav key={g.title} aria-label={g.title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60">
              <h2 className="font-[family-name:var(--font-sora)] text-base font-bold text-[var(--ink)]">
                {g.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-[#1F5AA6] underline-offset-4 hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </section>
    </>
  );
}
