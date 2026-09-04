import { TestimonyForm } from "@/components/testimony/TestimonyForm";
import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Heart, ShieldCheck, MessageCircle } from "lucide-react";
import styles from "@/components/testimony/testimony.module.css";

export const metadata = {
  title: "Share Your Testimony",
  description: "Has God done something special in your life? Share your testimony and encourage the faith of others.",
};

export default function TestimoniesPage() {
  return <div className={styles.landing}>
    <section className={styles.hero} aria-labelledby="testimony-title">
      <div className={styles.heroPhoto}><Image src="/images/community-families-ai.webp" alt="" fill priority sizes="(max-width: 767px) 100vw, 65vw" className={styles.cover} /></div>
      <div className={styles.heroShade} aria-hidden="true" />
      <div className={styles.heroInner}>
        <p className={styles.eyebrow}><span /> FAITH. HOPE. YOUR STORY.</p>
        <h1 id="testimony-title">Share your<br /><span>testimony.</span></h1>
        <p className={styles.heroQuestion}>Has God done something special in your life?</p>
        <p className={styles.heroDescription}>We want to celebrate with you. Share your testimony and allow your story to encourage and strengthen the faith of others.</p>
        <Link href="#testimony-form" className={styles.heroCta}>Share your testimony <ArrowDown size={18} aria-hidden="true" /></Link>
      </div>
      <p className={styles.photoCaption}>A story of faith.<br /><strong>A reason for hope.</strong></p>
    </section>

    <div className={styles.trustBar}>
      <p><Heart size={20} aria-hidden="true" /> Your story matters</p>
      <p><ShieldCheck size={20} aria-hidden="true" /> You choose what is shared</p>
      <p><MessageCircle size={20} aria-hidden="true" /> Reviewed with care</p>
    </div>

    <section id="testimony-form" aria-labelledby="form-title" className={styles.formSection}>
      <aside className={styles.guide}>
        <p className={styles.sectionEyebrow}>WE WANT TO CELEBRATE WITH YOU</p>
        <h2>Every story <br />starts with <br /><span>a moment.</span></h2>
        <p className={styles.guideText}>A prayer answered. A new beginning. A moment that changed everything. Tell us yours.</p>
        <nav aria-label="Testimony form sections" className={styles.steps}>
          <a href="#about-you"><span>01</span><div><strong>About you</strong><small>Let us know who you are.</small></div><ArrowUpRight size={16} aria-hidden="true" /></a>
          <a href="#your-story"><span>02</span><div><strong>Your story</strong><small>Share what happened.</small></div><ArrowUpRight size={16} aria-hidden="true" /></a>
          <a href="#your-permission"><span>03</span><div><strong>Your permission</strong><small>Choose how we may use it.</small></div><ArrowUpRight size={16} aria-hidden="true" /></a>
        </nav>
        <div className={styles.guidePhoto}><Image src="/images/community-gathering.webp" alt="Comunidade cristã reunida, imagem gerada por IA" fill sizes="320px" className={styles.cover} /></div>
      </aside>

      <div className={styles.formColumn}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <span className={styles.formIcon}><Heart size={24} aria-hidden="true" /></span>
            <div><p className={styles.sectionEyebrow}>YOUR STORY, IN YOUR WORDS</p><h2 id="form-title">Testimony Form</h2></div>
          </div>
          <p className={styles.formHint}>Fields marked with * are required. Contact details and attachments are optional.</p>
          <TestimonyForm />
        </div>
        {process.env.NEXT_PUBLIC_APPROVAL_PREVIEW === "true" && <p className={styles.previewLink}><Link href="/testimonies/obrigado">Preview the after-submission message <ArrowUpRight size={16} aria-hidden="true" /></Link></p>}
      </div>
    </section>
  </div>;
}
