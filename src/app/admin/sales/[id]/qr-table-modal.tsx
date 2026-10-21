"use client";
import { useState } from "react";
import { SubmitButton } from "@/components/buttons";
import { StatusBadge } from "@/components/status-badge";
import type { QrStatusKey } from "@/lib/qr-status";
import { rupiah } from "@/lib/sales";
import { unassignQr } from "../actions";
import { QrModal } from "../../qr-modal";
import type { QrRow } from "../../qr-table";

const fmtDate = (d: Date) => d.toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta", dateStyle: "medium" });

export type SalesQrRow = QrRow & { assignedAt: Date | null; price: number | null };

export function SalesQrTable({ qrs }: { qrs: SalesQrRow[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = qrs.find((q) => q.id === selectedId) ?? null;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[46rem] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3">Token</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">PIN</th><th className="px-3 py-3">Bisnis</th>
              <th className="px-3 py-3">Diserahkan</th><th className="px-3 py-3">Diaktivasi</th><th className="px-3 py-3 text-right">Setoran</th><th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {qrs.map((q) => (
              <tr key={q.id} className="transition hover:bg-slate-50/70">
                <td className="px-5 py-3.5"><button type="button" className="cursor-pointer font-mono text-[13px] font-medium text-brand-600 hover:underline" onClick={() => setSelectedId(q.id)}>{q.publicToken}</button></td>
                <td className="px-3 py-3.5"><StatusBadge status={q.status as QrStatusKey} /></td>
                <td className="px-3 py-3.5">{q.status === "UNACTIVATED" && q.pin ? <code className="rounded-md bg-slate-100 px-2 py-1 font-mono text-[13px] tracking-wider">{q.pin}</code> : <span className="text-slate-300">—</span>}</td>
                <td className="px-3 py-3.5 text-slate-800">{q.business?.businessName ?? <span className="text-slate-300">—</span>}</td>
                <td className="px-3 py-3.5 text-slate-500">{q.assignedAt ? fmtDate(q.assignedAt) : "—"}</td>
                <td className="px-3 py-3.5 text-slate-500">{q.activatedAt ? fmtDate(q.activatedAt) : <span className="text-slate-300">—</span>}</td>
                <td className="px-3 py-3.5 text-right tabular-nums">{q.activatedAt ? rupiah(q.price ?? 0) : <span className="text-slate-300">—</span>}</td>
                <td className="px-5 py-3.5 text-right">
                  {q.status === "UNACTIVATED" && <form action={unassignQr}><input type="hidden" name="id" value={q.id} /><SubmitButton className="btn-ghost btn-sm" pendingText="Menarik…">Tarik kembali</SubmitButton></form>}
                </td>
              </tr>
            ))}
            {qrs.length === 0 && <tr><td colSpan={8} className="px-5 py-12 text-center text-slate-500">Belum ada QR yang diserahkan ke sales ini.</td></tr>}
          </tbody>
        </table>
      </div>
      {selected && <QrModal row={selected} onClose={() => setSelectedId(null)} />}
    </>
  );
}
