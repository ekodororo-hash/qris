import Link from "next/link";
import { IconCheck } from "@/components/icons";

export default function Activated() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-3 p-6 text-center">
      <span className="grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50"><IconCheck className="size-8" strokeWidth={3} /></span>
      <h1 className="mt-3 text-2xl font-bold tracking-tight">QR berhasil diaktifkan</h1>
      <p className="text-slate-500">Mulai sekarang QR ini langsung membuka halaman review bisnis Anda. Masuk ke dashboard untuk mengunduh QR dan mengubah pengaturan.</p>
      <Link href="/login" className="btn mt-3 px-6">Masuk ke dashboard</Link>
    </main>
  );
}
