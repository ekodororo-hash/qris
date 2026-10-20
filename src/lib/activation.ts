import { prisma } from "./db";
import { verifyPin } from "./tokens";
import { activationSchema } from "./validators";

const MAX_ATTEMPTS = 5;
type Result = { ok: true } | { ok: false; error: string };

// Panggil dari Server Action. Tambahkan rate limit per IP di lapisan atas (mis. Upstash).
export async function activateQr(input: unknown): Promise<Result> {
  const parsed = activationSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const d = parsed.data;

  const qr = await prisma.qrCode.findUnique({ where: { publicToken: d.token } });
  if (!qr || qr.status !== "UNACTIVATED") return { ok: false, error: "QR tidak dapat diaktivasi." };
  if (qr.failedPinAttempts >= MAX_ATTEMPTS) return { ok: false, error: "Terlalu banyak percobaan. Hubungi admin." };

  // PIN aktivasi = PIN yang diberikan admin bersama QR (bukan PIN baru karangan pemindai)
  if (!(await verifyPin(d.pin, qr.pinHash))) {
    await prisma.qrCode.update({ where: { id: qr.id }, data: { failedPinAttempts: { increment: 1 } } });
    return { ok: false, error: "PIN salah." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Klaim atomik: hanya satu request yang bisa mengubah UNACTIVATED -> ACTIVE
      const claimed = await tx.qrCode.updateMany({
        where: { id: qr.id, status: "UNACTIVATED" },
        data: { status: "ACTIVE", activatedAt: new Date() },
      });
      if (claimed.count !== 1) throw new Error("ALREADY_ACTIVATED");

      const biz = await tx.business.create({
        data: {
          businessName: d.businessName, ownerName: d.ownerName, phone: d.phone,
          address: d.address, googleMapsUrl: d.googleMapsUrl, googleReviewUrl: d.googleReviewUrl,
        },
      });
      await tx.qrCode.update({ where: { id: qr.id }, data: { businessId: biz.id } });
      await tx.auditLog.create({ data: { action: "QR_ACTIVATED", targetId: qr.id } });
    });
  } catch (e) {
    if ((e as Error).message === "ALREADY_ACTIVATED") return { ok: false, error: "QR sudah diaktivasi." };
    throw e;
  }
  return { ok: true };
}
