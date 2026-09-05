import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  HeartHandshake,
  MapPin,
  Play,
  UsersRound,
} from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { MobileHome } from "@/components/home/MobileHome";
import { HeroSlideshow } from "@/components/home/HeroSlideshow";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");
  const gatherings = [
    { marker: t("gathering1_marker"), title: t("gathering1_title"), meta: t("gathering1_meta"), href: "/sou-novo" },
    { marker: t("gathering2_marker"), title: t("gathering2_title"), meta: t("gathering2_meta"), href: "/grupos" },
    { marker: t("gathering3_marker"), title: t("gathering3_title"), meta: t("gathering3_meta"), href: "/eventos" },
  ];

  const nextSteps = [
    { icon: MapPin, label: t("nextstep1_label"), href: "/sou-novo" },
    { icon: UsersRound, label: t("nextstep2_label"), href: "/grupos" },
    { icon: HeartHandshake, label: t("nextstep3_label"), href: "/oracao" },
    { icon: CalendarDays, label: t("nextstep4_label"), href: "/eventos" },
  ];

  const expectItems = [t("expect_item1"), t("expect_item2"), t("expect_item3"), t("expect_item4")];
  return (
    <>
      <MobileHome />

      <div className="hidden md:block">
        <section aria-label={t("aria_hero")}>
          <HeroSlideshow variant="desktop" />
        </section>

        <section className="overflow-hidden bg-[#101216] text-white">
          <div className="mx-auto grid max-w-[1320px] lg:grid-cols-[.72fr_1.28fr]">
            <div className="relative flex min-h-[520px] flex-col justify-center px-8 py-20 lg:px-12">
              <div className="pointer-events-none absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full border-[38px] border-white/[.055]" />
              <div className="relative">
                <p className="eyebrow text-[#8eb5e5]">{t("join_us_eyebrow")}</p>
                <h2 className="mt-5 text-4xl font-extrabold uppercase tracking-[-.04em] text-white lg:text-5xl">{t("sunday_title")}</h2>
                <div className="mt-10 space-y-6">
                  <div>
                    <p className="text-sm font-extrabold uppercase tracking-[.12em]">{t("celebration1_label")}</p>
                    <p className="mt-1 text-2xl font-medium text-white/76">{t("celebration1_time")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-extrabold uppercase tracking-[.12em]">{t("celebration2_label")}</p>
                    <p className="mt-1 text-2xl font-medium text-white/76">{t("celebration2_time")}</p>
                  </div>
                </div>
                <p className="mt-8 flex items-start gap-3 text-sm leading-6 text-white/55"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#8eb5e5]" aria-hidden="true" />{t("address")}</p>
                <Link href="/contacto" className="mt-8 inline-flex min-h-12 items-center gap-3 bg-[#0b3b82] px-5 text-xs font-extrabold uppercase tracking-[.08em] text-white transition hover:bg-[#124b99]">{t("how_to_get_there")} <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
              </div>
            </div>

            <div className="relative min-h-[520px]">
              <Image src="/images/community-gathering.webp" alt={t("alt_community_gathering")} fill sizes="(max-width: 1024px) 100vw, 64vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#101216]/25 to-transparent" />
            </div>
          </div>
        </section>

        <section className="bg-white py-24 lg:py-32">
          <div className="mx-auto grid max-w-[1320px] gap-16 px-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-12">
            <div className="relative min-h-[620px] overflow-hidden">
              <Image src="/images/community-families-ai.webp" alt={t("alt_families_convivial")} fill sizes="(max-width: 1024px) 100vw, 54vw" className="object-cover" />
              <div className="absolute -right-12 -top-12 h-48 w-48 border-[18px] border-[#f5bd42]/75" aria-hidden="true" />
            </div>

            <div className="lg:pl-6">
              <p className="eyebrow text-[#0b3b82]">{t("expect_eyebrow")}</p>
              <h2 className="section-heading mt-6 uppercase">{t("expect_title")}</h2>
              <p className="mt-7 max-w-xl text-lg leading-8 text-[#4b5f7d]">{t("expect_text")}</p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2" aria-label={t("aria_expect")}>
                {expectItems.map((item) => (
                  <li key={item} className="border-l-4 border-[#0b3b82] bg-[#f3f6fb] px-4 py-4 text-sm font-bold text-[#12356b]">{item}</li>
                ))}
              </ul>
              <Link href="/sou-novo" className="mt-9 inline-flex min-h-12 items-center gap-3 bg-[#0b3b82] px-6 text-xs font-extrabold uppercase tracking-[.08em] text-white transition hover:bg-[#071a3d]">{t("learn_more")} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
          </div>
        </section>

        <section className="bg-[#f3f6fb] py-24 lg:py-28">
          <div className="mx-auto max-w-[1320px] px-8 lg:px-12">
            <div className="flex items-end justify-between gap-8">
              <div>
                <p className="eyebrow text-[#0b3b82]">{t("events_eyebrow")}</p>
                <h2 className="section-heading mt-5 uppercase">{t("events_title")}</h2>
              </div>
              <Link href="/eventos" className="hidden items-center gap-2 text-sm font-extrabold uppercase tracking-[.08em] text-[#0b3b82] md:inline-flex">{t("view_full_schedule")} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>

            <div className="mt-14 grid gap-4 lg:grid-cols-3">
              {gatherings.map((item) => (
                <Link key={item.marker} href={item.href} className="group flex min-h-[250px] flex-col justify-between border-t-8 border-[#0b3b82] bg-white p-8 shadow-[0_12px_36px_rgba(7,26,61,.06)] transition hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(7,26,61,.11)]">
                  <span className="text-sm font-extrabold tracking-[.18em] text-[#0b3b82]">{item.marker}</span>
                  <div>
                    <h3 className="text-2xl font-extrabold text-[#071a3d]">{item.title}</h3>
                    <p className="mt-2 text-sm text-[#65748d]">{item.meta}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.08em] text-[#0b3b82]">{t("explore_link")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="grid min-h-[650px] bg-white lg:grid-cols-2">
          <div className="relative min-h-[560px]">
            <Image src="/images/community-families-ai.webp" alt={t("alt_family_angolan")} fill sizes="50vw" className="object-cover" />
          </div>
          <div className="relative flex items-center overflow-hidden bg-[#0b3b82] px-10 py-20 text-white lg:px-20">
            <div className="reference-stripes pointer-events-none absolute -right-20 -top-24 h-80 w-80 opacity-55" />
            <div className="relative max-w-xl">
              <p className="eyebrow text-[#f5bd42]">{t("family_eyebrow")}</p>
              <h2 className="mt-6 text-5xl font-extrabold uppercase leading-[.92] tracking-[-.05em] text-white xl:text-6xl">{t("family_title")}</h2>
              <p className="mt-7 text-lg leading-8 text-white/72">{t("family_text")}</p>
              <Link href="/ministerios/criancas" className="mt-9 inline-flex min-h-12 items-center gap-3 bg-white px-6 text-xs font-extrabold uppercase tracking-[.08em] text-[#071a3d] transition hover:bg-[#eaf1fb]">{t("family_cta")} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
          </div>
        </section>

        <section className="bg-[#071a3d] py-24 text-white lg:py-28">
          <div className="mx-auto grid max-w-[1320px] gap-14 px-8 lg:grid-cols-[.95fr_1.05fr] lg:items-center lg:px-12">
            <div>
              <p className="eyebrow text-[#8eb5e5]">{t("message_eyebrow")}</p>
              <h2 className="mt-6 text-5xl font-extrabold uppercase leading-[.92] tracking-[-.05em] text-white lg:text-6xl">{t("message_title")}</h2>
              <p className="mt-7 max-w-xl text-lg leading-8 text-white/65">{t("message_text")}</p>
              <Link href="/assistir" className="mt-9 inline-flex min-h-12 items-center gap-3 bg-white px-6 text-xs font-extrabold uppercase tracking-[.08em] text-[#071a3d] transition hover:bg-[#eaf1fb]"><Play className="h-4 w-4 fill-current" aria-hidden="true" />{t("watch_now")}</Link>
            </div>
            <Link href="/assistir" className="group relative aspect-[3/2] overflow-hidden" aria-label={t("aria_watch")}>
              <Image src="/images/message-speaker-ai.webp" alt={t("alt_speaker")} fill sizes="(max-width: 1024px) 100vw, 54vw" className="object-cover transition duration-700 group-hover:scale-[1.02]" />
              <div className="absolute inset-0 bg-[#071a3d]/15 transition group-hover:bg-transparent" />
              <span className="absolute inset-0 grid place-items-center"><span className="grid h-20 w-20 place-items-center bg-white text-[#0b3b82] shadow-2xl"><Play className="ml-1 h-7 w-7 fill-current" aria-hidden="true" /></span></span>
            </Link>
          </div>
        </section>

        <section className="border-b border-[#071a3d]/10 bg-white">
          <div className="mx-auto grid max-w-[1320px] grid-cols-2 divide-x divide-y divide-[#071a3d]/10 px-8 lg:grid-cols-4 lg:divide-y-0 lg:px-12">
            {nextSteps.map(({ icon: Icon, label, href }) => (
              <Link key={href} href={href} className="group flex min-h-40 flex-col justify-between p-7 transition hover:bg-[#f3f6fb]">
                <Icon className="h-6 w-6 text-[#0b3b82]" aria-hidden="true" />
                <span className="flex items-end justify-between gap-4 font-extrabold text-[#071a3d]">{label}<ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
