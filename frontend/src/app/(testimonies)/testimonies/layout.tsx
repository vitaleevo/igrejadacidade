import Link from "next/link";
import { BrandLogo } from "@/components/shared/BrandLogo";

export default function TestimoniesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--ivory)]">
      <header className="sticky top-0 z-40 border-b border-[#071a3d]/10 bg-white/95 text-[#071a3d] backdrop-blur-xl">
        <div className="mx-auto flex min-h-20 max-w-[1280px] items-center justify-between gap-4 px-6 py-3 lg:px-12">
          <Link href="/" className="flex items-center gap-3">
            <BrandLogo size={52} priority className="h-10 w-10 sm:h-12 sm:w-12" />
            <div className="leading-tight">
              <div className="font-sans text-xs font-bold uppercase tracking-[.08em] sm:text-sm">Igreja da Cidade</div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-[.28em] text-[var(--teal)]">Luanda</div>
            </div>
          </Link>
          <Link href="/" className="hidden min-h-11 items-center rounded-full border border-[#071a3d]/15 px-5 text-sm font-semibold text-[#071a3d] transition hover:bg-[#eef3fa] md:inline-flex">
            ← Home
          </Link>
          <Link href="/" className="inline-flex min-h-11 shrink-0 items-center text-sm font-semibold text-[#071a3d] md:hidden">
            Home
          </Link>
        </div>
      </header>
      <main id="conteudo-principal" lang="en">{children}</main>
      <footer className="bg-[var(--ink)] text-white/75">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-6 px-6 py-10 text-sm sm:flex-row sm:items-center lg:px-12">
          <div><p className="font-semibold text-white">Igreja da Cidade Luanda</p><p className="mt-1 text-xs">© 2026 · Testemunhos para glória de Deus</p></div>
          <Link href="/privacidade" className="inline-flex min-h-11 items-center underline decoration-white/30 underline-offset-4 hover:text-white">Privacidade e consentimento</Link>
        </div>
      </footer>
    </div>
  );
}
