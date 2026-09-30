import { readFileSync } from "node:fs";
import path from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// ---------------------------------------------------------------------------
// Design-system checks: color contrast (WCAG AA), accessibility scan,
// tap-target size, and "red only for danger".
// ---------------------------------------------------------------------------

const css = readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
const token = (name: string) => {
  const match = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) throw new Error(`Missing color token --color-${name}`);
  return match[1];
};

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
/** A see-through white on a background, as the eye sees it. */
function whiteOver(bg: string, alpha: number) {
  const mix = [1, 3, 5].map((i) => Math.round(255 * alpha + parseInt(bg.slice(i, i + 2), 16) * (1 - alpha)));
  return "#" + mix.map((c) => c.toString(16).padStart(2, "0")).join("");
}

test("every text/background color pair meets WCAG AA (4.5:1)", () => {
  const white = "#ffffff";
  const pairs: [string, string, string][] = [
    ["text on page", token("ink"), token("bg")],
    ["text on card", token("ink"), token("surface")],
    ["secondary text on page", token("ink-soft"), token("bg")],
    ["secondary text on card", token("ink-soft"), token("surface")],
    ["secondary text on notice", token("ink-soft"), token("brand-soft")],
    ["white on navy header", white, token("brand")],
    ["80% white (tagline) on navy", whiteOver(token("brand"), 0.8), token("brand")],
    ["navy on white (Quick Exit)", token("brand"), white],
    ["white on danger", white, token("danger")],
    ["90% white (hint) on danger", whiteOver(token("danger"), 0.9), token("danger")],
    ["text on danger notice", token("ink"), token("danger-soft")],
    ["test banner", token("banner-ink"), token("banner")],
    ["link on card", token("brand"), token("surface")],
  ];
  for (const pillar of ["learn", "help", "report", "support", "danger", "brand"]) {
    pairs.push([`${pillar} icon on its tint`, token(pillar), token(`${pillar}-soft`)]);
  }
  const failures = pairs
    .map(([label, fg, bg]) => ({ label, ratio: contrast(fg, bg) }))
    .filter(({ ratio }) => ratio < 4.5)
    .map(({ label, ratio }) => `${label}: ${ratio.toFixed(2)}`);
  expect(failures).toEqual([]);
});

const pages = ["/en", "/ur", "/en/now", "/ur/now", "/en/tips", "/ur/tips", "/en/form"];

for (const path of pages) {
  test(`no accessibility problems on ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)).toEqual([]);
  });
}

test("every button and link is at least 48px tall (easy to tap)", async ({ page }) => {
  for (const path of ["/en", "/ur", "/en/tips", "/en/now", "/en/plan"]) {
    await page.goto(path);
    if (path.endsWith("/plan")) await page.getByTestId("plan-trusted").waitFor();
    const small = await page.locator("header a, header button, main a, main button, footer a, main input, main select").evaluateAll((els) =>
      els
        .filter((el) => el.getBoundingClientRect().height > 0)
        .filter((el) => !(el instanceof HTMLInputElement && (el.type === "checkbox" || el.type === "radio")))
        .filter((el) => el.getBoundingClientRect().height < 47.5)
        .map((el) => `${el.textContent?.trim()} (${Math.round(el.getBoundingClientRect().height)}px)`),
    );
    expect(small, path).toEqual([]);
  }
});

test("red is used only for the danger option on the home screen", async ({ page }) => {
  await page.goto("/en");
  const red = await page.locator("body *").evaluateAll((els) =>
    els
      .filter((el) => getComputedStyle(el).backgroundColor === "rgb(198, 40, 40)")
      .map((el) => el.getAttribute("data-testid") ?? el.tagName),
  );
  expect(red).toEqual(["danger-card"]);
});

test("English pages never download the Urdu font", async ({ page }) => {
  const fonts: string[] = [];
  page.on("request", (r) => {
    if (r.resourceType() === "font") fonts.push(r.url());
  });
  await page.goto("/en");
  await page.evaluate(() => document.fonts.ready);
  const urduFonts = await page.evaluate(() =>
    [...document.fonts].filter((f) => f.family.toLowerCase().includes("nastaliq") && f.status === "loaded").length,
  );
  expect(urduFonts).toBe(0);
});
