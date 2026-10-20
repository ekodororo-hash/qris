"use client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { createQr } from "./actions";
import { CopyButton } from "@/components/buttons";
import { IconArrowRight, IconPlus } from "@/components/icons";

export function CreateQr() {
  const [r, setR] = useState<{ url: string; pin: string; id: string } | null>(null);
  const [pending, start] = useTransition();
  return (
    <div className="card overflow-hidden p-0">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold">Buat QR baru</h2>
          <p className="mt-0.5 text-sm text-slate-500">Setiap QR mendapat token permanen dan PIN aktivasi untuk pemilik bisnis.</p>
        </div>
        <button className="btn shrink-0" disabled={pending} onClick={() => start(async () => setR(await createQr()))}>
          <IconPlus className="size-4" />{pending ? "Membuat…" : "Buat QR baru"}
        </button>
      </div>
      {r && (
        <div className="space-y-4 border-t border-brand-100 bg-brand-50/50 p-5">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">URL</p>
              <p className="mt-1 break-all font-mono text-sm text-slate-800">{r.url}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">PIN aktivasi</p>
              <code className="mt-1 inline-block rounded-xl bg-white px-4 py-2 text-2xl font-bold tracking-[0.3em] text-brand-700 ring-1 ring-brand-200">{r.pin}</code>
            </div>
          </div>
          <p className="rounded-xl bg-amber-50 px-3.5 py-2.5 text-sm text-amber-800 ring-1 ring-amber-200">PIN juga bisa dilihat lagi di daftar QR selama belum diaktivasi. Berikan ke pemilik secara terpisah dari QR.</p>
          <div className="flex flex-wrap gap-2">
            <CopyButton text={r.pin} label="Salin PIN" />
            <Link className="btn-ghost" href={`/admin/qr/${r.id}`}>Detail & download <IconArrowRight className="size-4" /></Link>
          </div>
        </div>
      )}
    </div>
  );
}
