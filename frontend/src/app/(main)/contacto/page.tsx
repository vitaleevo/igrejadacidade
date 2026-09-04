import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { PageHero } from "@/components/shared/PageHero";

const contactItems = [
  { label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}`, icon: Mail, tone: "bg-[var(--gold)]" },
  { label: "Telefone", value: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/\s/g, "")}`, icon: Phone, tone: "bg-[var(--aqua)]" },
  { label: "Localização", value: siteConfig.address, href: "https://maps.google.com/?q=Luanda,Angola", icon: MapPin, tone: "bg-[var(--coral)] text-white" },
];

export default function ContactPage() {
  return <>
    <PageHero eyebrow="Contacto" title="A sua mensagem importa para nós." description="Fale com a equipa para preparar uma visita, encontrar um grupo, pedir oração ou receber mais informações." accent="aqua" />
    <section className="bg-[var(--ivory)] px-5 py-20 sm:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
      {contactItems.map(({ label, value, href, icon: Icon, tone }) => <a key={label} href={href} target={label === "Localização" ? "_blank" : undefined} rel={label === "Localização" ? "noreferrer" : undefined} className={`${tone} group flex min-h-72 flex-col justify-between p-8 transition-transform hover:-translate-y-1 sm:p-10`}>
        <div className="flex items-start justify-between"><Icon className="h-8 w-8" strokeWidth={1.5} aria-hidden="true" /><ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" /></div>
        <div><p className="text-sm uppercase tracking-[0.16em] opacity-65">{label}</p><h2 className="mt-3 break-words font-serif text-2xl sm:text-3xl">{value}</h2></div>
      </a>)}
    </div></section>
  </>;
}
