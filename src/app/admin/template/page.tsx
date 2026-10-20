import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { PageHeader } from "@/components/page-header";
import type { QrStatusKey } from "@/lib/qr-status";
import { TemplateStudio } from "./template-studio";

export default async function TemplatePage({ searchParams }: { searchParams: Promise<{ qr?: string }> }) {
  await requireRole("ADMIN");
  const sp = await searchParams;
  const rows = await prisma.qrCode.findMany({
    where: { status: { not: "ARCHIVED" } },
    orderBy: { createdAt: "desc" },
    take: 200,
    select: { id: true, publicToken: true, status: true, business: { select: { businessName: true } } },
  });
  const options = rows.map((r) => ({ id: r.id, publicToken: r.publicToken, status: r.status as QrStatusKey, businessName: r.business?.businessName ?? null }));
  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <PageHeader title="Template QR" desc="Desain kartu meja, poster, atau stiker berisi QR review Google, lalu cetak langsung." />
      </div>
      {options.length === 0 ? (
        <div className="card py-14 text-center text-slate-500 print:hidden">
          Belum ada QR. <Link href="/admin" className="font-medium text-brand-600 hover:text-brand-700">Buat QR baru</Link> dulu untuk membuat template.
        </div>
      ) : (
        <TemplateStudio options={options} initialId={sp.qr} />
      )}
    </div>
  );
}
