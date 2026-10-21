"use server";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { allow } from "@/lib/ratelimit";
import { requireRole } from "@/lib/session";

export type AccountState = { error?: string; ok?: boolean; values?: Record<string, string> } | null;

const emailSchema = z.object({
  email: z.string().trim().toLowerCase().email("Alamat email tidak valid."),
  password: z.string().min(1, "Masukkan kata sandi saat ini."),
});
const passwordSchema = z.object({
  current: z.string().min(1, "Masukkan kata sandi saat ini."),
  next: z.string().min(8, "Kata sandi baru minimal 8 karakter.").max(100, "Kata sandi baru terlalu panjang."),
  confirm: z.string(),
}).refine((d) => d.next === d.confirm, { message: "Konfirmasi kata sandi tidak sama.", path: ["confirm"] });

async function checkedUser(password: string) {
  const s = await requireRole("OWNER");
  const user = await prisma.user.findUnique({ where: { id: s.id } });
  const ok = user?.passwordHash ? await bcrypt.compare(password, user.passwordHash) : false;
  return ok ? user : null;
}

export async function changeEmail(_: AccountState, fd: FormData): Promise<AccountState> {
  await requireRole("OWNER");
  const values = { email: String(fd.get("email") ?? "") }; // dikembalikan saat error supaya isian tidak hilang
  if (!(await allow("account", 10))) return { error: "Terlalu banyak percobaan. Coba lagi nanti.", values };
  const p = emailSchema.safeParse(Object.fromEntries(fd));
  if (!p.success) return { error: p.error.issues[0].message, values };
  const user = await checkedUser(p.data.password);
  if (!user) return { error: "Kata sandi salah.", values };
  if (user.email === p.data.email) return { error: "Email baru sama dengan email saat ini.", values };
  if (await prisma.user.findUnique({ where: { email: p.data.email } })) return { error: "Email ini sudah dipakai.", values };
  try {
    await prisma.user.update({ where: { id: user.id }, data: { email: p.data.email } });
    await prisma.auditLog.create({ data: { actorId: user.id, action: "EMAIL_CHANGED" } });
  } catch {
    return { error: "Email gagal diubah. Mungkin sudah dipakai.", values };
  }
  revalidatePath("/dashboard/akun");
  return { ok: true };
}

export async function changePassword(_: AccountState, fd: FormData): Promise<AccountState> {
  await requireRole("OWNER");
  const values = { next: String(fd.get("next") ?? ""), confirm: String(fd.get("confirm") ?? "") }; // kata sandi saat ini sengaja tidak dikembalikan
  if (!(await allow("account", 10))) return { error: "Terlalu banyak percobaan. Coba lagi nanti.", values };
  const p = passwordSchema.safeParse(Object.fromEntries(fd));
  if (!p.success) return { error: p.error.issues[0].message, values };
  const user = await checkedUser(p.data.current);
  if (!user) return { error: "Kata sandi saat ini salah.", values };
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(p.data.next, 12) } });
  await prisma.auditLog.create({ data: { actorId: user.id, action: "PASSWORD_CHANGED" } });
  return { ok: true };
}
