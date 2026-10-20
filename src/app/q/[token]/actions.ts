"use server";
import { redirect } from "next/navigation";
import { activateQr } from "@/lib/activation";
import { allow } from "@/lib/ratelimit";

export type ActivateState = { error?: string; values?: Record<string, string> } | null;

export async function activate(_: ActivateState, fd: FormData): Promise<ActivateState> {
  // Kembalikan isian (kecuali PIN) supaya form tidak kosong lagi saat ada error
  const { pin: _pin, ...values } = Object.fromEntries(fd) as Record<string, string>;
  if (!(await allow("activate", 10))) return { error: "Terlalu banyak percobaan. Silakan coba lagi nanti.", values };
  const r = await activateQr(Object.fromEntries(fd));
  if (!r.ok) return { error: r.error, values };
  redirect(`/q/${String(fd.get("token"))}/activated`);
}
