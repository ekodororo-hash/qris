"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IconSearch } from "@/components/icons";

type Vals = { q: string; action: string; from: string; to: string };

export function AuditFilter({ initial, options }: { initial: Vals; options: { value: string; label: string }[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [v, setV] = useState(initial);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  function go(n: Vals) {
    const p = new URLSearchParams();
    if (n.q.trim()) p.set("q", n.q.trim());
    if (n.action) p.set("action", n.action);
    if (n.from) p.set("from", n.from);
    if (n.to) p.set("to", n.to);
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }
  const set = (patch: Partial<Vals>, delay = 0) => {
    const n = { ...v, ...patch };
    setV(n);
    clearTimeout(timer.current);
    if (delay) timer.current = setTimeout(() => go(n), delay); else go(n);
  };

  return (
    <form className="flex flex-col gap-2 lg:flex-row" onSubmit={(e) => { e.preventDefault(); clearTimeout(timer.current); go(v); }}>
      <div className="relative lg:w-72">
        <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input value={v.q} onChange={(e) => set({ q: e.target.value }, 350)} placeholder="Cari token / nama bisnis" className="input pl-10" />
      </div>
      <select value={v.action} onChange={(e) => set({ action: e.target.value })} className="input lg:w-60">
        <option value="">Semua aksi</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <input type="date" value={v.from} onChange={(e) => set({ from: e.target.value })} aria-label="Dari tanggal" className="input lg:w-44" />
      <input type="date" value={v.to} onChange={(e) => set({ to: e.target.value })} aria-label="Sampai tanggal" className="input lg:w-44" />
    </form>
  );
}
