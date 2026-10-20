"use client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { createQr } from "./actions";
import { CopyButton, Spinner } from "@/components/buttons";
import { IconArrowRight, IconPlus } from "@/components/icons";

type Result = { url: string; pin: string; id: string };
const MAX = 100;

export function CreateQr() {
  const [r, setR] = useState<Result[] | null>(null);
  const [mode, setMode] = useState<"one" | "many">("one");
  const [qty, setQty] = useState("10");
  const [pending, start] = useTransition();

  const n = mode === "one" ? 1 : Math.floor(Number(qty));
  const valid = mode === "one" || (Number.isFinite(n) && n >= 2 && n <= MAX);
  const submit = () => start(async () => setR(await createQr(n)));
  const seg = (active: boolean) => `rounded-lg px-3 py-1.5 text-sm font-medium transition ${active ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`;

  return (
    <div className="card overflow-hidden p-0">
      <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-base font-semibold">Buat QR baru</h2>
          <p className="mt-0.5 text-sm text-slate-500">Setiap QR mendapat token permanen dan PIN aktivasi untuk pemilik bisnis.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-xl bg-slate-100 p-1">
            <button type="button" className={seg(mode === "one")} onClick={() => setMode("one")} disabled={pending}>1 QR</button>
            <button type="button" className={seg(mode === "many")} onClick={() => setMode("many")} disabled={pending}>Banyak</button>
          </div>
          {mode === "many" && (
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input className="input !w-24 text-center tabular-nums" type="number" inputMode="numeric" min={2} max={MAX} value={qty} disabled={pending}
                onChange={(e) => setQty(e.target.value)} onKeyDown={(e) => e.key === "Enter" && valid && !pending && submit()} aria-label="Jumlah QR" />
              <span>QR <span className="text-slate-400">(2–{MAX})</span></span>
            </label>
          )}
          <button className="btn shrink-0" disabled={pending || !valid} onClick={submit}>
            {pending ? <Spinner /> : <IconPlus className="size-4" />}
            {pending ? "Membuat…" : n > 1 && valid ? `Buat ${n} QR` : "Buat QR baru"}
          </button>
        </div>
      </div>

      {r && r.length === 1 && (
        <div className="space-y-4 border-t border-brand-100 bg-brand-50/50 p-5">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">URL</p>
              <p className="mt-1 break-all font-mono text-sm text-slate-800">{r[0].url}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">PIN aktivasi</p>
              <code className="mt-1 inline-block rounded-xl bg-white px-4 py-2 text-2xl font-bold tracking-[0.3em] text-brand-700 ring-1 ring-brand-200">{r[0].pin}</code>
            </div>
          </div>
          <p className="rounded-xl bg-amber-50 px-3.5 py-2.5 text-sm text-amber-800 ring-1 ring-amber-200">PIN juga bisa dilihat lagi di daftar QR selama belum diaktivasi. Berikan ke pemilik secara terpisah dari QR.</p>
          <div className="flex flex-wrap gap-2">
            <CopyButton text={r[0].pin} label="Salin PIN" />
            <Link className="btn-ghost" href={`/admin/qr/${r[0].id}`}>Detail & download <IconArrowRight className="size-4" /></Link>
          </div>
        </div>
      )}

      {r && r.length > 1 && (
        <div className="space-y-4 border-t border-brand-100 bg-brand-50/50 p-5">
          <p className="text-sm font-semibold text-slate-800">{r.length} QR berhasil dibuat</p>
          <div className="max-h-64 overflow-auto rounded-xl bg-white ring-1 ring-brand-200">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr><th className="px-4 py-2">No</th><th className="px-3 py-2">Token</th><th className="px-3 py-2">PIN</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {r.map((x, i) => (
                  <tr key={x.id}>
                    <td className="px-4 py-2 tabular-nums text-slate-400">{i + 1}</td>
                    <td className="px-3 py-2 font-mono text-[13px] text-brand-600">{x.url.split("/").pop()}</td>
                    <td className="px-3 py-2"><code className="rounded-md bg-slate-100 px-2 py-1 font-mono text-[13px] tracking-wider">{x.pin}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="rounded-xl bg-amber-50 px-3.5 py-2.5 text-sm text-amber-800 ring-1 ring-amber-200">PIN juga bisa dilihat lagi di daftar QR selama belum diaktivasi. Berikan ke pemilik secara terpisah dari QR.</p>
          <div className="flex flex-wrap gap-2">
            <CopyButton text={r.map((x) => `${x.url}\t${x.pin}`).join("\n")} label="Salin semua (URL + PIN)" />
            <Link className="btn-ghost" href="/admin/qr">Lihat di daftar QR <IconArrowRight className="size-4" /></Link>
          </div>
        </div>
      )}
    </div>
  );
}
