import { headers } from "next/headers";
// Rate limit in-memory (per instance serverless). Untuk produksi ketat, ganti ke Upstash Redis.
const hits = new Map<string, { n: number; t: number }>();
export async function allow(prefix: string, max = 10, windowMs = 10 * 60_000) {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const k = `${prefix}:${ip}`, now = Date.now(), h = hits.get(k);
  if (!h || now - h.t > windowMs) { hits.set(k, { n: 1, t: now }); return true; }
  h.n++; return h.n <= max;
}
