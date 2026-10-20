import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { logout } from "../login/actions";
import { CopyButton } from "@/components/buttons";
import { IconDownload, IconExternal, IconLogout, IconPointer, IconScan, IconShield, Logo } from "@/components/icons";
import { StatusBadge } from "@/components/status-badge";
import type { QrStatusKey } from "@/lib/qr-status";
import { SettingsForm } from "./settings-form";

export default async function Dashboard() {
  const s = await requireRole("OWNER");
  const b = await prisma.business.findFirst({ where: { ownerId: s.id }, include: { qrCode: true } });
  if (!b || !b.qrCode) return <main className="p-6 text-slate-600">Bisnis belum terhubung ke QR.</main>;
  const qr = b.qrCode;
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/q/${qr.publicToken}`;
  const [scans, clicks, recent] = await Promise.all([
    prisma.scanEvent.count({ where: { qrCodeId: qr.id, eventType: "SCAN" } }),
    prisma.scanEvent.count({ where: { qrCodeId: qr.id, eventType: "REVIEW_CLICK" } }),
    prisma.scanEvent.findMany({ where: { qrCodeId: qr.id }, orderBy: { createdAt: "desc" }, take: 15 }),
  ]);
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <form action={logout}><button className="btn-ghost btn-sm"><IconLogout className="size-4" />Keluar</button></form>
        </div>
      </header>
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{b.businessName}</h1>
          <StatusBadge status={qr.status as QrStatusKey} />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="card flex items-center gap-4"><span className="grid size-11 place-items-center rounded-xl bg-sky-50 text-sky-600"><IconScan className="size-5" /></span><div><p className="text-xs font-medium text-slate-500">Scan</p><p className="text-2xl font-bold tabular-nums">{scans}</p></div></div>
          <div className="card flex items-center gap-4"><span className="grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><IconPointer className="size-5" /></span><div><p className="text-xs font-medium text-slate-500">Klik ke Google</p><p className="text-2xl font-bold tabular-nums">{clicks}</p></div></div>
        </div>

        <div className="card space-y-4">
          <div><h2 className="text-base font-semibold">QR Anda</h2><p className="mt-1 break-all font-mono text-sm text-slate-500">{url}</p></div>
          <div className="flex flex-wrap gap-2">
            <a className="btn" href={`/api/qr/download?id=${qr.id}&fmt=png`}><IconDownload className="size-4" />PNG</a>
            <a className="btn-ghost" href={`/api/qr/download?id=${qr.id}&fmt=svg`}><IconDownload className="size-4" />SVG</a>
            <a className="btn-ghost" href={url} target="_blank" rel="noreferrer"><IconExternal className="size-4" />Preview halaman</a>
            <CopyButton text={url} />
          </div>
        </div>

        <SettingsForm b={b} />

        <div className="card">
          <h2 className="text-base font-semibold">Riwayat scan & klik</h2>
          <ul className="mt-3 divide-y divide-slate-100 text-sm">
            {recent.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 py-3">
                <span className="flex items-center gap-3">
                  <span className={`grid size-8 place-items-center rounded-lg ${e.eventType === "SCAN" ? "bg-sky-50 text-sky-600" : "bg-emerald-50 text-emerald-600"}`}>{e.eventType === "SCAN" ? <IconScan className="size-4" /> : <IconPointer className="size-4" />}</span>
                  {e.eventType === "SCAN" ? "Scan" : "Klik tombol review"}
                </span>
                <span className="text-slate-500">{e.createdAt.toLocaleString("id-ID")}</span>
              </li>
            ))}
            {recent.length === 0 && <li className="py-6 text-center text-slate-500">Belum ada aktivitas.</li>}
          </ul>
        </div>
        <p className="flex items-center justify-center gap-1.5 pb-4 text-xs text-slate-400"><IconShield className="size-3.5" />Data pelanggan tidak disimpan, hanya waktu scan dan klik.</p>
      </main>
    </div>
  );
}
