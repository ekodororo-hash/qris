"use client";
import { useState, useTransition } from "react";
import { Spinner } from "@/components/buttons";
import { addPayment, assignQrs, createSalesperson, savePrice } from "./actions";

type Res = { ok?: boolean; error?: string; assigned?: number };
const Err = ({ m }: { m?: string }) => (m ? <p role="alert" className="rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 ring-1 ring-rose-200">{m}</p> : null);

// pola umum: kirim FormData ke server action, tampilkan error / pesan sukses, kosongkan form bila berhasil
function useSubmit(run: (fd: FormData) => Promise<Res>, okText: (r: Res) => string) {
  const [msg, setMsg] = useState<{ ok?: string; error?: string } | null>(null);
  const [pending, start] = useTransition();
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    start(async () => {
      const r = await run(fd);
      setMsg(r.ok ? { ok: okText(r) } : { error: r.error ?? "Gagal menyimpan." });
      if (r.ok) form.reset();
    });
  };
  return { msg, pending, onSubmit };
}

export function PriceForm({ current }: { current: number | null }) {
  const f = useSubmit(savePrice, () => "Harga setoran tersimpan.");
  return (
    <form onSubmit={f.onSubmit} className="space-y-3">
      <label className="block"><span className="label">Setoran wajib per QR (Rp)</span>
        <input name="price" type="number" inputMode="numeric" min={1} step={1} required defaultValue={current ?? ""} placeholder="mis. 100000" className="input" /></label>
      <p className="text-xs text-slate-500">Harga dikunci saat QR diserahkan ke sales. Mengubahnya hanya berlaku untuk serah terima berikutnya.</p>
      <Err m={f.msg?.error} />
      {f.msg?.ok && <p className="text-sm text-emerald-700">{f.msg.ok}</p>}
      <button className="btn" disabled={f.pending}>{f.pending && <Spinner />}{f.pending ? "Menyimpan…" : "Simpan harga"}</button>
    </form>
  );
}

export function AddSalesForm() {
  const f = useSubmit(createSalesperson, () => "Sales ditambahkan.");
  return (
    <form onSubmit={f.onSubmit} className="space-y-3">
      <label className="block"><span className="label">Nama sales</span>
        <input name="name" type="text" required minLength={2} maxLength={60} placeholder="mis. Budi" className="input" /></label>
      <Err m={f.msg?.error} />
      {f.msg?.ok && <p className="text-sm text-emerald-700">{f.msg.ok}</p>}
      <button className="btn" disabled={f.pending}>{f.pending && <Spinner />}{f.pending ? "Menambah…" : "Tambah sales"}</button>
    </form>
  );
}

export function AssignForm({ salespersonId, available }: { salespersonId: string; available: number }) {
  const f = useSubmit(assignQrs, (r) => `${r.assigned ?? 0} QR diserahkan.`);
  return (
    <form onSubmit={f.onSubmit} className="space-y-3">
      <input type="hidden" name="salespersonId" value={salespersonId} />
      <label className="block"><span className="label">Jumlah QR yang diserahkan</span>
        <input name="count" type="number" inputMode="numeric" min={1} max={100} step={1} required defaultValue={10} className="input" /></label>
      <p className="text-xs text-slate-500">Diambil dari stok QR yang belum aktif dan belum dipegang siapa pun (tersedia: {available}).</p>
      <Err m={f.msg?.error} />
      {f.msg?.ok && <p className="text-sm text-emerald-700">{f.msg.ok}</p>}
      <button className="btn" disabled={f.pending || available === 0}>{f.pending && <Spinner />}{f.pending ? "Memproses…" : "Serahkan QR"}</button>
    </form>
  );
}

export function PaymentForm({ salespersonId, today }: { salespersonId: string; today: string }) {
  const f = useSubmit(addPayment, () => "Setoran dicatat.");
  return (
    <form onSubmit={f.onSubmit} className="space-y-3">
      <input type="hidden" name="salespersonId" value={salespersonId} />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block"><span className="label">Jumlah setoran (Rp)</span>
          <input name="amount" type="number" inputMode="numeric" min={1} step={1} required className="input" /></label>
        <label className="block"><span className="label">Tanggal</span>
          <input name="paidAt" type="date" required defaultValue={today} className="input" /></label>
      </div>
      <label className="block"><span className="label">Catatan (opsional)</span>
        <input name="note" type="text" maxLength={200} placeholder="mis. transfer BCA" className="input" /></label>
      <Err m={f.msg?.error} />
      {f.msg?.ok && <p className="text-sm text-emerald-700">{f.msg.ok}</p>}
      <button className="btn" disabled={f.pending}>{f.pending && <Spinner />}{f.pending ? "Menyimpan…" : "Catat setoran"}</button>
    </form>
  );
}
