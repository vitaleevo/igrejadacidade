import { Shell } from "./_components/Shell";
import { getAdminList } from "./_data";

export default async function AdminSectionLayout({ children }: { children: React.ReactNode }) {
  const pending = await getAdminList("pending", 100);
  return <Shell pendingCount={pending.length}>{children}</Shell>;
}
