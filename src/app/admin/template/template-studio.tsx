"use client";
import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
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

const G = { blue: "#4285F4", red: "#EA4335", yellow: "#FBBC05", green: "#34A853" };
const QUAD = `linear-gradient(${G.blue},${G.blue}) 0 0/50% 50% no-repeat,linear-gradient(${G.red},${G.red}) 100% 0/50% 50% no-repeat,linear-gradient(${G.green},${G.green}) 0 100%/50% 50% no-repeat,linear-gradient(${G.yellow},${G.yellow}) 100% 100%/50% 50% no-repeat`;
const STRIPE = `linear-gradient(${G.blue} 0 25%,${G.red} 25% 50%,${G.yellow} 50% 75%,${G.green} 75%)`;
const RAINBOW = `linear-gradient(135deg,${G.red},${G.yellow},${G.green},${G.blue})`;

const DIAG = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'><rect width='100' height='100' fill='${G.red}'/><polygon points='0,48 100,34 100,56 0,72' fill='${G.green}'/><polygon points='100,34 100,76 40,62 62,50' fill='${G.yellow}'/><polygon points='0,0 100,0 100,34 0,48' fill='${G.blue}'/></svg>`)}")`;

type Texts = { kicker: string; headline: string; cta: string };
const TEMPLATES = {
  blok: { label: "Blok warna", bg: QUAD, def: { kicker: "Bantu Kami Dengan", headline: "Google Review", cta: "Scan QR" } },
  tepi: { label: "Rate", bg: "#fff", def: { kicker: "", headline: "Beri Penilaian Anda", cta: "Scan QR Code" } },
  pelangi: { label: "Pelangi", bg: RAINBOW, def: { kicker: "Jadilah Bagian Dari Cerita Kami!", headline: "Scan QR Code Ini", cta: "Beri Kami Ulasan" } },
  diagonal: { label: "Diagonal", bg: `${DIAG} center/100% 100% no-repeat`, def: { kicker: "Beri ulasan kami di", headline: "Google", cta: "Scan untuk review" } },
  bersih: { label: "Bersih", bg: "#fff", def: { kicker: "Ulas kami di", headline: "Google", cta: "Scan untuk memberi ulasan" } },
} as const;
type TplKey = keyof typeof TEMPLATES;

type Cfg = { size: SizeKey; tpl: TplKey; t: Texts };

function Wordmark({ size }: { size: string }) {
  const c = [G.blue, G.red, G.yellow, G.blue, G.green, G.red];
  return <span style={{ fontSize: size, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1 }}>{"Google".split("").map((ch, i) => <span key={i} style={{ color: c[i] }}>{ch}</span>)}</span>;
}

function Stars({ size, gap = "0.8cqw" }: { size: string; gap?: string }) {
  return <div style={{ display: "flex", gap, color: G.yellow, fontSize: size }}>{[0, 1, 2, 3, 4].map((i) => <IconStar key={i} />)}</div>;
}

function Qr({ svg, width, border = true }: { svg: string; width: string; border?: boolean }) {
  return (
    <div style={{ width, background: "#fff", padding: "2cqw", borderRadius: "3cqw", boxSizing: "border-box", border: border ? "0.5cqw solid #e2e8f0" : undefined }}>
      <div className="[&_svg]:block [&_svg]:h-auto [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
}

const col = { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" } as const;

function Body({ cfg, svg }: { cfg: Cfg; svg: string }) {
  const { tpl, t } = cfg;
  const sticker = cfg.size === "sticker";
  const ink = "#0f172a";

  if (sticker) {
    return (
      <div style={{ ...col, height: "100%", gap: "2.5cqw", padding: "5cqw" }}>
        {tpl === "tepi" ? <Wordmark size="9cqw" /> : <IconGoogleG style={{ fontSize: "10cqw" }} />}
        <Stars size="5cqw" />
        <Qr svg={svg} width="50cqw" />
        <p style={{ margin: 0, fontSize: "4.4cqw", fontWeight: 700, color: ink }}>{t.cta}</p>
      </div>
    );
  }

  if (tpl === "diagonal") {
    return (
      <div style={{ ...col, height: "100%", justifyContent: "space-between", padding: "10cqw 8cqw 9cqw", color: "#fff" }}>
        <div>
          <p style={{ margin: 0, fontSize: "7cqw", fontWeight: 700, lineHeight: 1.1 }}>{t.kicker}</p>
          <h2 style={{ margin: "1cqw 0 0", fontSize: "17cqw", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em" }}>{t.headline}</h2>
        </div>
        <div style={{ position: "relative", marginTop: "9cqw" }}>
          <div style={{ position: "absolute", top: "-9cqw", left: "50%", transform: "translateX(-50%)", width: "18cqw", height: "18cqw", borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", boxShadow: "0 0 0 1.4cqw rgba(255,255,255,.35)", zIndex: 1 }}>
            <IconGoogleG style={{ fontSize: "11cqw" }} />
          </div>
          <div style={{ background: "#fff", borderRadius: "6cqw", padding: "9cqw 4cqw 4cqw", boxShadow: "0 3cqw 6cqw rgba(0,0,0,.2)" }}>
            <Qr svg={svg} width="52cqw" border={false} />
          </div>
        </div>
        <p style={{ margin: 0, fontSize: "5.6cqw", fontWeight: 700 }}>{t.cta}</p>
      </div>
    );
  }

  if (tpl === "blok") {
    return (
      <div style={{ ...col, height: "100%", position: "relative", padding: "16cqw 8cqw 8cqw", gap: "3cqw" }}>
        <div style={{ position: "absolute", top: "-11cqw", left: "50%", transform: "translateX(-50%)", width: "22cqw", height: "22cqw", borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", boxShadow: "0 0 0 1.6cqw rgba(255,255,255,.9)" }}>
          <IconGoogleG style={{ fontSize: "14cqw" }} />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: "4.4cqw", fontWeight: 500, color: "#475569" }}>{t.kicker}</p>
          <h2 style={{ margin: "0.5cqw 0 0", fontSize: "9cqw", fontWeight: 800, lineHeight: 1.1, textWrap: "balance" }}>{t.headline}</h2>
        </div>
        <Stars size="5.4cqw" />
        <Qr svg={svg} width="52cqw" border={false} />
        <p style={{ margin: 0, fontSize: "3.2cqw", fontWeight: 600, color: "#64748b" }}>{t.cta}</p>
      </div>
    );
  }

  if (tpl === "tepi") {
    return (
      <div style={{ ...col, height: "100%", padding: "9cqw 12cqw 8cqw", gap: "3cqw" }}>
        <Wordmark size="15cqw" />
        <h2 style={{ margin: 0, fontSize: "6.2cqw", fontWeight: 600, lineHeight: 1.15 }}>{t.headline}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "2cqw" }}>
          <span style={{ fontSize: "7cqw", fontWeight: 500 }}>5.0</span>
          <Stars size="7cqw" />
        </div>
        <p style={{ margin: "1cqw 0 0", fontSize: "5cqw", fontWeight: 500 }}>{t.cta}</p>
        <Qr svg={svg} width="58cqw" border={false} />
      </div>
    );
  }

  if (tpl === "pelangi") {
    return (
      <div style={{ ...col, height: "100%", padding: "8cqw", gap: "2.6cqw" }}>
        <p style={{ margin: 0, fontSize: "5.2cqw", fontWeight: 800, lineHeight: 1.2, textWrap: "balance" }}>{t.kicker}</p>
        <IconGoogleG style={{ fontSize: "14cqw" }} />
        <h2 style={{ margin: 0, fontSize: "7.2cqw", fontWeight: 700, lineHeight: 1.1 }}>{t.headline}</h2>
        <Qr svg={svg} width="50cqw" />
        <Stars size="6cqw" />
        <p style={{ margin: 0, fontSize: "4.4cqw", fontWeight: 700 }}>{t.cta}</p>
      </div>
    );
  }

  return (
    <div style={{ ...col, height: "100%", padding: "8cqw", gap: "2.4cqw" }}>
      <IconGoogleG style={{ fontSize: "24cqw" }} />
      <p style={{ margin: "1cqw 0 0", fontSize: "5cqw", fontWeight: 500, color: "#475569" }}>{t.kicker}</p>
      <h2 style={{ margin: 0, fontSize: "12cqw", fontWeight: 600, lineHeight: 1, color: "#5f6368" }}>{t.headline}</h2>
      <Stars size="7cqw" />
      <Qr svg={svg} width="46cqw" border={false} />
      <p style={{ margin: 0, fontSize: "3.6cqw", fontWeight: 600, color: "#64748b" }}>{t.cta}</p>
    </div>
  );
}

const STEPS = ["Pindai kode QR di sisi depan menggunakan kamera ponsel.", "Lengkapi data bisnis, alamat email, dan kata sandi.", "Masukkan PIN aktivasi, kemudian kirim."];

// Sisi belakang (gaya Google): cara aktivasi + token kecil di bawah untuk mencocokkan PIN. PIN sengaja tidak dicetak.
function BackBody({ token }: { token: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: "none", height: "2.6cqw", background: `linear-gradient(90deg,${G.blue} 0 25%,${G.red} 25% 50%,${G.yellow} 50% 75%,${G.green} 75%)` }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "8cqw 9cqw 7cqw", gap: "5cqw" }}>
        <h2 style={{ margin: 0, fontSize: "6.4cqw", fontWeight: 800, color: "#202124" }}>Panduan Aktivasi</h2>
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "4.5cqw" }}>
          {STEPS.map((x, i) => (
            <li key={i} style={{ fontSize: "4.3cqw", fontWeight: 500, lineHeight: 1.3, color: "#202124", paddingLeft: "1.15em", textIndent: "-1.15em" }}>{i + 1}. {x}</li>
          ))}
        </ol>
        <div style={{ flex: "1 0 auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2cqw", textAlign: "center" }}>
          <IconGoogleG style={{ fontSize: "12cqw" }} />
          <p style={{ margin: 0, fontSize: "4.6cqw", fontWeight: 700, color: "#202124" }}>Google Review</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2.4cqw", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: "2.6cqw", fontWeight: 700, letterSpacing: "0.18em", color: "#5f6368" }}>KODE QR</p>
          <p style={{ margin: 0, fontFamily: "ui-monospace, monospace", fontSize: "5.4cqw", fontWeight: 700, color: "#202124", whiteSpace: "nowrap" }}>{token}</p>
          <div style={{ width: "100%", height: "0.3cqw", background: "#e2e8f0", margin: "1cqw 0" }} />
          <p style={{ margin: 0, fontSize: "3cqw", lineHeight: 1.45, color: "#5f6368", textWrap: "balance" }}>Setelah aktif, QR di sisi depan langsung mengarahkan pelanggan ke Google Review Anda.</p>
        </div>
      </div>
    </div>
  );
}

function Sheet({ cfg, svg, side = "front", token = "", breakAfter = false }: { cfg: Cfg; svg: string; side?: "front" | "back"; token?: string; breakAfter?: boolean }) {
  const { w, h } = SIZES[cfg.size];
  const { tpl } = cfg;
  const back = side === "back";
  return (
    <>
      {/* ukuran cetak fisik; tinggi dikurangi 0,5mm agar tidak melahirkan halaman kosong */}
      <style>{`@media print{@page{size:${w}mm ${h}mm;margin:0}.tpl-sheet{width:${w}mm!important;height:${h - 0.5}mm!important;max-width:none!important;border-radius:0!important;box-shadow:none!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}}`}</style>
      <div className={`tpl-sheet relative w-full overflow-hidden rounded-2xl shadow-xl shadow-slate-900/10${back ? " ring-1 ring-slate-200 print:ring-0" : ""}${breakAfter ? " print:break-after-page" : ""}`} style={{ containerType: "inline-size", aspectRatio: `${w} / ${h}`, background: back ? "#fff" : TEMPLATES[tpl].bg, color: "#0f172a" }}>
        {back ? <BackBody token={token} /> : (<>
        {tpl === "tepi" && (
          <>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3.5cqw", background: STRIPE }} />
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "3.5cqw", background: STRIPE }} />
          </>
        )}
        <div style={{ height: "100%", boxSizing: "border-box", padding: tpl === "blok" ? "17cqw 8cqw 8cqw" : tpl === "pelangi" || (tpl === "diagonal" && cfg.size === "sticker") ? "2.4cqw" : 0 }}>
          <div style={{ height: "100%", boxSizing: "border-box", background: tpl === "diagonal" && cfg.size !== "sticker" ? "transparent" : "#fff", borderRadius: tpl === "blok" ? "7cqw" : tpl === "pelangi" || (tpl === "diagonal" && cfg.size === "sticker") ? "5cqw" : 0, border: tpl === "bersih" ? "0.4cqw solid #e5e7eb" : undefined, position: "relative", overflow: tpl === "blok" ? "visible" : "hidden" }}>
            <Body cfg={cfg} svg={svg} />
          </div>
        </div>
        </>)}
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

function TplPicker({ value, onChange }: { value: TplKey; onChange: (v: TplKey) => void }) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {(Object.keys(TEMPLATES) as TplKey[]).map((k) => (
        <button key={k} type="button" aria-pressed={value === k} onClick={() => onChange(k)}
          className={`cursor-pointer rounded-xl border p-1 text-center transition ${value === k ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/15" : "border-slate-200 bg-white hover:border-slate-300"}`}>
          <span className="relative mx-auto block aspect-[3/4] w-full overflow-hidden rounded-md ring-1 ring-slate-200" style={{ background: TEMPLATES[k].bg, padding: k === "blok" ? "10%" : k === "pelangi" ? "6%" : 0, boxSizing: "border-box" }}>
            {k === "tepi" && <><span className="absolute inset-y-0 left-0 w-[10%]" style={{ background: STRIPE }} /><span className="absolute inset-y-0 right-0 w-[10%]" style={{ background: STRIPE }} /></>}
            <span className={`block h-full w-full ${k === "diagonal" ? "" : "bg-white"}`} style={{ borderRadius: k === "blok" ? "18%" : k === "pelangi" ? "12%" : 0 }}>
              <span className="mx-auto mt-[22%] block size-[22%] rounded-full" style={{ background: k === "diagonal" ? "#fff" : G.blue }} />
              <span className={`mx-auto mt-[12%] block aspect-square w-[44%] ${k === "diagonal" ? "bg-white ring-1 ring-slate-900/20" : "bg-slate-800"}`} />
            </span>
          </span>
          <span className="mt-1 block text-[10px] font-semibold leading-tight text-slate-600">{TEMPLATES[k].label}</span>
        </button>
      ))}
    </div>
  );
}

export function TemplateStudio({ options, initialId, owner = false }: { options: QrOption[]; initialId?: string; owner?: boolean }) {
  const first = options.find((o) => o.id === initialId) ?? options.find((o) => o.status === "ACTIVE") ?? options[0];
  const [qrId, setQrId] = useState(first?.id ?? "");
  const [size, setSize] = useState<SizeKey>("a6");
  const [tpl, setTpl] = useState<TplKey>("blok");
  const [edits, setEdits] = useState<Partial<Record<TplKey, Partial<Texts>>>>({});
  const [svg, setSvg] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState("");
  const [sides, setSides] = useState<"1" | "2">("2");
  const sheetRef = useRef<HTMLDivElement>(null);

  const sel = options.find((o) => o.id === qrId);
  const token = sel?.publicToken;
  const twoSided = !owner && size !== "sticker" && sides === "2";
  const t: Texts = { ...TEMPLATES[tpl].def, ...edits[tpl] };
  const setT = (k: keyof Texts, v: string) => setEdits((e) => ({ ...e, [tpl]: { ...e[tpl], [k]: v } }));

  useEffect(() => {
    if (!token) return;
    let alive = true;
    const url = `${process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin}/q/${token}`;
    import("qrcode").then((m) => m.default.toString(url, { type: "svg", margin: 1, errorCorrectionLevel: "M" })).then((s) => alive && setSvg(s));
    return () => { alive = false; };
  }, [token]);

  const cfg: Cfg = { size, tpl, t };

  // simpan seluruh desain (bukan QR saja) sebagai PNG resolusi cetak 300 dpi; dua sisi = dua file
  async function saveImage() {
    const nodes = Array.from(sheetRef.current?.querySelectorAll<HTMLElement>(".tpl-sheet") ?? []);
    if (!nodes.length || !svg) return;
    setSaving(true);
    setSaveErr("");
    try {
      const targetPx = (SIZES[size].w / 25.4) * 300;
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const dataUrl = await toPng(node, {
          pixelRatio: targetPx / node.offsetWidth,
          backgroundColor: "#ffffff",
          style: { borderRadius: "0", boxShadow: "none" },
        });
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `template-${tpl}-${size}-${token}${nodes.length > 1 ? (i === 0 ? "-depan" : "-belakang") : ""}.png`;
        a.click();
        if (i < nodes.length - 1) await new Promise((r) => setTimeout(r, 400));
      }
    } catch {
      setSaveErr("Gagal menyimpan gambar. Coba lagi, atau pakai Cetak template lalu simpan sebagai PDF.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)] print:block">
      <div className="card space-y-4 print:hidden">
        {!owner && (
        <div>
          <label className="label" htmlFor="tpl-qr">QR yang dipakai</label>
          <select id="tpl-qr" className="input" value={qrId} onChange={(e) => setQrId(e.target.value)}>
            {options.map((o) => <option key={o.id} value={o.id}>{o.publicToken}</option>)}
          </select>
          {sel && sel.status === "ACTIVE" && (
            <p className="mt-2 flex flex-wrap items-center gap-2 rounded-xl bg-emerald-50 p-2.5 text-xs text-emerald-800 ring-1 ring-emerald-200">
              <StatusBadge status={sel.status} />
              {sel.businessName ? `QR milik ${sel.businessName} sudah aktif.` : "QR sudah aktif."} Pelanggan yang scan langsung diarahkan ke Google.
            </p>
          )}
          {sel && sel.status === "UNACTIVATED" && (
            <p className="mt-2 flex flex-wrap items-center gap-2 rounded-xl bg-sky-50 p-2.5 text-xs text-sky-800 ring-1 ring-sky-200">
              <StatusBadge status={sel.status} />
              Normal untuk QR baru: cetak dulu, pemilik bisnis mengaktifkannya belakangan lewat scan pertama.
            </p>
          )}
          {sel && sel.status === "DISABLED" && (
            <p className="mt-2 flex flex-wrap items-center gap-2 rounded-xl bg-amber-50 p-2.5 text-xs text-amber-800 ring-1 ring-amber-200">
              <StatusBadge status={sel.status} />
              QR sedang nonaktif; pelanggan yang scan tidak diarahkan ke Google.
            </p>
          )}
        </div>
        )}

        <div><span className="label">Ukuran</span><Seg value={size} onChange={setSize} options={(Object.keys(SIZES) as SizeKey[]).map((k) => ({ value: k, label: SIZES[k].label, hint: SIZES[k].hint }))} /></div>
        {!owner && size !== "sticker" && (
          <div><span className="label">Sisi cetak</span><Seg value={sides} onChange={setSides} options={[{ value: "1", label: "Satu sisi" }, { value: "2", label: "Dua sisi", hint: "belakang: kode & aktivasi" }]} /></div>
        )}
        <div><span className="label">Template</span><TplPicker value={tpl} onChange={setTpl} /></div>

        <details className="group rounded-xl border border-slate-200 open:bg-slate-50/50">
          <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2.5 text-sm font-semibold text-slate-700">
            Ubah teks
            <span className="text-xs font-normal text-slate-400 group-open:hidden">Opsional</span>
          </summary>
          <div className="space-y-2.5 border-t border-slate-200 p-3">
            {size !== "sticker" && (
              <>
                <div><label className="label" htmlFor="tpl-kicker">Teks kecil</label><input id="tpl-kicker" className="input" maxLength={60} value={t.kicker} onChange={(e) => setT("kicker", e.target.value)} /></div>
                <div><label className="label" htmlFor="tpl-headline">Judul</label><input id="tpl-headline" className="input" maxLength={40} value={t.headline} onChange={(e) => setT("headline", e.target.value)} /></div>
              </>
            )}
            <div><label className="label" htmlFor="tpl-cta">Ajakan di sekitar QR</label><input id="tpl-cta" className="input" maxLength={50} value={t.cta} onChange={(e) => setT("cta", e.target.value)} /></div>
          </div>
        </details>

        <div className="space-y-2 border-t border-slate-100 pt-4">
          <button type="button" className="btn w-full" onClick={() => window.print()}><IconPrinter className="size-4" />Cetak template</button>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" className="btn-ghost" disabled={!svg || saving} onClick={saveImage}><IconDownload className="size-4" />{saving ? "Menyimpan..." : "Simpan gambar"}</button>
            {sel ? <a className="btn-ghost" href={`/api/qr/download?id=${sel.id}&fmt=png`}><IconDownload className="size-4" />QR saja</a> : <span />}
          </div>
        </div>
        {saveErr && <p className="text-xs text-rose-600">{saveErr}</p>}
        <details className="text-xs text-slate-500">
          <summary className="cursor-pointer font-medium">Tips cetak</summary>
          <p className="mt-1.5 leading-relaxed">Di dialog cetak: margin <b>Tidak ada</b>, aktifkan <b>Background graphics</b>, skala <b>100%</b>. QR sengaja tetap hitam-putih supaya mudah discan.</p>
        </details>
      </div>

      <div className="rounded-2xl bg-slate-100 p-4 sm:p-8 print:bg-transparent print:p-0">
        <div ref={sheetRef} className={`mx-auto w-full print:m-0 print:block print:max-w-none ${twoSided ? "grid max-w-[52rem] gap-6 sm:grid-cols-2" : size === "sticker" ? "max-w-[20rem]" : "max-w-[24rem]"}`}>
          <Sheet cfg={cfg} svg={svg} breakAfter={twoSided} />
          {twoSided && token && <div className="print:mt-0"><Sheet cfg={cfg} svg={svg} side="back" token={token} /></div>}
        </div>
        <p className="mt-5 text-center text-xs text-slate-500 print:hidden">Pratinjau · {twoSided ? "depan (kiri) & belakang (kanan) · " : ""}ukuran cetak asli {SIZES[size].hint}</p>
      </div>
    </div>
  );
}
