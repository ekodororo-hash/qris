"use client";
import { useActionState } from "react";
import { activate } from "./actions";
import { AuthShell } from "@/components/auth-shell";
import { PasswordInput } from "@/components/password-input";
import { AddressSearch } from "@/components/address-search";

type Field = [name: string, label: string, type: string, full?: boolean, placeholder?: string];
const GROUPS: { title: string; fields: Field[] }[] = [
  { title: "Informasi bisnis", fields: [
    ["businessName", "Nama bisnis", "text", false, "Contoh: Kopi Senja"],
    ["ownerName", "Nama pemilik", "text", false, "Nama lengkap pemilik"],
    ["phone", "Nomor WhatsApp", "tel", false, "08123456789"],
    ["email", "Email untuk masuk ke dashboard", "email", false, "nama@email.com"],
    ["address", "Alamat bisnis", "address", true],
    ["googleReviewUrl", "Tautan Google Review", "url", true, "https://g.page/r/..."],
  ] },
  { title: "Keamanan akun", fields: [
    ["password", "Kata sandi (minimal 8 karakter)", "password"],
    ["pin", "PIN aktivasi", "password"],
  ] },
];

export function ActivationForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(activate, null);
  return (
    <AuthShell wide noLogo title="Aktivasi QR" desc="Lengkapi data bisnis Anda untuk mengaktifkan QR. Setelah aktif, QR akan terhubung secara permanen ke bisnis Anda.">
      <form action={action} className="card space-y-5 p-5 shadow-xl shadow-slate-900/5 sm:p-6">
        <input type="hidden" name="token" value={token} />
        {GROUPS.map((g, i) => (
          <fieldset key={g.title} className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
            <legend className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900"><span className="grid size-6 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">{i + 1}</span>{g.title}</legend>
            {g.fields.map(([n, l, t, full, ph]) => t === "address" ? (
              <div key={n} className="sm:col-span-2"><label className="label" htmlFor="address">{l}</label><AddressSearch id="address" defaultValue={state?.values?.address ?? ""} defaultMapsUrl={state?.values?.googleMapsUrl ?? ""} /></div>
            ) : (
              <label key={n} className={full ? "block sm:col-span-2" : "block"}><span className="label">{l}</span>{t === "password"
                ? <PasswordInput name={n} required defaultValue={state?.values?.[n] ?? ""} inputMode={n === "pin" ? "numeric" : undefined} />
                : <input name={n} type={t} required placeholder={ph} className="input" defaultValue={state?.values?.[n] ?? ""} />}</label>
            ))}
          </fieldset>
        ))}
        {state?.error && <p role="alert" className="rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 ring-1 ring-rose-200">{state.error}</p>}
        <button className="btn w-full py-2.5" disabled={pending}>{pending ? "Memproses…" : "Aktifkan QR"}</button>
      </form>
    </AuthShell>
  );
}
