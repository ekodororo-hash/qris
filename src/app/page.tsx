import Link from "next/link";
import { FauxQr } from "@/components/faux-qr";
import { IconArrowRight, IconCheck, IconPointer, IconRefresh, IconScan, IconShield, IconStar, IconStore, IconQr, Logo } from "@/components/icons";

const STEPS = [
  { n: "01", title: "Admin membuat QR", desc: "Setiap QR mendapat token permanen dan PIN aktivasi yang diberikan terpisah ke pemilik bisnis." },
  { n: "02", title: "Pemilik mengaktivasi", desc: "Scan QR, isi data bisnis dan tautan Google Review, lalu masukkan PIN. Selesai dalam hitungan menit." },
  { n: "03", title: "Cetak dan tempel", desc: "Unduh QR sebagai PNG atau SVG, taruh di meja atau kasir, dan pantau scan dari dashboard." },
];

const FEATURES = [
  { icon: IconQr, title: "QR sekali cetak", desc: "URL di QR tidak pernah berubah. Cetakan lama tetap berfungsi selamanya.", wide: true },
  { icon: IconRefresh, title: "Ubah kapan saja", desc: "Ganti nama toko, logo, atau tautan Google Review tanpa mencetak ulang.", wide: false },
  { icon: IconScan, title: "Statistik scan & klik", desc: "Lihat berapa pelanggan yang scan dan lanjut ke halaman ulasan Google.", wide: false },
  { icon: IconShield, title: "Privasi pelanggan terjaga", desc: "Kami hanya mencatat waktu scan. Tanpa IP dan tanpa data pribadi pelanggan.", wide: true },
];

const FAQ = [
  { q: "Apakah QR bisa diganti tujuannya setelah dicetak?", a: "Bisa. QR hanya menyimpan satu URL tetap. Tujuan ulasan diatur dari dashboard, jadi Anda tidak perlu mencetak ulang." },
  { q: "Apakah ulasan pelanggan dijamin bagus?", a: "Tidak. Semua pelanggan mendapat akses yang sama, dan ulasan selalu ditulis sendiri oleh pelanggan langsung di Google." },
  { q: "Data apa yang disimpan dari pelanggan?", a: "Hanya waktu scan dan klik tombol review. Kami tidak menyimpan IP maupun data pribadi pelanggan." },
  { q: "Bagaimana cara mendapatkan QR?", a: "QR dibuat oleh admin. Pemilik bisnis menerima PIN aktivasi, lalu mengaktifkannya sendiri lewat halaman QR." },
];

function PhoneMock() {
  return (
    <div className="relative mx-auto w-[17rem]">
      <div className="rounded-[2.6rem] border-[7px] border-slate-900 bg-white p-5 shadow-2xl shadow-brand-900/25">
        <div className="mx-auto mb-5 h-1.5 w-16 rounded-full bg-slate-200" />
        <div className="flex flex-col items-center text-center">
          <span className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 text-white shadow-lg shadow-orange-400/30"><IconStore className="size-8" /></span>
          <p className="mt-3 text-xs font-medium text-slate-500">Kopi Senja</p>
          <p className="mt-1 text-lg font-bold leading-snug tracking-tight">Bagaimana pengalaman Anda?</p>
          <div className="mt-3 flex gap-0.5 text-amber-400">{[0, 1, 2, 3, 4].map((i) => <IconStar key={i} className="size-5" />)}</div>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">Ulasan Anda membantu kami dan pelanggan lain.</p>
          <div className="btn mt-5 w-full text-xs">Berikan Review di Google</div>
        </div>
        <div className="h-5" />
      </div>
      <div className="absolute -left-14 top-24 hidden w-32 rotate-[-6deg] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-900/10 sm:block">
        <FauxQr className="text-slate-900" />
        <p className="mt-2 text-center text-[10px] font-semibold text-slate-500">Scan untuk review</p>
      </div>
      <div className="absolute -right-10 bottom-16 hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-xl shadow-slate-900/10 sm:flex">
        <span className="grid size-8 place-items-center rounded-full bg-emerald-100 text-emerald-600"><IconPointer className="size-4" /></span>
        <div><p className="text-[11px] text-slate-500">Klik ke Google</p><p className="text-sm font-bold leading-none">+ 1 hari ini</p></div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="overflow-x-clip">
      <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/75 backdrop-blur-lg">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/"><Logo /></Link>
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#cara-kerja" className="hover:text-slate-900">Cara kerja</a>
            <a href="#fitur" className="hover:text-slate-900">Fitur</a>
            <a href="#faq" className="hover:text-slate-900">FAQ</a>
          </div>
          <Link href="/login" className="btn">Masuk</Link>
        </nav>
      </header>

      <section className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 left-1/2 h-[34rem] w-[60rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-brand-200/70 via-brand-100/40 to-transparent blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        </div>
        <div className="mx-auto grid max-w-6xl items-center gap-16 px-5 pb-24 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:pt-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3 py-1 text-xs font-semibold text-brand-700 shadow-sm"><span className="size-1.5 rounded-full bg-brand-500" />QR permanen untuk ulasan Google</span>
            <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">Satu QR untuk <span className="bg-gradient-to-r from-brand-600 to-violet-500 bg-clip-text text-transparent">semua ulasan</span> bisnis Anda.</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">Cetak sekali, tempel di meja atau kasir. Ubah nama toko atau tautan ulasan kapan saja tanpa mengganti QR. Ulasan selalu diselesaikan sendiri oleh pelanggan di Google.</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/login" className="btn px-6 py-3 text-base">Masuk ke dashboard <IconArrowRight className="size-4" /></Link>
              <a href="#cara-kerja" className="btn-ghost px-6 py-3 text-base">Lihat cara kerja</a>
            </div>
            <ul className="mt-10 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              {["Tanpa cetak ulang", "Tanpa data pribadi pelanggan", "Unduh PNG & SVG", "Statistik scan dan klik"].map((t) => (
                <li key={t} className="flex items-center gap-2"><span className="grid size-5 place-items-center rounded-full bg-emerald-100 text-emerald-600"><IconCheck className="size-3" strokeWidth={3} /></span>{t}</li>
              ))}
            </ul>
          </div>
          <PhoneMock />
        </div>
      </section>

      <section id="cara-kerja" className="scroll-mt-20 border-y border-slate-200/70 bg-white py-24">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-sm font-semibold text-brand-600">Cara kerja</p>
          <h2 className="mt-2 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">Tiga langkah, langsung siap dipakai.</h2>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="group relative rounded-2xl border border-slate-200 bg-slate-50/60 p-7 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-slate-900/5">
                <span className="text-4xl font-extrabold text-brand-200 transition group-hover:text-brand-500">{s.n}</span>
                <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="fitur" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
        <p className="text-sm font-semibold text-brand-600">Fitur</p>
        <h2 className="mt-2 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">Sederhana untuk pemilik, rapi untuk admin.</h2>
        <div className="mt-14 grid gap-5 md:grid-cols-5">
          {FEATURES.map((f) => (
            <div key={f.title} className={`card p-7 ${f.wide ? "md:col-span-3" : "md:col-span-2"}`}>
              <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-600"><f.icon className="size-5" /></span>
              <h3 className="mt-5 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="scroll-mt-20 border-t border-slate-200/70 bg-white py-24">
        <div className="mx-auto max-w-3xl px-5">
          <p className="text-sm font-semibold text-brand-600">FAQ</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Pertanyaan yang sering muncul</h2>
          <div className="mt-10 divide-y divide-slate-200 rounded-2xl border border-slate-200">
            {FAQ.map((f) => (
              <details key={f.q} className="group px-6 py-5 open:bg-slate-50/70">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 pt-8">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 px-8 py-16 text-center text-white">
          <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl" />
          <h2 className="relative mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">Mulai kumpulkan ulasan Google lebih mudah hari ini.</h2>
          <p className="relative mx-auto mt-4 max-w-lg text-brand-100">Sudah punya QR dan PIN dari admin? Scan QR untuk aktivasi, atau masuk untuk membuka dashboard.</p>
          <Link href="/login" className="relative mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-brand-700 shadow-lg transition hover:bg-brand-50">Masuk <IconArrowRight className="size-4" /></Link>
        </div>
      </section>

      <footer className="border-t border-slate-200/70 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-slate-500 sm:flex-row">
          <Logo />
          <p>© {new Date().getFullYear()} ReviewQR. Ulasan ditulis sendiri oleh pelanggan di Google.</p>
        </div>
      </footer>
    </div>
  );
}
