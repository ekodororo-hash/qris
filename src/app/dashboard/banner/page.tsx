import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/session";
import type { QrStatusKey } from "@/lib/qr-status";
import { TemplateStudio } from "@/app/admin/template/template-studio";

export default async function BannerPage() {
  const s = await requireRole("OWNER");
  const b = await prisma.business.findFirst({ where: { ownerId: s.id }, include: { qrCode: true } });
  if (!b || !b.qrCode) return <p className="text-slate-600">Bisnis belum terhubung ke QR.</p>;
  const qr = b.qrCode;
  return (
    <>
      <div className="print:hidden">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Banner & poster</h1>
        <p className="mt-1 text-sm text-slate-500">Pilih ukuran dan desain, lalu cetak atau simpan sebagai gambar. <Link href="/dashboard" className="font-medium text-brand-600 hover:text-brand-700">Kembali ke ringkasan</Link></p>
      </div>
      <TemplateStudio owner options={[{ id: qr.id, publicToken: qr.publicToken, status: qr.status as QrStatusKey, businessName: b.businessName }]} />
    </>
  );
}
