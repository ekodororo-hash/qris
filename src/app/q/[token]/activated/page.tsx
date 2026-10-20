import Link from "next/link";
export default function Activated() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-2xl font-semibold">QR berhasil diaktifkan ✓</h1>
      <p className="text-neutral-600">Mulai sekarang QR ini langsung membuka halaman review bisnis Anda. Masuk ke dashboard untuk mengunduh QR dan mengubah pengaturan.</p>
      <Link href="/login" className="btn">Masuk ke dashboard</Link>
    </main>
  );
}
