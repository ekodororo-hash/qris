"use client";
import { useActionState } from "react";
import { activate } from "./actions";
const F: [string, string, string][] = [
  ["businessName", "Nama toko / bisnis", "text"], ["ownerName", "Nama pemilik", "text"], ["phone", "Nomor WhatsApp (08…)", "tel"],
  ["address", "Alamat bisnis", "text"], ["googleMapsUrl", "Link Google Maps bisnis", "url"], ["googleReviewUrl", "Google Review URL", "url"],
  ["email", "Email (untuk login dashboard)", "email"], ["password", "Password dashboard (min. 8)", "password"],
  ["pin", "PIN aktivasi dari admin", "password"], ["pinConfirm", "Konfirmasi PIN", "password"],
];
export function ActivationForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(activate, null);
  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold">Aktifkan QR</h1>
      <p className="mb-5 mt-1 text-sm text-neutral-600">Isi data bisnis Anda. QR ini akan terhubung permanen ke bisnis Anda.</p>
      <form action={action} className="card space-y-3">
        <input type="hidden" name="token" value={token} />
        {F.map(([n, l, t]) => (<label key={n} className="block text-sm"><span className="mb-1 block text-neutral-600">{l}</span><input name={n} type={t} required className="input" inputMode={n.startsWith("pin") ? "numeric" : undefined} /></label>))}
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button className="btn w-full" disabled={pending}>{pending ? "Memproses…" : "Aktifkan QR"}</button>
      </form>
    </main>
  );
}
