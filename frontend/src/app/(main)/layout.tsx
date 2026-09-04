import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mobile-app-shell">
      <Header />
      <main id="conteudo-principal" className="flex-1" tabIndex={-1}>{children}</main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
