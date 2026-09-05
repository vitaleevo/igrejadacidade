import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Inter, Sora } from "next/font/google";
import { routing } from "@/i18n/routing";
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

const publicOrigin =
  process.env.NEXT_PUBLIC_APPROVAL_PREVIEW === "true"
    ? "https://igreja-cidade-luanda-aprovacao.holyconexao.chatgpt.site"
    : "https://igrejadacidadeluanda.org";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${sora.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-[var(--ink)]">
        <NextIntlClientProvider messages={messages}>
          <ChurchOrganizationSchema url={publicOrigin} />
          {process.env.NEXT_PUBLIC_APPROVAL_PREVIEW === "true" && <p className="bg-[#071a3d] px-4 py-2 text-center text-xs leading-5 text-white">Pré-visualização para aprovação · Conteúdos e contactos sujeitos a confirmação.</p>}
          <a href="#conteudo-principal" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--teal)] focus:shadow-lg">Saltar para o conteúdo</a>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
