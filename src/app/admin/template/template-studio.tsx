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

const STYLES = { solid: "Header warna", full: "Penuh warna", minimal: "Minimal" } as const;
type StyleKey = keyof typeof STYLES;

const THEMES = {
  blue: { label: "Biru", main: "#4285F4", soft: "#e8f0fe" },
  red: { label: "Merah", main: "#EA4335", soft: "#fce8e6" },
  yellow: { label: "Kuning", main: "#FBBC05", soft: "#fef7e0" },
  green: { label: "Hijau", main: "#34A853", soft: "#e6f4ea" },
} as const;
type ThemeKey = keyof typeof THEMES;

const STEPS = ["Scan QR", "Pilih bintang", "Tulis ulasan"];

type Cfg = { size: SizeKey; style: StyleKey; color: ThemeKey; headline: string; sub: string; cta: string; steps: boolean; showName: boolean; name: string };

function Sheet({ cfg, svg }: { cfg: Cfg; svg: string }) {
  const { w, h } = SIZES[cfg.size];
  const t = THEMES[cfg.color];
  const sticker = cfg.size === "sticker";
  const full = cfg.style === "full";
  const solid = cfg.style === "solid";
  const minimal = cfg.style === "minimal";
  const fg = full ? "#fff" : "#0f172a";
  const accent = full ? "#fff" : t.main;
  const star = full || solid ? "#fde047" : "#f59e0b";

  const GoogleBadge = ({ size }: { size: string }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.4cqw", background: "#fff", borderRadius: "999px", padding: "1.4cqw 3cqw", boxShadow: full ? "0 0.6cqw 2cqw rgba(15,23,42,.2)" : "none", border: full ? "none" : `0.3cqw solid ${t.soft}` }}>
      <IconGoogleG style={{ fontSize: size }} />
      <span style={{ fontSize: "3.4cqw", fontWeight: 700, color: "#5f6368" }}>Google</span>
    </div>
  );

  const panel = (width: string) => (
    <div style={{ width, background: "#fff", padding: "4cqw", borderRadius: "5cqw", boxSizing: "border-box", boxShadow: minimal ? "none" : "0 1cqw 5cqw rgba(15,23,42,.18)", border: minimal ? `0.6cqw solid ${t.main}` : undefined }}>
      <div className="[&_svg]:block [&_svg]:h-auto [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );

  return (
    <>
      {/* ukuran cetak fisik; tinggi dikurangi 0,5mm agar tidak melahirkan halaman kosong */}
      <style>{`@media print{@page{size:${w}mm ${h}mm;margin:0}.tpl-sheet{width:${w}mm!important;height:${h - 0.5}mm!important;max-width:none!important;border-radius:0!important;box-shadow:none!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}}`}</style>
      <div className="tpl-sheet w-full overflow-hidden rounded-2xl shadow-xl shadow-slate-900/10" style={{ containerType: "inline-size", aspectRatio: `${w} / ${h}`, background: full ? t.main : "#fff", color: fg }}>
        {sticker ? (
          <div style={{ height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3cqw", padding: "6cqw", textAlign: "center", border: minimal ? `1.2cqw solid ${t.main}` : undefined, background: solid ? t.soft : undefined }}>
            <GoogleBadge size="7cqw" />
            <p style={{ margin: 0, fontSize: "5.2cqw", fontWeight: 800, lineHeight: 1.2, color: accent, textWrap: "balance" }}>{cfg.cta}</p>
            {panel("62cqw")}
            {cfg.showName && cfg.name && <p style={{ margin: 0, fontSize: "3.8cqw", fontWeight: 700 }}>{cfg.name}</p>}
          </div>
        ) : (
          <div style={{ height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", border: minimal ? `1.2cqw solid ${t.main}` : undefined }}>
            <div style={{ background: solid ? t.main : "transparent", color: solid ? "#fff" : minimal ? t.main : fg, padding: solid ? "9cqw 8cqw 10cqw" : "9cqw 8cqw 0", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", gap: "1cqw", color: star, fontSize: "6cqw" }}>
                {[0, 1, 2, 3, 4].map((i) => <IconStar key={i} />)}
              </div>
              <h2 style={{ margin: "2.5cqw 0 0", fontSize: "7.6cqw", fontWeight: 800, lineHeight: 1.15, textWrap: "balance" }}>{cfg.headline}</h2>
              {cfg.sub && <p style={{ margin: "2.5cqw 0 0", fontSize: "3.6cqw", lineHeight: 1.45, opacity: 0.85 }}>{cfg.sub}</p>}
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4cqw", padding: "5cqw 8cqw" }}>
              {panel("64cqw")}
              <GoogleBadge size="5.5cqw" />
              <p style={{ margin: 0, fontSize: "4.6cqw", fontWeight: 700, textAlign: "center", color: accent, textWrap: "balance" }}>{cfg.cta}</p>
            </div>
            {cfg.steps && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "3cqw", padding: "0 8cqw 5cqw", textAlign: "center" }}>
                {STEPS.map((s, i) => (
                  <div key={s}>
                    <span style={{ display: "inline-grid", placeItems: "center", width: "7cqw", height: "7cqw", borderRadius: "50%", background: full ? "rgba(255,255,255,.2)" : t.soft, color: accent, fontSize: "3.6cqw", fontWeight: 800 }}>{i + 1}</span>
                    <p style={{ margin: "1.5cqw 0 0", fontSize: "3cqw", fontWeight: 600 }}>{s}</p>
                  </div>
                ))}
              </div>
            )}
            {cfg.showName && cfg.name && <p style={{ margin: 0, padding: "0 8cqw 7cqw", textAlign: "center", fontSize: "3.8cqw", fontWeight: 700, opacity: 0.9 }}>{cfg.name}</p>}
          </div>
        )}
      </div>
    </>
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
  const [style, setStyle] = useState<StyleKey>("solid");
  const [color, setColor] = useState<ThemeKey>("blue");
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

  const cfg: Cfg = { size, style, color, headline, sub, cta, steps: steps && size !== "sticker", showName, name };

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)] print:block">
      <div className="card space-y-5 print:hidden">
        <div>
          <label className="label" htmlFor="tpl-qr">QR yang dipakai</label>
          <select id="tpl-qr" className="input" value={qrId} onChange={(e) => setQrId(e.target.value)}>
            {options.map((o) => <option key={o.id} value={o.id}>{o.businessName ? `${o.businessName} · ` : ""}{o.publicToken}</option>)}
          </select>
          {sel && sel.status !== "ACTIVE" && (
            <p className="mt-2 flex flex-wrap items-center gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-200">
              <StatusBadge status={sel.status} />
              {sel.status === "UNACTIVATED" ? "QR belum diaktivasi pemilik; pelanggan yang scan belum diarahkan ke Google." : "QR sedang nonaktif; pelanggan yang scan tidak diarahkan ke Google."}
            </p>
          )}
        </div>

        <div><span className="label">Ukuran</span><Seg value={size} onChange={setSize} options={(Object.keys(SIZES) as SizeKey[]).map((k) => ({ value: k, label: SIZES[k].label, hint: SIZES[k].hint }))} /></div>
        <div><span className="label">Gaya</span><Seg value={style} onChange={setStyle} options={(Object.keys(STYLES) as StyleKey[]).map((k) => ({ value: k, label: STYLES[k] }))} /></div>
        <div>
          <span className="label">Warna</span>
          <div className="flex gap-2.5">
            {(Object.keys(THEMES) as ThemeKey[]).map((k) => (
              <button key={k} type="button" title={THEMES[k].label} aria-label={THEMES[k].label} aria-pressed={color === k} onClick={() => setColor(k)}
                className={`size-8 cursor-pointer rounded-full ring-offset-2 transition ${color === k ? "ring-2 ring-slate-900" : "ring-1 ring-slate-200 hover:ring-slate-400"}`} style={{ background: THEMES[k].main }} />
            ))}
          </div>
        </div>

        <div className="space-y-3 border-t border-slate-100 pt-5">
          {size !== "sticker" && (
            <>
              <div><label className="label" htmlFor="tpl-headline">Judul</label><input id="tpl-headline" className="input" maxLength={60} value={headline} onChange={(e) => setHeadline(e.target.value)} /></div>
              <div><label className="label" htmlFor="tpl-sub">Teks pendukung</label><textarea id="tpl-sub" className="input min-h-16 resize-y" maxLength={120} value={sub} onChange={(e) => setSub(e.target.value)} /></div>
            </>
          )}
          <div><label className="label" htmlFor="tpl-cta">Ajakan di bawah QR</label><input id="tpl-cta" className="input" maxLength={50} value={cta} onChange={(e) => setCta(e.target.value)} /></div>
          <div><label className="label" htmlFor="tpl-name">Nama bisnis</label><input id="tpl-name" className="input" maxLength={50} placeholder={sel?.businessName ?? "Nama bisnis Anda"} value={nameOverride} onChange={(e) => setNameOverride(e.target.value)} /></div>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700"><input type="checkbox" className="size-4 accent-[var(--color-brand-600)]" checked={showName} onChange={(e) => setShowName(e.target.checked)} />Tampilkan nama bisnis</label>
          {size !== "sticker" && <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700"><input type="checkbox" className="size-4 accent-[var(--color-brand-600)]" checked={steps} onChange={(e) => setSteps(e.target.checked)} />Tampilkan 3 langkah</label>}
        </div>

        <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-5">
          <button type="button" className="btn flex-1" onClick={() => window.print()}><IconPrinter className="size-4" />Cetak template</button>
          {sel && <a className="btn-ghost" href={`/api/qr/download?id=${sel.id}&fmt=png`}><IconDownload className="size-4" />QR saja</a>}
        </div>
        <p className="text-xs leading-relaxed text-slate-500">Di dialog cetak: margin <b>Tidak ada</b>, aktifkan <b>Background graphics</b>, skala <b>100%</b>. Kode QR sengaja tetap hitam-putih supaya mudah discan.</p>
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
