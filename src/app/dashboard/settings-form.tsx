"use client";
import { useActionState } from "react";
import { updateBusiness } from "./actions";
type B = { businessName: string; description: string | null; logoUrl: string | null; googleMapsUrl: string; googleReviewUrl: string };
export function SettingsForm({ b }: { b: B }) {
  const [s, action, pending] = useActionState(updateBusiness, null);
  const f = (n: keyof B, l: string, t = "text") => (<label className="block text-sm"><span className="mb-1 block text-neutral-600">{l}</span><input name={n} type={t} defaultValue={b[n] ?? ""} className="input" /></label>);
  return (
    <form action={action} className="card space-y-3">
      <h2 className="font-semibold">Pengaturan bisnis</h2>
      {f("businessName", "Nama toko")}{f("description", "Deskripsi singkat")}{f("logoUrl", "URL logo (https)", "url")}{f("googleMapsUrl", "Link Google Maps", "url")}{f("googleReviewUrl", "Link Google Review", "url")}
      {s?.error && <p className="text-sm text-red-600">{s.error}</p>}{s?.ok && <p className="text-sm text-green-700">Tersimpan. QR fisik tidak berubah.</p>}
      <button className="btn" disabled={pending}>{pending ? "Menyimpan…" : "Simpan"}</button>
    </form>
  );
}
