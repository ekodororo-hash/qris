import { logout } from "../login/actions";
import { IconLogout, Logo } from "@/components/icons";
import { DashNav } from "./nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur print:hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between">
            <Logo />
            <form action={logout}><button className="btn-ghost btn-sm"><IconLogout className="size-4" />Keluar</button></form>
          </div>
          <DashNav />
        </div>
      </header>
      <main className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6 sm:py-8 print:max-w-none print:p-0">{children}</main>
    </div>
  );
}
