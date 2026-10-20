import Link from "next/link";
export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-sm font-medium text-blue-600">ReviewQR</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Satu QR permanen untuk halaman ulasan Google Anda.</h1>
      <p className="mt-5 text-lg text-neutral-600">Cetak sekali, tempel di meja atau kasir. Ubah nama toko atau tautan ulasan kapan saja tanpa mengganti QR. Semua pelanggan mendapat akses yang sama, dan ulasan selalu diselesaikan sendiri oleh pelanggan di Google.</p>
      <div className="mt-8 flex gap-3"><Link href="/login" className="btn">Masuk</Link></div>
    </main>
  );
}
