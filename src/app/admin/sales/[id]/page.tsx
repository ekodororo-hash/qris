import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { PageHeader } from "@/components/page-header";
import { CopyButton, SubmitButton } from "@/components/buttons";
import { IconArrowLeft } from "@/components/icons";
import { StatusBadge } from "@/components/status-badge";
import type { QrStatusKey } from "@/lib/qr-status";
import { rupiah, salesTotals } from "@/lib/sales";
import { deletePayment, unassignQr } from "../actions";
import { AssignForm, PaymentForm } from "../forms";

const fmtDate = (d: Date) => d.toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta", dateStyle: "medium" });

export default async function SalesDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("ADMIN");
  const { id } = await params;
  const sp = await prisma.salesperson.findUnique({ where: { id } });
  if (!sp) notFound();

  const [totals, payments, qrs, available] = await Promise.all([
    salesTotals(),
    prisma.payment.findMany({ where: { salespersonId: id }, orderBy: [{ paidAt: "desc" }, { createdAt: "desc" }], take: 200 }),
    prisma.qrCode.findMany({
      where: { salespersonId: id }, orderBy: { assignedAt: "desc" }, take: 500,
      select: { id: true, publicToken: true, status: true, pin: true, activatedAt: true, assignedAt: true, price: true, business: { select: { businessName: true } } },
    }),
    prisma.qrCode.count({ where: { status: "UNACTIVATED", salespersonId: null, businessId: null } }),
  ]);
  const t = totals.get(id) ?? { held: 0, sold: 0, owed: 0, paid: 0 };
  const balance = t.owed - t.paid;
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Jakarta" });
  const base = process.env.NEXT_PUBLIC_APP_URL;
  const waiting = qrs.filter((q) => q.status === "UNACTIVATED" && q.pin);
  const stats = [
    { label: "QR dipegang", value: String(t.held) },
    { label: "Aktif (terjual)", value: String(t.sold) },
    { label: "Wajib setor", value: rupiah(t.owed) },
    { label: "Sudah setor", value: rupiah(t.paid) },
    { label: "Sisa setoran", value: rupiah(balance), tone: balance > 0 ? "text-rose-600" : "text-emerald-600" },
  ];

  return (
    <div className="space-y-6">
      <Link href="/admin/sales" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900"><IconArrowLeft className="size-4" />Kembali ke Sales</Link>
      <PageHeader title={sp.name} desc="Rekap QR dan setoran sales ini." />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="card"><p className="text-xs font-medium text-slate-500">{s.label}</p><p className={`mt-1 text-xl font-bold tabular-nums tracking-tight ${s.tone ?? ""}`}>{s.value}</p></div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card space-y-3"><h2 className="text-base font-semibold">Serah terima QR</h2><AssignForm salespersonId={id} available={available} /></div>
        <div className="card space-y-3"><h2 className="text-base font-semibold">Catat setoran</h2><PaymentForm salespersonId={id} today={today} /></div>
      </div>

      <section className="card overflow-hidden p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-3.5">
          <div><h2 className="text-base font-semibold">QR yang dipegang</h2><p className="text-xs text-slate-500">PIN hanya tampil untuk QR yang belum aktif. Salin daftar ini untuk dikirim ke sales.</p></div>
          {waiting.length > 0 && <CopyButton label={`Salin ${waiting.length} QR belum aktif (URL + PIN)`} text={waiting.map((q) => `${base}/q/${q.publicToken}\t${q.pin}`).join("\n")} />}
        </div>
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
                  <td className="px-5 py-3.5"><Link href={`/admin/qr/${q.id}`} className="font-mono text-[13px] font-medium text-brand-600 hover:underline">{q.publicToken}</Link></td>
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
      </section>

      <section className="card overflow-hidden p-0">
        <div className="border-b border-slate-200 px-5 py-3.5"><h2 className="text-base font-semibold">Riwayat setoran</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3">Tanggal</th><th className="px-3 py-3 text-right">Jumlah</th><th className="px-3 py-3">Catatan</th><th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => (
                <tr key={p.id} className="transition hover:bg-slate-50/70">
                  <td className="px-5 py-3.5 text-slate-500">{fmtDate(p.paidAt)}</td>
                  <td className="px-3 py-3.5 text-right font-medium tabular-nums">{rupiah(p.amount)}</td>
                  <td className="px-3 py-3.5 text-slate-600">{p.note ?? <span className="text-slate-300">—</span>}</td>
                  <td className="px-5 py-3.5 text-right"><form action={deletePayment}><input type="hidden" name="id" value={p.id} /><SubmitButton className="btn-ghost btn-sm" pendingText="Menghapus…">Hapus</SubmitButton></form></td>
                </tr>
              ))}
              {payments.length === 0 && <tr><td colSpan={4} className="px-5 py-12 text-center text-slate-500">Belum ada setoran.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
