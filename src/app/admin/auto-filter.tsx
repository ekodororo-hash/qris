"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IconSearch } from "@/components/icons";

type Props = { q: string; status: string; options: { value: string; label: string }[] };

export function AutoFilter({ q, status, options }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [text, setText] = useState(q);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  function go(nextQ: string, nextStatus: string) {
    const p = new URLSearchParams();
    if (nextQ.trim()) p.set("q", nextQ.trim());
    if (nextStatus) p.set("status", nextStatus);
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <form className="flex flex-col gap-2 sm:flex-row" onSubmit={(e) => { e.preventDefault(); clearTimeout(timer.current); go(text, status); }}>
      <div className="relative sm:w-80">
        <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          value={text}
          onChange={(e) => { setText(e.target.value); clearTimeout(timer.current); const v = e.target.value; timer.current = setTimeout(() => go(v, status), 350); }}
          placeholder="Cari token / nama bisnis" className="input pl-10"
        />
      </div>
      <select value={status} onChange={(e) => { clearTimeout(timer.current); go(text, e.target.value); }} className="input sm:w-52">
        <option value="">Semua (tanpa arsip)</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </form>
  );
}
