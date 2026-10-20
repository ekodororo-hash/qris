"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

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
    <form className="flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); clearTimeout(timer.current); go(text, status); }}>
      <input
        value={text}
        onChange={(e) => { setText(e.target.value); clearTimeout(timer.current); const v = e.target.value; timer.current = setTimeout(() => go(v, status), 350); }}
        placeholder="Cari token / nama bisnis" className="input max-w-xs"
      />
      <select value={status} onChange={(e) => { clearTimeout(timer.current); go(text, e.target.value); }} className="input max-w-[11rem]">
        <option value="">Semua (tanpa arsip)</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </form>
  );
}
