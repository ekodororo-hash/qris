import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { PageHeader } from "@/components/page-header";
import { AUDIT_LABEL } from "@/lib/audit";
import { AuditFilter } from "./audit-filter";

const PER_PAGE = 50;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
type SP = { q?: string; action?: string; from?: string; to?: string; page?: string };

export default async function AuditPage({ searchParams }: { searchParams: Promise<SP> }) {
  await requireRole("ADMIN");
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const action = sp.action && sp.action in AUDIT_LABEL ? sp.action : "";
  const from = sp.from && DATE.test(sp.from) ? sp.from : "";
  const to = sp.to && DATE.test(sp.to) ? sp.to : "";
  const page = Math.max(1, Math.floor(Number(sp.page)) || 1);

  const where: Prisma.AuditLogWhereInput = {};
  if (action) where.action = action;
  if (from || to) where.createdAt = { ...(from ? { gte: new Date(`${from}T00:00:00+07:00`) } : {}), ...(to ? { lte: new Date(`${to}T23:59:59.999+07:00`) } : {}) };
  if (q) {
    const found = await prisma.qrCode.findMany({
      where: { OR: [{ publicToken: { contains: q } }, { business: { businessName: { contains: q, mode: "insensitive" } } }] },
      select: { id: true, businessId: true }, take: 500,
    });
    where.targetId = { in: found.flatMap((f) => (f.businessId ? [f.id, f.businessId] : [f.id])) };
  }

  const logs = await prisma.auditLog.findMany({
    where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PER_PAGE, take: PER_PAGE + 1,
    include: { actor: { select: { name: true, email: true } } },
  });
  const hasNext = logs.length > PER_PAGE;
  const rows = logs.slice(0, PER_PAGE);

  // targetId bisa berisi id QR atau id bisnis (perubahan data bisnis)
  const ids = [...new Set(rows.map((r) => r.targetId).filter((x): x is string => !!x))];
  const qrs = ids.length ? await prisma.qrCode.findMany({
    where: { OR: [{ id: { in: ids } }, { businessId: { in: ids } }] },
    select: { id: true, publicToken: true, businessId: true, business: { select: { businessName: true } } },
  }) : [];
  const target = new Map<string, (typeof qrs)[number]>();
  for (const x of qrs) { target.set(x.id, x); if (x.businessId) target.set(x.businessId, x); }

  const href = (n: number) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (action) p.set("action", action);
    if (from) p.set("from", from);
    if (to) p.set("to", to);
    if (n > 1) p.set("page", String(n));
    const s = p.toString();
    return s ? `/admin/audit?${s}` : "/admin/audit";
  };
  const filtered = !!(q || action || from || to);

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Log" desc="Riwayat aksi pada QR dan data bisnis." />
      <AuditFilter initial={{ q, action, from, to }} options={Object.entries(AUDIT_LABEL).map(([value, label]) => ({ value, label }))} />
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[48rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3">Waktu</th><th className="px-3 py-3">Siapa</th><th className="px-3 py-3">Aksi</th><th className="px-5 py-3">QR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => {
                const t = r.targetId ? target.get(r.targetId) : undefined;
                return (
                  <tr key={r.id} className="transition hover:bg-slate-50/70">
                    <td className="whitespace-nowrap px-5 py-3.5 text-slate-500">{r.createdAt.toLocaleString("id-ID", { timeZone: "Asia/Jakarta", dateStyle: "medium", timeStyle: "short" })} WIB</td>
                    <td className="px-3 py-3.5">{r.actor ? <><p className="font-medium text-slate-800">{r.actor.name}</p><p className="text-xs text-slate-500">{r.actor.email}</p></> : <span className="text-slate-300">—</span>}</td>
                    <td className="px-3 py-3.5 font-medium text-slate-800">{AUDIT_LABEL[r.action] ?? r.action}</td>
                    <td className="px-5 py-3.5">
                      {t ? <><Link href={`/admin/qr/${t.id}`} className="font-mono text-[13px] font-medium text-brand-600 hover:underline">{t.publicToken}</Link>{t.business && <p className="text-xs text-slate-500">{t.business.businessName}</p>}</>
                        : r.targetId ? <span className="text-xs text-slate-400">QR sudah dihapus</span> : <span className="text-slate-300">—</span>}
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && <tr><td colSpan={4} className="px-5 py-14 text-center text-slate-500">{filtered ? "Tidak ada log yang cocok dengan filter." : "Belum ada log."}</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {(page > 1 || hasNext) && (
        <div className="flex items-center justify-between text-sm">
          {page > 1 ? <Link href={href(page - 1)} className="btn-ghost btn-sm">← Sebelumnya</Link> : <span />}
          <span className="text-slate-500">Halaman {page}</span>
          {hasNext ? <Link href={href(page + 1)} className="btn-ghost btn-sm">Berikutnya →</Link> : <span />}
        </div>
      )}
    </div>
  );
}
