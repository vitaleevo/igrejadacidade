import type { MetadataRoute } from "next";

const isPreview = process.env.NEXT_PUBLIC_APPROVAL_PREVIEW === "true";
const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://igrejadacidadeluanda.org";

export default function robots(): MetadataRoute.Robots {
  if (isPreview) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/testimonies/obrigado"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
