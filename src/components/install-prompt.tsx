"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { IconClose, IconDownload } from "./icons";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };
type Ctx = { canInstall: boolean; ios: boolean; manual: boolean; install: () => Promise<void> };

const KEY = "pwa-installable"; // Chrome pernah bilang "boleh diinstal" di browser ini dan aplikasi belum terpasang
const MANUAL = "Buka menu browser (⋮), lalu pilih “Instal aplikasi” atau “Tambahkan ke layar utama”.";
const remember = (on: boolean) => { try { if (on) localStorage.setItem(KEY, "1"); else localStorage.removeItem(KEY); } catch {} };

const InstallCtx = createContext<Ctx>({ canInstall: false, ios: false, manual: false, install: async () => {} });
export const useInstall = () => useContext(InstallCtx);

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

// Menyimpan status instal untuk seluruh aplikasi, menampilkan kotak ajakan instal,
// dan menyediakan useInstall() untuk tombol instal permanen (mis. di halaman login).
export function InstallProvider({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [evt, setEvt] = useState<InstallEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [known, setKnown] = useState(false);   // diingat dari kunjungan sebelumnya, supaya reload tidak menghilangkan kartu
  const [manual, setManual] = useState(false); // tombol ditekan tapi sinyal belum ada: tampilkan petunjuk manual
  const [dismissed, setDismissed] = useState(false); // hanya di memori: hilang saat halaman dimuat ulang / browser ditutup

  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") navigator.serviceWorker.register("/sw.js").catch(() => {});
    if (isStandalone()) { setInstalled(true); remember(false); return; }
    if (isIos()) { setIos(true); return; }
    // sinyal instal ditangkap lebih awal oleh skrip kecil di <head> (lihat layout.tsx) dan disimpan di window.__bip,
    // supaya tidak terlewat kalau Chrome mengirimnya sebelum komponen ini siap mendengarkan
    const w = window as unknown as { __bip?: InstallEvent };
    try { if (localStorage.getItem(KEY) === "1") setKnown(true); } catch {}
    const got = () => { if (w.__bip) { setEvt(w.__bip); setKnown(true); remember(true); } };
    got();
    const onReady = got;
    const onInstalled = () => { setInstalled(true); remember(false); };
    window.addEventListener("bip-ready", onReady);
    window.addEventListener("appinstalled", onInstalled);
    return () => { window.removeEventListener("bip-ready", onReady); window.removeEventListener("appinstalled", onInstalled); };
  }, []);

  const canInstall = !installed && (!!evt || known || ios);
  const install = async () => {
    if (!evt) { setManual(true); return; }
    await evt.prompt();
    const { outcome } = await evt.userChoice;
    setEvt(null); // event hanya bisa dipakai sekali
    if (outcome === "accepted") { setInstalled(true); remember(false); }
  };

  // tanpa kotak di halaman QR pelanggan (/q/...) dan di /login (di sana sudah ada tombol instal sendiri)
  const showBanner = canInstall && !dismissed && !path.startsWith("/q/") && !path.startsWith("/login");

  return (
    <InstallCtx.Provider value={{ canInstall, ios, manual, install }}>
      {children}
      {showBanner && (
        <div role="dialog" aria-label="Instal aplikasi" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md print:hidden">
          <InstallCard ios={ios} desc={manual ? MANUAL : undefined} onInstall={install} onClose={() => setDismissed(true)} />
        </div>
      )}
    </InstallCtx.Provider>
  );
}

// kartu instal (tampilan sama untuk kotak ajakan dan untuk tombol permanen di halaman login)
function InstallCard({ ios, desc, onInstall, onClose }: { ios: boolean; desc?: string; onInstall: () => void; onClose?: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xl shadow-slate-900/10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icon-192.png" alt="" className="size-11 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">Instal ReviewQR</p>
        <p className="text-xs leading-snug text-slate-500">
          {desc ?? (ios ? "Ketuk tombol Bagikan, lalu pilih “Tambah ke Layar Utama”." : "Buka lebih cepat dari layar utama, tanpa mengetik alamat.")}
        </p>
      </div>
      {!ios && <button type="button" onClick={onInstall} className="btn btn-sm shrink-0"><IconDownload className="size-3.5" />Instal</button>}
      {onClose && <button type="button" onClick={onClose} aria-label="Tutup" className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"><IconClose className="size-4" /></button>}
    </div>
  );
}

// kartu instal di halaman login: sama seperti banner tapi tanpa tombol X (tidak bisa ditutup).
// Tampil hanya saat browser memberi sinyal instal; hilang kalau aplikasi sudah terpasang.
export function InstallButton() {
  const { canInstall, ios, manual, install } = useInstall();
  if (!canInstall) return null;
  return <InstallCard ios={ios} desc={manual ? MANUAL : undefined} onInstall={install} />;
}
