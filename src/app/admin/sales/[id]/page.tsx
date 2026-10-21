import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { PageHeader } from "@/components/page-header";
import { CopyButton, SubmitButton } from "@/components/buttons";
import { IconArrowLeft } from "@/components/icons";
import { rupiah, salesTotals } from "@/lib/sales";
import { deletePayment } from "../actions";
import { AssignForm, PaymentForm } from "../forms";
import { SalesQrTable } from "./qr-table-modal";

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
      select: {
        id: true, publicToken: true, status: true, pin: true, businessId: true, failedPinAttempts: true,
        activatedAt: true, assignedAt: true, price: true,
        business: { select: { businessName: true, ownerName: true, phone: true, address: true, googleReviewUrl: true } },
      },
    }),
    prisma.qrCode.count({ where: { status: "UNACTIVATED", salespersonId: null, businessId: null } }),
  ]);
  const t = totals.get(id) ?? { held: 0, sold: 0, owed: 0, paid: 0 };
  const balance = t.owed - t.paid;
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Jakarta" });
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
          <div><h2 className="text-base font-semibold">QR yang dipegang</h2><p className="text-xs text-slate-500">PIN hanya tampil untuk QR yang belum aktif. Token juga tercetak di belakang banner, jadi cocokkan token lalu pakai PIN-nya.</p></div>
          {waiting.length > 0 && <CopyButton label={`Salin ${waiting.length} QR belum aktif (token + PIN)`} text={waiting.map((q) => `${q.publicToken} → ${q.pin}`).join("\n")} />}
        </div>
        <SalesQrTable qrs={qrs} />
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
