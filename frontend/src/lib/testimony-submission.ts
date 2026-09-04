export const MAX_MEDIA_BYTES = 50 * 1024 * 1024;
export const MEDIA_ACCEPT = ".jpg,.jpeg,.png,.webp,.mp4,.mov";
const mediaTypes: Record<string, string> = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp",
  mp4: "video/mp4", mov: "video/quicktime",
};

export function validateTestimonyMedia(file: Pick<File, "name" | "size" | "type">): string | null {
  if (file.size > MAX_MEDIA_BYTES) return "Please choose a photo or video smaller than 50 MB.";
  if (!file.size) return "The selected file is empty. Please choose another file.";
  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  if (!mediaTypes[extension] || mediaTypes[extension] !== file.type) {
    return "Please choose a JPG, PNG, WEBP, MP4 or MOV file.";
  }
  return null;
}

export function prepareTestimony(form: FormData): FormData {
  const payload = new FormData();
  for (const field of ["full_name", "phone", "email", "story", "happened_at", "category"]) {
    const value = form.get(field);
    if (typeof value === "string" && value.trim()) payload.set(field, value.trim());
  }
  if (String(payload.get("full_name") || "").length < 2) throw new Error("Please enter your full name.");
  const story = String(payload.get("story") || "");
  if (story.length < 20 || story.split(/\s+/).length < 5) {
    throw new Error("Please share your story in detail, using at least 20 characters and 5 words.");
  }
  const consent = form.get("publication_consent");
  if (consent !== "publish" && consent !== "internal") throw new Error("Please choose how your testimony may be used.");
  const contact = form.get("allow_contact");
  if (contact !== "true" && contact !== "false") throw new Error("Please choose whether we may contact you.");
  payload.set("publication_consent", consent);
  payload.set("allow_contact", contact);
  const media = form.get("media");
  if (media instanceof File && media.name) {
    const error = validateTestimonyMedia(media);
    if (error) throw new Error(error);
    payload.set("media", media);
  }
  return payload;
}

export async function uploadTestimonyFile(
  file: File,
  options: { fetcher?: typeof fetch; signal?: AbortSignal } = {}
): Promise<{ storageId: string; mediaType: "image" | "video" }> {
  const invalid = validateTestimonyMedia(file);
  if (invalid) throw new Error(invalid);
  const fetcher = options.fetcher || fetch;
  const qs = new URLSearchParams({ contentType: file.type, sizeBytes: String(file.size) });
  const urlRes = await fetcher(`/api/testimonies/upload-url?${qs.toString()}`, {
    signal: options.signal,
  });
  if (!urlRes.ok) throw new Error("The attachment could not be accepted. Please check its type and size.");
  const { uploadUrl }: { uploadUrl?: unknown } = await urlRes.json().catch(() => ({}));
  if (typeof uploadUrl !== "string" || !uploadUrl) {
    throw new Error("The attachment could not be accepted. Please try again.");
  }
  const put = await fetcher(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
    signal: options.signal,
  });
  if (!put.ok) throw new Error("The attachment could not be uploaded. Please try again.");
  const { storageId }: { storageId?: unknown } = await put.json().catch(() => ({}));
  if (typeof storageId !== "string" || !storageId) {
    throw new Error("The attachment could not be uploaded. Please try again.");
  }
  return { storageId, mediaType: file.type.startsWith("image/") ? "image" : "video" };
}

export async function submitTestimony(form: FormData, options: {
  preview: boolean;
  fetcher?: typeof fetch;
  signal?: AbortSignal;
}): Promise<void> {
  if (options.preview) throw new Error("This is an approval preview. No testimony has been sent.");
  const body = prepareTestimony(form);
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
      400: "The attachment could not be accepted. Please check its type and size.",
      403: "Submissions are not enabled in this preview.",
      413: "The attachment is too large. Please choose a file smaller than 50 MB.",
      422: "Please check your name, email, story and consent choices, then try again.",
      429: "Too many attempts. Please wait before submitting another testimony.",
    };
    throw new Error(messages[response.status] || "We could not confirm receipt. Please try again later.");
  }
  const receipt: unknown = await response.json().catch(() => null);
  if (response.status !== 201 || !receipt || typeof receipt !== "object" || !("id" in receipt) || typeof receipt.id !== "string" || !receipt.id) {
    throw new Error("We could not confirm receipt. Please check with the church before submitting again.");
  }
}
