"use client";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { CopyButton, Spinner } from "@/components/buttons";
import { IconArrowRight, IconClose, IconDownload } from "@/components/icons";
import { deleteQr, resetActivation } from "./actions";
import { StatusBadge } from "@/components/status-badge";
import type { QrRow } from "./qr-table";

export function QrModal({ row, onClose }: { row: QrRow; onClose: () => void }) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin}/q/${row.publicToken}`;
  const [svg, setSvg] = useState("");
  const b = row.business;
  const [confirming, setConfirming] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [pending, start] = useTransition();

  useEffect(() => {
    let alive = true;
    import("qrcode").then((m) => m.default.toString(url, { type: "svg", margin: 2 })).then((s) => alive && setSvg(s));
    return () => { alive = false; };
  }, [url]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  const field = (label: string, value: string) => (
    <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-1 break-words text-sm text-slate-800">{value}</dd></div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4" onClick={onClose} role="dialog" aria-modal="true" aria-label={`Detail QR ${row.publicToken}`}>
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="break-all font-mono text-sm font-semibold text-slate-900">{row.publicToken}</p>
            <div className="mt-2"><StatusBadge status={row.status} /></div>
          </div>
          <button type="button" className="btn-ghost btn-sm shrink-0" onClick={onClose} aria-label="Tutup"><IconClose className="size-4" /></button>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-[13rem_1fr] sm:items-center">
          <div className="mx-auto aspect-square w-full max-w-[13rem] rounded-2xl border border-slate-200 bg-white p-2 shadow-sm [&_svg]:h-auto [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
          <div className="min-w-0 space-y-4">
            <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">URL QR</p><p className="mt-1 break-all font-mono text-sm">{url}</p></div>
            {!row.businessId && row.pin && (
              <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">PIN aktivasi</p><code className="mt-1 inline-block rounded-xl bg-brand-50 px-4 py-2 text-lg font-bold tracking-[0.3em] text-brand-700 ring-1 ring-brand-200">{row.pin}</code></div>
            )}
            <div className="flex flex-wrap gap-2">
              <a className="btn" href={`/api/qr/download?id=${row.id}&fmt=png`}><IconDownload className="size-4" />PNG</a>
              <a className="btn-ghost" href={`/api/qr/download?id=${row.id}&fmt=svg`}><IconDownload className="size-4" />SVG</a>
              <CopyButton text={url} />
            </div>
          </div>
        </div>

        {b && (
          <div className="mt-6 border-t border-slate-100 pt-5">
            <h3 className="text-base font-semibold">{b.businessName}</h3>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              {field("Pemilik", b.ownerName)}{field("Telepon", b.phone)}{field("Alamat", b.address)}{field("Link review", b.googleReviewUrl)}
            </dl>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
          {resetting ? (
            <div className="w-full space-y-3 rounded-xl bg-amber-50 p-4 ring-1 ring-amber-200">
              <p className="text-sm text-amber-900">Reset aktivasi QR ini? Bisnis <b>{b?.businessName}</b> dan akun pemilik lama akan dilepas, status kembali ke Belum Aktif, dan dibuat PIN baru. Token dan QR yang sudah tercetak tetap sama.</p>
              <div className="flex gap-2">
                <button type="button" disabled={pending} className="btn !bg-amber-600 hover:!bg-amber-700" onClick={() => start(async () => { await resetActivation(row.id); onClose(); })}>{pending && <Spinner />}{pending ? "Mereset…" : "Ya, reset"}</button>
                <button type="button" disabled={pending} className="btn-ghost" onClick={() => setResetting(false)}>Batal</button>
              </div>
            </div>
          ) : confirming ? (
            <div className="w-full space-y-3 rounded-xl bg-rose-50 p-4 ring-1 ring-rose-200">
              <p className="text-sm text-rose-800">Hapus permanen QR ini{b ? <>, bisnis <b>{b.businessName}</b>,</> : ""}? Tindakan ini tidak bisa dibatalkan. Kalau hanya ingin menyembunyikan, pakai Arsipkan.</p>
              <div className="flex gap-2">
                <button type="button" disabled={pending} className="btn !bg-rose-600 hover:!bg-rose-700" onClick={() => start(async () => { await deleteQr(row.id); onClose(); })}>{pending && <Spinner />}{pending ? "Menghapus…" : "Ya, hapus"}</button>
                <button type="button" disabled={pending} className="btn-ghost" onClick={() => setConfirming(false)}>Batal</button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="btn-ghost text-rose-600 hover:!border-rose-200 hover:!bg-rose-50" onClick={() => setConfirming(true)}>Hapus QR</button>
                {row.businessId && row.status !== "ARCHIVED" && <button type="button" className="btn-ghost" onClick={() => setResetting(true)}>Reset aktivasi</button>}
              </div>
              <Link href={`/admin/qr/${row.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">Buka halaman penuh / cetak <IconArrowRight className="size-4" /></Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
