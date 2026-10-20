import { randomBytes, randomInt } from "crypto";
import { timingSafeEqual } from "crypto";

// 12 karakter base62 dari crypto (~71 bit entropi), tidak bisa ditebak
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
export function generatePublicToken(len = 12) {
  const bytes = randomBytes(len);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}
export function generatePin(len = 8) {
  return Array.from({ length: len }, () => randomInt(0, 10)).join("");
}
export function verifyPin(input: string, pin: string | null) {
  if (!pin) return false;
  const a = Buffer.from(input), b = Buffer.from(pin);
  return a.length === b.length && timingSafeEqual(a, b);
}
