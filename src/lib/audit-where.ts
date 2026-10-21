import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { AUDIT_LABEL } from "@/lib/audit";

const DATE = /^\d{4}-\d{2}-\d{2}$/;
export type AuditFilterInput = { q?: string; action?: string; from?: string; to?: string };

// merapikan input filter (dipakai halaman audit dan aksi hapus massal supaya hasilnya selalu sama)
export function cleanAuditFilter(sp: AuditFilterInput) {
  return {
    q: sp.q?.trim() ?? "",
    action: sp.action && sp.action in AUDIT_LABEL ? sp.action : "",
    from: sp.from && DATE.test(sp.from) ? sp.from : "",
    to: sp.to && DATE.test(sp.to) ? sp.to : "",
  };
}

export async function auditWhere(f: { q: string; action: string; from: string; to: string }): Promise<Prisma.AuditLogWhereInput> {
  const where: Prisma.AuditLogWhereInput = {};
  if (f.action) where.action = f.action;
  if (f.from || f.to) where.createdAt = { ...(f.from ? { gte: new Date(`${f.from}T00:00:00+07:00`) } : {}), ...(f.to ? { lte: new Date(`${f.to}T23:59:59.999+07:00`) } : {}) };
  if (f.q) {
    const found = await prisma.qrCode.findMany({
      where: { OR: [{ publicToken: { contains: f.q } }, { business: { businessName: { contains: f.q, mode: "insensitive" } } }] },
      select: { id: true, businessId: true }, take: 500,
    });
    where.targetId = { in: found.flatMap((x) => (x.businessId ? [x.id, x.businessId] : [x.id])) };
  }
  return where;
}
