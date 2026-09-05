import { setRequestLocale } from "next-intl/server";
import { isAdmin } from "@/lib/admin-auth";
import { Shell } from "./_components/Shell";
import { getAdminList } from "./_data";

export default async function AdminSectionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  // Login fica isolado (sem sidebar); shell só para sessões autenticadas.
  if (!(await isAdmin())) return <>{children}</>;
  const pending = await getAdminList("pending", 100);
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Shell pendingCount={pending.length}>{children}</Shell>
    </div>
  );
}
