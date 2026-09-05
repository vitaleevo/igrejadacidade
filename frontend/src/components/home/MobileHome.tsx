import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight, CalendarDays, Clock3, HeartHandshake, MapPin, Play, UsersRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { HeroSlideshow } from "@/components/home/HeroSlideshow";

export function MobileHome() {
  const t = useTranslations("Home");
  const quickActions = [
    { label: t("quick1_label"), caption: t("quick1_caption"), href: "/sou-novo", icon: MapPin },
    { label: t("quick2_label"), caption: t("quick2_caption"), href: "/eventos", icon: CalendarDays },
    { label: t("quick3_label"), caption: t("quick3_caption"), href: "/grupos", icon: UsersRound },
    { label: t("quick4_label"), caption: t("quick4_caption"), href: "/doar", icon: HeartHandshake },
  ];
  return (
    <div className="bg-white font-sans md:hidden">
      <section className="px-3 pb-0 pt-3">
        <HeroSlideshow variant="mobile" />
        <div className="relative -mt-1 flex min-h-24 items-center overflow-hidden bg-[#0b3b82] px-6 py-6">
          <div aria-hidden="true" className="reference-stripes pointer-events-none absolute inset-0 opacity-20" />
          <p className="relative z-10 text-sm font-extrabold uppercase tracking-[.2em] text-white">{t("motto")}</p>
        </div>
      </section>

      <section className="px-4 py-10">
        <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#0b3b82]">{t("quick_access_eyebrow")}</p>
        <h2 className="mt-2 text-2xl font-extrabold text-[#071a3d]">{t("quick_access_title")}</h2>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {quickActions.map(({ label, caption, href, icon: Icon }) => (
            <Link key={href} href={href} className="min-h-36 rounded-2xl border border-[#071a3d]/10 bg-[#f7f9fc] p-5 shadow-[0_10px_24px_rgba(7,26,61,.05)] transition active:scale-[.98]">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e6eef9] text-[#0b3b82]"><Icon className="h-5 w-5" aria-hidden="true" /></span>
              <strong className="mt-5 block text-base text-[#071a3d]">{label}</strong>
              <span className="mt-1 block text-xs text-[#65748d]">{caption}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-4 py-6">
        <div className="relative overflow-hidden rounded-2xl bg-[#101216] p-6 text-white">
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full border-[20px] border-white/[.05]" />
          <p className="relative text-xs font-extrabold uppercase tracking-[.18em] text-[#8eb5e5]">{t("next_sunday_eyebrow")}</p>
          <h2 className="relative mt-3 text-3xl font-extrabold">{t("mobile_sunday_title")}</h2>
          <div className="mt-6 grid gap-3 text-sm">
            <p className="flex items-center gap-3 border-l-4 border-[#0b3b82] bg-white/[.06] p-4"><Clock3 className="h-5 w-5 text-[#8eb5e5]" aria-hidden="true" /><span><strong className="block">{t("mobile_time")}</strong><span className="text-white/65">{t("mobile_time_caption")}</span></span></p>
            <p className="flex items-center gap-3 border-l-4 border-[#0b3b82] bg-white/[.06] p-4"><MapPin className="h-5 w-5 text-[#8eb5e5]" aria-hidden="true" /><span><strong className="block">{t("mobile_address")}</strong><span className="text-white/65">{t("mobile_address_caption")}</span></span></p>
          </div>
          <Link href="/sou-novo" className="relative mt-5 flex min-h-12 items-center justify-between bg-[#0b3b82] px-5 text-sm font-extrabold text-white">{t("mobile_plan_visit")} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="px-4 py-8">
        <div className="relative min-h-[430px] overflow-hidden rounded-2xl">
          <Image src="/images/community-families-ai.webp" alt={t("slide2_alt")} fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071a3d]/90 via-[#071a3d]/10 to-transparent" />
          <div className="relative flex min-h-[430px] flex-col justify-end p-6 pt-48 text-white"><p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#f5bd42]">{t("mobile_family_eyebrow")}</p><h2 className="mt-3 text-3xl font-extrabold">{t("mobile_family_title")}</h2><Link href="/grupos" className="mt-5 inline-flex min-h-11 items-center gap-2 font-bold">{t("mobile_family_cta")} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
        </div>
      </section>

      <section className="px-4 pb-10 pt-8">
        <div className="overflow-hidden rounded-2xl border border-[#071a3d]/10 bg-white shadow-[0_16px_40px_rgba(7,26,61,.08)]">
          <div className="relative aspect-[16/10]"><Image src="/images/message-speaker-ai.webp" alt={t("alt_speaker")} fill sizes="100vw" className="object-cover" /><span className="absolute inset-0 grid place-items-center"><span className="grid h-14 w-14 place-items-center bg-white text-[#0b3b82] shadow-xl"><Play className="ml-1 h-5 w-5 fill-current" aria-hidden="true" /></span></span></div>
          <div className="p-6"><p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#0b3b82]">{t("mobile_message_eyebrow")}</p><h2 className="mt-2 text-2xl font-extrabold text-[#071a3d]">{t("mobile_message_title")}</h2><Link href="/assistir" className="mt-5 flex min-h-12 items-center justify-between bg-[#0b3b82] px-5 font-bold text-white">{t("mobile_watch_now")} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
        </div>
      </section>
    </div>
  );
}
