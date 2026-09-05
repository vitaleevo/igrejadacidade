"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { siteConfig } from "@/lib/config";
import { useTranslations } from "next-intl";
import { MEDIA_ACCEPT, submitTestimony, validateTestimonyMedia } from "@/lib/testimony-submission";
import type { MsgFn, TestimonyMsgKey } from "@/lib/testimony-submission";
import { TurnstileWidget } from "@/components/testimony/TurnstileWidget";
import { TestimonySuccess } from "@/components/testimony/TestimonySuccess";
import { Loader2, Upload, AlertCircle } from "lucide-react";
import styles from "./testimony.module.css";

const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;
const choiceClass = "flex min-h-12 cursor-pointer items-start gap-3 border border-[#071a3d]/15 bg-white p-4 text-sm leading-6 has-checked:border-[#0b3b82] has-checked:bg-[#eef3fa]";

export function TestimonyForm() {
  const t = useTranslations("Testimony");
  const tErr = useTranslations("TestimonyErrors");
  const msg: MsgFn = (k: TestimonyMsgKey) => {
    const map: Record<TestimonyMsgKey, string> = {
      err_media_too_large: tErr("file_too_large"),
      err_media_empty: tErr("file_empty"),
      err_media_type: tErr("file_bad_type"),
      err_name_required: tErr("name_required"),
      err_story_short: tErr("story_short"),
      err_consent_required: tErr("consent_required"),
      err_contact_required: tErr("contact_required"),
      err_age_required: tErr("age_required"),
      err_preview_disabled: tErr("preview_no_send"),
      err_attachment_invalid: tErr("attachment_check"),
      err_attachment_rejected: tErr("attachment_accept_retry"),
      err_upload_failed: tErr("attachment_upload_fail"),
      err_preview_submissions_disabled: tErr("preview_disabled"),
      err_attachment_too_large: tErr("attachment_too_large"),
      err_validation_check: tErr("invalid_fields"),
      msg_429: tErr("too_many"),
      err_generic: tErr("confirm_retry"),
      err_unconfirmed_check_church: tErr("api_confirm_church"),
      api_err_unknown: tErr("api_unknown"),
      api_err_submit: tErr("api_send_failed"),
      api_err_receipt: tErr("api_confirm_church"),
      api_err_load: tErr("api_load_failed"),
      err_antirobot: tErr("err_antirobot"),
    };
    return map[k];
  };
  const preview = process.env.NEXT_PUBLIC_APPROVAL_PREVIEW === "true";
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const inFlight = useRef(false);
  const errorRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);
  useEffect(() => { if (submitted) successRef.current?.focus(); }, [submitted]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || preview) return;
    inFlight.current = true;
    setError(null);
    const data = new FormData(event.currentTarget);
    setLoading(true);
    try {
      await submitTestimony(data, { preview, signal: AbortSignal.timeout(120_000), msg });
      setSubmitted(true);
    } catch (cause) {
      const networkError = cause instanceof TypeError || (cause instanceof Error && ["TimeoutError", "AbortError"].includes(cause.name));
      setError(networkError ? tErr("connection_interrupted") : cause instanceof Error ? cause.message : tErr("confirm_retry"));
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }

  if (submitted) return <div ref={successRef} tabIndex={-1}><TestimonySuccess /></div>;

  return <form method="post" action="/api/testimonies" encType="multipart/form-data" onSubmit={handleSubmit} aria-busy={loading} aria-describedby={preview ? "preview-notice" : undefined} className="space-y-8">
    {preview && <div id="preview-notice" role="note" className="border-l-4 border-[#0b3b82] bg-[#eef3fa] p-4 text-sm leading-6 text-[#071a3d]">
      <p className="font-semibold">{t("preview_notice_title")}</p>
      <p>{t("preview_notice_body")}</p>
    </div>}
    {error && <div ref={errorRef} tabIndex={-1} role="alert" className="flex gap-3 border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-900"><AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" /><p>{error}</p></div>}
    <fieldset disabled={loading} className="min-w-0 space-y-8">
      <legend className="sr-only">{t("form_title")}</legend>
      <h3 id="about-you" className={styles.sectionHeading}><span>01</span> {t("step1_title")}</h3>
      <div className="space-y-2">
        <Label htmlFor="full_name">{t("label_full_name")}</Label>
        <Input id="full_name" name="full_name" required minLength={2} maxLength={255} autoComplete="name" placeholder={t("placeholder_full_name")} className="text-base" />
      </div>
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="phone">{t("label_phone")}</Label><Input id="phone" name="phone" type="tel" maxLength={50} autoComplete="tel" placeholder={t("placeholder_phone")} className="text-base" /></div>
        <div className="space-y-2"><Label htmlFor="email">{t("label_email")}</Label><Input id="email" name="email" type="email" maxLength={254} autoComplete="email" placeholder={t("placeholder_email")} className="text-base" /></div>
      </div>
      <div className="space-y-2">
        <h3 id="your-story" className={`${styles.sectionHeading} mb-6 border-t border-[#071a3d]/10 pt-8`}><span>02</span> {t("step2_title")}</h3>
        <Label htmlFor="story">{t("label_story")}</Label>
        <p id="story-help" className="text-sm leading-6 text-[var(--muted)]">{t("story_help")}</p>
        <Textarea id="story" name="story" required minLength={20} aria-describedby="story-help" placeholder={t("placeholder_story")} className="min-h-48 text-base" />
      </div>
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="happened_at">{t("label_happened")}</Label><Input id="happened_at" name="happened_at" maxLength={100} placeholder={t("placeholder_happened")} className="text-base" /></div>
        <div className="space-y-2"><Label htmlFor="category">{t("label_category")}</Label><Select id="category" name="category" defaultValue="Other" className="text-base">{siteConfig.testimonyCategories.map((category) => <option key={category} value={category}>{category}</option>)}</Select></div>
      </div>
      <div className="space-y-3">
        <Label htmlFor="media">{t("label_media")}</Label>
        <div className="border border-dashed border-[#0b3b82]/40 bg-[#eef3fa]/50 p-4 sm:p-6">
          <Upload className="mb-3 h-6 w-6 text-[#0b3b82]" aria-hidden="true" />
          <p id="media-help" className="mb-3 text-sm leading-6 text-[var(--muted)]">{t("media_help")}</p>
          <input ref={fileRef} id="media" name="media" type="file" accept={MEDIA_ACCEPT} aria-describedby="media-help" className="block min-h-12 w-full min-w-0 text-sm file:mr-3 file:border-0 file:bg-[#0b3b82] file:px-4 file:py-3 file:text-sm file:font-semibold file:text-white" onChange={(event) => {
            const file = event.target.files?.[0];
            const issue = file ? validateTestimonyMedia(file, msg) : null;
            event.target.setCustomValidity(issue || "");
            setFileName(file?.name || null);
            setError(issue);
          }} />
          {fileName && <div className="mt-3 flex flex-wrap items-center gap-3"><p className="min-w-0 break-all text-sm">{fileName}</p><button type="button" className="min-h-11 px-3 text-sm font-semibold text-[#0b3b82] underline" onClick={() => { if (fileRef.current) { fileRef.current.value = ""; fileRef.current.setCustomValidity(""); } setFileName(null); setError(null); }}>{t("remove_file")}</button></div>}
        </div>
      </div>
      <h3 id="your-permission" className={`${styles.sectionHeading} border-t border-[#071a3d]/10 pt-8`}><span>03</span> {t("step3_title")}</h3>
      <fieldset className="space-y-3"><legend className="mb-3 text-sm font-semibold">{t("q8_contact")}</legend>
        <div className="grid gap-3 sm:grid-cols-2">{[{ value: "true", label: t("choice_yes") }, { value: "false", label: t("choice_no") }].map((choice) => <label key={choice.value} className={choiceClass}><input type="radio" name="allow_contact" value={choice.value} required className="mt-1 h-4 w-4 shrink-0 accent-[#0b3b82]" /><span>{choice.label}</span></label>)}</div>
      </fieldset>
      <fieldset className="space-y-3"><legend className="mb-3 text-sm font-semibold">{t("q9_consent")}</legend>
        <p className="text-sm leading-6 text-[var(--muted)]">{t("consent_help")}</p>
        <label className={choiceClass}><input type="radio" name="publication_consent" value="publish" required className="mt-1 h-4 w-4 shrink-0 accent-[#0b3b82]" /><span>{t("consent_publish")}</span></label>
        <label className={choiceClass}><input type="radio" name="publication_consent" value="internal" required className="mt-1 h-4 w-4 shrink-0 accent-[#0b3b82]" /><span>{t("consent_internal")}</span></label>
      </fieldset>
      <div className="space-y-3">
        <label className={`${choiceClass} cursor-pointer`}><input type="checkbox" name="age_confirm" value="true" required className="mt-1 h-4 w-4 shrink-0 accent-[#0b3b82]" /><span className="text-sm font-semibold">{t("q10_age")}<span className="mt-1 block font-normal text-[var(--muted)]">{t("age_detail")}</span></span></label>
      </div>
      <TurnstileWidget />
      <Button type="submit" disabled={loading || preview || !ready} size="lg" className="h-auto min-h-14 w-full whitespace-normal rounded-none py-4" aria-describedby={preview ? "preview-notice" : undefined}>
        {loading ? <><Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> {t("submit_loading")}</> : t("submit_idle")}
      </Button>
    </fieldset>
    <p className="text-center text-sm leading-6 text-[var(--muted)]">{t("privacy_prefix")} <Link href="/privacidade" className="font-semibold text-[#0b3b82] underline">{t("privacy_link_text")}</Link>.</p>
    <noscript><p>{t("noscript")}</p></noscript>
  </form>;
}
