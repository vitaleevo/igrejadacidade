"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { siteConfig } from "@/lib/config";
import { MEDIA_ACCEPT, submitTestimony, validateTestimonyMedia } from "@/lib/testimony-submission";
import { TestimonySuccess } from "@/components/testimony/TestimonySuccess";
import { Loader2, Upload, AlertCircle } from "lucide-react";
import styles from "./testimony.module.css";

const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;
const choiceClass = "flex min-h-12 cursor-pointer items-start gap-3 border border-[#071a3d]/15 bg-white p-4 text-sm leading-6 has-checked:border-[#0b3b82] has-checked:bg-[#eef3fa]";

export function TestimonyForm() {
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
      await submitTestimony(data, { preview, signal: AbortSignal.timeout(120_000) });
      setSubmitted(true);
    } catch (cause) {
      const networkError = cause instanceof TypeError || (cause instanceof Error && ["TimeoutError", "AbortError"].includes(cause.name));
      setError(networkError ? "The connection was interrupted. We could not confirm receipt. Please check with the church before submitting again." : cause instanceof Error ? cause.message : "We could not confirm receipt. Please try again later.");
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }

  if (submitted) return <div ref={successRef} tabIndex={-1}><TestimonySuccess /></div>;

  return <form method="post" action="/api/testimonies" encType="multipart/form-data" onSubmit={handleSubmit} aria-busy={loading} aria-describedby={preview ? "preview-notice" : undefined} className="space-y-8">
    {preview && <div id="preview-notice" role="note" className="border-l-4 border-[#0b3b82] bg-[#eef3fa] p-4 text-sm leading-6 text-[#071a3d]">
      <p className="font-semibold">Approval preview — submissions are not enabled.</p>
      <p>You can explore the form, but nothing will be sent or saved. Please use sample details only.</p>
    </div>}
    {error && <div ref={errorRef} tabIndex={-1} role="alert" className="flex gap-3 border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-900"><AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" /><p>{error}</p></div>}
    <fieldset disabled={loading} className="min-w-0 space-y-8">
      <legend className="sr-only">Testimony Form</legend>
      <h3 id="about-you" className={styles.sectionHeading}><span>01</span> About you</h3>
      <div className="space-y-2">
        <Label htmlFor="full_name">1. Full Name <span aria-hidden="true">*</span></Label>
        <Input id="full_name" name="full_name" required minLength={2} maxLength={255} autoComplete="name" placeholder="Your full name" className="text-base" />
      </div>
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="phone">2. Phone Number / WhatsApp <span className="font-normal">— Optional</span></Label><Input id="phone" name="phone" type="tel" maxLength={50} autoComplete="tel" placeholder="+244" className="text-base" /></div>
        <div className="space-y-2"><Label htmlFor="email">3. Email Address <span className="font-normal">— Optional</span></Label><Input id="email" name="email" type="email" maxLength={254} autoComplete="email" placeholder="you@example.com" className="text-base" /></div>
      </div>
      <div className="space-y-2">
        <h3 id="your-story" className={`${styles.sectionHeading} mb-6 border-t border-[#071a3d]/10 pt-8`}><span>02</span> Your story</h3>
        <Label htmlFor="story">4. What is your testimony? <span aria-hidden="true">*</span></Label>
        <p id="story-help" className="text-sm leading-6 text-[var(--muted)]">Please share your story in detail. At least 20 characters and 5 words.</p>
        <Textarea id="story" name="story" required minLength={20} aria-describedby="story-help" placeholder="Tell us what happened and what it means to you…" className="min-h-48 text-base" />
      </div>
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="happened_at">5. When did it happen?</Label><Input id="happened_at" name="happened_at" maxLength={100} placeholder="For example, last month" className="text-base" /></div>
        <div className="space-y-2"><Label htmlFor="category">6. Testimony Category</Label><Select id="category" name="category" defaultValue="Other" className="text-base">{siteConfig.testimonyCategories.map((category) => <option key={category} value={category}>{category}</option>)}</Select></div>
      </div>
      <div className="space-y-3">
        <Label htmlFor="media">7. Would you like to upload a photo or video? <span className="font-normal">— Optional</span></Label>
        <div className="border border-dashed border-[#0b3b82]/40 bg-[#eef3fa]/50 p-4 sm:p-6">
          <Upload className="mb-3 h-6 w-6 text-[#0b3b82]" aria-hidden="true" />
          <p id="media-help" className="mb-3 text-sm leading-6 text-[var(--muted)]">JPG, PNG, WEBP, MP4 or MOV · Up to 50 MB. Attach only media you have permission to share.</p>
          <input ref={fileRef} id="media" name="media" type="file" accept={MEDIA_ACCEPT} aria-describedby="media-help" className="block min-h-12 w-full min-w-0 text-sm file:mr-3 file:border-0 file:bg-[#0b3b82] file:px-4 file:py-3 file:text-sm file:font-semibold file:text-white" onChange={(event) => {
            const file = event.target.files?.[0];
            const issue = file ? validateTestimonyMedia(file) : null;
            event.target.setCustomValidity(issue || "");
            setFileName(file?.name || null);
            setError(issue);
          }} />
          {fileName && <div className="mt-3 flex flex-wrap items-center gap-3"><p className="min-w-0 break-all text-sm">{fileName}</p><button type="button" className="min-h-11 px-3 text-sm font-semibold text-[#0b3b82] underline" onClick={() => { if (fileRef.current) { fileRef.current.value = ""; fileRef.current.setCustomValidity(""); } setFileName(null); setError(null); }}>Remove file</button></div>}
        </div>
      </div>
      <h3 id="your-permission" className={`${styles.sectionHeading} border-t border-[#071a3d]/10 pt-8`}><span>03</span> Your permission</h3>
      <fieldset className="space-y-3"><legend className="mb-3 text-sm font-semibold">8. May we contact you for more details? <span aria-hidden="true">*</span></legend>
        <div className="grid gap-3 sm:grid-cols-2">{[{ value: "true", label: "Yes" }, { value: "false", label: "No" }].map((choice) => <label key={choice.value} className={choiceClass}><input type="radio" name="allow_contact" value={choice.value} required className="mt-1 h-4 w-4 shrink-0 accent-[#0b3b82]" /><span>{choice.label}</span></label>)}</div>
      </fieldset>
      <fieldset className="space-y-3"><legend className="mb-3 text-sm font-semibold">9. Publication Consent <span aria-hidden="true">*</span></legend>
        <p className="text-sm leading-6 text-[var(--muted)]">Choose one option. Your story will be reviewed before any publication.</p>
        <label className={choiceClass}><input type="radio" name="publication_consent" value="publish" required className="mt-1 h-4 w-4 shrink-0 accent-[#0b3b82]" /><span>I authorize the church to publish my testimony on its official channels.</span></label>
        <label className={choiceClass}><input type="radio" name="publication_consent" value="internal" required className="mt-1 h-4 w-4 shrink-0 accent-[#0b3b82]" /><span>I prefer my testimony to be used for internal purposes only.</span></label>
      </fieldset>
      <Button type="submit" disabled={loading || preview || !ready} size="lg" className="h-auto min-h-14 w-full whitespace-normal rounded-none py-4" aria-describedby={preview ? "preview-notice" : undefined}>
        {loading ? <><Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> SUBMITTING…</> : "SUBMIT MY TESTIMONY"}
      </Button>
    </fieldset>
    <p className="text-center text-sm leading-6 text-[var(--muted)]">Learn how we handle your information in our <Link href="/privacidade" className="font-semibold text-[#0b3b82] underline">Privacy Policy</Link>.</p>
    <noscript><p>JavaScript is required to submit this form. Please enable it in your browser.</p></noscript>
  </form>;
}
