"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { IconClose, IconDownload } from "./icons";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };
const KEY = "pwa-install-dismissed";
const HIDE_DAYS = 1;

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const recentlyDismissed = () => {
  try { const t = Number(localStorage.getItem(KEY)); return !!t && Date.now() - t < HIDE_DAYS * 864e5; } catch { return false; }
};

export function InstallPrompt() {
  const path = usePathname();
  const [evt, setEvt] = useState<InstallEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") navigator.serviceWorker.register("/sw.js").catch(() => {});
    if (isStandalone() || recentlyDismissed()) return;
    if (isIos()) { setIos(true); setOpen(true); return; }
    const onPrompt = (e: Event) => { e.preventDefault(); setEvt(e as InstallEvent); setOpen(true); };
    const onInstalled = () => setOpen(false);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => { window.removeEventListener("beforeinstallprompt", onPrompt); window.removeEventListener("appinstalled", onInstalled); };
  }, []);

  // halaman QR untuk pelanggan (/q/...) tidak perlu ajakan instal
  if (!open || path.startsWith("/q/")) return null;

  const dismiss = () => { setOpen(false); try { localStorage.setItem(KEY, String(Date.now())); } catch {} };
  const install = async () => {
    if (!evt) return;
    await evt.prompt();
    const { outcome } = await evt.userChoice;
    setEvt(null);
    if (outcome === "accepted") setOpen(false); else dismiss();
  };

  return (
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
      <button type="button" onClick={dismiss} aria-label="Tutup" className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"><IconClose className="size-4" /></button>
    </div>
  );
}
