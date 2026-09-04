import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/LegalPage";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como a Igreja da Cidade Luanda recolhe, usa e protege os seus dados — testemunhos, contactos e cookies.",
  alternates: { canonical: "/privacidade" },
};

const UPDATED = "4 de setembro de 2026";

export default function PrivacidadePage() {
  return (
    <LegalPage
      eyebrow="A SUA PRIVACIDADE"
      title="Política de Privacidade"
      intro="Respeitamos a sua privacidade. Esta política explica que dados recolhemos neste site, para que os usamos e que direitos tem sobre eles."
      updated={UPDATED}
      sections={[
        {
          heading: "Quem é responsável pelos seus dados",
          paragraphs: [
            `A responsável pelo tratamento é a ${siteConfig.name}, em Luanda, Angola. Para qualquer questão sobre privacidade, escreva para ${siteConfig.email}.`,
          ],
        },
        {
          heading: "Dados que recolhemos",
          paragraphs: [
            "Recolhemos apenas os dados que nos envia voluntariamente:",
          ],
          bullets: [
            "Formulário de testemunhos: nome completo, telefone e email (opcionais), história, data aproximada, categoria, fotografia ou vídeo (opcional), preferência de contacto e consentimento de publicação.",
            "Formulários de contacto e pedidos: nome, email e mensagem.",
            "Dados técnicos mínimos de funcionamento (por exemplo, sessão de administração e registos de segurança).",
          ],
        },
        {
          heading: "Para que usamos os seus dados",
          bullets: [
            "Responder aos seus pedidos e mensagens.",
            "Receber, moderar e — só com o seu consentimento expresso — publicar testemunhos.",
            "Gerir as atividades e a comunicação da igreja.",
            "Garantir a segurança do site e prevenir abusos.",
          ],
        },
        {
          heading: "Consentimento de publicação",
          paragraphs: [
            "Ao enviar um testemunho escolhe explicitamente entre autorizar a publicação nos canais oficiais da igreja ou permitir apenas o uso interno. Nada é publicado sem essa escolha.",
            "Mesmo com autorização, cada testemunho passa por moderação: só o que for aprovado fica visível publicamente. Pode retirar o consentimento a qualquer momento pelo email acima.",
          ],
        },
        {
          heading: "Partilha e armazenamento",
          paragraphs: [
            "Não vendemos nem partilhamos os seus dados com terceiros para marketing. Os dados ficam guardados na nossa plataforma (Convex, com alojamento seguro) e os anexos só ficam acessíveis depois de aprovação e consentimento de publicação.",
          ],
        },
        {
          heading: "Conservação",
          paragraphs: [
            "Guardamos os dados apenas pelo tempo necessário às finalidades descritas. Se pedir a eliminação, removemos os seus dados pessoais e anexos num prazo razoável, exceto quando a lei exigir outra coisa.",
          ],
        },
        {
          heading: "Os seus direitos",
          paragraphs: ["Tem direito a pedir, gratuitamente:"],
          bullets: [
            "Acesso aos dados que temos sobre si.",
            "Correção de dados incorretos ou desatualizados.",
            "Eliminação dos seus dados e anexos.",
            "Retirada do consentimento de publicação.",
          ],
        },
        {
          heading: "Menores",
          paragraphs: [
            "Testemunhos de menores devem ser enviados pelo encarregado de educação ou com a sua autorização.",
          ],
        },
        {
          heading: "Cookies",
          paragraphs: [
            "Explicamos em detalhe na nossa Política de Cookies que cookies usamos e como os pode gerir.",
          ],
        },
        {
          heading: "Alterações a esta política",
          paragraphs: [
            "Podemos atualizar esta página quando for preciso. A data no topo mostra sempre a última versão.",
          ],
        },
      ]}
    />
  );
}
