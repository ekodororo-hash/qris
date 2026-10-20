import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic"; // status dicek di server setiap scan

export default async function QrPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[A-Za-z0-9]{8,32}$/.test(token)) notFound();

  const qr = await prisma.qrCode.findUnique({
    where: { publicToken: token },
    select: {
      id: true, status: true,
      business: { select: { businessName: true, description: true, logoUrl: true } },
    },
  });
  if (!qr || qr.status === "ARCHIVED") notFound();                 // Kondisi C: tidak valid
  if (qr.status === "DISABLED") return <div>QR dinonaktifkan</div>; // TODO: halaman error

  if (qr.status === "UNACTIVATED") {
    // Kondisi A: render <ActivationForm token={token} /> (Server Action -> activateQr)
    return <div>TODO: ActivationForm</div>;
  }

  // Kondisi B: catat scan (tanpa IP) lalu tampilkan halaman review
  await prisma.scanEvent.create({ data: { qrCodeId: qr.id, eventType: "SCAN" } });
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-2xl font-semibold">{qr.business!.businessName}</h1>
      <p className="text-lg">Bagaimana pengalaman Anda?</p>
      {/* Tombol -> /q/[token]/go (route handler: catat REVIEW_CLICK, redirect ke googleReviewUrl dari DB) */}
      <a href={`/q/${token}/go`} className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white">
        Berikan Review di Google
      </a>
    </main>
  );
}
