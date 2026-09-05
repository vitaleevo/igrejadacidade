import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LegalPage } from "@/components/shared/LegalPage";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Cookies");
  return {
    title: t("meta_title"),
    description: t("meta_description"),
    alternates: { canonical: "/cookies" },
  };
}

export default async function CookiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Cookies");

  return (
    <>
      <LegalPage
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro")}
        updated={t("updated")}
        updatedLabel={t("updated_label")}
        sections={[
          {
            heading: t("sec1_h"),
            paragraphs: [
              t("sec1_p1"),
            ],
            bullets: [
              t("sec1_b1"),
              t("sec1_b2"),
            ],
          },
          {
            heading: t("sec2_h"),
            paragraphs: [
              t("sec2_p1"),
            ],
            bullets: [
              t("sec2_b1"),
              t("sec2_b2"),
            ],
          },
          {
            heading: t("sec3_h"),
            bullets: [
              t("sec3_b1"),
              t("sec3_b2"),
            ],
          },
          {
            heading: t("sec4_h"),
            paragraphs: [
              t("sec4_p1"),
            ],
          },
          {
            heading: t("sec5_h"),
            paragraphs: [
              t("sec5_p1"),
            ],
          },
        ]}
      />
      <div className="bg-[var(--ivory)] px-5 pb-14 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <Link href="/privacidade" className="primary-cta">{t("cta_link")}</Link>
        </div>
      </div>
    </>
  );
}
