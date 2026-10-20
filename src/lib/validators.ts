import { z } from "zod";

// Hanya host Google resmi yang boleh menjadi tujuan redirect (anti open-redirect/phishing)
const ALLOWED = [
  /^search\.google\.com$/, /^g\.page$/, /^maps\.app\.goo\.gl$/, /^goo\.gl$/,
  /^(www\.)?google\.[a-z.]+$/, /^maps\.google\.[a-z.]+$/,
];
export function isSafeGoogleUrl(raw: string) {
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:") return false;
    return ALLOWED.some((r) => r.test(u.hostname));
  } catch { return false; }
}
const googleUrl = z.string().url().max(500).refine(isSafeGoogleUrl, "Harus tautan Google resmi (https).");

export const activationSchema = z.object({
  token: z.string().min(8).max(32),
  businessName: z.string().trim().min(2).max(100),
  ownerName: z.string().trim().min(2).max(100),
  phone: z.string().regex(/^(\+62|62|0)8\d{7,12}$/, "Nomor WhatsApp tidak valid"),
  address: z.string().trim().min(5).max(300),
  googleMapsUrl: googleUrl,
  googleReviewUrl: googleUrl,
  pin: z.string().regex(/^\d{6,8}$/, "PIN 6-8 digit"),
  pinConfirm: z.string(),
}).refine((d) => d.pin === d.pinConfirm, { path: ["pinConfirm"], message: "Konfirmasi PIN tidak cocok" });
export type ActivationInput = z.infer<typeof activationSchema>;
