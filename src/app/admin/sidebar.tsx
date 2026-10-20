"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "../login/actions";
import { IconClose, IconDashboard, IconLogout, IconMenu, IconQr, IconShield, Logo } from "@/components/icons";

const NAV = [
  { href: "/admin", label: "Ringkasan", icon: IconDashboard, exact: true },
  { href: "/admin/qr", label: "Daftar QR", icon: IconQr, exact: false },
  { href: "/admin/audit", label: "Audit Log", icon: IconShield, exact: false },
];

function Panel({ pathname }: { pathname: string }) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pb-6 pt-6"><Link href="/admin"><Logo /></Link></div>
      <p className="px-6 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Menu</p>
      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((n) => {
          const active = n.exact ? pathname === n.href : pathname.startsWith(n.href);
          return (
            <Link key={n.href} href={n.href} aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>
              <n.icon className={`size-[18px] ${active ? "text-brand-600" : "text-slate-400"}`} />
              {n.label}
              {active && <span className="ml-auto size-1.5 rounded-full bg-brand-500" />}
            </Link>
          );
        })}
      </nav>
      <div className="m-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">A</span>
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">Admin</p><p className="text-xs text-slate-500">Pengelola QR</p></div>
        </div>
        <form action={logout} className="mt-3"><button className="btn-ghost btn-sm w-full"><IconLogout className="size-4" />Keluar</button></form>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden print:hidden">
        <Link href="/admin"><Logo /></Link>
        <button type="button" onClick={() => setOpen(true)} aria-label="Buka menu" className="grid size-9 place-items-center rounded-lg border border-slate-200 bg-white"><IconMenu className="size-5" /></button>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden print:hidden">
          <button type="button" aria-label="Tutup menu" className="absolute inset-0 bg-slate-900/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-white shadow-2xl">
            <button type="button" onClick={() => setOpen(false)} aria-label="Tutup" className="absolute right-3 top-4 grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"><IconClose className="size-5" /></button>
            <Panel pathname={pathname} />
          </aside>
        </div>
      )}

      <aside className="sticky top-0 hidden h-dvh border-r border-slate-200 bg-white lg:block print:hidden"><Panel pathname={pathname} /></aside>
    </>
  );
}
