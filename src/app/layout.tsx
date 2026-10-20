import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

export const metadata: Metadata = { title: "ReviewQR", description: "QR permanen untuk halaman ulasan Google bisnis Anda." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={jakarta.variable}>
      <body className="min-h-dvh bg-slate-50 font-sans text-slate-900 antialiased">{children}</body>
    </html>
  );
}
