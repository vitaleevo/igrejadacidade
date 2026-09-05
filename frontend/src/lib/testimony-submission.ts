export const MAX_MEDIA_BYTES = 50 * 1024 * 1024;
export const MEDIA_ACCEPT = ".jpg,.jpeg,.png,.webp,.mp4,.mov";
const mediaTypes: Record<string, string> = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp",
  mp4: "video/mp4", mov: "video/quicktime",
};

// Mensagens EN por omissão (testes + fallback). A UI passa traduções via `msg`.
export const EN_MSGS = {
  err_media_too_large: "Please choose a photo or video smaller than 50 MB.",
  err_media_empty: "The selected file is empty. Please choose another file.",
  err_media_type: "Please choose a JPG, PNG, WEBP, MP4 or MOV file.",
  err_name_required: "Please enter your full name.",
  err_story_short: "Please share your story in detail, using at least 20 characters and 5 words.",
  err_consent_required: "Please choose how your testimony may be used.",
  err_contact_required: "Please choose whether we may contact you.",
  err_age_required: "Please confirm you are 18 or older, or that your guardian authorizes this submission.",
  err_preview_disabled: "This is an approval preview. No testimony has been sent.",
  err_attachment_invalid: "The attachment could not be accepted. Please check its type and size.",
  err_attachment_rejected: "The attachment could not be accepted. Please try again.",
  err_upload_failed: "The attachment could not be uploaded. Please try again.",
  err_preview_submissions_disabled: "Submissions are not enabled in this preview.",
  err_attachment_too_large: "The attachment is too large. Please choose a file smaller than 50 MB.",
  err_validation_check: "Please check your name, email, story and consent choices, then try again.",
  msg_429: "Too many attempts. Please wait before submitting another testimony.",
  err_generic: "We could not confirm receipt. Please try again later.",
  err_unconfirmed_check_church: "We could not confirm receipt. Please check with the church before submitting again.",
  api_err_unknown: "Unknown error",
  api_err_submit: "Failed to submit testimony",
  api_err_receipt: "We could not confirm receipt. Please check with the church before submitting again.",
  api_err_load: "Failed to load testimonies",
  err_antirobot: "Anti-robot verification failed. Please try again.",
} as const;

export type TestimonyMsgKey = keyof typeof EN_MSGS;
export type MsgFn = (key: TestimonyMsgKey) => string;
const defaultMsg: MsgFn = (key) => EN_MSGS[key];

export function validateTestimonyMedia(
  file: Pick<File, "name" | "size" | "type">,
  msg: MsgFn = defaultMsg
): string | null {
  if (file.size > MAX_MEDIA_BYTES) return msg("err_media_too_large");
  if (!file.size) return msg("err_media_empty");
  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  if (!mediaTypes[extension] || mediaTypes[extension] !== file.type) {
    return msg("err_media_type");
  }
  return null;
}

export function prepareTestimony(form: FormData, msg: MsgFn = defaultMsg): FormData {
  const payload = new FormData();
  for (const field of ["full_name", "phone", "email", "story", "happened_at", "category"]) {
    const value = form.get(field);
    if (typeof value === "string" && value.trim()) payload.set(field, value.trim());
  }
  if (String(payload.get("full_name") || "").length < 2) throw new Error(msg("err_name_required"));
  const story = String(payload.get("story") || "");
  if (story.length < 20 || story.split(/\s+/).length < 5) {
    throw new Error(msg("err_story_short"));
  }
  const consent = form.get("publication_consent");
  if (consent !== "publish" && consent !== "internal") throw new Error(msg("err_consent_required"));
  const contact = form.get("allow_contact");
  if (contact !== "true" && contact !== "false") throw new Error(msg("err_contact_required"));
  if (form.get("age_confirm") !== "true") throw new Error(msg("err_age_required"));
  payload.set("publication_consent", consent);
  payload.set("allow_contact", contact);
  payload.set("age_confirm", "true");
  const turnstile = form.get("cf-turnstile-response");
  if (typeof turnstile === "string" && turnstile) payload.set("cf-turnstile-response", turnstile);
  const media = form.get("media");
  if (media instanceof File && media.name) {
    const error = validateTestimonyMedia(media, msg);
    if (error) throw new Error(error);
    payload.set("media", media);
  }
  return payload;
}

export async function uploadTestimonyFile(
  file: File,
  options: { fetcher?: typeof fetch; signal?: AbortSignal; msg?: MsgFn } = {}
): Promise<{ storageId: string; mediaType: "image" | "video" }> {
  const msg = options.msg || defaultMsg;
  const invalid = validateTestimonyMedia(file, msg);
  if (invalid) throw new Error(invalid);
  const fetcher = options.fetcher || fetch;
  const qs = new URLSearchParams({ contentType: file.type, sizeBytes: String(file.size) });
  const urlRes = await fetcher(`/api/testimonies/upload-url?${qs.toString()}`, {
    signal: options.signal,
  });
  if (!urlRes.ok) throw new Error(msg("err_attachment_invalid"));
  const { uploadUrl }: { uploadUrl?: unknown } = await urlRes.json().catch(() => ({}));
  if (typeof uploadUrl !== "string" || !uploadUrl) {
    throw new Error(msg("err_attachment_rejected"));
  }
  const put = await fetcher(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
    signal: options.signal,
  });
  if (!put.ok) throw new Error(msg("err_upload_failed"));
  const { storageId }: { storageId?: unknown } = await put.json().catch(() => ({}));
  if (typeof storageId !== "string" || !storageId) {
    throw new Error(msg("err_upload_failed"));
  }
  return { storageId, mediaType: file.type.startsWith("image/") ? "image" : "video" };
}

export async function submitTestimony(form: FormData, options: {
  preview: boolean;
  fetcher?: typeof fetch;
  signal?: AbortSignal;
  msg?: MsgFn;
}): Promise<void> {
  const msg = options.msg || defaultMsg;
  if (options.preview) throw new Error(msg("err_preview_disabled"));
  const body = prepareTestimony(form, msg);
  const media = body.get("media");
  if (media instanceof File && media.name) {
    const { storageId, mediaType } = await uploadTestimonyFile(media, options);
    body.delete("media");
    body.set("mediaStorageId", storageId);
    body.set("mediaType", mediaType);
  }
  const response = await (options.fetcher || fetch)("/api/testimonies", {
    method: "POST", body, signal: options.signal,
  });
  if (!response.ok) {
    const messages: Record<number, string> = {
      400: msg("err_attachment_invalid"),
      403: msg("err_preview_submissions_disabled"),
      413: msg("err_attachment_too_large"),
      422: msg("err_validation_check"),
      429: msg("msg_429"),
    };
    throw new Error(messages[response.status] || msg("err_generic"));
  }
  const receipt: unknown = await response.json().catch(() => null);
  if (response.status !== 201 || !receipt || typeof receipt !== "object" || !("id" in receipt) || typeof receipt.id !== "string" || !receipt.id) {
    throw new Error(msg("err_unconfirmed_check_church"));
  }
}
