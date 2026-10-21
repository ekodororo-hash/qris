"use client";
import { useActionState, useState } from "react";
import { updateBusiness } from "./actions";
import { LogoUpload } from "./logo-upload";
import { AddressSearch } from "@/components/address-search";
import { ReviewLinkGuide } from "@/components/review-link-guide";

type B = { businessName: string; description: string | null; logoUrl: string | null; address: string | null; googleMapsUrl: string | null; googleReviewUrl: string | null };
export function SettingsForm({ b }: { b: B }) {
  const [s, action, pending] = useActionState(updateBusiness, null);
  const [startOpen] = useState(!b.googleReviewUrl); // terbuka hanya saat awal, supaya tidak menutup sendiri setelah menyimpan
  const f = (n: "businessName" | "description", l: string) => (
    <label className="block"><span className="label">{l}</span><input name={n} type="text" defaultValue={b[n] ?? ""} className="input" /></label>
  );
  return (
    <details id="pengaturan" className="card group p-0" open={startOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 [&::-webkit-details-marker]:hidden">
        <div>
          <h2 className="text-base font-semibold">Pengaturan bisnis</h2>
          <p className="mt-0.5 text-sm text-slate-500">Nama, deskripsi, logo, alamat, dan tautan review.</p>
        </div>
        <svg className="size-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </summary>
      <form action={action} className="space-y-5 border-t border-slate-100 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {f("businessName", "Nama toko")}{f("description", "Deskripsi singkat")}
      </div>
      <LogoUpload defaultValue={b.logoUrl ?? ""} />
      <div>
        <label className="label" htmlFor="settings-address">Alamat bisnis</label>
        <AddressSearch id="settings-address" required={false} defaultValue={b.address ?? ""} defaultMapsUrl={b.googleMapsUrl ?? ""} />
      </div>
      <div className="space-y-3">
        <label className="block"><span className="label">Tautan Google Review</span>
          <input name="googleReviewUrl" type="url" placeholder="https://g.page/r/.../review" defaultValue={b.googleReviewUrl ?? ""} className="input" />
        </label>
        <ReviewLinkGuide defaultOpen={startOpen} />
      </div>
      {s?.error && <p role="alert" className="rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 ring-1 ring-rose-200">{s.error}</p>}
      {s?.ok && <p className="rounded-xl bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700 ring-1 ring-emerald-200">Perubahan berhasil disimpan.</p>}
      <button className="btn" disabled={pending}>{pending ? "Menyimpan…" : "Simpan perubahan"}</button>
      </form>
    </details>
  );
}
