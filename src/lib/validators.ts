import { z } from "zod";

const ALLOWED = [/^search\.google\.com$/, /^g\.page$/, /^maps\.app\.goo\.gl$/, /^goo\.gl$/, /^(www\.)?google\.[a-z.]+$/, /^maps\.google\.[a-z.]+$/];
export function isSafeGoogleUrl(raw: string) {
  try { const u = new URL(raw); return u.protocol === "https:" && ALLOWED.some((r) => r.test(u.hostname)); } catch { return false; }
}
export const googleUrl = z.string().trim().url().max(500).refine(isSafeGoogleUrl, "Masukkan tautan Google yang valid (diawali https://).");

const optionalGoogleUrl = z.union([googleUrl, z.literal("")]).optional();

export const activationSchema = z.object({
  token: z.string().min(8).max(32),
  businessName: z.string().trim().min(2).max(100),
  ownerName: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^(\+62|62|0)8\d{7,12}$/, "Nomor WhatsApp tidak valid. Gunakan format 08xxxxxxxxxx."),
  address: z.union([z.string().trim().min(5).max(300), z.literal("")]).optional(), // opsional: dilengkapi setelah aktivasi
  googleMapsUrl: optionalGoogleUrl, // otomatis dari pilihan Maps / dibuat dari nama + alamat
  googleReviewUrl: optionalGoogleUrl, // opsional: dilengkapi setelah aktivasi
  email: z.string().trim().toLowerCase().email("Alamat email tidak valid."),
  password: z.string().min(8, "Kata sandi minimal 8 karakter.").max(100),
  pin: z.string().regex(/^\d{6,8}$/, "PIN aktivasi terdiri dari 6 sampai 8 angka."),
});

// Logo: foto hasil unggah (data URL JPEG/PNG/WebP, tanpa SVG) atau tautan https lama.
const logoValue = z.string().trim().max(100_000).refine(
  (v) => v === "" || (v.length <= 500 && /^https:\/\/\S+$/.test(v)) || /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(v),
  "Logo tidak valid. Unggah foto berformat JPG, PNG, atau WebP.",
);

export const businessUpdateSchema = z.object({
  businessName: z.string().trim().min(2).max(100),
  description: z.string().trim().max(300).optional(),
  logoUrl: logoValue.optional(),
  address: activationSchema.shape.address,
  googleMapsUrl: optionalGoogleUrl,
  googleReviewUrl: optionalGoogleUrl,
});

export const adminBusinessSchema = activationSchema.pick({ businessName: true, ownerName: true, phone: true, address: true, googleMapsUrl: true, googleReviewUrl: true });
