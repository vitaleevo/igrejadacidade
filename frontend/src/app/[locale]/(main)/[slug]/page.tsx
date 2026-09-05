import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/shared/PageHero";

export function generateStaticParams() {
  return [{ slug: "oracao" }, { slug: "batismo" }, { slug: "casamento" }];
}

export default async function InformationPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("InfoSlug");

  const pages: Record<string, { eyebrow: string; title: string; body: string; action: string; href: string }> = {
    // Nota: /privacidade e /termos têm páginas próprias completas; não duplicar aqui.
    oracao: {
      eyebrow: t("oracao_eyebrow"),
      title: t("oracao_title"),
      body: t("oracao_body"),
      action: t("oracao_action"),
      href: "/contacto",
    },
    batismo: {
      eyebrow: t("batismo_eyebrow"),
      title: t("batismo_title"),
      body: t("batismo_body"),
      action: t("batismo_action"),
      href: "/contacto",
    },
    casamento: {
      eyebrow: t("casamento_eyebrow"),
      title: t("casamento_title"),
      body: t("casamento_body"),
      action: t("casamento_action"),
      href: "/contacto",
    },
  };

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
