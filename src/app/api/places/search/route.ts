import { NextRequest, NextResponse } from "next/server";
import { allow } from "@/lib/ratelimit";

export const dynamic = "force-dynamic";

type Raw = {
  name?: string;
  formatted?: string;
  address_line1?: string;
  address_line2?: string;
  lat?: number;
  lon?: number;
};

// Dipakai halaman aktivasi (publik), jadi dibatasi per IP agar kuota Geoapify tidak habis dipakai orang lain.
// Data dari Geoapify (berbasis OpenStreetMap). Link Google Maps dibuat dari koordinat hasil pilihan.
export async function GET(req: NextRequest) {
  const key = process.env.GEOAPIFY_API_KEY;
  if (!key) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  if (!(await allow("places", 60))) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const q = (req.nextUrl.searchParams.get("q") ?? "").trim().slice(0, 100);
  if (q.length < 3) return NextResponse.json({ places: [] });

  const url = new URL("https://api.geoapify.com/v1/geocode/autocomplete");
  url.search = new URLSearchParams({
    text: q,
    filter: "countrycode:id",
    lang: "id",
    limit: "5",
    format: "json",
    apiKey: key,
  }).toString();

  let r: Response;
  try {
    r = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(8000) });
  } catch {
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }
  if (!r.ok) return NextResponse.json({ error: "upstream" }, { status: 502 });

  const d = (await r.json()) as { results?: Raw[] };
  const places = (d.results ?? [])
    .filter((p) => p.formatted)
    .map((p) => ({
      name: p.name || p.address_line1 || "",
      address: p.formatted as string,
      mapsUrl:
        typeof p.lat === "number" && typeof p.lon === "number"
          ? `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lon}`
          : "",
    }));
  return NextResponse.json({ places });
}
