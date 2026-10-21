// Panduan mengambil tautan Google Review. Tanpa state, jadi aman dipakai di server maupun client component.
const A = "font-medium text-brand-600 underline";

export function ReviewLinkGuide({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group rounded-xl border border-slate-200 bg-slate-50/70 text-sm text-slate-700">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-medium text-slate-800 [&::-webkit-details-marker]:hidden">
        Cara mendapatkan tautan Google Review
        <svg className="size-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </summary>
      <div className="space-y-4 border-t border-slate-200 px-4 py-4">
        <section>
          <h3 className="font-semibold text-slate-900">Cara 1: lewat Google Maps (termudah)</h3>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5">
            <li>Buka Google Maps, lalu cari bisnis Anda sampai halaman bisnisnya terbuka.</li>
            <li>Di HP: tekan <b>Bagikan</b>, lalu <b>Salin</b>. Di komputer: salin tautan dari kolom alamat browser.</li>
            <li>Tempel ke kolom <b>Tautan Google Review</b>, lalu simpan. Tautan Maps otomatis diubah jadi tautan review.</li>
          </ol>
        </section>
        <section>
          <h3 className="font-semibold text-slate-900">Cara 2: lewat Profil Bisnis Google</h3>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5">
            <li>Buka Profil Bisnis Anda di <b>komputer</b> lewat <a href="https://business.google.com" target="_blank" rel="noopener noreferrer" className={A}>business.google.com</a>.</li>
            <li>Pilih <b>Baca ulasan</b>, lalu <b>Dapatkan lebih banyak ulasan</b> (nama tombol bisa sedikit berbeda, cari ikon bagikan).</li>
            <li>Klik <b>Salin</b>, lalu tempel ke kolom di atas.</li>
          </ol>
        </section>
        <p className="rounded-lg bg-white px-3 py-2.5 text-xs leading-relaxed text-slate-600 ring-1 ring-slate-200">
          <b>Cek dulu:</b> setelah disimpan, buka halaman QR Anda dan tekan tombol review. Yang muncul harus formulir ulasan (pilihan bintang).
        </p>
      </div>
    </details>
  );
}
