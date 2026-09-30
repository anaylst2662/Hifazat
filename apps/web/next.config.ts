import type { NextConfig } from "next";
import path from "node:path";

// Security headers sent with every page.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Never tell other sites (e.g. the Quick Exit destination) that the visitor came from Hifazat.
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  // The repo root, so the app can read the shared translation files in /shared.
  turbopack: { root: path.join(__dirname, "..", "..") },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // The offline helper (service worker) must always be re-checked for updates.
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
        ],
      },
      {
        // Staff pages (Phase 7): never stored by browsers or search engines.
        source: "/staff/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
