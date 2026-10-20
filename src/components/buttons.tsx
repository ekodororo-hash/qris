"use client";
import { useState } from "react";
import { IconCheck, IconCopy, IconPrinter } from "./icons";

export function CopyButton({ text, label = "Salin URL" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button" className="btn-ghost" onClick={async () => { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); }}>
      {done ? <IconCheck className="size-4 text-emerald-600" /> : <IconCopy className="size-4" />}
      {done ? "Tersalin" : label}
    </button>
  );
}
export function PrintButton() {
  return <button type="button" className="btn-ghost" onClick={() => window.print()}><IconPrinter className="size-4" />Cetak QR</button>;
}
