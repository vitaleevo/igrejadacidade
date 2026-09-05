import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { LegalPage } from "@/components/shared/LegalPage";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Privacidade");
  return {
    title: t("meta_title"),
    description: t("meta_description"),
    alternates: { canonical: "/privacidade" },
  };
}

export default async function PrivacidadePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Privacidade");

  return (
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
        },
        {
          heading: t("sec2_h"),
          paragraphs: [
            t("sec2_p1"),
          ],
          bullets: [
            t("sec2_b1"),
            t("sec2_b2"),
            t("sec2_b3"),
          ],
        },
        {
          heading: t("sec3_h"),
          bullets: [
            t("sec3_b1"),
            t("sec3_b2"),
            t("sec3_b3"),
            t("sec3_b4"),
          ],
        },
        {
          heading: t("sec4_h"),
          paragraphs: [
            t("sec4_p1"),
            t("sec4_p2"),
          ],
        },
        {
          heading: t("sec5_h"),
          paragraphs: [
            t("sec5_p1"),
            t("sec5_p2"),
          ],
        },
        {
          heading: t("sec6_h"),
          paragraphs: [
            t("sec6_p1"),
          ],
        },
        {
          heading: t("sec7_h"),
          paragraphs: [t("sec7_p1")],
          bullets: [
            t("sec7_b1"),
            t("sec7_b2"),
            t("sec7_b3"),
            t("sec7_b4"),
          ],
        },
        {
          heading: t("sec8_h"),
          paragraphs: [
            t("sec8_p1"),
          ],
        },
        {
          heading: t("sec9_h"),
          paragraphs: [
            t("sec9_p1"),
          ],
        },
        {
          heading: t("sec10_h"),
          paragraphs: [
            t("sec10_p1"),
          ],
        },
      ]}
    />
  );
}
