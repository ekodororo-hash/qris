import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ActivationForm } from "./activation-form";
import { IconGoogleG, IconQr, IconStar, IconStore } from "@/components/icons";

export const dynamic = "force-dynamic";
export default async function QrPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[A-Za-z0-9]{8,32}$/.test(token)) notFound();
  const qr = await prisma.qrCode.findUnique({ where: { publicToken: token }, select: { status: true, business: { select: { businessName: true, description: true, logoUrl: true } } } });
  if (!qr || qr.status === "ARCHIVED") notFound();
  if (qr.status === "DISABLED" || (qr.status === "ACTIVE" && !qr.business)) return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-2 p-6 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-slate-100 text-slate-400"><IconQr className="size-7" /></span>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">QR tidak aktif</h1>
      <p className="text-slate-500">QR ini sedang dinonaktifkan. Silakan hubungi pihak bisnis.</p>
    </main>);
  if (qr.status === "UNACTIVATED") return <ActivationForm token={token} />;

  const b = qr.business!;
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-5 py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-[#e8f0fe] to-transparent" />
      <div className="card relative w-full max-w-sm space-y-5 overflow-hidden p-7 pt-8 text-center shadow-xl shadow-slate-900/5">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 flex h-1.5"><span className="flex-1 bg-[#4285F4]" /><span className="flex-1 bg-[#EA4335]" /><span className="flex-1 bg-[#FBBC05]" /><span className="flex-1 bg-[#34A853]" /></div>
        {b.logoUrl
          ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={b.logoUrl} alt="" className="mx-auto size-20 rounded-2xl object-cover shadow-md" />
          : <span className="mx-auto grid size-20 place-items-center rounded-2xl bg-gradient-to-br from-[#4285F4] to-[#1a73e8] text-white shadow-md"><IconStore className="size-9" /></span>}
        <p className="text-sm font-semibold text-slate-500">{b.businessName}</p>
        <h1 className="text-balance text-3xl font-bold tracking-tight">Bagaimana pengalaman Anda?</h1>
        <div className="flex justify-center gap-1 text-[#FBBC05]">{[0, 1, 2, 3, 4].map((i) => <IconStar key={i} className="size-6" />)}</div>
        <p className="text-sm leading-relaxed text-slate-500">{b.description || "Ulasan Anda membantu kami dan pelanggan lain. Anda akan diarahkan ke Google untuk menulisnya."}</p>
        <a href={`/q/${token}/go`} className="btn w-full gap-2.5 !bg-[#1a73e8] py-3.5 text-base !shadow-[#1a73e8]/25 hover:!bg-[#1765cc]"><span className="grid size-6 place-items-center rounded-full bg-white"><IconGoogleG className="size-4" /></span>Berikan Review di Google</a>
      </div>
      <p className="mt-6 text-xs text-slate-400">Didukung ReviewQR</p>
    </main>
  );
}
