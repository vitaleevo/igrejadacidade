import { isAdmin } from "@/lib/admin-auth";
import { Shell } from "./_components/Shell";
import { getAdminList } from "./_data";

export default async function AdminSectionLayout({ children }: { children: React.ReactNode }) {
  // Login fica isolado (sem sidebar); shell só para sessões autenticadas.
  if (!(await isAdmin())) return <>{children}</>;
  const pending = await getAdminList("pending", 100);
  return <Shell pendingCount={pending.length}>{children}</Shell>;
}
