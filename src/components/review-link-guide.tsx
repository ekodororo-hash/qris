// Panduan mengambil tautan Google Review. Tanpa state, jadi aman dipakai di server maupun client component.
const STEPS_PROFIL = [
  <>Buka Profil Bisnis Google Anda di <b>komputer</b>: cari nama bisnis di Google saat masuk dengan akun pengelola, atau buka <a href="https://business.google.com" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-600 underline">business.google.com</a>.</>,
  <>Pilih <b>Baca ulasan</b> (Read reviews), lalu <b>Dapatkan lebih banyak ulasan</b> (Get more reviews). Nama tombolnya bisa sedikit berbeda, cari ikon bagikan.</>,
  <>Klik <b>Salin</b> pada bagian tautan ulasan. Bentuknya biasanya <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">https://g.page/r/…/review</code>.</>,
  <>Tempel ke kolom <b>Tautan Google Review</b>, lalu simpan.</>,
];

export function ReviewLinkGuide({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group rounded-xl border border-slate-200 bg-slate-50/70 text-sm text-slate-700">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-medium text-slate-800 [&::-webkit-details-marker]:hidden">
        Cara mendapatkan tautan Google Review
        <svg className="size-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </summary>
      <div className="space-y-4 border-t border-slate-200 px-4 py-4">
        <section>
          <h3 className="font-semibold text-slate-900">Cara 1: lewat Profil Bisnis Google (disarankan)</h3>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5">
            {STEPS_PROFIL.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </section>
        <section>
          <h3 className="font-semibold text-slate-900">Cara 2: belum punya akses pengelola Profil Bisnis</h3>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5">
            <li>Buka <a href="https://developers.google.com/maps/documentation/places/web-service/place-id" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-600 underline">Google Place ID Finder</a>, cari bisnis Anda, lalu salin <b>Place ID</b> (diawali <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">ChIJ</code>).</li>
            <li>Tempelkan ke bentuk ini, ganti <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">PLACE_ID</code> dengan Place ID Anda:
              <code className="mt-1.5 block break-all rounded-lg bg-white px-3 py-2 text-xs ring-1 ring-slate-200">https://search.google.com/local/writereview?placeid=PLACE_ID</code>
            </li>
          </ol>
        </section>
        <p className="rounded-lg bg-white px-3 py-2.5 text-xs leading-relaxed text-slate-600 ring-1 ring-slate-200">
          <b>Cek dulu sebelum disimpan:</b> buka tautannya di HP. Yang muncul harus formulir ulasan (pilihan bintang), bukan sekadar halaman bisnis di Google Maps.
        </p>
      </div>
    </details>
  );
}
