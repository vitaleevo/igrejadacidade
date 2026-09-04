import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Gestão do site",
    template: "%s · Gestão",
  },
  description: "Gestão do site — Igreja da Cidade Luanda",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-AO" className={`${inter.variable} ${sora.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-100 font-[family-name:var(--font-inter)] text-slate-900">
        {children}
      </body>
    </html>
  );
}
