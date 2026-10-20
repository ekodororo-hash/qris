import { randomBytes, randomInt } from "crypto";
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
export const verifyPin = (pin: string, hash: string) => bcrypt.compare(pin, hash);
