import { TestimonyForm } from "@/components/testimony/TestimonyForm";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Heart, ShieldCheck, MessageCircle } from "lucide-react";
import styles from "@/components/testimony/testimony.module.css";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Testimony" });
  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default async function TestimoniesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Testimony");
  return <div className={styles.landing}>
    <section className={styles.hero} aria-labelledby="testimony-title">
      <div className={styles.heroPhoto}><Image src="/images/community-families-ai.webp" alt="" fill priority sizes="(max-width: 767px) 100vw, 65vw" className={styles.cover} /></div>
      <div className={styles.heroShade} aria-hidden="true" />
      <div className={styles.heroInner}>
        <p className={styles.eyebrow}><span /> {t("hero_eyebrow")}</p>
        <h1 id="testimony-title">{t("hero_title")}</h1>
        <p className={styles.heroQuestion}>{t("hero_question")}</p>
        <p className={styles.heroDescription}>{t("hero_description")}</p>
        <Link href="#testimony-form" className={styles.heroCta}>{t("hero_cta")} <ArrowDown size={18} aria-hidden="true" /></Link>
      </div>
      <p className={styles.photoCaption}>{t("photo_caption_1")}<br /><strong>{t("photo_caption_2")}</strong></p>
    </section>

    <div className={styles.trustBar}>
      <p><Heart size={20} aria-hidden="true" /> {t("trust_1")}</p>
      <p><ShieldCheck size={20} aria-hidden="true" /> {t("trust_2")}</p>
      <p><MessageCircle size={20} aria-hidden="true" /> {t("trust_3")}</p>
    </div>

    <section id="testimony-form" aria-labelledby="form-title" className={styles.formSection}>
      <aside className={styles.guide}>
        <p className={styles.sectionEyebrow}>{t("guide_eyebrow")}</p>
        <h2>{t("guide_title")}</h2>
        <p className={styles.guideText}>{t("guide_text")}</p>
        <nav aria-label={t("steps_nav_label")} className={styles.steps}>
          <a href="#about-you"><span>01</span><div><strong>{t("step1_title")}</strong><small>{t("step1_desc")}</small></div><ArrowUpRight size={16} aria-hidden="true" /></a>
          <a href="#your-story"><span>02</span><div><strong>{t("step2_title")}</strong><small>{t("step2_desc")}</small></div><ArrowUpRight size={16} aria-hidden="true" /></a>
          <a href="#your-permission"><span>03</span><div><strong>{t("step3_title")}</strong><small>{t("step3_desc")}</small></div><ArrowUpRight size={16} aria-hidden="true" /></a>
        </nav>
        <div className={styles.guidePhoto}><Image src="/images/community-gathering.webp" alt={t("guide_photo_alt")} fill sizes="320px" className={styles.cover} /></div>
      </aside>

      <div className={styles.formColumn}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <span className={styles.formIcon}><Heart size={24} aria-hidden="true" /></span>
            <div><p className={styles.sectionEyebrow}>{t("form_eyebrow")}</p><h2 id="form-title">{t("form_title")}</h2></div>
          </div>
          <p className={styles.formHint}>{t("form_hint")}</p>
          <TestimonyForm />
        </div>
        {process.env.NEXT_PUBLIC_APPROVAL_PREVIEW === "true" && <p className={styles.previewLink}><Link href="/testimonies/obrigado">{t("preview_link")} <ArrowUpRight size={16} aria-hidden="true" /></Link></p>}
      </div>
    </section>
  </div>;
}
