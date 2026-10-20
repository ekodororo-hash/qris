"use client";
import { useEffect, useRef, useState } from "react";
import { IconCheck, IconSearch } from "@/components/icons";

type Place = { name: string; address: string; mapsUrl: string };

// Kolom alamat dengan pencarian lokasi (Geoapify). Memilih hasil mengisi alamat + link Maps (hidden).
// Kalau pencarian tidak tersedia / tidak ketemu, pengguna tetap bisa mengetik alamat manual.
export function AddressSearch({ id, defaultValue = "", defaultMapsUrl = "", name = "address", mapsName = "googleMapsUrl" }: {
  id: string; defaultValue?: string; defaultMapsUrl?: string; name?: string; mapsName?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [mapsUrl, setMapsUrl] = useState(defaultMapsUrl);
  const [results, setResults] = useState<Place[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const skip = useRef(defaultValue); // teks yang tidak perlu dicari (nilai awal / hasil pilihan)
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = value.trim();
    if (value === skip.current || q.length < 3) { setResults([]); setNote(""); setLoading(false); return; }
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await fetch(`/api/places/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        if (r.status === 503) { setResults([]); setNote("Pencarian lokasi belum tersedia. Silakan ketik alamat lengkap secara manual."); return; }
        if (r.status === 429) { setResults([]); setNote("Terlalu banyak pencarian. Silakan coba lagi sesaat lagi atau ketik alamat secara manual."); return; }
        if (!r.ok) throw new Error("search");
        const d = (await r.json()) as { places: Place[] };
        setResults(d.places);
        setNote(d.places.length ? "" : "Hasil tidak ditemukan. Coba kata kunci lain atau ketik alamat secara manual.");
        setOpen(true);
      } catch (e) {
        if ((e as Error).name !== "AbortError") { setResults([]); setNote("Pencarian gagal. Silakan ketik alamat secara manual."); }
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, 400);
    return () => { clearTimeout(timer); ctrl.abort(); };
  }, [value]);

  useEffect(() => {
    const close = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  function pick(p: Place) {
    skip.current = p.address;
    setValue(p.address);
    setMapsUrl(p.mapsUrl);
    setResults([]);
    setNote("");
    setOpen(false);
  }

  const showList = open && (loading || results.length > 0 || note);

  return (
    <div ref={box} className="relative">
      <div className="relative">
        <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input id={id} name={name} required minLength={5} maxLength={300} autoComplete="off" className="input pl-10"
          placeholder="Cari nama bisnis atau alamat" value={value}
          onChange={(e) => { setValue(e.target.value); setMapsUrl(""); setOpen(true); }}
          onFocus={() => setOpen(true)} />
      </div>
      <input type="hidden" name={mapsName} value={mapsUrl} />
      {showList && (
        <ul role="listbox" className="absolute inset-x-0 top-full z-20 mt-1.5 max-h-72 overflow-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10">
          {loading && <li className="px-3 py-2 text-xs text-slate-500">Mencari lokasi…</li>}
          {!loading && results.map((p, i) => (
            <li key={i} role="option" aria-selected={false}>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => pick(p)}
                className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left transition hover:bg-brand-50">
                <span className="block text-sm font-semibold text-slate-900">{p.name}</span>
                <span className="block text-xs text-slate-500">{p.address}</span>
              </button>
            </li>
          ))}
          {!loading && note && <li className="px-3 py-2 text-xs text-slate-500">{note}</li>}
        </ul>
      )}
      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
        {mapsUrl
          ? <><IconCheck className="size-3.5 text-emerald-600" /><span className="text-emerald-700">Lokasi dipilih dari hasil pencarian.</span></>
          : "Ketik nama bisnis, lalu pilih hasil yang sesuai."}
        <span className="ml-auto">
          Powered by{" "}
          <a href="https://www.geoapify.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-700">Geoapify</a>
        </span>
      </p>
    </div>
  );
}
