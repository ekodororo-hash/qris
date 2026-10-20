"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { generatePin, generatePublicToken, hashPin } from "@/lib/tokens";

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
  // scanEvents ikut terhapus (onDelete: Cascade); bisnis terkait dihapus agar tidak yatim
  await prisma.$transaction([
    prisma.qrCode.delete({ where: { id } }),
    ...(qr.businessId ? [prisma.business.delete({ where: { id: qr.businessId } })] : []),
    prisma.auditLog.create({ data: { actorId: s.id, action: "QR_DELETED", targetId: id } }),
  ]);
  revalidatePath("/admin", "layout");
}
