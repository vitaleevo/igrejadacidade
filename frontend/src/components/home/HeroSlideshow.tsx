"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "@/lib/motion-preference";

export type HeroSlide = {
  image: string;
  mobileImage?: string;
  alt: string;
  eyebrow: string;
  title: React.ReactNode;
  text: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
};

type HeroSlideshowProps = {
  slides?: HeroSlide[];
  intervalMs?: number;
  variant?: "desktop" | "mobile";
};

export function HeroSlideshow({ slides: slidesProp, intervalMs = 7000, variant = "desktop" }: HeroSlideshowProps) {
  const t = useTranslations("Home");
  const defaultSlides: HeroSlide[] = [
    {
      image: "/images/worship-hero.webp",
      mobileImage: "/images/mobile-worship-ai.webp",
      alt: t("slide1_alt"),
      eyebrow: t("slide1_eyebrow"),
      title: t("slide1_title"),
      text: t("slide1_text"),
      primary: { label: t("slide1_primary"), href: "/sou-novo" },
      secondary: { label: t("slide1_secondary"), href: "/assistir" },
    },
    {
      image: "/images/community-families-ai.webp",
      alt: t("slide2_alt"),
      eyebrow: t("slide2_eyebrow"),
      title: t("slide2_title"),
      text: t("slide2_text"),
      primary: { label: t("slide2_primary"), href: "/grupos" },
    },
    {
      image: "/images/message-speaker-ai.webp",
      alt: t("slide3_alt"),
      eyebrow: t("slide3_eyebrow"),
      title: t("slide3_title"),
      text: t("slide3_text"),
      primary: { label: t("slide3_primary"), href: "/assistir" },
    },
  ];
  const slides = slidesProp ?? defaultSlides;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const reducedMotion = useReducedMotion();
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMobile = variant === "mobile";
  const count = slides.length;

  const goTo = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  useEffect(() => {
    if (paused || !autoplayEnabled || reducedMotion || count < 2) return;
    timer.current = setInterval(() => setIndex((current) => (current + 1) % count), intervalMs);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [autoplayEnabled, count, intervalMs, paused, reducedMotion]);

  const slide = slides[index];

  return (
    <div
      role="region"
      aria-roledescription={t("slideshow_roledescription")}
      aria-label={t("slideshow_aria_label")}
      className={
        isMobile
          ? "relative min-h-[600px] overflow-hidden rounded-[1.5rem] bg-[#071a3d] text-white shadow-[0_20px_54px_rgba(7,26,61,.22)]"
          : "relative min-h-[730px] overflow-hidden bg-[#071a3d] text-white"
      }
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      {slides.map((item, itemIndex) => {
        const source = isMobile && item.mobileImage ? item.mobileImage : item.image;
        return (
          <div
            key={`${item.image}-${itemIndex}`}
            aria-hidden={itemIndex === index ? undefined : true}
            className={`absolute inset-0 transition-opacity duration-700 ${itemIndex === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <Image
              src={source}
              alt={itemIndex === index ? item.alt : ""}
              fill
              priority={itemIndex === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        );
      })}

      <div className={isMobile ? "absolute inset-0 bg-[linear-gradient(180deg,rgba(3,14,36,.10)_0%,rgba(3,14,36,.22)_32%,rgba(3,14,36,.96)_82%)]" : "absolute inset-0 bg-[linear-gradient(90deg,rgba(3,14,36,.92)_0%,rgba(3,14,36,.65)_42%,rgba(3,14,36,.12)_78%)]"} />
      {!isMobile && <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#071a3d] to-transparent" />}

      <div
        aria-live={paused || !autoplayEnabled || reducedMotion ? "polite" : "off"}
        className={
          isMobile
            ? "relative z-10 flex min-h-[600px] flex-col justify-end p-6 pb-24 pt-48"
            : "relative z-10 mx-auto flex min-h-[730px] max-w-[1320px] items-center px-8 pb-52 pt-24 lg:px-12"
        }
      >
        <div className={isMobile ? "max-w-sm" : "max-w-3xl"}>
          <div className={isMobile ? "mb-4 inline-flex items-center gap-2 bg-[#0b3b82] px-3 py-2 text-[10px] font-extrabold uppercase tracking-[.18em]" : "mb-6 flex items-center gap-4"}>
            {!isMobile && <span className="h-px w-12 bg-[#f5bd42]" />}
            <p className={isMobile ? undefined : "eyebrow text-[#f5bd42]"}>{slide.eyebrow}</p>
          </div>
          <h1 className={isMobile ? "break-words text-[clamp(1.85rem,8vw,2.35rem)] font-extrabold leading-[1.02] tracking-[-.05em]" : "font-display text-[clamp(3.5rem,6vw,6.4rem)] font-bold uppercase leading-[.98] tracking-[-.055em] text-white"}>
            {slide.title}
          </h1>
          <p className={isMobile ? "mt-4 max-w-xs text-sm leading-6 text-white/78" : "mt-7 max-w-xl text-lg leading-8 text-white/78"}>{slide.text}</p>
          <div className={isMobile ? "mt-6 grid gap-3" : "mt-8 flex flex-wrap gap-3"}>
            <Link href={slide.primary.href} className={isMobile ? "flex min-h-14 items-center justify-between bg-white px-5 font-extrabold text-[#071a3d]" : "primary-cta"}>
              {slide.primary.label} <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            {slide.secondary && !isMobile && <Link href={slide.secondary.href} className="secondary-cta">{slide.secondary.label}</Link>}
          </div>
        </div>
      </div>

      {!isMobile && (
        <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/15 bg-[#0b3b82]/95 backdrop-blur-sm">
          <div className="reference-stripes pointer-events-none absolute left-[42%] top-[-72px] h-64 w-64 -rotate-6 opacity-90" />
          <div className="mx-auto flex min-h-40 max-w-[1320px] items-center px-8 lg:px-12">
            <p className="relative z-10 max-w-5xl text-[clamp(1.35rem,2.35vw,2.4rem)] font-extrabold uppercase tracking-[.26em] text-white">{t("motto")}</p>
          </div>
        </div>
      )}


      <div className={`absolute z-20 flex items-center gap-2 ${isMobile ? "bottom-4 left-6" : "top-6 right-8 lg:right-12"}`}>
        {!reducedMotion && (
          <button type="button" onClick={() => setAutoplayEnabled((enabled) => !enabled)} aria-label={autoplayEnabled ? t("slideshow_pause") : t("slideshow_resume")} className="grid h-11 w-11 place-items-center border border-white/35 bg-[#071a3d]/50 text-white backdrop-blur transition hover:bg-white hover:text-[#071a3d]">
            {autoplayEnabled ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
          </button>
        )}
        <button type="button" onClick={() => goTo(index - 1)} aria-label={t("slideshow_prev")} className="grid h-11 w-11 place-items-center border border-white/35 bg-[#071a3d]/50 text-white backdrop-blur transition hover:bg-white hover:text-[#071a3d]">
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button type="button" onClick={() => goTo(index + 1)} aria-label={t("slideshow_next")} className="grid h-11 w-11 place-items-center border border-white/35 bg-[#071a3d]/50 text-white backdrop-blur transition hover:bg-white hover:text-[#071a3d]">
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {isMobile && (
        <p className="absolute bottom-4 right-6 z-20 flex h-11 items-center text-xs font-bold tracking-[.15em] text-white/75" aria-label={t("slideshow_counter", { index: index + 1, count })}>
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </p>
      )}
    </div>
  );
}
