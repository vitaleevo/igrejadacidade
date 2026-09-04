import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/LegalPage";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Termos de Utilização",
  description: "Regras de utilização do site da Igreja da Cidade Luanda, incluindo envio de testemunhos.",
  alternates: { canonical: "/termos" },
};

const UPDATED = "4 de setembro de 2026";

export default function TermosPage() {
  return (
    <LegalPage
      eyebrow="INFORMAÇÃO IMPORTANTE"
      title="Termos de Utilização"
      intro={`Bem-vindo ao site da ${siteConfig.name}. Ao navegar aqui, aceita estas regras simples.`}
      updated={UPDATED}
      sections={[
        {
          heading: "Objeto do site",
          paragraphs: [
            "Este site apresenta a igreja, os seus ministérios, eventos e atividades, e permite o envio voluntário de pedidos e testemunhos.",
          ],
        },
        {
          heading: "Utilização aceitável",
          bullets: [
            "Use o site de forma respeitosa e verdadeira.",
            "Não envie conteúdos ofensivos, falsos, ilegais ou que violem direitos de outras pessoas.",
            "Não tente perturbar o funcionamento do site.",
          ],
        },
        {
          heading: "Testemunhos enviados",
          bullets: [
            "Confirma que as informações enviadas são verdadeiras.",
            "Confirma que tem autorização sobre qualquer fotografia ou vídeo partilhado (incluindo de terceiros que apareçam).",
            "Ao autorizar a publicação, concede à igreja uma licença gratuita para publicar o testemunho nos seus canais oficiais.",
            "Todos os testemunhos passam por moderação; o envio não garante publicação.",
          ],
        },
        {
          heading: "Conteúdos do site",
          paragraphs: [
            "Os conteúdos publicados (horários, eventos, mensagens) são informativos e podem ser atualizados sem aviso. Em caso de dúvida, confirme pelos contactos oficiais.",
          ],
        },
        {
          heading: "Contribuições",
          paragraphs: [
            "As informações sobre contribuições têm caráter informativo. Qualquer pagamento é processado por parceiros seguros, com os seus próprios termos.",
          ],
        },
        {
          heading: "Propriedade intelectual",
          paragraphs: [
            "Textos, imagens e identidade visual deste site pertencem à igreja ou aos seus autores. Pode partilhar ligações, mas não copiar conteúdos em massa sem autorização.",
          ],
        },
        {
          heading: "Ligações externas",
          paragraphs: [
            "O site liga para serviços externos (por exemplo, YouTube e redes sociais), que têm as suas próprias regras e políticas.",
          ],
        },
        {
          heading: "Limitação de responsabilidade",
          paragraphs: [
            "Fazemos o possível para manter o site correto e disponível, mas não garantimos ausência total de erros ou interrupções.",
          ],
        },
        {
          heading: "Contacto",
          paragraphs: [
            `Dúvidas sobre estes termos? Escreva para ${siteConfig.email}.`,
          ],
        },
      ]}
    />
  );
}
