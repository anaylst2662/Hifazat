"use client";

import { useEffect } from "react";

/**
 * Turns on offline support (see public/sw.js) for the public site.
 * Only in the real (production) build; never on staff pages.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then(() => navigator.serviceWorker.ready)
      .then((registration) => registration.active?.postMessage({ type: "refresh-core-pages" }))
      .catch(() => {
        // Offline support is a bonus; the site works without it.
      });
  }, []);
  return null;
}
