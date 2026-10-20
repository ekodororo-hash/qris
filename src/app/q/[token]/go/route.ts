import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isSafeGoogleUrl } from "@/lib/validators";

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const qr = await prisma.qrCode.findUnique({ where: { publicToken: token }, select: { id: true, status: true, business: { select: { googleReviewUrl: true } } } });
  const dest = qr?.business?.googleReviewUrl;
  if (!qr || qr.status !== "ACTIVE" || !dest || !isSafeGoogleUrl(dest)) return NextResponse.redirect(new URL(`/q/${token}`, req.url));
  await prisma.scanEvent.create({ data: { qrCodeId: qr.id, eventType: "REVIEW_CLICK" } });
  return NextResponse.redirect(dest);
}
