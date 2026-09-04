import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/shared/LegalPage";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description: "Que cookies o site da Igreja da Cidade Luanda usa e como os pode gerir no seu navegador.",
  alternates: { canonical: "/cookies" },
};

const UPDATED = "4 de setembro de 2026";

export default function CookiesPage() {
  return (
    <>
      <LegalPage
        eyebrow="TRANSPARÊNCIA"
        title="Política de Cookies"
        intro="Cookies são pequenos ficheiros que o navegador guarda para o site funcionar bem. Usamos o mínimo possível."
        updated={UPDATED}
        sections={[
          {
            heading: "Cookies estritamente necessários",
            paragraphs: [
              "Sem estes, partes do site não funcionam:",
            ],
            bullets: [
              "Sessão da área de gestão (rccg_admin): mantém o administrador autenticado; só existe para quem entra na gestão.",
              "Segurança e equilíbrio de carga da plataforma de alojamento.",
            ],
          },
          {
            heading: "Cookies de terceiros",
            paragraphs: [
              "Algumas páginas mostram conteúdos externos, que podem definir os seus próprios cookies:",
            ],
            bullets: [
              "Vídeos incorporados do YouTube (página Assistir).",
              "Tipos de letra do Google Fonts.",
              "Ligações para redes sociais (só definem cookies se as visitar).",
            ],
          },
          {
            heading: "O que NÃO fazemos",
            bullets: [
              "Não usamos cookies de publicidade nem vendemos dados de navegação.",
              "De momento não usamos ferramentas de análise estatística.",
            ],
          },
          {
            heading: "Como gerir cookies",
            paragraphs: [
              "Pode bloquear ou apagar cookies nas definições do seu navegador (Chrome, Safari, Firefox, Edge). Note que bloquear cookies necessários pode impedir o envio de formulários e o acesso à gestão.",
            ],
          },
          {
            heading: "Contacto",
            paragraphs: [
              `Dúvidas? Escreva para ${siteConfig.email} ou leia a Política de Privacidade.`,
            ],
          },
        ]}
      />
      <div className="bg-[var(--ivory)] px-5 pb-14 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <Link href="/privacidade" className="primary-cta">Ler a Política de Privacidade</Link>
        </div>
      </div>
    </>
  );
}
