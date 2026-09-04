import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  cta?: { label: string; href: string };
  accent?: "teal" | "aqua" | "coral" | "gold";
  titleFont?: "serif" | "sans";
  image?: "worship" | "community" | "message";
};

const heroImages = {
  worship: "/images/worship-hero.webp",
  community: "/images/community-families-ai.webp",
  message: "/images/message-speaker-ai.webp",
};

const accents = {
  teal: "text-[#b8d5ff]",
  aqua: "text-[#b8d5ff]",
  coral: "text-[#ffb39f]",
  gold: "text-[#f5bd42]",
};

export function PageHero({ eyebrow, title, description, cta, accent = "teal", titleFont = "sans", image = "worship" }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#071a3d] pb-16 pt-16 text-white sm:pb-20 sm:pt-24 lg:pb-28 lg:pt-32">
      <Image src={heroImages[image]} alt="" fill priority sizes="100vw" className="object-cover object-center" />
      <div aria-hidden="true" className="absolute inset-0 bg-[#071a3d]/70" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#071a3d]/60 to-transparent" />
      <div className="relative mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
        <p className={`eyebrow ${accents[accent]}`}>{eyebrow}</p>
        <h1 className={`mt-6 max-w-5xl text-[clamp(2.5rem,8vw,7.5rem)] leading-[1.02] tracking-[-.05em] text-white ${titleFont === "sans" ? "font-sans font-extrabold" : "font-display"}`}>{title}</h1>
        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          {description && <p className="max-w-2xl text-lg leading-8 text-white/90">{description}</p>}
          {cta && <Link href={cta.href} className="inline-flex w-fit shrink-0 items-center gap-3 rounded-full bg-[#ed6a4d] px-7 py-4 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-[#d9593f]">{cta.label}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>}
        </div>
      </div>
    </section>
  );
}
