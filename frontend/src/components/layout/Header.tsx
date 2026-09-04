"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/shared/BrandLogo";

const primaryNavigation = [
  { label: "Sou novo", href: "/sou-novo" },
  { label: "Assistir", href: "/assistir" },
  { label: "Grupos", href: "/grupos" },
  { label: "Ministérios", href: "/ministerios" },
];

export function Header() {
  const pathname = usePathname();
  const [aboutOpen, setAboutOpen] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);
  const aboutButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    setAboutOpen(false);
    if (mobileMenuRef.current) mobileMenuRef.current.open = false;
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) {
        setAboutOpen(false);
      }
    }
    if (aboutOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [aboutOpen]);

  useEffect(() => {
    function closeOnEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (aboutRef.current?.contains(document.activeElement)) aboutButtonRef.current?.focus();
        setAboutOpen(false);
        if (mobileMenuRef.current?.open) {
          mobileMenuRef.current.open = false;
          mobileMenuRef.current.querySelector("summary")?.focus();
        }
      }
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header className="sticky left-0 top-0 z-50 w-full border-b border-[#071a3d]/10 bg-white/97 text-[#071a3d] shadow-[0_1px_0_rgba(7,26,61,.04)] backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-[1320px] items-center justify-between px-4 sm:h-[78px] sm:px-8 lg:px-12">
        <Link href="/" aria-label="Igreja da Cidade Luanda — página inicial" className="group flex items-center gap-3">
          <BrandLogo size={52} priority className="h-11 w-11 transition-transform group-hover:rotate-3 sm:h-[52px] sm:w-[52px]" />
          <span className="leading-none">
            <span className="block text-[12px] font-bold uppercase tracking-[0.14em] sm:text-[13px]">Igreja da Cidade</span>
            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.28em] text-[#0b3b82]">Luanda</span>
          </span>
        </Link>

        <nav aria-label="Navegação principal" className="hidden items-center gap-4 lg:flex xl:gap-6">
          <Link href="/" aria-current={pathname === "/" ? "page" : undefined} className="nav-link">Home</Link>
          {primaryNavigation.slice(0, 2).map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">{item.label}</Link>
          ))}

          <div className="relative" ref={aboutRef} onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setAboutOpen(false);
          }}>
            <button
              ref={aboutButtonRef}
              type="button"
              onClick={() => setAboutOpen((v) => !v)}
              aria-expanded={aboutOpen}
              aria-controls="about-navigation"
              className="nav-link flex items-center gap-1"
            >
              Sobre <ChevronDown className={`h-3.5 w-3.5 transition-transform ${aboutOpen ? "rotate-180" : ""}`} />
            </button>
            {aboutOpen && (
              <div
                id="about-navigation"
                onMouseLeave={() => setAboutOpen(false)}
                className="absolute left-1/2 top-full mt-4 w-56 -translate-x-1/2 rounded-2xl bg-white p-2 text-[#071a3d] shadow-2xl ring-1 ring-black/5"
              >
                <Link href="/sobre" className="menu-item" onClick={() => setAboutOpen(false)}>Quem somos</Link>
                <Link href="/sobre/equipa" className="menu-item" onClick={() => setAboutOpen(false)}>Nossa equipa</Link>
                <Link href="/sobre/conectar" className="menu-item" onClick={() => setAboutOpen(false)}>Como conectar</Link>
                <Link href="/eventos" className="menu-item" onClick={() => setAboutOpen(false)}>Eventos</Link>
              </div>
            )}
          </div>

          {primaryNavigation.slice(2).map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">{item.label}</Link>
          ))}
          <Link href="/doar" className="inline-flex min-h-11 items-center gap-2 bg-[#0b3b82] px-5 py-3 text-xs font-extrabold uppercase tracking-[.08em] text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#071a3d] hover:shadow-md">
            Contribuir <ArrowUpRight className="h-4 w-4" />
          </Link>
        </nav>

        <details ref={mobileMenuRef} className="group lg:hidden">
          <summary aria-label="Abrir ou fechar menu" className="grid h-11 w-11 cursor-pointer list-none place-items-center border border-[#071a3d]/12 bg-white text-[#071a3d] shadow-sm transition [&::-webkit-details-marker]:hidden">
            <Menu className="h-5 w-5 group-open:hidden" aria-hidden="true" />
            <X className="hidden h-5 w-5 group-open:block" aria-hidden="true" />
          </summary>
          <nav id="mobile-navigation" aria-label="Navegação móvel" className="mobile-navigation-panel fixed inset-x-0 top-[68px] z-50 border-t border-black/5 bg-white px-5 py-6 text-[#071a3d] shadow-2xl sm:top-[78px]">
            <div className="mx-auto grid max-w-[1440px] gap-1">
              {[{ label: "Home", href: "/" }, ...primaryNavigation.slice(0, 2), { label: "Sobre nós", href: "/sobre" }, ...primaryNavigation.slice(2), { label: "Eventos", href: "/eventos" }, { label: "Contactos", href: "/contacto" }].map((item) => (
                <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} className="rounded-lg px-4 py-3 text-[17px] font-semibold transition hover:bg-[#eef3fa]">{item.label}</Link>
              ))}
              <Link href="/doar" className="mt-3 flex items-center justify-between bg-[#0b3b82] px-4 py-4 font-bold text-white shadow-sm transition hover:bg-[#071a3d]">
                Contribuir <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
