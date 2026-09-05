import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const approvalPreview = process.env.NEXT_PUBLIC_APPROVAL_PREVIEW === "true";
// standalone SÓ para Docker prod — a Vercel não suporta output standalone (parte o onBuildComplete).
const isProdDocker = process.env.DOCKER_BUILD === "true" && !process.env.VERCEL;

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob: https:",
  "connect-src 'self' https:",
  "frame-src https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const nextConfig: NextConfig = {
  ...(approvalPreview ? { output: "export", images: { unoptimized: true }, trailingSlash: true } : {}),
  ...(!approvalPreview && isProdDocker ? { output: "standalone" } : {}),
  allowedDevOrigins: ["172.31.78.219"],
  poweredByHeader: false,
  // Backend canónico: Vercel Route Handlers + Convex. Sem proxy externo.
  async headers() {
    if (approvalPreview) return [];
    const prodSecurity = process.env.NODE_ENV === "production" ? [
      { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
      { key: "Content-Security-Policy", value: csp },
    ] : [];
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          ...prodSecurity,
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(approvalPreview ? { ...nextConfig, headers: undefined } : nextConfig);
