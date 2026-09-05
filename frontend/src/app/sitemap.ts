import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://igrejadacidadeluanda.org";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes = [
    "",
    "/sou-novo",
    "/sobre",
    "/ministerios",
    "/ministerios/criancas",
    "/eventos",
    "/grupos",
    "/assistir",
    "/doar",
    "/contacto",
    "/testimonies",
    "/privacidade",
    "/termos",
    "/cookies",
    "/sitemap",
  ];
  const entries: MetadataRoute.Sitemap = [];
  for (const route of staticRoutes) {
    entries.push({
      url: `${baseUrl}/pt${route}`,
      lastModified: now,
      changeFrequency: route === "" ? "daily" : "weekly",
      priority: route === "" ? 1 : route === "/testimonies" ? 0.8 : 0.7,
      alternates: {
        languages: {
          pt: `${baseUrl}/pt${route}`,
          en: `${baseUrl}/en${route}`,
          fr: `${baseUrl}/fr${route}`,
        },
      },
    });
  }
  return entries;
}
