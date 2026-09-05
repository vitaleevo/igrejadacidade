import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { siteConfig } from "@/lib/config";
import { PageHero } from "@/components/shared/PageHero";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Contacto");

  const contactItems = [
    { label: t("card_email_label"), value: siteConfig.email, href: `mailto:${siteConfig.email}`, icon: Mail, tone: "bg-[var(--gold)]" },
    { label: t("card_phone_label"), value: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/\s/g, "")}`, icon: Phone, tone: "bg-[var(--aqua)]" },
    { label: t("card_location_label"), value: siteConfig.address, href: "https://maps.google.com/?q=Luanda,Angola", icon: MapPin, tone: "bg-[var(--coral)] text-white" },
  ];

  return <>
    <PageHero eyebrow={t("hero_eyebrow")} title={t("hero_title")} description={t("hero_desc")} accent="aqua" />
    <section className="bg-[var(--ivory)] px-5 py-20 sm:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
      {contactItems.map(({ label, value, href, icon: Icon, tone }) => <a key={label} href={href} target={label === t("card_location_label") ? "_blank" : undefined} rel={label === t("card_location_label") ? "noreferrer" : undefined} className={`${tone} group flex min-h-72 flex-col justify-between p-8 transition-transform hover:-translate-y-1 sm:p-10`}>
        <div className="flex items-start justify-between"><Icon className="h-8 w-8" strokeWidth={1.5} aria-hidden="true" /><ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" /></div>
        <div><p className="text-sm uppercase tracking-[0.16em] opacity-65">{label}</p><h2 className="mt-3 break-words font-serif text-2xl sm:text-3xl">{value}</h2></div>
      </a>)}
    </div></section>
  </>;
}
