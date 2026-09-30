// Draws the SAMPLE campaign posters (public/samples/*.png) in English and Urdu.
// A real browser draws them, so Urdu (Nastaliq) script is shaped correctly.
// Run with: node scripts/make-sample-posters.mjs
// Real campaign posters will be uploaded by admins (Phase 7), not made here.
import { mkdirSync, readFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const font = (path) => `data:font/woff2;base64,${readFileSync(new URL(`../node_modules/${path}`, import.meta.url)).toString("base64")}`;
const jakarta = font("@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-800-normal.woff2");
const jakartaMed = font("@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-500-normal.woff2");
const nastaliq = font("@fontsource/noto-nastaliq-urdu/files/noto-nastaliq-urdu-arabic-700-normal.woff2");

const posters = [
  { file: "campaign-smp009-en", lang: "en", title: "Don’t Let Fear Silence You.", sub: "Learn. Prevent. Protect. Report. Support.", accent: "#e3f4ec" },
  { file: "campaign-smp009-ur", lang: "ur", title: "خوف کو اپنی آواز دبانے نہ دیں۔", sub: "سیکھیں۔ روک تھام کریں۔ تحفظ کریں۔ رپورٹ کریں۔ سہارا دیں۔", accent: "#e3f4ec" },
  { file: "campaign-smp010-en", lang: "en", title: "No Means No.", sub: "Respect boundaries. Every time.", accent: "#eee9fb" },
  { file: "campaign-smp010-ur", lang: "ur", title: "نہیں کا مطلب نہیں۔", sub: "حدود کا احترام کریں۔ ہر بار۔", accent: "#eee9fb" },
];

const shield = `<svg viewBox="0 0 24 24" width="120" height="120" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`;

const html = (p) => `<!doctype html><html lang="${p.lang}" dir="${p.lang === "ur" ? "rtl" : "ltr"}"><head><meta charset="utf-8"><style>
@font-face { font-family: J; src: url(${jakarta}); font-weight: 800; }
@font-face { font-family: J; src: url(${jakartaMed}); font-weight: 500; }
@font-face { font-family: N; src: url(${nastaliq}); font-weight: 700; }
html, body { margin: 0; }
.poster { width: 1080px; height: 1080px; box-sizing: border-box; padding: 130px 100px 100px; position: relative; overflow: hidden;
  background: radial-gradient(circle at 85% 10%, #22497d 0, #14325a 45%, #0e2645 100%); color: #fff;
  display: flex; flex-direction: column; justify-content: space-between; font-family: ${p.lang === "ur" ? "N" : "J"}, sans-serif; }
.ring { position: absolute; border-radius: 50%; border: 2px solid rgba(255,255,255,.08); }
.icon { color: ${p.accent}; }
h1 { margin: 0; font-weight: ${p.lang === "ur" ? 700 : 800}; font-size: ${p.lang === "ur" ? "78px" : "112px"}; line-height: ${p.lang === "ur" ? 1.9 : 1.02}; letter-spacing: ${p.lang === "ur" ? "0" : "-0.03em"}; }
p { margin: ${p.lang === "ur" ? "8px" : "28px"} 0 0; font-weight: 500; font-size: ${p.lang === "ur" ? "38px" : "46px"}; line-height: ${p.lang === "ur" ? 2.0 : 1.3}; color: ${p.accent}; }
.foot { display: flex; align-items: center; gap: 18px; font-family: J, sans-serif; font-weight: 800; font-size: 44px; }
.foot span.ur { font-family: N, serif; font-weight: 700; }
.sample { position: absolute; top: 0; left: 0; right: 0; text-align: center; direction: ltr;
  background: #fff3d6; color: #5c3d00; font-family: J, sans-serif; font-weight: 800; font-size: 30px; letter-spacing: .08em; padding: 16px 0; }
</style></head><body><div class="poster">
<div class="ring" style="width:900px;height:900px;right:-420px;top:-380px"></div>
<div class="ring" style="width:600px;height:600px;right:-260px;top:-240px"></div>
<div class="sample">SAMPLE — DO NOT PUBLISH</div>
<div class="icon">${shield}</div>
<div><h1>${p.title}</h1><p>${p.sub}</p></div>
<div class="foot"><span>Hifazat</span><span>·</span><span class="ur">حفاظت</span></div>
</div></body></html>`;

mkdirSync(new URL("../public/samples/", import.meta.url), { recursive: true });
const browser = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1080, height: 1080 } });
for (const p of posters) {
  await page.setContent(html(p));
  await page.evaluate(() => document.fonts.ready);
  // JPEG keeps each poster small (about 60–90 KB) for weak connections.
  await page.locator(".poster").screenshot({ type: "jpeg", quality: 82, path: new URL(`../public/samples/${p.file}.jpg`, import.meta.url).pathname });
  console.log("Wrote", p.file);
}
await browser.close();
