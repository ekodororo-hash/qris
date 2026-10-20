"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { businessUpdateSchema } from "@/lib/validators";

export async function updateBusiness(_: { error?: string; ok?: boolean } | null, fd: FormData): Promise<{ error?: string; ok?: boolean }> {
  const s = await requireRole("OWNER");
  const p = businessUpdateSchema.safeParse(Object.fromEntries(fd));
  if (!p.success) return { error: p.error.issues[0].message };
  const biz = await prisma.business.findFirst({ where: { ownerId: s.id } });
  if (!biz) return { error: "Bisnis tidak ditemukan." };
  await prisma.business.update({ where: { id: biz.id }, data: { ...p.data, description: p.data.description || null, logoUrl: p.data.logoUrl || null } });
  await prisma.auditLog.create({ data: { actorId: s.id, action: "BUSINESS_UPDATED", targetId: biz.id } });
  revalidatePath("/dashboard");
  return { ok: true };
}
