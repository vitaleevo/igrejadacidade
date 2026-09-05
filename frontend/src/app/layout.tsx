import type { Metadata, Viewport } from "next";
import "./globals.css";

const publicOrigin = process.env.NEXT_PUBLIC_APPROVAL_PREVIEW === "true"
  ? "https://igreja-cidade-luanda-aprovacao.holyconexao.chatgpt.site"
  : "https://igrejadacidadeluanda.org";

export const metadata: Metadata = {
  applicationName: "Igreja da Cidade Luanda",
  title: {
    default: "Igreja da Cidade Luanda",
    template: "%s | Igreja da Cidade Luanda",
  },
  description:
    "Igreja da Cidade Luanda — uma família de fé, esperança e amor. Cultos aos domingos às 08:00 e 10:30 em Luanda, Angola. Acredite. Pertença. Torne-se.",
  keywords: ["Igreja Luanda", "Igreja da Cidade Luanda", "igreja cristã Luanda", "igreja em Angola"],
  authors: [{ name: "Igreja da Cidade Luanda" }],
  openGraph: {
    type: "website",
    locale: "pt_AO",
    url: publicOrigin,
    siteName: "Igreja da Cidade Luanda",
    title: "Igreja da Cidade Luanda",
    description: "Uma família de fé, esperança e amor em Luanda.",
    images: [{ url: `${publicOrigin}/og-cover.jpg`, width: 1200, height: 630, alt: "Igreja da Cidade Luanda" }],
  },
  twitter: { card: "summary_large_image", title: "Igreja da Cidade Luanda", description: "Uma família de fé, esperança e amor em Luanda." },
  alternates: { canonical: publicOrigin },
  metadataBase: new URL(publicOrigin),
  robots: { index: process.env.NEXT_PUBLIC_APPROVAL_PREVIEW !== "true", follow: process.env.NEXT_PUBLIC_APPROVAL_PREVIEW !== "true" },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Igreja da Cidade",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#071a3d",
};

// O <html>/<body> vivem em app/[locale]/layout.tsx (next-intl).
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
