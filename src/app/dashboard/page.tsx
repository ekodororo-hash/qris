import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { logout } from "../login/actions";
import { CopyButton } from "@/components/buttons";
import { SettingsForm } from "./settings-form";

export default async function Dashboard() {
  const s = await requireRole("OWNER");
  const b = await prisma.business.findFirst({ where: { ownerId: s.id }, include: { qrCode: true } });
  if (!b || !b.qrCode) return <main className="p-6">Bisnis belum terhubung ke QR.</main>;
  const qr = b.qrCode;
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/q/${qr.publicToken}`;
  const [scans, clicks, recent] = await Promise.all([
    prisma.scanEvent.count({ where: { qrCodeId: qr.id, eventType: "SCAN" } }),
    prisma.scanEvent.count({ where: { qrCodeId: qr.id, eventType: "REVIEW_CLICK" } }),
    prisma.scanEvent.findMany({ where: { qrCodeId: qr.id }, orderBy: { createdAt: "desc" }, take: 15 }),
  ]);
  return (
    <main className="mx-auto max-w-3xl space-y-4 p-6">
      <header className="flex items-center justify-between"><h1 className="text-2xl font-semibold">{b.businessName}</h1><form action={logout}><button className="btn-ghost">Keluar</button></form></header>
      <div className="grid grid-cols-3 gap-3">
        <div className="card"><p className="text-sm text-neutral-500">Status QR</p><p className="font-semibold">{qr.status}</p></div>
        <div className="card"><p className="text-sm text-neutral-500">Scan</p><p className="text-2xl font-semibold">{scans}</p></div>
        <div className="card"><p className="text-sm text-neutral-500">Klik ke Google</p><p className="text-2xl font-semibold">{clicks}</p></div>
      </div>
      <div className="card space-y-3 text-sm">
        <p className="break-all font-mono">{url}</p>
        <div className="flex flex-wrap gap-2"><a className="btn-ghost" href={`/api/qr/download?id=${qr.id}&fmt=png`}>Download PNG</a><a className="btn-ghost" href={`/api/qr/download?id=${qr.id}&fmt=svg`}>Download SVG</a><a className="btn-ghost" href={url} target="_blank">Preview halaman</a><CopyButton text={url} /></div>
      </div>
      <SettingsForm b={b} />
      <div className="card"><h2 className="mb-2 font-semibold">Riwayat scan & klik</h2>
        <ul className="divide-y text-sm">{recent.map((e) => <li key={e.id} className="flex justify-between py-2"><span>{e.eventType === "SCAN" ? "Scan" : "Klik tombol review"}</span><span className="text-neutral-500">{e.createdAt.toLocaleString("id-ID")}</span></li>)}{recent.length === 0 && <li className="py-2 text-neutral-500">Belum ada aktivitas.</li>}</ul></div>
    </main>
  );
}
