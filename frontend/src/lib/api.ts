export type TestimonyPublic = {
  id: number;
  full_name: string;
  story: string;
  happened_at: string | null;
  category: string;
  media_url: string | null;
  media_type: string | null;
  created_at: string;
};

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function fetchWithTimeout(input: string, init: RequestInit = {}, timeoutMs = 30000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function submitTestimony(formData: FormData) {
  const res = await fetchWithTimeout("/api/testimonies", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Erro desconhecido" }));
    const detail = typeof err.detail === "string" ? err.detail : "Erro ao enviar testemunho";
    throw new ApiError(res.status, detail);
  }
  const data: unknown = await res.json().catch(() => null);
  if (!data || typeof data !== "object" || !("id" in data) || !Number.isInteger((data as { id: unknown }).id)) {
    throw new ApiError(500, "Não foi possível confirmar a receção. Fale com a igreja antes de reenviar.");
  }
  return data as TestimonyPublic & { id: number };
}

export async function getTestimonies(params?: { category?: string; limit?: number }): Promise<TestimonyPublic[]> {
  const query = new URLSearchParams();
  if (params?.category) query.set("category", params.category);
  if (params?.limit) query.set("limit", String(params.limit));
  const suffix = query.size ? `?${query.toString()}` : "";
  const res = await fetchWithTimeout(`/api/testimonies${suffix}`, { cache: "no-store" });
  if (!res.ok) throw new ApiError(res.status, "Erro ao carregar testemunhos");
  return (await res.json()) as TestimonyPublic[];
}
