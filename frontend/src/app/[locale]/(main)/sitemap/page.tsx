import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/shared/PageHero";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("SitemapPage");
  return {
    title: t("meta_title"),
    description: t("meta_description"),
    alternates: { canonical: "/sitemap" },
  };
}

export default async function SitemapPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("SitemapPage");

  const GROUPS: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: t("group1_title"),
      links: [
        { label: t("group1_item1"), href: "/" },
        { label: t("group1_item2"), href: "/sou-novo" },
        { label: t("group1_item3"), href: "/sobre" },
        { label: t("group1_item4"), href: "/sobre/equipa" },
        { label: t("group1_item5"), href: "/sobre/conectar" },
        { label: t("group1_item6"), href: "/contacto" },
      ],
    },
    {
      title: t("group2_title"),
      links: [
        { label: t("group2_item1"), href: "/ministerios" },
        { label: t("group2_item2"), href: "/ministerios/criancas" },
      ],
    },
    {
      title: t("group3_title"),
      links: [
        { label: t("group3_item1"), href: "/grupos" },
        { label: t("group3_item2"), href: "/eventos" },
        { label: t("group3_item3"), href: "/testimonies" },
        { label: t("group3_item4"), href: "/oracao" },
        { label: t("group3_item5"), href: "/batismo" },
        { label: t("group3_item6"), href: "/casamento" },
      ],
    },
    {
      title: t("group4_title"),
      links: [
        { label: t("group4_item1"), href: "/assistir" },
        { label: t("group4_item2"), href: "/doar" },
      ],
    },
    {
      title: t("group5_title"),
      links: [
        { label: t("group5_item1"), href: "/privacidade" },
        { label: t("group5_item2"), href: "/termos" },
        { label: t("group5_item3"), href: "/cookies" },
        { label: t("group5_item4"), href: "/sitemap" },
      ],
    },
  ];

  return (
    <>
      <PageHero eyebrow={t("hero_eyebrow")} title={t("hero_title")} accent="teal" />
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
