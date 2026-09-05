import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/shared/PageHero";

export default async function MinistriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Ministerios");
  const ministries = [
    { number: "01", title: t("item1_title"), text: t("item1_text"), href: "/ministerios/criancas", color: "bg-[var(--gold)]" },
    { number: "02", title: t("item2_title"), text: t("item2_text"), href: "/contacto", color: "bg-[var(--aqua)]" },
    { number: "03", title: t("item3_title"), text: t("item3_text"), href: "/contacto", color: "bg-[var(--coral)] text-white" },
    { number: "04", title: t("item4_title"), text: t("item4_text"), href: "/contacto", color: "bg-[var(--teal)] text-white" },
    { number: "05", title: t("item5_title"), text: t("item5_text"), href: "/contacto", color: "bg-white" },
    { number: "06", title: t("item6_title"), text: t("item6_text"), href: "/contacto", color: "bg-[var(--ink)] text-white" },
  ];
  return (
    <>
      <PageHero
        eyebrow={t("hero_eyebrow")}
        title={t("hero_title")}
        description={t("hero_desc")}
        cta={{ label: t("hero_cta"), href: "/contacto" }}
        accent="aqua"
      />

      <section className="bg-[var(--ivory)] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {ministries.map((ministry) => (
              <Link key={ministry.title} href={ministry.href} className={`${ministry.color} group flex min-h-80 flex-col justify-between p-8 transition-transform duration-300 hover:-translate-y-1 sm:p-10`}>
                <div className="flex items-start justify-between">
                  <span className="font-mono text-sm opacity-65">{ministry.number}</span>
                  <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-serif text-4xl">{ministry.title}</h2>
                  <p className="mt-4 leading-7 opacity-75">{ministry.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
