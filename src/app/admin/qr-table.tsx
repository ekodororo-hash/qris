"use client";
import { useState } from "react";
import { SubmitButton } from "@/components/buttons";
import { StatusBadge } from "@/components/status-badge";
import { MAX_PIN_ATTEMPTS, type QrStatusKey } from "@/lib/qr-status";
import { archiveQr, resetPin, toggleQr, unarchiveQr } from "./actions";
import { QrModal } from "./qr-modal";

export type QrRow = {
  id: string; publicToken: string; status: QrStatusKey; pin: string | null; businessId: string | null;
  activatedAt: Date | null; failedPinAttempts: number;
  business: { businessName: string; ownerName: string; phone: string; address: string; googleReviewUrl: string } | null;
  salesperson?: { name: string } | null;
};

export function QrTable({ rows, empty = "Belum ada QR." }: { rows: QrRow[]; empty?: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = rows.find((r) => r.id === selectedId) ?? null;
  return (
    <div className="card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[66rem] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="w-12 px-5 py-3">No</th><th className="px-3 py-3">Token</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">PIN</th><th className="px-3 py-3">Bisnis</th><th className="px-3 py-3">Sales</th>
              <th className="px-3 py-3">Aktivasi</th><th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r, i) => (
              <tr key={r.id} className="transition hover:bg-slate-50/70">
                <td className="px-5 py-3.5 tabular-nums text-slate-400">{i + 1}</td>
                <td className="px-3 py-3.5"><button type="button" className="cursor-pointer font-mono text-[13px] font-medium text-brand-600 hover:underline" onClick={() => setSelectedId(r.id)}>{r.publicToken}</button></td>
                <td className="px-3 py-3.5"><div className="flex flex-wrap items-center gap-1.5"><StatusBadge status={r.status} />{r.status === "UNACTIVATED" && r.failedPinAttempts >= MAX_PIN_ATTEMPTS && <span className="badge bg-rose-50 text-rose-700 ring-rose-600/20">Terkunci</span>}</div></td>
                <td className="px-3 py-3.5">{!r.businessId && r.pin ? <code className="rounded-md bg-slate-100 px-2 py-1 font-mono text-[13px] tracking-wider">{r.pin}</code> : <span className="text-slate-300">—</span>}</td>
                <td className="px-3 py-3.5 font-medium text-slate-800">{r.business?.businessName ?? <span className="font-normal text-slate-300">—</span>}</td>
                <td className="px-3 py-3.5 text-slate-600">{r.salesperson?.name ?? <span className="text-slate-300">—</span>}</td>
                <td className="px-3 py-3.5 text-slate-500">{r.activatedAt ? r.activatedAt.toLocaleDateString("id-ID") : <span className="text-slate-300">—</span>}</td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end gap-2">
                    {(r.status === "ACTIVE" || r.status === "DISABLED") && <form action={toggleQr}><input type="hidden" name="id" value={r.id} /><SubmitButton className="btn-ghost btn-sm" pendingText={r.status === "ACTIVE" ? "Menonaktifkan…" : "Mengaktifkan…"}>{r.status === "ACTIVE" ? "Nonaktifkan" : "Aktifkan"}</SubmitButton></form>}
                    {r.status === "UNACTIVATED" && <form action={resetPin}><input type="hidden" name="id" value={r.id} /><SubmitButton className="btn-ghost btn-sm" pendingText="Mereset…">Reset PIN</SubmitButton></form>}
                    {r.status === "ARCHIVED"
                      ? <form action={unarchiveQr}><input type="hidden" name="id" value={r.id} /><SubmitButton className="btn-ghost btn-sm" pendingText="Memproses…">Batal arsip</SubmitButton></form>
                      : <form action={archiveQr}><input type="hidden" name="id" value={r.id} /><SubmitButton className="btn-ghost btn-sm" pendingText="Mengarsipkan…">Arsipkan</SubmitButton></form>}
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={8} className="px-5 py-14 text-center text-slate-500">{empty}</td></tr>}
          </tbody>
        </table>
      </div>
      {selected && <QrModal row={selected} onClose={() => setSelectedId(null)} />}
    </div>
  );
}
