"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { getPrice, PRICE_KEY } from "@/lib/sales";

type Res = { ok?: boolean; error?: string };
const refresh = () => revalidatePath("/admin", "layout");
// terima "150.000", "Rp 150.000", "150000" -> semua jadi 150000 (titik/koma hanyalah pemisah ribuan)
const rupiahInt = z.preprocess((v) => String(v ?? "").replace(/\D/g, ""), z.coerce.number().int().min(1, "Nominal minimal Rp1.").max(1_000_000_000, "Nominal terlalu besar."));

export async function savePrice(fd: FormData): Promise<Res> {
  const s = await requireRole("ADMIN");
  const p = rupiahInt.safeParse(fd.get("price"));
  if (!p.success) return { error: p.error.issues[0].message };
  await prisma.setting.upsert({ where: { key: PRICE_KEY }, update: { value: String(p.data) }, create: { key: PRICE_KEY, value: String(p.data) } });
  await prisma.auditLog.create({ data: { actorId: s.id, action: "PRICE_CHANGED" } });
  refresh();
  return { ok: true };
}

export async function createSalesperson(fd: FormData): Promise<Res> {
  const s = await requireRole("ADMIN");
  const p = z.string().trim().min(2, "Nama minimal 2 karakter.").max(60, "Nama maksimal 60 karakter.").safeParse(fd.get("name"));
  if (!p.success) return { error: p.error.issues[0].message };
  if (await prisma.salesperson.findFirst({ where: { name: { equals: p.data, mode: "insensitive" } } })) return { error: "Nama sales ini sudah ada." };
  const sp = await prisma.salesperson.create({ data: { name: p.data } });
  await prisma.auditLog.create({ data: { actorId: s.id, action: "SALES_CREATED", targetId: sp.id } });
  refresh();
  return { ok: true };
}

export async function deleteSalesperson(fd: FormData) {
  const s = await requireRole("ADMIN");
  const id = String(fd.get("id"));
  const [qrs, pays] = await Promise.all([prisma.qrCode.count({ where: { salespersonId: id } }), prisma.payment.count({ where: { salespersonId: id } })]);
  if (qrs > 0 || pays > 0) return; // hanya sales kosong yang boleh dihapus
  await prisma.salesperson.delete({ where: { id } }).catch(() => null);
  await prisma.auditLog.create({ data: { actorId: s.id, action: "SALES_DELETED", targetId: id } });
  refresh();
}

// Serah terima: ambil N QR tertua yang belum aktif dan belum dipegang siapa pun.
export async function assignQrs(fd: FormData): Promise<Res & { assigned?: number }> {
  const s = await requireRole("ADMIN");
  const salespersonId = String(fd.get("salespersonId"));
  const n = z.coerce.number().int().min(1, "Jumlah minimal 1.").max(100, "Maksimal 100 QR sekali serah.").safeParse(fd.get("count"));
  if (!n.success) return { error: n.error.issues[0].message };
  if (!(await prisma.salesperson.findUnique({ where: { id: salespersonId }, select: { id: true } }))) return { error: "Sales tidak ditemukan." };
  const price = await getPrice();
  if (!price) return { error: "Atur harga setoran per QR dulu di halaman Sales." };

  const free = await prisma.qrCode.findMany({ where: { status: "UNACTIVATED", salespersonId: null, businessId: null }, orderBy: { createdAt: "asc" }, take: n.data, select: { id: true } });
  if (free.length < n.data) return { error: `Stok QR bebas hanya ${free.length}. Buat QR baru dulu.` };

  const ids = free.map((q) => q.id);
  const now = new Date();
  const r = await prisma.qrCode.updateMany({ where: { id: { in: ids }, salespersonId: null }, data: { salespersonId, assignedAt: now, price } });
  await prisma.auditLog.createMany({ data: ids.map((id) => ({ actorId: s.id, action: "QR_ASSIGNED", targetId: id })) });
  refresh();
  return { ok: true, assigned: r.count };
}

// Tarik kembali QR yang belum aktif (QR yang sudah aktif = sudah terjual, tidak bisa ditarik).
export async function unassignQr(fd: FormData) {
  const s = await requireRole("ADMIN");
  const id = String(fd.get("id"));
  const r = await prisma.qrCode.updateMany({ where: { id, status: "UNACTIVATED", activatedAt: null, salespersonId: { not: null } }, data: { salespersonId: null, assignedAt: null, price: null } });
  if (r.count === 1) await prisma.auditLog.create({ data: { actorId: s.id, action: "QR_UNASSIGNED", targetId: id } });
  refresh();
}

export async function addPayment(fd: FormData): Promise<Res> {
  const s = await requireRole("ADMIN");
  const salespersonId = String(fd.get("salespersonId"));
  const amount = rupiahInt.safeParse(fd.get("amount"));
  if (!amount.success) return { error: amount.error.issues[0].message };
  const date = String(fd.get("paidAt"));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "Tanggal tidak valid." };
  const paidAt = new Date(`${date}T12:00:00+07:00`);
  if (Number.isNaN(paidAt.getTime())) return { error: "Tanggal tidak valid." };
  const note = String(fd.get("note") ?? "").trim().slice(0, 200) || null;
  if (!(await prisma.salesperson.findUnique({ where: { id: salespersonId }, select: { id: true } }))) return { error: "Sales tidak ditemukan." };
  await prisma.payment.create({ data: { salespersonId, amount: amount.data, paidAt, note } });
  await prisma.auditLog.create({ data: { actorId: s.id, action: "PAYMENT_ADDED", targetId: salespersonId } });
  refresh();
  return { ok: true };
}

export async function deletePayment(fd: FormData) {
  const s = await requireRole("ADMIN");
  const p = await prisma.payment.findUnique({ where: { id: String(fd.get("id")) } });
  if (!p) return;
  await prisma.payment.delete({ where: { id: p.id } });
  await prisma.auditLog.create({ data: { actorId: s.id, action: "PAYMENT_DELETED", targetId: p.salespersonId } });
  refresh();
}
