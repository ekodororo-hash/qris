import { isSafeGoogleUrl } from "./validators";

// Mengubah tautan bisnis dari Google Maps menjadi tautan formulir ulasan.
// Tautan Maps memuat ID fitur "!1s0x…:0x…"; dua angka itu dikodekan menjadi Place ID (ChIJ…),
// lalu dipakai di https://search.google.com/local/writereview?placeid=…
// Tautan review (g.page/r/…, search.google.com/…) dan tautan Google lain dikembalikan apa adanya.

const FID = /!1s(0x[0-9a-f]{1,16}):(0x[0-9a-f]{1,16})/i;
const SHORT = /^(maps\.app\.goo\.gl|goo\.gl)$/;

export function placeIdFromFid(hi: string, lo: string) {
  const b = Buffer.alloc(20);
  b[0] = 0x0a; b[1] = 0x12; b[2] = 0x09;
  b.writeBigUInt64LE(BigInt(hi), 3);
  b[11] = 0x11;
  b.writeBigUInt64LE(BigInt(lo), 12);
  return b.toString("base64url");
}

// Tautan pendek dari tombol Bagikan (maps.app.goo.gl) diikuti manual, hanya ke domain Google.
async function expand(raw: string): Promise<string | null> {
  let url = raw;
  for (let i = 0; i < 4; i++) {
    if (!SHORT.test(new URL(url).hostname)) return url;
    const r = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(5000), headers: { "user-agent": "Mozilla/5.0" } });
    const loc = r.headers.get("location");
    if (!loc) return null;
    url = new URL(loc, url).toString();
    if (!isSafeGoogleUrl(url)) return null;
  }
  return url;
}

export type ReviewLinkResult = { ok: true; url: string } | { ok: false; error: string };

export async function toReviewLink(raw: string): Promise<ReviewLinkResult> {
  const u = new URL(raw);
  const h = u.hostname;
  const isMaps = SHORT.test(h) || /^maps\.google\./.test(h) || (/^(www\.)?google\./.test(h) && u.pathname.startsWith("/maps"));
  if (!isMaps) return { ok: true, url: raw };

  const full = await expand(raw).catch(() => null);
  let text = full ?? "";
  try { text = decodeURIComponent(text); } catch { /* pakai apa adanya */ }
  const m = FID.exec(text);
  if (!m) return { ok: false, error: "Tautan Google Maps tidak dikenali. Buka halaman bisnis Anda di Google Maps (bukan hasil pencarian), lalu salin tautannya dari kolom alamat browser." };
  return { ok: true, url: `https://search.google.com/local/writereview?placeid=${placeIdFromFid(m[1], m[2])}` };
}
