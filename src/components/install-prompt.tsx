"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { IconClose, IconDownload } from "./icons";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };
type Ctx = { canInstall: boolean; ios: boolean; install: () => Promise<void> };

const InstallCtx = createContext<Ctx>({ canInstall: false, ios: false, install: async () => {} });
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
  const [dismissed, setDismissed] = useState(false); // hanya di memori: hilang saat halaman dimuat ulang / browser ditutup

  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") navigator.serviceWorker.register("/sw.js").catch(() => {});
    if (isStandalone()) { setInstalled(true); return; }
    if (isIos()) { setIos(true); return; }
    const onPrompt = (e: Event) => { e.preventDefault(); setEvt(e as InstallEvent); };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => { window.removeEventListener("beforeinstallprompt", onPrompt); window.removeEventListener("appinstalled", onInstalled); };
  }, []);

  const canInstall = !installed && (!!evt || ios);
  const install = async () => {
    if (!evt) return;
    await evt.prompt();
    const { outcome } = await evt.userChoice;
    setEvt(null); // event hanya bisa dipakai sekali
    if (outcome === "accepted") setInstalled(true);
  };

  // halaman QR untuk pelanggan (/q/...) tidak perlu ajakan instal
  const showBanner = canInstall && !dismissed && !path.startsWith("/q/");

  return (
    <InstallCtx.Provider value={{ canInstall, ios, install }}>
      {children}
      {showBanner && (
        <div role="dialog" aria-label="Instal aplikasi" className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xl shadow-slate-900/10 print:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon-192.png" alt="" className="size-11 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">Instal ReviewQR</p>
            <p className="text-xs leading-snug text-slate-500">
              {ios ? "Ketuk tombol Bagikan, lalu pilih “Tambah ke Layar Utama”." : "Buka lebih cepat dari layar utama, tanpa mengetik alamat."}
            </p>
          </div>
          {!ios && <button type="button" onClick={install} className="btn btn-sm shrink-0"><IconDownload className="size-3.5" />Instal</button>}
          <button type="button" onClick={() => setDismissed(true)} aria-label="Tutup" className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"><IconClose className="size-4" /></button>
        </div>
      )}
    </InstallCtx.Provider>
  );
}

// tombol instal permanen: tetap ada walau kotak ajakan sudah ditutup; hilang kalau aplikasi sudah terpasang
export function InstallButton() {
  const { canInstall, ios, install } = useInstall();
  const [hint, setHint] = useState(false);
  if (!canInstall) return null;
  return (
    <div className="space-y-2">
      <button type="button" className="btn-ghost w-full" onClick={() => (ios ? setHint((v) => !v) : install())}>
        <IconDownload className="size-4" />Instal aplikasi
      </button>
      {ios && hint && <p className="text-center text-xs text-slate-500">Ketuk tombol Bagikan, lalu pilih “Tambah ke Layar Utama”.</p>}
    </div>
  );
}
