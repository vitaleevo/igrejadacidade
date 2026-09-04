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
  ];
  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route || "/"}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : route === "/testimonies" ? 0.8 : 0.7,
  }));
}
