"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { generatePin, generatePublicToken, hashPin } from "@/lib/tokens";

export async function createQr(): Promise<{ url: string; pin: string; id: string }> {
  const s = await requireRole("ADMIN");
  const pin = generatePin();
  const qr = await prisma.qrCode.create({ data: { publicToken: generatePublicToken(), pinHash: await hashPin(pin), pin } });
  await prisma.auditLog.create({ data: { actorId: s.id, action: "QR_CREATED", targetId: qr.id } });
  revalidatePath("/admin", "layout");
  return { url: `${process.env.NEXT_PUBLIC_APP_URL}/q/${qr.publicToken}`, pin, id: qr.id };
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
