import Link from "next/link";
import { FauxQr } from "@/components/faux-qr";
import { IconArrowRight, IconCheck, IconDownload, IconRefresh, IconShield, IconStar, IconStore, IconQr, IconGoogleG, Logo } from "@/components/icons";

const STEPS = [
  { n: "01", title: "Terima QR Anda", desc: "Setiap bisnis mendapat QR dengan token permanen dan PIN aktivasi khusus." },
  { n: "02", title: "Aktivasi dalam hitungan menit", desc: "Scan QR, lengkapi data bisnis dan tautan ulasan Google, lalu masukkan PIN." },
  { n: "03", title: "Tempel dan mulai", desc: "Taruh QR di meja atau kasir — ulasan pelanggan langsung masuk ke Google." },
];

const FEATURES = [
  { icon: IconQr, title: "QR sekali cetak", desc: "URL di QR tidak pernah berubah. Cetakan lama tetap berfungsi selamanya.", wide: true },
  { icon: IconRefresh, title: "Ubah kapan saja", desc: "Ganti nama bisnis, logo, atau tautan ulasan Google tanpa perlu mencetak ulang.", wide: false },
  { icon: IconDownload, title: "Siap cetak", desc: "Unduh QR dalam format PNG atau SVG beresolusi tinggi untuk meja, kasir, atau stiker.", wide: false },
  { icon: IconShield, title: "Privasi pelanggan terjaga", desc: "Kami tidak mencatat data pelanggan — tanpa IP, tanpa data pribadi.", wide: true },
];

const FAQ = [
  { q: "Apakah tujuan QR bisa diganti setelah dicetak?", a: "Bisa. QR hanya menyimpan satu URL tetap, sementara tautan ulasan diatur dari dashboard — jadi Anda tidak perlu mencetak ulang." },
  { q: "Apakah ulasan pelanggan dijamin bagus?", a: "Tidak. Semua pelanggan mendapat akses yang sama, dan ulasan selalu ditulis sendiri oleh pelanggan langsung di Google." },
  { q: "Data apa yang disimpan dari pelanggan?", a: "Tidak ada. Kami tidak menyimpan IP maupun data pribadi pelanggan." },
  { q: "Bagaimana cara mendapatkan QR?", a: "QR disertai token permanen dan PIN aktivasi khusus untuk bisnis Anda. Setelah menerimanya, Anda tinggal mengaktifkannya sendiri melalui halaman QR." },
];

function IconWhatsApp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

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
          <div className="btn mt-5 w-full gap-2.5 !bg-[#1a73e8] py-3 text-xs !shadow-[#1a73e8]/25"><span className="grid size-5 place-items-center rounded-full bg-white"><IconGoogleG className="size-3.5" /></span>Berikan Review di Google</div>
        </div>
        <div className="h-5" />
      </div>
      <div className="absolute -left-14 top-24 hidden w-32 rotate-[-6deg] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-900/10 sm:block">
        <FauxQr className="text-slate-900" />
        <p className="mt-2 text-center text-[10px] font-semibold text-slate-500">Scan untuk ulasan</p>
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
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm"><span className="size-1.5 rounded-full bg-emerald-500" />QR permanen untuk ulasan Google</span>
            <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">Satu QR untuk <span className="text-[#4285F4]">semua ulasan</span> bisnis Anda.</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">Cetak sekali, tempel di meja atau kasir. Ubah nama bisnis atau tautan ulasan kapan saja tanpa mengganti QR. Ulasan selalu ditulis sendiri oleh pelanggan di Google.</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/login" className="inline-flex items-center gap-2 rounded-xl bg-[#4285F4] px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-[#1a73e8]">Masuk ke dashboard <IconArrowRight className="size-4" /></Link>
              <a href="#cara-kerja" className="btn-ghost px-6 py-3 text-base">Lihat cara kerja</a>
            </div>
            <ul className="mt-10 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              {["Tanpa cetak ulang", "Tanpa data pribadi pelanggan", "Unduh PNG & SVG", "Dashboard untuk pemilik bisnis"].map((t) => (
                <li key={t} className="flex items-center gap-2"><span className="grid size-5 place-items-center rounded-full bg-emerald-100 text-emerald-600"><IconCheck className="size-3" strokeWidth={3} /></span>{t}</li>
              ))}
            </ul>
          </div>
          <PhoneMock />
        </div>
      </section>

      <section id="cara-kerja" className="scroll-mt-20 border-y border-slate-200/70 bg-white py-24">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-sm font-semibold text-slate-500">Cara kerja</p>
          <h2 className="mt-2 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">Siap pakai dalam tiga langkah.</h2>
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
        <p className="text-sm font-semibold text-slate-500">Fitur</p>
        <h2 className="mt-2 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">Sederhana untuk pemilik, rapi untuk admin.</h2>
        <div className="mt-14 grid gap-5 md:grid-cols-5">
          {FEATURES.map((f) => (
            <div key={f.title} className={`card p-7 ${f.wide ? "md:col-span-3" : "md:col-span-2"}`}>
              <span className="grid size-11 place-items-center rounded-xl bg-slate-100 text-slate-900"><f.icon className="size-5" /></span>
              <h3 className="mt-5 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="scroll-mt-20 border-t border-slate-200/70 bg-white py-24">
        <div className="mx-auto max-w-3xl px-5">
          <p className="text-sm font-semibold text-slate-500">FAQ</p>
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
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white px-8 py-16 text-center shadow-sm">
          <div className="absolute inset-x-0 top-0 flex h-2"><span className="flex-1 bg-[#4285F4]" /><span className="flex-1 bg-[#EA4335]" /><span className="flex-1 bg-[#FBBC05]" /><span className="flex-1 bg-[#34A853]" /></div>
          <h2 className="relative mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">Mulai kumpulkan ulasan Google lebih mudah hari ini.</h2>
          <p className="relative mx-auto mt-4 max-w-lg text-slate-600">Sudah punya QR dan PIN aktivasi? Scan QR untuk aktivasi, atau masuk untuk membuka dashboard.</p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/login" className="inline-flex items-center gap-2 rounded-xl bg-[#4285F4] px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-[#1a73e8]">Masuk <IconArrowRight className="size-4" /></Link>
            <a href="https://wa.me/62895379994528" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-[#1ebe5b]"><IconWhatsApp className="size-5" />Hubungi via WhatsApp</a>
          </div>
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
