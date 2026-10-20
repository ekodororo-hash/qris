"use client";
import { useActionState } from "react";
import { login } from "./actions";
import { AuthShell } from "@/components/auth-shell";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <AuthShell title="Selamat datang kembali" desc="Masuk sebagai admin atau pemilik bisnis.">
      <form action={action} className="card space-y-4 p-6 shadow-xl shadow-slate-900/5">
        <label className="block"><span className="label">Email</span><input name="email" type="email" placeholder="nama@bisnis.com" required className="input" autoComplete="email" /></label>
        <label className="block"><span className="label">Password</span><input name="password" type="password" placeholder="••••••••" required className="input" autoComplete="current-password" /></label>
        {state?.error && <p role="alert" className="rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 ring-1 ring-rose-200">{state.error}</p>}
        <button className="btn w-full py-3" disabled={pending}>{pending ? "Memproses…" : "Masuk"}</button>
      </form>
    </AuthShell>
  );
}
