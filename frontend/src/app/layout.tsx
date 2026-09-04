import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { ChurchOrganizationSchema } from "@/components/seo/JsonLd";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-AO" className={`${inter.variable} ${sora.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-[var(--ink)]">
        <ChurchOrganizationSchema url={publicOrigin} />
        {process.env.NEXT_PUBLIC_APPROVAL_PREVIEW === "true" && <p className="bg-[#071a3d] px-4 py-2 text-center text-xs leading-5 text-white">Pré-visualização para aprovação · Conteúdos e contactos sujeitos a confirmação.</p>}
        <a href="#conteudo-principal" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--teal)] focus:shadow-lg">Saltar para o conteúdo</a>
        {children}
      </body>
    </html>
  );
}
