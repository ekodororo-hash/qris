import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { CopyButton, PrintButton } from "@/components/buttons";

export default async function QrDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("ADMIN");
  const { id } = await params;
  const qr = await prisma.qrCode.findUnique({ where: { id }, include: { business: true, _count: { select: { scanEvents: true } } } });
  if (!qr) notFound();
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/q/${qr.publicToken}`;
  const svg = await QRCode.toString(url, { type: "svg", margin: 2 });
  const b = qr.business;
  return (
    <main className="mx-auto max-w-3xl space-y-4 p-6">
      <Link href="/admin" className="text-sm text-blue-600 print:hidden">← Kembali</Link>
      <div className="card flex flex-col items-center gap-4 sm:flex-row">
        <div className="w-56 shrink-0" dangerouslySetInnerHTML={{ __html: svg }} />
        <div className="space-y-2 text-sm"><p className="break-all font-mono">{url}</p><p>Status: <b>{qr.status}</b> · Scan: {qr._count.scanEvents}</p>
          {qr.status === "UNACTIVATED" && qr.pin && <p className="print:hidden">PIN aktivasi: <b className="font-mono text-base">{qr.pin}</b></p>}
          <div className="flex flex-wrap gap-2 print:hidden"><a className="btn-ghost" href={`/api/qr/download?id=${qr.id}&fmt=png`}>PNG</a><a className="btn-ghost" href={`/api/qr/download?id=${qr.id}&fmt=svg`}>SVG</a><PrintButton /><CopyButton text={url} /></div></div>
      </div>
      {b && <div className="card space-y-1 text-sm print:hidden"><h2 className="font-semibold">{b.businessName}</h2><p>Pemilik: {b.ownerName} · {b.phone}</p><p>{b.address}</p><p className="break-all">Review: {b.googleReviewUrl}</p></div>}
    </main>
  );
}
