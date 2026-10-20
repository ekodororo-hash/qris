"use server";
import { redirect } from "next/navigation";
import { activateQr } from "@/lib/activation";
import { allow } from "@/lib/ratelimit";

export async function activate(_: { error?: string } | null, fd: FormData): Promise<{ error?: string } | null> {
  if (!(await allow("activate", 10))) return { error: "Terlalu banyak percobaan. Coba lagi nanti." };
  const r = await activateQr(Object.fromEntries(fd));
  if (!r.ok) return { error: r.error };
  redirect(`/q/${String(fd.get("token"))}/activated`);
}
