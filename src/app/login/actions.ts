"use server";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { allow } from "@/lib/ratelimit";
import { createSession, destroySession } from "@/lib/session";

type S = { error?: string } | null;
export async function login(_: S, fd: FormData): Promise<S> {
  if (!(await allow("login", 10))) return { error: "Terlalu banyak percobaan. Coba lagi nanti." };
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const password = String(fd.get("password") ?? "");
  const user = await prisma.user.findUnique({ where: { email } });
  const ok = user?.passwordHash ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!user || !ok) return { error: "Email atau password salah." };
  await createSession({ id: user.id, role: user.role });
  redirect(user.role === "ADMIN" ? "/admin" : "/dashboard");
}
export async function logout() { await destroySession(); redirect("/login"); }
