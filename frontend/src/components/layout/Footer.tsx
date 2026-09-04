import Link from "next/link";
import { ArrowUpRight, Instagram, Mail, MapPin, Youtube } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { BrandLogo } from "@/components/shared/BrandLogo";

export function Footer() {
  return (
    <footer className="overflow-hidden bg-[#071a3d] text-white">
      <div className="relative border-b border-white/10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-[#4f84c4]/25" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full border border-[#f5bd42]/30" />
        <div className="mx-auto flex max-w-[1320px] flex-col gap-8 px-6 py-16 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:py-20">
          <div className="max-w-3xl">
            <p className="eyebrow text-[#f5bd42]">Há um lugar para si</p>
            <h2 className="mt-4 font-display text-4xl leading-[1.02] text-white sm:text-5xl lg:text-6xl">Venha viver a fé<br />em comunidade.</h2>
          </div>
          <Link href="/sou-novo" className="inline-flex w-fit items-center gap-3 bg-[#0b3b82] px-7 py-4 text-sm font-extrabold uppercase tracking-[.06em] transition hover:-translate-y-1 hover:bg-[#124b99]">Planeie a sua visita <ArrowUpRight className="h-5 w-5" /></Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1320px] gap-12 px-6 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.3fr_.8fr_.8fr_1fr] lg:px-12">
        <div>
          <div className="flex items-center gap-3">
            <BrandLogo size={72} className="h-16 w-16" />
            <div><p className="text-sm font-bold uppercase tracking-[0.16em]">Igreja da Cidade</p><p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/55">Luanda</p></div>
          </div>
          <p className="mt-6 max-w-sm text-sm leading-7 text-white/65">Uma família de fé que existe para ajudar pessoas a acreditar em Jesus, pertencer à comunidade e tornar-se tudo aquilo que Deus as chamou para ser.</p>
        </div>
        <div>
          <p className="footer-title">Explorar</p>
          <div className="mt-5 grid gap-3 text-sm text-white/65">
            <Link href="/sou-novo" className="footer-link">Sou novo</Link><Link href="/sobre" className="footer-link">Sobre nós</Link><Link href="/ministerios" className="footer-link">Ministérios</Link><Link href="/testimonies" className="footer-link">Testemunhos</Link>
          </div>
        </div>
        <div>
          <p className="footer-title">Próximos passos</p>
          <div className="mt-5 grid gap-3 text-sm text-white/65">
            <Link href="/grupos" className="footer-link">Encontrar um grupo</Link><Link href="/oracao" className="footer-link">Pedir oração</Link><Link href="/batismo" className="footer-link">Batismo</Link><Link href="/doar" className="footer-link">Contribuir</Link>
          </div>
        </div>
        <div>
          <p className="footer-title">Contactos</p>
          <div className="mt-5 space-y-4 text-sm text-white/65">
            <p className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#79a2d6]" />{siteConfig.address}</p>
            <a className="flex gap-3 hover:text-white" href={`mailto:${siteConfig.email}`}><Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#79a2d6]" />{siteConfig.email}</a>
            <div className="flex gap-3 pt-2"><a aria-label="Instagram" href={siteConfig.social.instagram} target="_blank" rel="noreferrer" className="social-link"><Instagram className="h-4 w-4" /></a><a aria-label="YouTube" href={siteConfig.social.youtube} target="_blank" rel="noreferrer" className="social-link"><Youtube className="h-4 w-4" /></a></div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-3 px-6 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <p>© 2026 Igreja da Cidade Luanda. Todos os direitos reservados.</p>
          <div className="flex gap-5"><Link href="/privacidade" className="hover:text-white">Privacidade</Link><Link href="/termos" className="hover:text-white">Termos</Link></div>
        </div>
      </div>
    </footer>
  );
}
