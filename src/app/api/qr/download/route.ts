import { NextRequest } from "next/server";
import QRCode from "qrcode";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  const s = await getSession();
  if (!s) return new Response("Unauthorized", { status: 401 });
  const id = req.nextUrl.searchParams.get("id") ?? "";
  const fmt = req.nextUrl.searchParams.get("fmt") === "svg" ? "svg" : "png";
  const qr = await prisma.qrCode.findUnique({ where: { id }, include: { business: { select: { ownerId: true } } } });
  if (!qr || (s.role !== "ADMIN" && qr.business?.ownerId !== s.id)) return new Response("Not found", { status: 404 }); // cegah IDOR
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/q/${qr.publicToken}`;
  const headers = (type: string) => ({ "Content-Type": type, "Content-Disposition": `attachment; filename="qr-${qr.publicToken}.${fmt}"` });
  if (fmt === "svg") return new Response(await QRCode.toString(url, { type: "svg", margin: 2, width: 1024 }), { headers: headers("image/svg+xml") });
  return new Response(new Uint8Array(await QRCode.toBuffer(url, { margin: 2, width: 1024 })), { headers: headers("image/png") });
}
