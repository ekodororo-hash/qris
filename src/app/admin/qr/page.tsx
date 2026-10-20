import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { PageHeader } from "@/components/page-header";
import { QR_LABEL, type QrStatusKey } from "@/lib/qr-status";
import { AutoFilter } from "../auto-filter";
import { QrTable } from "../qr-table";

export default async function QrListPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  await requireRole("ADMIN");
  const sp = await searchParams;
  const status = sp.status && sp.status in QR_LABEL ? (sp.status as QrStatusKey) : undefined;
  const q = sp.q?.trim();
  const rows = await prisma.qrCode.findMany({
    where: { ...(status ? { status } : { status: { not: "ARCHIVED" } }), ...(q ? { OR: [{ publicToken: { contains: q } }, { business: { businessName: { contains: q, mode: "insensitive" } } }] } : {}) },
    orderBy: { createdAt: "desc" }, take: 100,
    include: { business: { select: { businessName: true } }, _count: { select: { scanEvents: true } } },
  });
  return (
    <div className="space-y-6">
      <PageHeader title="Daftar QR" desc={`${rows.length} QR ditampilkan${rows.length === 100 ? " (maksimal 100 terbaru)" : ""}.`} />
      <AutoFilter q={q ?? ""} status={status ?? ""} options={Object.entries(QR_LABEL).map(([value, label]) => ({ value, label }))} />
      <QrTable rows={rows.map((r) => ({ ...r, status: r.status as QrStatusKey }))} empty={q || status ? "Tidak ada QR yang cocok dengan filter." : "Belum ada QR."} />
    </div>
  );
}
