"use client";
import { useActionState } from "react";
import { activate } from "./actions";
import { AuthShell } from "@/components/auth-shell";
import { PasswordInput } from "@/components/password-input";

type Field = [name: string, label: string, type: string];
const GROUPS: { title: string; fields: Field[] }[] = [
  { title: "Data bisnis", fields: [
    ["businessName", "Nama toko / bisnis", "text"], ["ownerName", "Nama pemilik", "text"], ["phone", "Nomor WhatsApp (08…)", "tel"],
    ["address", "Alamat bisnis", "text"], ["googleMapsUrl", "Link Google Maps bisnis", "url"], ["googleReviewUrl", "Google Review URL", "url"],
  ] },
  { title: "Akun dashboard", fields: [["email", "Email (untuk login dashboard)", "email"], ["password", "Password dashboard (min. 8)", "password"]] },
  { title: "Verifikasi", fields: [["pin", "PIN aktivasi dari admin", "password"]] },
];

export function ActivationForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(activate, null);
  return (
    <AuthShell wide title="Aktifkan QR" desc="Isi data bisnis Anda. QR ini akan terhubung permanen ke bisnis Anda.">
      <form action={action} className="card space-y-7 p-6 shadow-xl shadow-slate-900/5">
        <input type="hidden" name="token" value={token} />
        {GROUPS.map((g, i) => (
          <fieldset key={g.title} className="space-y-4">
            <legend className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-900"><span className="grid size-6 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">{i + 1}</span>{g.title}</legend>
            {g.fields.map(([n, l, t]) => (
              <label key={n} className="block"><span className="label">{l}</span>{t === "password"
                ? <PasswordInput name={n} required defaultValue={state?.values?.[n] ?? ""} inputMode={n === "pin" ? "numeric" : undefined} />
                : <input name={n} type={t} required className="input" defaultValue={state?.values?.[n] ?? ""} />}</label>
            ))}
          </fieldset>
        ))}
        {state?.error && <p role="alert" className="rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 ring-1 ring-rose-200">{state.error}</p>}
        <button className="btn w-full py-3" disabled={pending}>{pending ? "Memproses…" : "Aktifkan QR"}</button>
      </form>
    </AuthShell>
  );
}
