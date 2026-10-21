"use client";

import { usePathname } from "next/navigation";

// Halaman template butuh lebar penuh (mentok kiri) supaya pratinjau dua sisi bisa sebelahan.
export function AdminMain({ children }: { children: React.ReactNode }) {
  const wide = usePathname().startsWith("/admin/template");
  return (
    <main className={`w-full px-4 py-6 sm:px-8 sm:py-10 print:max-w-none print:p-0 ${wide ? "" : "mx-auto max-w-6xl"}`}>{children}</main>
  );
}
