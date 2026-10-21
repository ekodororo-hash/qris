import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { InstallProvider } from "@/components/install-prompt";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

export const metadata: Metadata = {
  title: "ReviewQR",
  description: "QR permanen untuk halaman ulasan Google bisnis Anda.",
  applicationName: "ReviewQR",
  appleWebApp: { capable: true, title: "ReviewQR", statusBarStyle: "default" },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: "/apple-touch-icon.png",
  },
};
export const viewport: Viewport = { themeColor: "#4f46e5" };

// menangkap sinyal "boleh diinstal" dari Chrome sedini mungkin (sebelum React siap), lalu memberi tahu InstallProvider
const CAPTURE_INSTALL = `window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();window.__bip=e;window.dispatchEvent(new Event("bip-ready"))});`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={jakarta.variable}>
      <head><script dangerouslySetInnerHTML={{ __html: CAPTURE_INSTALL }} /></head>
      <body className="min-h-dvh bg-slate-50 font-sans text-slate-900 antialiased"><InstallProvider>{children}</InstallProvider></body>
    </html>
  );
}
