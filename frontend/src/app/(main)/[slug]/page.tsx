import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";

const pages: Record<string, { eyebrow: string; title: string; body: string; action: string; href: string }> = {
  privacidade: {
    eyebrow: "A SUA PRIVACIDADE",
    title: "Política de Privacidade",
    body: "Tratamos os dados enviados nos formulários apenas para responder ao seu pedido, acompanhar testemunhos e gerir atividades da igreja. Nunca publicamos um testemunho sem o seu consentimento expresso. Para corrigir ou eliminar os seus dados, contacte-nos.",
    action: "Falar connosco",
    href: "/contacto",
  },
  termos: {
    eyebrow: "INFORMAÇÃO IMPORTANTE",
    title: "Termos de utilização",
    body: "Este site oferece informação sobre a Igreja da Cidade Luanda e permite o envio voluntário de pedidos e testemunhos. Os conteúdos publicados podem ser atualizados. Ao enviar um testemunho, confirma que as informações são verdadeiras e que possui autorização sobre qualquer ficheiro partilhado.",
    action: "Partilhar testemunho",
    href: "/testimonies",
  },
  oracao: {
    eyebrow: "ESTAMOS CONSIGO",
    title: "Pedido de oração",
    body: "A nossa equipa de oração está pronta para caminhar consigo. Envie o seu pedido pelo contacto oficial da igreja; tratamo-lo com respeito e discrição.",
    action: "Contactar a equipa",
    href: "/contacto",
  },
  batismo: {
    eyebrow: "PRÓXIMO PASSO",
    title: "Batismo nas águas",
    body: "O batismo é uma declaração pública de fé em Jesus. Se decidiu dar este passo, fale com a nossa equipa para conhecer o próximo encontro de preparação.",
    action: "Quero saber mais",
    href: "/contacto",
  },
  casamento: {
    eyebrow: "CUIDAR DA FAMÍLIA",
    title: "Aconselhamento matrimonial",
    body: "Oferecemos orientação pastoral para casais que desejam fortalecer a comunicação, a fé e a vida familiar. O primeiro passo é uma conversa confidencial com a equipa.",
    action: "Pedir acompanhamento",
    href: "/contacto",
  },
};

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export default async function InformationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) notFound();

  return <>
    <PageHero eyebrow={page.eyebrow} title={page.title} accent="aqua" />
    <section className="bg-[var(--ivory)] px-5 py-20 sm:px-8 lg:py-28"><div className="mx-auto max-w-4xl">
      <p className="font-serif text-2xl leading-relaxed text-[var(--ink)] sm:text-3xl">{page.body}</p>
      <Link href={page.href} className="primary-cta mt-10">{page.action} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
    </div></section>
  </>;
}
