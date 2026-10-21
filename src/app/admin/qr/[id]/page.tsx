import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { CopyButton, PrintButton } from "@/components/buttons";
import { IconArrowLeft, IconDownload } from "@/components/icons";
import { StatusBadge } from "@/components/status-badge";
import type { QrStatusKey } from "@/lib/qr-status";
import { BusinessEditForm } from "./business-edit-form";

export default async function QrDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("ADMIN");
  const { id } = await params;
  const qr = await prisma.qrCode.findUnique({ where: { id }, include: { business: true } });
  if (!qr) notFound();
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/q/${qr.publicToken}`;
  const svg = await QRCode.toString(url, { type: "svg", margin: 2 });
  const b = qr.business;
  const row = (l: string, v: string | null) => <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{l}</dt><dd className="mt-1 break-words text-sm text-slate-800">{v || "—"}</dd></div>;
  return (
    <div className="space-y-6">
      <Link href="/admin/qr" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 print:hidden"><IconArrowLeft className="size-4" />Kembali ke daftar</Link>
      <div className="card grid gap-8 p-6 md:grid-cols-[17rem_1fr] md:items-center">
        <div className="mx-auto w-full max-w-[17rem] rounded-2xl border border-slate-200 bg-white p-2 shadow-sm [&_svg]:h-auto [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
        <div className="space-y-5">
          <div><StatusBadge status={qr.status as QrStatusKey} /></div>
          <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">URL QR</p><p className="mt-1 break-all font-mono text-sm">{url}</p></div>
          {!qr.businessId && qr.pin && (
            <div className="print:hidden"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">PIN aktivasi</p><code className="mt-1 inline-block rounded-xl bg-brand-50 px-4 py-2 text-xl font-bold tracking-[0.3em] text-brand-700 ring-1 ring-brand-200">{qr.pin}</code></div>
          )}
          <div className="flex flex-wrap gap-2 print:hidden">
            <a className="btn" href={`/api/qr/download?id=${qr.id}&fmt=png`}><IconDownload className="size-4" />PNG</a>
            <a className="btn-ghost" href={`/api/qr/download?id=${qr.id}&fmt=svg`}><IconDownload className="size-4" />SVG</a>
            <PrintButton /><CopyButton text={url} />
            <Link className="btn-ghost" href={`/admin/template?qr=${qr.id}`}>Template cetak</Link>
          </div>
        </div>
      </div>
      {b && (
        <div className="card print:hidden">
          <h2 className="text-base font-semibold">{b.businessName}</h2>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            {row("Pemilik", b.ownerName)}{row("Telepon", b.phone)}{row("Alamat", b.address)}{row("Link review", b.googleReviewUrl)}
          </dl>
          <BusinessEditForm qrId={qr.id} b={{ businessName: b.businessName, ownerName: b.ownerName, phone: b.phone, address: b.address ?? "", googleMapsUrl: b.googleMapsUrl ?? "", googleReviewUrl: b.googleReviewUrl ?? "" }} />
        </div>
      )}
    </div>
  );
}
