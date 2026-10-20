"use client";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { IconCheck, IconCopy, IconPrinter } from "./icons";

export function CopyButton({ text, label = "Salin URL", className = "btn-ghost" }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button" className={className} onClick={async () => { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); }}>
      {done ? <IconCheck className="size-4 text-emerald-600" /> : <IconCopy className="size-4" />}
      {done ? "Tersalin" : label}
    </button>
  );
}
export function PrintButton() {
  return <button type="button" className="btn-ghost" onClick={() => window.print()}><IconPrinter className="size-4" />Cetak QR</button>;
}

export function Spinner({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
    </svg>
  );
}
// tombol submit untuk <form action={serverAction}>: otomatis disabled + spinner selama proses
export function SubmitButton({ children, className, pendingText }: { children: React.ReactNode; className?: string; pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending && <Spinner className="size-3.5" />}
      {pending ? (pendingText ?? children) : children}
    </button>
  );
}
