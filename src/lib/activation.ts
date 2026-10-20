import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { verifyPin } from "./tokens";
import { activationSchema } from "./validators";

const MAX_ATTEMPTS = 5;
type Result = { ok: true } | { ok: false; error: string };

export async function activateQr(input: unknown): Promise<Result> {
  const parsed = activationSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const d = parsed.data;

  const qr = await prisma.qrCode.findUnique({ where: { publicToken: d.token } });
  if (!qr || qr.status !== "UNACTIVATED") return { ok: false, error: "QR tidak dapat diaktivasi." };
  if (qr.failedPinAttempts >= MAX_ATTEMPTS) return { ok: false, error: "Terlalu banyak percobaan. Hubungi admin." };
  if (!(await verifyPin(d.pin, qr.pin, qr.pinHash))) {
    await prisma.qrCode.update({ where: { id: qr.id }, data: { failedPinAttempts: { increment: 1 } } });
    return { ok: false, error: "PIN salah." };
  }
  if (await prisma.user.findUnique({ where: { email: d.email } })) return { ok: false, error: "Email sudah terdaftar." };
  const passwordHash = await bcrypt.hash(d.password, 12);

  try {
    await prisma.$transaction(async (tx) => {
      const claimed = await tx.qrCode.updateMany({ where: { id: qr.id, status: "UNACTIVATED" }, data: { status: "ACTIVE", activatedAt: new Date() } });
      if (claimed.count !== 1) throw new Error("ALREADY_ACTIVATED");
      const user = await tx.user.create({ data: { name: d.ownerName, email: d.email, role: "OWNER", passwordHash } });
      const biz = await tx.business.create({ data: { ownerId: user.id, businessName: d.businessName, ownerName: d.ownerName, phone: d.phone, address: d.address, googleMapsUrl: d.googleMapsUrl, googleReviewUrl: d.googleReviewUrl } });
      await tx.qrCode.update({ where: { id: qr.id }, data: { businessId: biz.id } });
      await tx.auditLog.create({ data: { actorId: user.id, action: "QR_ACTIVATED", targetId: qr.id } });
    });
  } catch (e) {
    if ((e as Error).message === "ALREADY_ACTIVATED") return { ok: false, error: "QR sudah diaktivasi." };
    return { ok: false, error: "Email sudah terdaftar atau terjadi kesalahan." };
  }
  return { ok: true };
}
