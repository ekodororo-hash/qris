import { randomBytes, randomInt } from "crypto";
import { timingSafeEqual } from "crypto";
import bcrypt from "bcryptjs";

// 12 karakter base62 dari crypto (~71 bit entropi), tidak bisa ditebak
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
export function generatePublicToken(len = 12) {
  const bytes = randomBytes(len);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}
export function generatePin(len = 8) {
  return Array.from({ length: len }, () => randomInt(0, 10)).join("");
}
export const hashPin = (pin: string) => bcrypt.hash(pin, 12);
// PIN plain dipakai bila ada; QR lama tanpa PIN plain jatuh ke hash
export async function verifyPin(input: string, pin: string | null, hash: string) {
  if (!pin) return bcrypt.compare(input, hash);
  const a = Buffer.from(input), b = Buffer.from(pin);
  return a.length === b.length && timingSafeEqual(a, b);
}
