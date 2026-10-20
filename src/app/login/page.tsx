"use client";
import { useActionState } from "react";
import { login } from "./actions";
export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center p-6">
      <h1 className="mb-1 text-2xl font-semibold">Masuk</h1>
      <p className="mb-6 text-sm text-neutral-600">Admin dan pemilik bisnis.</p>
      <form action={action} className="card space-y-3">
        <input name="email" type="email" placeholder="Email" required className="input" autoComplete="email" />
        <input name="password" type="password" placeholder="Password" required className="input" autoComplete="current-password" />
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button className="btn w-full" disabled={pending}>{pending ? "Memproses…" : "Masuk"}</button>
      </form>
    </main>
  );
}
