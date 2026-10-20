import { z } from "zod";

const ALLOWED = [/^search\.google\.com$/, /^g\.page$/, /^maps\.app\.goo\.gl$/, /^goo\.gl$/, /^(www\.)?google\.[a-z.]+$/, /^maps\.google\.[a-z.]+$/];
export function isSafeGoogleUrl(raw: string) {
  try { const u = new URL(raw); return u.protocol === "https:" && ALLOWED.some((r) => r.test(u.hostname)); } catch { return false; }
}
export const googleUrl = z.string().trim().url().max(500).refine(isSafeGoogleUrl, "Harus tautan Google resmi (https).");

export const activationSchema = z.object({
  token: z.string().min(8).max(32),
  businessName: z.string().trim().min(2).max(100),
  ownerName: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^(\+62|62|0)8\d{7,12}$/, "Nomor WhatsApp tidak valid"),
  address: z.string().trim().min(5).max(300),
  googleMapsUrl: googleUrl,
  googleReviewUrl: googleUrl,
  email: z.string().trim().toLowerCase().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter").max(100),
  pin: z.string().regex(/^\d{6,8}$/, "PIN 6-8 digit"),
});

export const businessUpdateSchema = z.object({
  businessName: z.string().trim().min(2).max(100),
  description: z.string().trim().max(300).optional(),
  logoUrl: z.string().trim().url().startsWith("https://").max(500).optional().or(z.literal("")),
  googleMapsUrl: googleUrl,
  googleReviewUrl: googleUrl,
});

export const adminBusinessSchema = activationSchema.pick({ businessName: true, ownerName: true, phone: true, address: true, googleMapsUrl: true, googleReviewUrl: true });
