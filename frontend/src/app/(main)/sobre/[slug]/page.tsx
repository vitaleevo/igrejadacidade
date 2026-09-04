import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";

const pages: Record<string, { title: string; body: string }> = {
  equipa: {
    title: "Nossa equipa",
    body: "Somos uma equipa de líderes e voluntários comprometidos em servir a Deus e a cidade de Luanda com amor, integridade e excelência.",
  },
  conectar: {
    title: "Conecte-se",
    body: "A vida é melhor em comunidade. Venha conhecer a igreja num domingo, participe num grupo de conexão e encontre um lugar onde pode crescer e servir.",
  },
};

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export default async function AboutDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) notFound();
  return <>
    <PageHero eyebrow="Sobre nós" title={page.title} description={page.body} accent="gold" />
    <section className="bg-[var(--ivory)] px-5 py-20 text-center sm:px-8 lg:py-28"><h2 className="mx-auto max-w-3xl font-serif text-4xl leading-tight text-[var(--ink)] sm:text-5xl">Queremos conhecer a sua história também.</h2><Link href="/contacto" className="primary-cta mt-9">Fale connosco <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></section>
  </>;
}
