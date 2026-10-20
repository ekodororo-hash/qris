"use client";
import { useActionState } from "react";
import { updateBusiness } from "./actions";
import { LogoUpload } from "./logo-upload";

type B = { businessName: string; description: string | null; logoUrl: string | null; googleReviewUrl: string };
export function SettingsForm({ b }: { b: B }) {
  const [s, action, pending] = useActionState(updateBusiness, null);
  const f = (n: keyof B, l: string, t = "text") => (
    <label className="block"><span className="label">{l}</span><input name={n} type={t} defaultValue={b[n] ?? ""} className="input" /></label>
  );
  return (
    <details className="card group p-0">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 [&::-webkit-details-marker]:hidden">
        <div>
          <h2 className="text-base font-semibold">Pengaturan bisnis</h2>
          <p className="mt-0.5 text-sm text-slate-500">Nama, deskripsi, logo, dan tautan review.</p>
        </div>
        <svg className="size-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </summary>
      <form action={action} className="space-y-5 border-t border-slate-100 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {f("businessName", "Nama toko")}{f("description", "Deskripsi singkat")}
      </div>
      <LogoUpload defaultValue={b.logoUrl ?? ""} />
      {f("googleReviewUrl", "Tautan Google Review", "url")}
      {s?.error && <p role="alert" className="rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 ring-1 ring-rose-200">{s.error}</p>}
      {s?.ok && <p className="rounded-xl bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700 ring-1 ring-emerald-200">Perubahan berhasil disimpan.</p>}
      <button className="btn" disabled={pending}>{pending ? "Menyimpan…" : "Simpan perubahan"}</button>
      </form>
    </details>
  );
}
