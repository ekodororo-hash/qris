"use client";
import { useState, useTransition } from "react";
import { createQr } from "./actions";
import { CopyButton } from "@/components/buttons";
export function CreateQr() {
  const [r, setR] = useState<{ url: string; pin: string; id: string } | null>(null);
  const [pending, start] = useTransition();
  return (
    <div className="card">
      <button className="btn" disabled={pending} onClick={() => start(async () => setR(await createQr()))}>{pending ? "Membuat…" : "+ Buat QR baru"}</button>
      {r && (
        <div className="mt-4 space-y-2 text-sm">
          <p><b>URL:</b> {r.url}</p>
          <p><b>PIN aktivasi:</b> <code className="rounded bg-neutral-100 px-2 py-1 text-base">{r.pin}</code></p>
          <p className="text-amber-700">PIN hanya ditampilkan sekali. Berikan ke pemilik secara terpisah dari QR.</p>
          <div className="flex gap-2"><CopyButton text={r.pin} /><a className="btn-ghost" href={`/admin/qr/${r.id}`}>Detail & download</a></div>
        </div>
      )}
    </div>
  );
}
