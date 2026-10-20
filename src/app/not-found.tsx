import Link from "next/link";
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-2xl font-semibold">Halaman tidak ditemukan</h1>
      <p className="text-neutral-600">Tautan atau QR ini tidak valid.</p>
      <Link href="/" className="btn-ghost">Ke beranda</Link>
    </main>
  );
}
