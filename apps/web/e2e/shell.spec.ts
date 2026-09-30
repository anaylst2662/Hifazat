import { expect, test, type Page } from "@playwright/test";

const NEUTRAL_START = "https://neutral.example/start";

// Pretend other websites exist, without using the internet.
async function fakeOtherSites(page: Page) {
  await page.route("https://www.google.com/**", (route) =>
    route.fulfill({ contentType: "text/html", body: "<title>Weather</title><h1>Weather</h1>" }),
  );
  await page.route(`${NEUTRAL_START}*`, (route) =>
    route.fulfill({ contentType: "text/html", body: "<title>Start</title><h1>Somewhere else</h1>" }),
  );
}

test.describe("Home screen", () => {
  test("English home shows the five actions, left-to-right", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("What do you need right now?");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    for (const label of ["I'm in Danger", "Learn & Stay Safe", "I Need Help", "I Want to Report", "I'm Supporting Someone"]) {
      await expect(page.getByRole("link", { name: new RegExp(label) })).toBeVisible();
    }
  });

  test("Urdu home is right-to-left and in Urdu", async ({ page }) => {
    await page.goto("/ur");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ur");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("آپ کو ابھی کس چیز کی ضرورت ہے؟");
  });

  test("the start address picks English by default", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
  });
});

test.describe("Start address with an Urdu phone", () => {
  test.use({ locale: "ur-PK" });
  test("still opens in English (the phone's language is not used)", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
  });
});

test("choosing Urdu is remembered for the next visit", async ({ page }) => {
  await page.goto("/en");
  await page.getByTestId("language-switcher").click();
  await expect(page).toHaveURL(/\/ur$/);
  await page.goto("/");
  await expect(page).toHaveURL(/\/ur$/);
  await page.getByTestId("language-switcher").click();
  await expect(page).toHaveURL(/\/en$/);
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
});

test.describe("Privacy of addresses and tab titles", () => {
  test("every page has a neutral tab title and web address", async ({ page }) => {
    await page.goto("/en");
    const hrefs = await page.locator("main nav a").evaluateAll((links) => links.map((a) => a.getAttribute("href")));
    expect(hrefs).toEqual(["/en/now", "/en/learn", "/en/services", "/en/form", "/en/guide"]);
    for (const href of [...(hrefs as string[]), "/en/tips", "/ur", "/ur/now"]) {
      expect(href).not.toMatch(/danger|report|assault|abuse|violence|harass/i);
      await page.goto(href);
      await expect(page).toHaveTitle(/^(Hifazat|حفاظت)$/);
    }
  });

  test("the site tells other websites nothing about where visitors came from", async ({ request }) => {
    const response = await request.get("/en");
    expect(response.headers()["referrer-policy"]).toBe("no-referrer");
  });
});

test.describe("Navigation", () => {
  test("Back returns to the previous page, and the phone's Back button works too", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("link", { name: /Learn & Stay Safe/ }).click();
    await expect(page).toHaveURL(/\/en\/learn$/);
    await page.getByRole("link", { name: "Back" }).click();
    await expect(page).toHaveURL(/\/en$/);
    await page.goForward();
    await expect(page).toHaveURL(/\/en\/learn$/);
    await page.goBack(); // the phone's own Back button
    await expect(page).toHaveURL(/\/en$/);
  });

  test("Back on a page opened directly goes to the home page", async ({ page }) => {
    await page.goto("/en/services");
    await page.getByRole("link", { name: "Back" }).click();
    await expect(page).toHaveURL(/\/en$/);
  });

  test("language switch keeps the same page", async ({ page }) => {
    await page.goto("/en/tips");
    await page.getByRole("link", { name: "Read this in Urdu" }).click();
    await expect(page).toHaveURL(/\/ur\/tips$/);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  });
});

test.describe("Quick Exit", () => {
  test("the button is on every page", async ({ page }) => {
    for (const path of ["/en", "/en/now", "/en/form", "/ur", "/ur/tips"]) {
      await page.goto(path);
      await expect(page.getByTestId("quick-exit")).toBeVisible();
    }
  });

  test("the button leaves, and Back does not return to that Hifazat page", async ({ page }) => {
    await fakeOtherSites(page);
    await page.goto(NEUTRAL_START);
    await page.goto("/en/now");
    await page.getByTestId("quick-exit").click();
    await expect(page).toHaveURL(/google\.com\/search\?q=weather/);
    await page.goBack();
    await expect(page).toHaveURL(NEUTRAL_START);
  });

  test("pressing Esc three times leaves", async ({ page }) => {
    await fakeOtherSites(page);
    await page.goto("/ur/form");
    await page.keyboard.press("Escape");
    await page.keyboard.press("Escape");
    await page.keyboard.press("Escape");
    await expect(page).toHaveURL(/google\.com\/search\?q=weather/);
  });
});

test.describe("Offline", () => {
  test("core pages open with no internet after one visit", async ({ page, context }) => {
    await page.goto("/en");
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
    });
    // Wait until the helper has saved the core pages.
    await expect
      .poll(() =>
        page.evaluate(async () => {
          const cache = await caches.open("hifazat-pages-v2");
          return (await cache.keys()).length;
        }),
      )
      .toBeGreaterThanOrEqual(6);

    const saved = await page.evaluate(async () => {
      const cache = await caches.open("hifazat-pages-v2");
      return (await cache.keys()).map((r) => new URL(r.url).pathname);
    });
    for (const path of saved.filter((p) => !p.startsWith("/__hifazat"))) {
      expect(path).toMatch(/^\/(en|ur)(\/|$)/); // only public pages are ever saved
    }

    await context.setOffline(true);
    await page.goto("/ur/now");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByTestId("quick-exit")).toBeVisible();
    await page.goto("/en/tips");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Staying safe online");
    // A page never visited falls back to the saved home page.
    await page.goto("/en/guide");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

test("the test version asks search engines not to list it", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});
