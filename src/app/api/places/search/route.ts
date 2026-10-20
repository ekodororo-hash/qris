import { NextRequest, NextResponse } from "next/server";
import { allow } from "@/lib/ratelimit";
import { isSafeGoogleUrl } from "@/lib/validators";

export const dynamic = "force-dynamic";

type Raw = { displayName?: { text?: string }; formattedAddress?: string; googleMapsUri?: string };

// Dipakai halaman aktivasi (publik), jadi dibatasi per IP agar kuota Google tidak habis dipakai orang lain.
export async function GET(req: NextRequest) {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  if (!(await allow("places", 60))) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const q = (req.nextUrl.searchParams.get("q") ?? "").trim().slice(0, 100);
  if (q.length < 3) return NextResponse.json({ places: [] });

  const r = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.googleMapsUri",
    },
    body: JSON.stringify({ textQuery: q, languageCode: "id", regionCode: "ID", pageSize: 5 }),
    cache: "no-store",
  });
  if (!r.ok) return NextResponse.json({ error: "upstream" }, { status: 502 });

  const d = (await r.json()) as { places?: Raw[] };
  const places = (d.places ?? [])
    .filter((p) => p.formattedAddress)
    .map((p) => ({
      name: p.displayName?.text ?? "",
      address: p.formattedAddress as string,
      mapsUrl: p.googleMapsUri && isSafeGoogleUrl(p.googleMapsUri) ? p.googleMapsUri : "",
    }));
  return NextResponse.json({ places });
}
