import Link from "next/link";
import QRCode from "qrcode";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { CopyButton } from "@/components/buttons";
import { IconDownload, IconExternal, IconPrinter, IconShield, IconStore } from "@/components/icons";
import { StatusBadge } from "@/components/status-badge";
import type { QrStatusKey } from "@/lib/qr-status";
import { SettingsForm } from "./settings-form";
import { ReviewLinkGuide } from "@/components/review-link-guide";

export default async function Dashboard() {
  const s = await requireRole("OWNER");
  const b = await prisma.business.findFirst({ where: { ownerId: s.id }, include: { qrCode: true } });
  if (!b || !b.qrCode) return <p className="text-slate-600">Bisnis belum terhubung ke QR.</p>;
  const qr = b.qrCode;
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/q/${qr.publicToken}`;
  const svg = await QRCode.toString(url, { type: "svg", margin: 1, errorCorrectionLevel: "M" });
  return (
    <>
      <div className="flex items-center gap-3.5">
        {b.logoUrl
          ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={b.logoUrl} alt="" className="size-12 shrink-0 rounded-xl object-cover ring-1 ring-slate-200" />
          : <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-400"><IconStore className="size-6" /></span>}
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl">{b.businessName}</h1>
          <div className="mt-1"><StatusBadge status={qr.status as QrStatusKey} /></div>
        </div>
      </div>

      {!b.googleReviewUrl && (
        <section className="rounded-2xl bg-amber-50 p-5 ring-1 ring-amber-200">
          <h2 className="text-base font-semibold text-amber-900">Satu langkah lagi: tambahkan tautan Google Review</h2>
          <p className="mt-1 text-sm text-amber-900/80">QR Anda sudah aktif, tapi pelanggan belum bisa menulis ulasan sampai tautan ini diisi. Isi di bagian <a href="#pengaturan" className="font-semibold underline">Pengaturan bisnis</a> di bawah.</p>
          <div className="mt-3"><ReviewLinkGuide /></div>
        </section>
      )}

      <section className="card">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="mx-auto w-40 shrink-0 rounded-xl border border-slate-200 bg-white p-2 sm:mx-0 [&_svg]:block [&_svg]:h-auto [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
          <div className="min-w-0 flex-1 space-y-4">
            <div>
              <h2 className="text-base font-semibold">QR review Anda</h2>
              <p className="mt-1 truncate text-sm text-slate-500" title={url}>{url}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <a className="btn-ghost" href={`/api/qr/download?id=${qr.id}&fmt=png`}><IconDownload className="size-4" />Unduh PNG</a>
              <a className="btn-ghost" href={`/api/qr/download?id=${qr.id}&fmt=svg`}><IconDownload className="size-4" />Unduh SVG</a>
              <a className="btn-ghost" href={url} target="_blank" rel="noreferrer"><IconExternal className="size-4" />Lihat halaman</a>
              <CopyButton text={url} label="Salin tautan" className="btn-ghost w-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold">Banner & poster siap cetak</h2>
          <p className="mt-1 text-sm text-slate-500">Pasang QR di kartu meja, poster, atau stiker dengan desain yang sudah jadi.</p>
        </div>
        <Link href="/dashboard/banner" className="btn-ghost shrink-0"><IconPrinter className="size-4" />Buat banner</Link>
      </section>

      <SettingsForm b={b} />

      <p className="flex items-center justify-center gap-1.5 pb-2 text-xs text-slate-400"><IconShield className="size-3.5" />Kami tidak menyimpan data pelanggan.</p>
    </>
  );
}
