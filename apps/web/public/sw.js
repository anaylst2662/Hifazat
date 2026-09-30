/*
 * Hifazat offline helper ("service worker").
 *
 * What it does, in plain words:
 *  - Saves the core public pages on the phone so they open without internet.
 *  - When online, always tries the internet first (so people see the latest
 *    version), and falls back to the saved copy if the connection is slow or down.
 *
 * What it NEVER saves:
 *  - Staff / admin pages (/staff), server calls (/api, /auth), or anything
 *    from other websites (including Supabase). Those always go to the network.
 *
 * Phase 2 will add: emergency numbers and the safety plan.
 */

const VERSION = "v1";
const STATIC_CACHE = `hifazat-static-${VERSION}`;
const PAGES_CACHE = `hifazat-pages-${VERSION}`;

// Pages saved as soon as the helper is installed (both languages).
const CORE_PAGES = ["/en", "/ur", "/en/now", "/ur/now", "/en/tips", "/ur/tips"];

// Only these pages may ever be saved: the public site in a supported language.
const PUBLIC_PAGE = /^\/(en|ur)(\/|$)/;
const NEVER_CACHE = /^\/(staff|api|auth)(\/|$)/;

// On weak connections, wait this long for the internet before using the saved copy.
const NETWORK_TIMEOUT_MS = 4000;

// Re-download the core pages at most once a day (saves mobile data).
const REFRESH_EVERY_MS = 24 * 60 * 60 * 1000;
const REFRESH_MARKER = "/__hifazat_core_refreshed";
const LAST_LANG_MARKER = "/__hifazat_last_lang";

self.addEventListener("install", (event) => {
  event.waitUntil(saveCorePages().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("hifazat-") && key !== STATIC_CACHE && key !== PAGES_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "refresh-core-pages") {
    event.waitUntil(refreshCorePagesIfOld());
  }
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // other websites: not our business
  if (NEVER_CACHE.test(url.pathname)) return; // staff and server calls: network only

  if (url.pathname.startsWith("/_next/static/")) {
    // Code and styles: file names change with every update, so a saved copy is always correct.
    event.respondWith(cacheFirst(request));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(pageNetworkFirst(request, url));
    return;
  }

  if (url.pathname.startsWith("/icons/") || url.pathname.endsWith(".webmanifest")) {
    event.respondWith(cacheFirst(request));
  }
});

async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  const saved = await cache.match(request);
  if (saved) return saved;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

async function pageNetworkFirst(request, url) {
  const cache = await caches.open(PAGES_CACHE);
  const langMatch = url.pathname.match(/^\/(en|ur)(\/|$)/);
  if (langMatch) cache.put(LAST_LANG_MARKER, new Response(langMatch[1]));

  const network = fetch(request).then((response) => {
    if (response.ok && PUBLIC_PAGE.test(url.pathname) && !response.redirected) {
      cache.put(url.pathname, response.clone());
    }
    return response;
  });
  network.catch(() => undefined); // failures are handled below

  try {
    return await withTimeout(network, NETWORK_TIMEOUT_MS);
  } catch {
    // Slow or no internet: use the saved copy of this page if there is one.
    const saved = await cache.match(url.pathname);
    if (saved) return saved;
  }
  try {
    // Nothing saved: keep waiting for the (slow) internet.
    return await network;
  } catch {
    // No internet at all: show the saved home page instead.
    const lang = langMatch ? langMatch[1] : await lastLanguage(cache);
    const home = await cache.match(`/${lang}`);
    if (home) return home;
    return new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } });
  }
}

async function lastLanguage(cache) {
  const saved = await cache.match(LAST_LANG_MARKER);
  const lang = saved ? await saved.text() : "en";
  return lang === "ur" ? "ur" : "en";
}

async function saveCorePages() {
  const pages = await caches.open(PAGES_CACHE);
  const statics = await caches.open(STATIC_CACHE);
  await Promise.all(
    CORE_PAGES.map(async (path) => {
      try {
        const response = await fetch(path, { cache: "no-store" });
        if (!response.ok) return;
        const html = await response.clone().text();
        await pages.put(path, response);
        // Also save the code and style files each page needs.
        const assets = new Set(html.match(/\/_next\/static\/[^"'\\\s)]+/g) || []);
        await Promise.all(
          [...assets].map((asset) =>
            statics.match(asset).then((hit) => hit || statics.add(asset).catch(() => undefined)),
          ),
        );
      } catch {
        // Offline during install: pages will be saved on a later visit.
      }
    }),
  );
  await pages.put(REFRESH_MARKER, new Response(String(Date.now())));
}

async function refreshCorePagesIfOld() {
  const pages = await caches.open(PAGES_CACHE);
  const marker = await pages.match(REFRESH_MARKER);
  const last = marker ? Number(await marker.text()) : 0;
  if (Date.now() - last > REFRESH_EVERY_MS) await saveCorePages();
}

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}
