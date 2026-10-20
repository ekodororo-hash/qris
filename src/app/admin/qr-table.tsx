import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import type { QrStatusKey } from "@/lib/qr-status";
import { archiveQr, toggleQr, unarchiveQr } from "./actions";

export type QrRow = {
  id: string; publicToken: string; status: QrStatusKey; pin: string | null; businessId: string | null;
  activatedAt: Date | null; business: { businessName: string } | null; _count: { scanEvents: number };
};

export function QrTable({ rows, empty = "Belum ada QR." }: { rows: QrRow[]; empty?: string }) {
  return (
    <div className="card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[56rem] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3">Token</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">PIN</th><th className="px-3 py-3">Bisnis</th>
              <th className="px-3 py-3 text-right">Scan</th><th className="px-3 py-3">Aktivasi</th><th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.id} className="transition hover:bg-slate-50/70">
                <td className="px-5 py-3.5"><Link className="font-mono text-[13px] font-medium text-brand-600 hover:underline" href={`/admin/qr/${r.id}`}>{r.publicToken}</Link></td>
                <td className="px-3 py-3.5"><StatusBadge status={r.status} /></td>
                <td className="px-3 py-3.5">{!r.businessId && r.pin ? <code className="rounded-md bg-slate-100 px-2 py-1 font-mono text-[13px] tracking-wider">{r.pin}</code> : <span className="text-slate-300">—</span>}</td>
                <td className="px-3 py-3.5 font-medium text-slate-800">{r.business?.businessName ?? <span className="font-normal text-slate-300">—</span>}</td>
                <td className="px-3 py-3.5 text-right tabular-nums">{r._count.scanEvents}</td>
                <td className="px-3 py-3.5 text-slate-500">{r.activatedAt ? r.activatedAt.toLocaleDateString("id-ID") : <span className="text-slate-300">—</span>}</td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end gap-2">
                    {(r.status === "ACTIVE" || r.status === "DISABLED") && <form action={toggleQr}><input type="hidden" name="id" value={r.id} /><button className="btn-ghost btn-sm">{r.status === "ACTIVE" ? "Nonaktifkan" : "Aktifkan"}</button></form>}
                    {r.status === "ARCHIVED"
                      ? <form action={unarchiveQr}><input type="hidden" name="id" value={r.id} /><button className="btn-ghost btn-sm">Batal arsip</button></form>
                      : <form action={archiveQr}><input type="hidden" name="id" value={r.id} /><button className="btn-ghost btn-sm">Arsipkan</button></form>}
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={7} className="px-5 py-14 text-center text-slate-500">{empty}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
