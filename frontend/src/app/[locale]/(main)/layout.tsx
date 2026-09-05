import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="mobile-app-shell">
      <Header />
      <main id="conteudo-principal" className="flex-1" tabIndex={-1}>{children}</main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
