import type { MetadataRoute } from "next";

// PWA: aplikasi terpasang selalu dibuka di /login (start_url)
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "ReviewQR",
    short_name: "ReviewQR",
    description: "QR permanen untuk halaman ulasan Google bisnis Anda.",
    lang: "id",
    start_url: "/login",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f8fafc",
    theme_color: "#4f46e5",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
