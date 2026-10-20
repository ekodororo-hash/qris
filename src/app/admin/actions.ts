"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { generatePin, generatePublicToken, hashPin } from "@/lib/tokens";
import { adminBusinessSchema } from "@/lib/validators";

export async function createQr(count = 1): Promise<{ url: string; pin: string; id: string }[]> {
  const s = await requireRole("ADMIN");
  const n = Math.min(100, Math.max(1, Math.floor(Number(count)) || 1));
  // pinHash hanya legacy (PIN plain yang dipakai); untuk batch pakai cost rendah agar tidak timeout
  const rounds = n > 1 ? 4 : 12;
  const data = await Promise.all(Array.from({ length: n }, async () => {
    const pin = generatePin();
    return { publicToken: generatePublicToken(), pin, pinHash: await hashPin(pin, rounds) };
  }));
  const created = await prisma.qrCode.createManyAndReturn({ data, select: { id: true, publicToken: true, pin: true } });
  await prisma.auditLog.createMany({ data: created.map((q) => ({ actorId: s.id, action: "QR_CREATED", targetId: q.id })) });
  revalidatePath("/admin", "layout");
  return created.map((q) => ({ id: q.id, url: `${process.env.NEXT_PUBLIC_APP_URL}/q/${q.publicToken}`, pin: q.pin ?? "" }));
}
export async function toggleQr(fd: FormData) {
  const s = await requireRole("ADMIN");
  const qr = await prisma.qrCode.findUnique({ where: { id: String(fd.get("id")) } });
  if (!qr || (qr.status !== "ACTIVE" && qr.status !== "DISABLED")) return;
  const status = qr.status === "ACTIVE" ? "DISABLED" : "ACTIVE";
  await prisma.qrCode.update({ where: { id: qr.id }, data: { status } });
  await prisma.auditLog.create({ data: { actorId: s.id, action: `QR_${status}`, targetId: qr.id } });
  revalidatePath("/admin", "layout");
}
export async function archiveQr(fd: FormData) {
  const s = await requireRole("ADMIN");
  const id = String(fd.get("id"));
  await prisma.qrCode.update({ where: { id }, data: { status: "ARCHIVED" } });
  await prisma.auditLog.create({ data: { actorId: s.id, action: "QR_ARCHIVED", targetId: id } });
  revalidatePath("/admin", "layout");
}
export async function unarchiveQr(fd: FormData) {
  const s = await requireRole("ADMIN");
  const id = String(fd.get("id"));
  const qr = await prisma.qrCode.findUnique({ where: { id } });
  if (!qr || qr.status !== "ARCHIVED") return;
  // kembali ke status wajar: sudah punya bisnis -> ACTIVE, belum -> UNACTIVATED
  await prisma.qrCode.update({ where: { id }, data: { status: qr.businessId ? "ACTIVE" : "UNACTIVATED" } });
  await prisma.auditLog.create({ data: { actorId: s.id, action: "QR_UNARCHIVED", targetId: id } });
  revalidatePath("/admin", "layout");
}
export async function deleteQr(id: string) {
  const s = await requireRole("ADMIN");
  const qr = await prisma.qrCode.findUnique({ where: { id } });
  if (!qr) return;
  // bisnis terkait dihapus agar tidak yatim
  await prisma.$transaction([
    prisma.qrCode.delete({ where: { id } }),
    ...(qr.businessId ? [prisma.business.delete({ where: { id: qr.businessId } })] : []),
    prisma.auditLog.create({ data: { actorId: s.id, action: "QR_DELETED", targetId: id } }),
  ]);
  revalidatePath("/admin", "layout");
}

export async function resetPin(fd: FormData) {
  const s = await requireRole("ADMIN");
  const id = String(fd.get("id"));
  const qr = await prisma.qrCode.findUnique({ where: { id } });
  if (!qr || qr.status !== "UNACTIVATED") return;
  const pin = generatePin();
  await prisma.qrCode.update({ where: { id }, data: { pin, pinHash: await hashPin(pin), failedPinAttempts: 0 } });
  await prisma.auditLog.create({ data: { actorId: s.id, action: "PIN_RESET", targetId: id } });
  revalidatePath("/admin", "layout");
}
export async function resetActivation(id: string) {
  const s = await requireRole("ADMIN");
  const qr = await prisma.qrCode.findUnique({ where: { id }, include: { business: true } });
  if (!qr || !qr.businessId || qr.status === "ARCHIVED") return;
  const bizId = qr.businessId, ownerId = qr.business?.ownerId ?? null;
  const pin = generatePin();
  const pinHash = await hashPin(pin);
  await prisma.$transaction(async (tx) => {
    await tx.qrCode.update({ where: { id }, data: { businessId: null, status: "UNACTIVATED", activatedAt: null, failedPinAttempts: 0, pin, pinHash } });
    await tx.business.delete({ where: { id: bizId } });
    if (ownerId) {
      // hapus akun pemilik lama (hanya akun OWNER yang tidak punya bisnis lain) agar emailnya bisa dipakai lagi
      const owner = await tx.user.findUnique({ where: { id: ownerId }, select: { role: true, businesses: { select: { id: true } } } });
      if (owner?.role === "OWNER" && owner.businesses.length === 0) {
        await tx.auditLog.updateMany({ where: { actorId: ownerId }, data: { actorId: null } });
        await tx.user.delete({ where: { id: ownerId } });
      }
    }
    await tx.auditLog.create({ data: { actorId: s.id, action: "ACTIVATION_RESET", targetId: id } });
  });
  revalidatePath("/admin", "layout");
}
export async function updateBusinessByAdmin(fd: FormData): Promise<{ ok?: boolean; error?: string }> {
  const s = await requireRole("ADMIN");
  const p = adminBusinessSchema.safeParse(Object.fromEntries(fd));
  if (!p.success) return { error: p.error.issues[0].message };
  const qr = await prisma.qrCode.findUnique({ where: { id: String(fd.get("id")) }, select: { businessId: true } });
  if (!qr?.businessId) return { error: "Bisnis tidak ditemukan." };
  await prisma.business.update({ where: { id: qr.businessId }, data: p.data });
  await prisma.auditLog.create({ data: { actorId: s.id, action: "BUSINESS_UPDATED", targetId: qr.businessId } });
  revalidatePath("/admin", "layout");
  return { ok: true };
}
