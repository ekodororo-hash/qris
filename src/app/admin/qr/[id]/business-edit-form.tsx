"use client";
import { useState, useTransition } from "react";
import { Spinner } from "@/components/buttons";
import { AddressSearch } from "@/components/address-search";
import { updateBusinessByAdmin } from "../../actions";

type B = { businessName: string; ownerName: string; phone: string; address: string; googleMapsUrl: string; googleReviewUrl: string };
const FIELDS: [Exclude<keyof B, "googleMapsUrl">, string, string][] = [
  ["businessName", "Nama toko / bisnis", "text"], ["ownerName", "Nama pemilik", "text"], ["phone", "Nomor WhatsApp (08…)", "tel"],
  ["address", "Alamat bisnis", "text"], ["googleReviewUrl", "Google Review URL", "url"],
];

export function BusinessEditForm({ qrId, b }: { qrId: string; b: B }) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState<{ ok?: boolean; error?: string } | null>(null);
  const [pending, start] = useTransition();
  if (!open) return <div className="mt-5 border-t border-slate-100 pt-5"><button type="button" className="btn-ghost" onClick={() => { setMsg(null); setOpen(true); }}>Edit data bisnis</button>{msg?.ok && <span className="ml-3 text-sm text-emerald-700">Tersimpan.</span>}</div>;
  return (
    <form className="mt-5 space-y-4 border-t border-slate-100 pt-5" onSubmit={(e) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      start(async () => { const r = await updateBusinessByAdmin(fd); setMsg(r); if (r.ok) setOpen(false); });
    }}>
      <input type="hidden" name="id" value={qrId} />
      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map(([n, l, t]) => n === "address"
          ? <div key={n} className="sm:col-span-2"><label className="label" htmlFor="admin-address">{l}</label><AddressSearch id="admin-address" defaultValue={b.address} defaultMapsUrl={b.googleMapsUrl} /></div>
          : <label key={n} className="block"><span className="label">{l}</span><input name={n} type={t} required defaultValue={b[n]} className="input" /></label>)}
      </div>
      {msg?.error && <p role="alert" className="rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 ring-1 ring-rose-200">{msg.error}</p>}
      <div className="flex gap-2">
        <button className="btn" disabled={pending}>{pending && <Spinner />}{pending ? "Menyimpan…" : "Simpan"}</button>
        <button type="button" className="btn-ghost" disabled={pending} onClick={() => setOpen(false)}>Batal</button>
      </div>
    </form>
  );
}
