import type { NextConfig } from "next";
const config: NextConfig = {
  async headers() {
    // service worker harus selalu dicek ulang oleh browser agar pembaruan tidak tertahan
    return [{ source: "/sw.js", headers: [{ key: "Cache-Control", value: "no-cache, no-store, must-revalidate" }, { key: "Content-Type", value: "application/javascript; charset=utf-8" }] }];
  },
};
export default config;
