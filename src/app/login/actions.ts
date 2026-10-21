"use server";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { allow } from "@/lib/ratelimit";
import { createSession, destroySession } from "@/lib/session";

type S = { error?: string; values?: { email: string; password: string } } | null;
export async function login(_: S, fd: FormData): Promise<S> {
  const rawEmail = String(fd.get("email") ?? "").trim();
  const password = String(fd.get("password") ?? "");
  const values = { email: rawEmail, password };
  if (!(await allow("login", 10))) return { error: "Terlalu banyak percobaan. Coba lagi nanti.", values };
  const email = rawEmail.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  const ok = user?.passwordHash ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!user || !ok) return { error: "Email atau password salah.", values };
  await createSession({ id: user.id, role: user.role });
  redirect(user.role === "ADMIN" ? "/admin" : "/dashboard");
}
export async function logout() { await destroySession(); redirect("/login"); }
