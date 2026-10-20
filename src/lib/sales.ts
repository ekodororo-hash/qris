import { prisma } from "./db";

export const PRICE_KEY = "QR_PRICE";
export const rupiah = (n: number) => "Rp" + n.toLocaleString("id-ID");

// setoran wajib per QR (null = belum diatur)
export async function getPrice(): Promise<number | null> {
  const s = await prisma.setting.findUnique({ where: { key: PRICE_KEY } });
  const n = Number(s?.value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export type SalesTotals = { held: number; sold: number; owed: number; paid: number };

// Hitungan per sales. "Terjual" = QR yang pernah diaktivasi (activatedAt terisi).
export async function salesTotals(): Promise<Map<string, SalesTotals>> {
  const [held, sold, paid] = await Promise.all([
    prisma.qrCode.groupBy({ by: ["salespersonId"], where: { salespersonId: { not: null } }, _count: { _all: true } }),
    prisma.qrCode.groupBy({ by: ["salespersonId"], where: { salespersonId: { not: null }, activatedAt: { not: null } }, _count: { _all: true }, _sum: { price: true } }),
    prisma.payment.groupBy({ by: ["salespersonId"], _sum: { amount: true } }),
  ]);
  const m = new Map<string, SalesTotals>();
  const get = (id: string) => { let t = m.get(id); if (!t) { t = { held: 0, sold: 0, owed: 0, paid: 0 }; m.set(id, t); } return t; };
  for (const x of held) if (x.salespersonId) get(x.salespersonId).held = x._count._all;
  for (const x of sold) if (x.salespersonId) { const t = get(x.salespersonId); t.sold = x._count._all; t.owed = x._sum.price ?? 0; }
  for (const x of paid) get(x.salespersonId).paid = x._sum.amount ?? 0;
  return m;
}
