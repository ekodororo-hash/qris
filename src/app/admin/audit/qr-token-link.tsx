"use client";
import { useState } from "react";
import { QrModal } from "../qr-modal";
import type { QrRow } from "../qr-table";

// token yang bisa diklik -> membuka modal detail QR (sama seperti di Daftar QR)
export function QrTokenLink({ row }: { row: QrRow }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="cursor-pointer font-mono text-[13px] font-medium text-brand-600 hover:underline" onClick={() => setOpen(true)}>{row.publicToken}</button>
      {open && <QrModal row={row} onClose={() => setOpen(false)} />}
    </>
  );
}
