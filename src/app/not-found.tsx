import Link from "next/link";
import { IconQr } from "@/components/icons";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-3 p-6 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-slate-100 text-slate-400"><IconQr className="size-7" /></span>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">Halaman tidak ditemukan</h1>
      <p className="text-slate-500">Tautan atau QR ini tidak valid.</p>
      <Link href="/" className="btn-ghost mt-2">Ke beranda</Link>
    </main>
  );
}
