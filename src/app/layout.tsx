import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = { title: "ReviewQR", description: "QR permanen untuk halaman ulasan Google bisnis Anda." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id"><body className={`${inter.className} min-h-dvh bg-neutral-50 text-neutral-900 antialiased`}>{children}</body></html>
  );
}
