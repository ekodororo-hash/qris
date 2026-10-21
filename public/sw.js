// Service worker minimal: syarat agar browser menawarkan "Instal aplikasi".
// Sengaja tidak menyimpan cache apa pun, jadi data (dashboard, admin) selalu segar dan tidak bocor lewat cache.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
