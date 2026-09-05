import { TestimonySuccess } from "@/components/testimony/TestimonySuccess";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Testimony" });
  return { title: t("obrigado_title"), robots: { index: false, follow: false } };
}

export default async function ObrigadoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Testimony");
  return <div className="mx-auto max-w-3xl px-4 py-12 sm:px-8 sm:py-16">
    <h1 className="eyebrow text-center">{t("obrigado_title")}</h1>
    {process.env.NEXT_PUBLIC_APPROVAL_PREVIEW === "true" && <p role="note" className="mt-6 border-l-4 border-[#0b3b82] bg-[#eef3fa] p-4 text-sm leading-6">{t("obrigado_preview_note")}</p>}
    <TestimonySuccess />
  </div>;
}
