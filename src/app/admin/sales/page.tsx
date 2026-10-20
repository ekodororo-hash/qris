import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { PageHeader } from "@/components/page-header";
import { SubmitButton } from "@/components/buttons";
import { getPrice, rupiah, salesTotals } from "@/lib/sales";
import { deleteSalesperson } from "./actions";
import { AddSalesForm, PriceForm } from "./forms";

export default async function SalesPage() {
  await requireRole("ADMIN");
  const [people, totals, price] = await Promise.all([
    prisma.salesperson.findMany({ orderBy: { name: "asc" } }),
    salesTotals(),
    getPrice(),
  ]);
  const rows = people.map((p) => {
    const t = totals.get(p.id) ?? { held: 0, sold: 0, owed: 0, paid: 0 };
    return { ...p, ...t, balance: t.owed - t.paid };
  });
  const totalBalance = rows.reduce((a, r) => a + r.balance, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Sales" desc="Pantau QR yang dipegang tiap sales dan setoran yang wajib dibayar." />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card"><PriceForm current={price} /></div>
        <div className="card"><AddSalesForm /></div>
      </div>
      {!price && <p className="rounded-xl bg-amber-50 px-3.5 py-2.5 text-sm text-amber-800 ring-1 ring-amber-200">Harga setoran belum diatur. QR belum bisa diserahkan ke sales sebelum harga diisi.</p>}

      <div className="card overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5">
          <h2 className="text-base font-semibold">Rekap per sales</h2>
          <p className="text-sm text-slate-500">Total sisa setoran: <span className={`font-semibold tabular-nums ${totalBalance > 0 ? "text-rose-600" : "text-emerald-600"}`}>{rupiah(totalBalance)}</span></p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[46rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3">Sales</th><th className="px-3 py-3 text-right">Dipegang</th><th className="px-3 py-3 text-right">Aktif (terjual)</th>
                <th className="px-3 py-3 text-right">Wajib setor</th><th className="px-3 py-3 text-right">Sudah setor</th><th className="px-5 py-3 text-right">Sisa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.id} className="transition hover:bg-slate-50/70">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/sales/${r.id}`} className="font-medium text-brand-600 hover:underline">{r.name}</Link>
                      {r.held === 0 && r.paid === 0 && <form action={deleteSalesperson}><input type="hidden" name="id" value={r.id} /><SubmitButton className="btn-ghost btn-sm" pendingText="Menghapus…">Hapus</SubmitButton></form>}
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-right tabular-nums">{r.held}</td>
                  <td className="px-3 py-3.5 text-right tabular-nums">{r.sold}</td>
                  <td className="px-3 py-3.5 text-right tabular-nums">{rupiah(r.owed)}</td>
                  <td className="px-3 py-3.5 text-right tabular-nums">{rupiah(r.paid)}</td>
                  <td className={`px-5 py-3.5 text-right font-semibold tabular-nums ${r.balance > 0 ? "text-rose-600" : "text-emerald-600"}`}>{rupiah(r.balance)}</td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={6} className="px-5 py-14 text-center text-slate-500">Belum ada sales. Tambahkan nama sales di atas.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
