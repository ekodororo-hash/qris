import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { logout } from "../login/actions";
import { archiveQr, toggleQr } from "./actions";
import { CreateQr } from "./create-qr";

const LABEL = { UNACTIVATED: "Belum Aktif", ACTIVE: "Aktif", DISABLED: "Dinonaktifkan", ARCHIVED: "Diarsipkan" } as const;
export default async function AdminPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  await requireRole("ADMIN");
  const sp = await searchParams;
  const status = sp.status && sp.status in LABEL ? (sp.status as keyof typeof LABEL) : undefined;
  const q = sp.q?.trim();
  const [qrs, total, active, scans] = await Promise.all([
    prisma.qrCode.findMany({
      where: { ...(status ? { status } : { status: { not: "ARCHIVED" } }), ...(q ? { OR: [{ publicToken: { contains: q } }, { business: { businessName: { contains: q, mode: "insensitive" } } }] } : {}) },
      orderBy: { createdAt: "desc" }, take: 100,
      include: { business: { select: { businessName: true } }, _count: { select: { scanEvents: true } } },
    }),
    prisma.qrCode.count(), prisma.qrCode.count({ where: { status: "ACTIVE" } }), prisma.scanEvent.count({ where: { eventType: "SCAN" } }),
  ]);
  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <header className="flex items-center justify-between"><h1 className="text-2xl font-semibold">Admin</h1><form action={logout}><button className="btn-ghost">Keluar</button></form></header>
      <div className="grid grid-cols-3 gap-3">
        {[["Total QR", total], ["QR aktif", active], ["Total scan", scans]].map(([l, v]) => (<div key={l as string} className="card"><p className="text-sm text-neutral-500">{l}</p><p className="text-2xl font-semibold">{v}</p></div>))}
      </div>
      <CreateQr />
      <form className="flex flex-wrap gap-2">
        <input name="q" defaultValue={q} placeholder="Cari token / nama bisnis" className="input max-w-xs" />
        <select name="status" defaultValue={status ?? ""} className="input max-w-[11rem]"><option value="">Semua (tanpa arsip)</option>{Object.entries(LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        <button className="btn-ghost">Filter</button>
      </form>
      <div className="card overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-neutral-50 text-neutral-500"><tr><th className="p-3">Token</th><th>Status</th><th>Bisnis</th><th>Scan</th><th>Aktivasi</th><th /></tr></thead>
          <tbody>{qrs.map((r) => (
            <tr key={r.id} className="border-b last:border-0">
              <td className="p-3 font-mono"><Link className="text-blue-600" href={`/admin/qr/${r.id}`}>{r.publicToken}</Link></td>
              <td>{LABEL[r.status]}</td><td>{r.business?.businessName ?? "—"}</td><td>{r._count.scanEvents}</td>
              <td>{r.activatedAt ? r.activatedAt.toLocaleDateString("id-ID") : "—"}</td>
              <td className="flex gap-2 p-3">
                {(r.status === "ACTIVE" || r.status === "DISABLED") && <form action={toggleQr}><input type="hidden" name="id" value={r.id} /><button className="btn-ghost">{r.status === "ACTIVE" ? "Nonaktifkan" : "Aktifkan"}</button></form>}
                <form action={archiveQr}><input type="hidden" name="id" value={r.id} /><button className="btn-ghost">Arsipkan</button></form>
              </td>
            </tr>))}
            {qrs.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-neutral-500">Belum ada QR.</td></tr>}
          </tbody>
        </table>
      </div>
    </main>
  );
}
