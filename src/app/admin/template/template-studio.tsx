"use client";
import { useEffect, useState } from "react";
import { IconDownload, IconGoogleG, IconPrinter, IconStar } from "@/components/icons";
import { StatusBadge } from "@/components/status-badge";
import type { QrStatusKey } from "@/lib/qr-status";

export type QrOption = { id: string; publicToken: string; status: QrStatusKey; businessName: string | null };

const SIZES = {
  a6: { label: "Kartu meja", hint: "A6 · 105×148 mm", w: 105, h: 148 },
  a4: { label: "Poster", hint: "A4 · 210×297 mm", w: 210, h: 297 },
  sticker: { label: "Stiker", hint: "80×80 mm", w: 80, h: 80 },
} as const;
type SizeKey = keyof typeof SIZES;

const TEMPLATES = {
  blok: { label: "Blok warna" },
  tepi: { label: "Tepi warna" },
  pelangi: { label: "Pelangi" },
  bersih: { label: "Bersih" },
} as const;
type TplKey = keyof typeof TEMPLATES;

const G = { blue: "#4285F4", red: "#EA4335", yellow: "#FBBC05", green: "#34A853" };
const QUAD = `linear-gradient(${G.blue},${G.blue}) 0 0/50% 50% no-repeat,linear-gradient(${G.red},${G.red}) 100% 0/50% 50% no-repeat,linear-gradient(${G.green},${G.green}) 0 100%/50% 50% no-repeat,linear-gradient(${G.yellow},${G.yellow}) 100% 100%/50% 50% no-repeat`;
const STRIPE = `linear-gradient(${G.blue} 0 25%,${G.red} 25% 50%,${G.yellow} 50% 75%,${G.green} 75%)`;
const RAINBOW = `linear-gradient(135deg,${G.red},${G.yellow},${G.green},${G.blue})`;
const FRAME_BG: Record<TplKey, string> = { blok: QUAD, tepi: "#fff", pelangi: RAINBOW, bersih: "#fff" };

const STEPS = ["Scan QR", "Pilih bintang", "Tulis ulasan"];

type Cfg = { size: SizeKey; tpl: TplKey; headline: string; sub: string; cta: string; steps: boolean; showName: boolean; name: string };

function Wordmark({ size }: { size: string }) {
  const c = [G.blue, G.red, G.yellow, G.blue, G.green, G.red];
  return <span style={{ fontSize: size, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1 }}>{"Google".split("").map((ch, i) => <span key={i} style={{ color: c[i] }}>{ch}</span>)}</span>;
}

function Sheet({ cfg, svg }: { cfg: Cfg; svg: string }) {
  const { w, h } = SIZES[cfg.size];
  const sticker = cfg.size === "sticker";
  const { tpl } = cfg;
  const ink = "#0f172a";

  return (
    <>
      {/* ukuran cetak fisik; tinggi dikurangi 0,5mm agar tidak melahirkan halaman kosong */}
      <style>{`@media print{@page{size:${w}mm ${h}mm;margin:0}.tpl-sheet{width:${w}mm!important;height:${h - 0.5}mm!important;max-width:none!important;border-radius:0!important;box-shadow:none!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}}`}</style>
      <div className="tpl-sheet relative w-full overflow-hidden rounded-2xl shadow-xl shadow-slate-900/10" style={{ containerType: "inline-size", aspectRatio: `${w} / ${h}`, background: FRAME_BG[tpl], padding: tpl === "blok" ? "4cqw" : tpl === "pelangi" ? "2.2cqw" : 0, boxSizing: "border-box", color: ink }}>
        {tpl === "tepi" && (
          <>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3cqw", background: STRIPE }} />
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "3cqw", background: STRIPE }} />
          </>
        )}
        <div style={{ height: "100%", boxSizing: "border-box", background: "#fff", borderRadius: tpl === "blok" ? "7cqw" : tpl === "pelangi" ? "5cqw" : 0, padding: sticker ? "5cqw" : "6cqw 8cqw 5cqw", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: sticker ? "2.5cqw" : "2.4cqw", textAlign: "center", overflow: "hidden" }}>
          {tpl === "tepi" ? <Wordmark size={sticker ? "8cqw" : "10cqw"} /> : <IconGoogleG style={{ fontSize: sticker ? "10cqw" : "12cqw" }} />}
          {!sticker && (
            <div>
              <h2 style={{ margin: 0, fontSize: "6.2cqw", fontWeight: 800, lineHeight: 1.15, textWrap: "balance" }}>{cfg.headline}</h2>
              {cfg.sub && <p style={{ margin: "1.6cqw 0 0", fontSize: "3.2cqw", lineHeight: 1.4, color: "#475569", textWrap: "balance" }}>{cfg.sub}</p>}
            </div>
          )}
          <div style={{ display: "flex", gap: "0.8cqw", color: G.yellow, fontSize: sticker ? "5cqw" : "5.4cqw" }}>
            {[0, 1, 2, 3, 4].map((i) => <IconStar key={i} />)}
          </div>
          <div style={{ width: sticker ? "52cqw" : "52cqw", background: "#fff", padding: "2.5cqw", borderRadius: "3.5cqw", boxSizing: "border-box", border: "0.5cqw solid #e2e8f0" }}>
            <div className="[&_svg]:block [&_svg]:h-auto [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
          </div>
          <p style={{ margin: 0, fontSize: sticker ? "4.6cqw" : "4.2cqw", fontWeight: 700, color: "#1a73e8", textWrap: "balance" }}>{cfg.cta}</p>
          {cfg.steps && !sticker && (
            <p style={{ margin: 0, fontSize: "2.9cqw", fontWeight: 600, color: "#64748b" }}>{STEPS.map((s, i) => `${i + 1}. ${s}`).join("   ·   ")}</p>
          )}
          {cfg.showName && cfg.name && <p style={{ margin: 0, fontSize: "3.6cqw", fontWeight: 700 }}>{cfg.name}</p>}
        </div>
      </div>
    </>
  );
}

function TplPicker({ value, onChange }: { value: TplKey; onChange: (v: TplKey) => void }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {(Object.keys(TEMPLATES) as TplKey[]).map((k) => (
        <button key={k} type="button" aria-pressed={value === k} onClick={() => onChange(k)}
          className={`cursor-pointer rounded-xl border p-1.5 text-center transition ${value === k ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/15" : "border-slate-200 bg-white hover:border-slate-300"}`}>
          <span className="relative mx-auto block aspect-[3/4] w-full overflow-hidden rounded-md ring-1 ring-slate-200" style={{ background: FRAME_BG[k], padding: k === "blok" ? "10%" : k === "pelangi" ? "6%" : 0, boxSizing: "border-box" }}>
            {k === "tepi" && <><span className="absolute inset-y-0 left-0 w-[10%]" style={{ background: STRIPE }} /><span className="absolute inset-y-0 right-0 w-[10%]" style={{ background: STRIPE }} /></>}
            <span className="block h-full w-full bg-white" style={{ borderRadius: k === "blok" ? "18%" : k === "pelangi" ? "12%" : 0 }}>
              <span className="mx-auto mt-[22%] block size-[22%] rounded-full" style={{ background: G.blue }} />
              <span className="mx-auto mt-[12%] block aspect-square w-[44%] bg-slate-800" />
            </span>
          </span>
          <span className="mt-1 block text-[10px] font-semibold leading-tight text-slate-600">{TEMPLATES[k].label}</span>
        </button>
      ))}
    </div>
  );
}

function Seg<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string; hint?: string }[] }) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={value === o.value} onClick={() => onChange(o.value)}
          className={`cursor-pointer rounded-xl border px-2 py-2 text-center text-xs font-semibold transition ${value === o.value ? "border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/15" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}>
          {o.label}
          {o.hint && <span className="mt-0.5 block text-[10px] font-normal text-slate-400">{o.hint}</span>}
        </button>
      ))}
    </div>
  );
}

export function TemplateStudio({ options, initialId }: { options: QrOption[]; initialId?: string }) {
  const first = options.find((o) => o.id === initialId) ?? options.find((o) => o.status === "ACTIVE") ?? options[0];
  const [qrId, setQrId] = useState(first?.id ?? "");
  const [size, setSize] = useState<SizeKey>("a6");
  const [tpl, setTpl] = useState<TplKey>("blok");
  const [headline, setHeadline] = useState("Suka dengan layanan kami?");
  const [sub, setSub] = useState("Ulasan Anda sangat berarti bagi kami dan pelanggan lain.");
  const [cta, setCta] = useState("Scan & beri ulasan di Google");
  const [steps, setSteps] = useState(true);
  const [showName, setShowName] = useState(true);
  const [nameOverride, setNameOverride] = useState("");
  const [svg, setSvg] = useState("");

  const sel = options.find((o) => o.id === qrId);
  const token = sel?.publicToken;
  const name = nameOverride.trim() || sel?.businessName || "";

  useEffect(() => {
    if (!token) return;
    let alive = true;
    const url = `${process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin}/q/${token}`;
    import("qrcode").then((m) => m.default.toString(url, { type: "svg", margin: 1, errorCorrectionLevel: "M" })).then((s) => alive && setSvg(s));
    return () => { alive = false; };
  }, [token]);

  const cfg: Cfg = { size, tpl, headline, sub, cta, steps: steps && size !== "sticker", showName, name };

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)] print:block">
      <div className="card space-y-4 print:hidden">
        <div>
          <label className="label" htmlFor="tpl-qr">QR yang dipakai</label>
          <select id="tpl-qr" className="input" value={qrId} onChange={(e) => setQrId(e.target.value)}>
            {options.map((o) => <option key={o.id} value={o.id}>{o.businessName ? `${o.businessName} · ` : ""}{o.publicToken}</option>)}
          </select>
          {sel && sel.status !== "ACTIVE" && (
            <p className="mt-2 flex flex-wrap items-center gap-2 rounded-xl bg-amber-50 p-2.5 text-xs text-amber-800 ring-1 ring-amber-200">
              <StatusBadge status={sel.status} />
              {sel.status === "UNACTIVATED" ? "QR belum diaktivasi pemilik; pelanggan yang scan belum diarahkan ke Google." : "QR sedang nonaktif; pelanggan yang scan tidak diarahkan ke Google."}
            </p>
          )}
        </div>

        <div><span className="label">Ukuran</span><Seg value={size} onChange={setSize} options={(Object.keys(SIZES) as SizeKey[]).map((k) => ({ value: k, label: SIZES[k].label, hint: SIZES[k].hint }))} /></div>
        <div><span className="label">Template</span><TplPicker value={tpl} onChange={setTpl} /></div>

        <details className="group rounded-xl border border-slate-200 open:bg-slate-50/50">
          <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2.5 text-sm font-semibold text-slate-700">
            Ubah teks
            <span className="text-xs font-normal text-slate-400 group-open:hidden">Judul, ajakan, nama</span>
          </summary>
          <div className="space-y-2.5 border-t border-slate-200 p-3">
            {size !== "sticker" && (
              <>
                <div><label className="label" htmlFor="tpl-headline">Judul</label><input id="tpl-headline" className="input" maxLength={60} value={headline} onChange={(e) => setHeadline(e.target.value)} /></div>
                <div><label className="label" htmlFor="tpl-sub">Teks pendukung</label><input id="tpl-sub" className="input" maxLength={120} value={sub} onChange={(e) => setSub(e.target.value)} /></div>
              </>
            )}
            <div><label className="label" htmlFor="tpl-cta">Ajakan di bawah QR</label><input id="tpl-cta" className="input" maxLength={50} value={cta} onChange={(e) => setCta(e.target.value)} /></div>
            <div><label className="label" htmlFor="tpl-name">Nama bisnis</label><input id="tpl-name" className="input" maxLength={50} placeholder={sel?.businessName ?? "Nama bisnis Anda"} value={nameOverride} onChange={(e) => setNameOverride(e.target.value)} /></div>
          </div>
        </details>

        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"><input type="checkbox" className="size-4 accent-[var(--color-brand-600)]" checked={showName} onChange={(e) => setShowName(e.target.checked)} />Nama bisnis</label>
          {size !== "sticker" && <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"><input type="checkbox" className="size-4 accent-[var(--color-brand-600)]" checked={steps} onChange={(e) => setSteps(e.target.checked)} />3 langkah</label>}
        </div>

        <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          <button type="button" className="btn flex-1" onClick={() => window.print()}><IconPrinter className="size-4" />Cetak template</button>
          {sel && <a className="btn-ghost" href={`/api/qr/download?id=${sel.id}&fmt=png`}><IconDownload className="size-4" />QR saja</a>}
        </div>
        <details className="text-xs text-slate-500">
          <summary className="cursor-pointer font-medium">Tips cetak</summary>
          <p className="mt-1.5 leading-relaxed">Di dialog cetak: margin <b>Tidak ada</b>, aktifkan <b>Background graphics</b>, skala <b>100%</b>. QR sengaja tetap hitam-putih supaya mudah discan.</p>
        </details>
      </div>

      <div className="rounded-2xl bg-slate-100 p-4 sm:p-8 print:bg-transparent print:p-0">
        <div className={`mx-auto w-full print:m-0 print:max-w-none ${size === "sticker" ? "max-w-[20rem]" : "max-w-[24rem]"}`}>
          <Sheet cfg={cfg} svg={svg} />
        </div>
        <p className="mt-5 text-center text-xs text-slate-500 print:hidden">Pratinjau · ukuran cetak asli {SIZES[size].hint}</p>
      </div>
    </div>
  );
}
