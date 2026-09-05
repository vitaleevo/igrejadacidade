export const siteConfig = {
  name: "Igreja da Cidade Luanda",
  shortName: "Igreja da Cidade Luanda",
  description:
    "Igreja da Cidade Luanda — uma família de fé, esperança e amor, servindo Luanda com a mensagem de Cristo. Acredite. Pertença. Torne-se.",
  url: "https://igrejadacidadeluanda.org",
  testimoniesUrl: "https://testimonies.igrejadacidadeluanda.org",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  address: "Luanda, Angola",
  email: "contacto@igrejadacidadeluanda.org",
  phone: "+244 900 000 000",
  social: {
    facebook: "https://www.facebook.com/rccgLuanda",
    instagram: "https://instagram.com/igrejadacidadeluanda",
    youtube: "https://youtube.com/@igrejadacidadeluanda",
  },
  services: [
    { name: "1º Culto", time: "Todos os Domingos às 08:00", icon: "sunrise" },
    { name: "2º Culto", time: "Todos os Domingos às 10:30", icon: "sun" },
    { name: "Culto da Semana", time: "Quartas-feiras às 18:00", icon: "moon" },
  ],
  nav: [
    { label: "Home", href: "/" },
    { label: "Sou Novo", href: "/sou-novo" },
    { label: "Sobre Nós", href: "/sobre", children: [
      { label: "Nossa Equipa", href: "/sobre/equipa" },
      { label: "Conecte-se", href: "/sobre/conectar" },
      { label: "Eventos", href: "/eventos" },
      { label: "Contacte-nos", href: "/contacto" },
    ]},
    { label: "Grupos de Conexão", href: "/grupos" },
    { label: "Ministérios", href: "/ministerios" },
    { label: "Assistir", href: "/assistir" },
    { label: "Doar", href: "/doar" },
  ],
  testimonyCategories: [
    "Healing",
    "Answered Prayer",
    "Employment / Finances",
    "Family / Marriage",
    "Deliverance",
    "Conversion / Salvation",
    "Miracle",
    "Other",
  ] as const,
};

export type TestimonyCategory = typeof siteConfig.testimonyCategories[number];
