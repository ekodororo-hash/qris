"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { auditWhere, cleanAuditFilter, type AuditFilterInput } from "@/lib/audit-where";

export async function deleteAuditLog(id: string) {
  await requireRole("ADMIN");
  await prisma.auditLog.deleteMany({ where: { id: String(id) } });
  revalidatePath("/admin/audit");
}

// hapus semua log yang cocok dengan filter aktif (tanpa filter = semua log)
export async function deleteAuditLogs(filter: AuditFilterInput): Promise<number> {
  const s = await requireRole("ADMIN");
  const where = await auditWhere(cleanAuditFilter(filter ?? {}));
  const { count } = await prisma.auditLog.deleteMany({ where });
  // jejak bahwa penghapusan massal pernah terjadi, supaya tidak hilang tanpa bekas
  if (count > 0) await prisma.auditLog.create({ data: { actorId: s.id, action: "AUDIT_DELETED", targetId: null } });
  revalidatePath("/admin/audit");
  return count;
}
