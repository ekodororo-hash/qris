import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { IconArrowRight, IconCheck, IconQr, IconStore } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import type { QrStatusKey } from "@/lib/qr-status";
import { CreateQr } from "./create-qr";
import { QrTable } from "./qr-table";

export default async function AdminPage() {
  await requireRole("ADMIN");
  const [recent, byStatus] = await Promise.all([
    prisma.qrCode.findMany({
      where: { status: { not: "ARCHIVED" } }, orderBy: { createdAt: "desc" }, take: 5,
      include: { business: { select: { businessName: true, ownerName: true, phone: true, address: true, googleReviewUrl: true } } },
    }),
    prisma.qrCode.groupBy({ by: ["status"], _count: { _all: true } }), // 1 query untuk semua hitungan status
  ]);
  const countOf = (st: string) => byStatus.find((x) => x.status === st)?._count._all ?? 0;
  const total = byStatus.reduce((a, x) => a + x._count._all, 0);
  const active = countOf("ACTIVE");
  const pending = countOf("UNACTIVATED");
  const stats = [
    { label: "Total QR", value: total, icon: IconQr, tone: "bg-brand-50 text-brand-600" },
    { label: "QR aktif", value: active, icon: IconCheck, tone: "bg-emerald-50 text-emerald-600" },
    { label: "Belum aktivasi", value: pending, icon: IconStore, tone: "bg-amber-50 text-amber-600" },
  ];
  return (
    <div className="space-y-8">
      <PageHeader title="Ringkasan" desc="Pantau status semua QR di satu tempat." />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card flex items-center gap-4">
            <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${s.tone}`}><s.icon className="size-5" /></span>
            <div className="min-w-0"><p className="truncate text-xs font-medium text-slate-500">{s.label}</p><p className="text-2xl font-bold tabular-nums tracking-tight">{s.value}</p></div>
          </div>
        ))}
      </div>
      <CreateQr />
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">QR terbaru</h2>
          <Link href="/admin/qr" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">Lihat semua <IconArrowRight className="size-4" /></Link>
        </div>
        <QrTable rows={recent.map((r) => ({ ...r, status: r.status as QrStatusKey }))} />
      </section>
    </div>
  );
}
