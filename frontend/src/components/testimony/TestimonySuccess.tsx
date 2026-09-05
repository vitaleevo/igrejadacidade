import { Link } from "@/i18n/navigation";
import { CheckCircle2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export function TestimonySuccess() {
  const t = useTranslations("Testimony");
  const locale = useLocale();
  return <section lang={locale} aria-labelledby="testimony-success-title" className="py-8 text-center">
    <CheckCircle2 className="mx-auto h-14 w-14 text-[#0b3b82]" aria-hidden="true" />
    <h2 id="testimony-success-title" className="mt-6 font-sans text-3xl font-bold leading-tight text-[#071a3d] sm:text-4xl">{t("success_title")}</h2>
    <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-[var(--muted)]">{t("success_body")}</p>
    <Link href="/" className="primary-cta mt-8">{t("success_back")}</Link>
  </section>;
}
