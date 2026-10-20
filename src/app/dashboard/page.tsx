import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { logout } from "../login/actions";
import { CopyButton } from "@/components/buttons";
import { IconDownload, IconExternal, IconLogout, IconShield, Logo } from "@/components/icons";
import { StatusBadge } from "@/components/status-badge";
import type { QrStatusKey } from "@/lib/qr-status";
import { SettingsForm } from "./settings-form";

export default async function Dashboard() {
  const s = await requireRole("OWNER");
  const b = await prisma.business.findFirst({ where: { ownerId: s.id }, include: { qrCode: true } });
  if (!b || !b.qrCode) return <main className="p-6 text-slate-600">Bisnis belum terhubung ke QR.</main>;
  const qr = b.qrCode;
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/q/${qr.publicToken}`;
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

        <p className="flex items-center justify-center gap-1.5 pb-4 text-xs text-slate-400"><IconShield className="size-3.5" />Kami tidak menyimpan data pelanggan.</p>
      </main>
    </div>
  );
}
