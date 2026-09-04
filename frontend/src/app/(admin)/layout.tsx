import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  description: "Gestão do site — Igreja da Cidade Luanda",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-AO">
      <body className="min-h-screen bg-[#f4f6fb] text-[#0b1e3a]">
        <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
      </body>
    </html>
  );
}
