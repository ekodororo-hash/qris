"use client";
import { useActionState } from "react";
import { changeEmail, changePassword } from "./actions";
import { PasswordInput } from "@/components/password-input";

const Msg = ({ s, ok }: { s: { error?: string; ok?: boolean } | null; ok: string }) => (
  <>
    {s?.error && <p role="alert" className="rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 ring-1 ring-rose-200">{s.error}</p>}
    {s?.ok && <p className="rounded-xl bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700 ring-1 ring-emerald-200">{ok}</p>}
  </>
);

export function EmailForm({ email }: { email: string }) {
  const [s, action, pending] = useActionState(changeEmail, null);
  return (
    <form action={action} className="card space-y-4">
      <div>
        <h2 className="text-base font-semibold">Email</h2>
        <p className="mt-0.5 text-sm text-slate-500">Email ini dipakai untuk masuk. Saat ini: <b className="text-slate-700">{email}</b></p>
      </div>
      <label className="block"><span className="label">Email baru</span><input name="email" type="email" required autoComplete="email" className="input" defaultValue={s?.values?.email ?? ""} /></label>
      <label className="block"><span className="label">Kata sandi saat ini</span><PasswordInput name="password" required /></label>
      <Msg s={s} ok="Email berhasil diubah." />
      <button className="btn" disabled={pending}>{pending ? "Menyimpan…" : "Ubah email"}</button>
    </form>
  );
}

export function PasswordForm() {
  const [s, action, pending] = useActionState(changePassword, null);
  return (
    <form action={action} className="card space-y-4">
      <div>
        <h2 className="text-base font-semibold">Kata sandi</h2>
        <p className="mt-0.5 text-sm text-slate-500">Minimal 8 karakter.</p>
      </div>
      <label className="block"><span className="label">Kata sandi saat ini</span><PasswordInput name="current" required /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block"><span className="label">Kata sandi baru</span><PasswordInput name="next" required defaultValue={s?.values?.next ?? ""} /></label>
        <label className="block"><span className="label">Ulangi kata sandi baru</span><PasswordInput name="confirm" required defaultValue={s?.values?.confirm ?? ""} /></label>
      </div>
      <Msg s={s} ok="Kata sandi berhasil diubah." />
      <button className="btn" disabled={pending}>{pending ? "Menyimpan…" : "Ubah kata sandi"}</button>
    </form>
  );
}
