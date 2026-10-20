import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ActivationForm } from "./activation-form";

export const dynamic = "force-dynamic";
export default async function QrPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[A-Za-z0-9]{8,32}$/.test(token)) notFound();
  const qr = await prisma.qrCode.findUnique({ where: { publicToken: token }, select: { id: true, status: true, business: { select: { businessName: true, description: true, logoUrl: true } } } });
  if (!qr || qr.status === "ARCHIVED") notFound();
  if (qr.status === "DISABLED" || (qr.status === "ACTIVE" && !qr.business)) return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-2 p-6 text-center"><h1 className="text-2xl font-semibold">QR tidak aktif</h1><p className="text-neutral-600">QR ini sedang dinonaktifkan. Silakan hubungi pihak bisnis.</p></main>);
  if (qr.status === "UNACTIVATED") return <ActivationForm token={token} />;

  await prisma.scanEvent.create({ data: { qrCodeId: qr.id, eventType: "SCAN" } });
  const b = qr.business!;
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-5 p-6 text-center">
      {b.logoUrl && /* eslint-disable-next-line @next/next/no-img-element */ <img src={b.logoUrl} alt="" className="h-20 w-20 rounded-2xl object-cover" />}
      <p className="text-sm font-medium text-neutral-500">{b.businessName}</p>
      <h1 className="text-3xl font-semibold tracking-tight">Bagaimana pengalaman Anda?</h1>
      <p className="text-neutral-600">{b.description || "Ulasan Anda membantu kami dan pelanggan lain. Anda akan diarahkan ke Google untuk menulisnya."}</p>
      <a href={`/q/${token}/go`} className="btn w-full py-3 text-base">Berikan Review di Google</a>
    </main>
  );
}
