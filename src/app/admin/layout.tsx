import { requireRole } from "@/lib/session";
import { AdminSidebar } from "./sidebar";
import { AdminMain } from "./admin-main";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole("ADMIN");
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[16.5rem_minmax(0,1fr)] print:block">
      <AdminSidebar />
      <AdminMain>{children}</AdminMain>
    </div>
  );
}
