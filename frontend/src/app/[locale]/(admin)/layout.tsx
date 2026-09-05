import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Gestão do site",
    template: "%s · Gestão",
  },
  description: "Gestão do site — Igreja da Cidade Luanda",
  robots: { index: false, follow: false },
};

// Sem <html>/<body> próprios: herda do layout [locale]. Só metadados noindex.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
