"use client";
import { useActionState } from "react";
import { updateBusiness } from "./actions";

type B = { businessName: string; description: string | null; logoUrl: string | null; googleReviewUrl: string };
export function SettingsForm({ b }: { b: B }) {
  const [s, action, pending] = useActionState(updateBusiness, null);
  const f = (n: keyof B, l: string, t = "text") => (
    <label className="block"><span className="label">{l}</span><input name={n} type={t} defaultValue={b[n] ?? ""} className="input" /></label>
  );
  return (
    <form action={action} className="card space-y-4">
      <div><h2 className="text-base font-semibold">Pengaturan bisnis</h2><p className="mt-0.5 text-sm text-slate-500">Perubahan langsung berlaku tanpa mengganti QR fisik.</p></div>
      <div className="grid gap-4 sm:grid-cols-2">
        {f("businessName", "Nama toko")}{f("description", "Deskripsi singkat")}
        {f("logoUrl", "URL logo (https)", "url")}
      </div>
      {f("googleReviewUrl", "Link Google Review", "url")}
      {s?.error && <p role="alert" className="rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 ring-1 ring-rose-200">{s.error}</p>}
      {s?.ok && <p className="rounded-xl bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700 ring-1 ring-emerald-200">Tersimpan. QR fisik tidak berubah.</p>}
      <button className="btn" disabled={pending}>{pending ? "Menyimpan…" : "Simpan perubahan"}</button>
    </form>
  );
}
