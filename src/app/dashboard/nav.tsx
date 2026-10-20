"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/dashboard", label: "Ringkasan" },
  { href: "/dashboard/banner", label: "Banner & poster" },
];

export function DashNav() {
  const path = usePathname();
  return (
    <nav className="-mb-px flex gap-1" aria-label="Menu dashboard">
      {ITEMS.map((i) => {
        const on = path === i.href;
        return (
          <Link key={i.href} href={i.href} aria-current={on ? "page" : undefined}
            className={`border-b-2 px-3 pb-3 pt-1 text-sm font-medium transition ${on ? "border-brand-600 text-brand-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}>
            {i.label}
          </Link>
        );
      })}
    </nav>
  );
}
