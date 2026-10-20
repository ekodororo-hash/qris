import { requireRole } from "@/lib/session";
import { AdminSidebar } from "./sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole("ADMIN");
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[16.5rem_minmax(0,1fr)] print:block">
      <AdminSidebar />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-8 sm:py-10 print:max-w-none print:p-0">{children}</main>
    </div>
  );
}
