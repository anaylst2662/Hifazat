import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Phase 3: Awareness Hub ("Learn & Stay Safe"), using the SAMPLE content.

test.describe("Learn page", () => {
  test("lists sample content in sections, clearly marked SAMPLE", async ({ page }) => {
    await page.goto("/en/learn");
    await expect(page.getByText("Items marked SAMPLE are for testing only.", { exact: false })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Is this harassment?" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Guides and questions" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Quizzes" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Campaigns" })).toBeVisible();
    const cards = page.getByTestId("content-card");
    await expect(cards).toHaveCount(10);
    for (const card of await cards.all()) await expect(card).toContainText("SAMPLE — DO NOT PUBLISH");
  });

  test("content addresses are short neutral codes, never topic names", async ({ page }) => {
    await page.goto("/en/learn");
    const hrefs = await page.getByTestId("content-card").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
    for (const href of hrefs) expect(href).toMatch(/^\/en\/learn\/[a-z0-9]{4,12}$/);
    await page.getByTestId("topic-online").click();
    await expect(page).toHaveURL(/\/en\/learn$/); // filters never change the address
    await expect(page).toHaveTitle("Hifazat");
  });

  test("audience filter", async ({ page }) => {
    await page.goto("/en/learn");
    await page.getByTestId("audience-parents").click();
    await expect(page.getByText("SAMPLE: Talking with children about body safety")).toBeVisible();
    await expect(page.getByText("SAMPLE: What is harassment?")).toHaveCount(0);
  });

  test("topic filter", async ({ page }) => {
    await page.goto("/en/learn");
    await page.getByTestId("topic-online").click();
    await expect(page.getByTestId("content-card")).toHaveCount(1);
    await expect(page.getByTestId("content-card")).toContainText("Pressure to send photos");
    await page.getByTestId("topic-online").click(); // tap again to clear
    await expect(page.getByTestId("content-card")).toHaveCount(10);
  });

  test("Urdu content is shown in Urdu, right-to-left", async ({ page }) => {
    await page.goto("/ur/learn/smp001");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("نمونہ: رضامندی کیا ہے؟");
  });
});

test.describe("Content pages", () => {
  test("article text is shown with paragraphs and a list", async ({ page }) => {
    await page.goto("/en/learn/smp001");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("SAMPLE: What is consent?");
    await expect(page.locator("main li")).toHaveCount(4);
    await expect(page.getByText("The responsibility belongs to the person who did it.", { exact: false })).toBeVisible();
  });

  test("scenario card hides the answer until asked", async ({ page }) => {
    await page.goto("/en/learn/smp003");
    await expect(page.getByTestId("scenario-answer")).toHaveCount(0);
    await page.getByTestId("scenario-reveal").click();
    await expect(page.getByTestId("scenario-answer")).toContainText("Repeated unwanted comments");
    await expect(page.getByRole("heading", { name: "What can you do?" })).toBeVisible();
  });

  test("quiz gives feedback and a score that is not saved", async ({ page }) => {
    await page.goto("/en/learn/smp007");
    const quiz = page.getByTestId("quiz");
    await quiz.getByRole("button", { name: "No", exact: true }).click();
    await expect(quiz.getByText("That's right.")).toBeVisible();
    await page.getByTestId("quiz-next").click();
    await quiz.getByRole("button", { name: "No, a yes is final" }).click();
    await expect(quiz.getByText("Not quite.")).toBeVisible();
    await page.getByTestId("quiz-next").click();
    await quiz.getByRole("button", { name: "Listening and believing them" }).click();
    await page.getByTestId("quiz-next").click();
    await expect(page.getByTestId("quiz-result")).toContainText("You answered 2 of 3 correctly.");
    const stored = await page.evaluate(() => localStorage.length + sessionStorage.length);
    expect(stored).toBe(0);
  });

  test("campaign shows the poster with share and download options", async ({ page }) => {
    await page.goto("/en/learn/smp009");
    await expect(page.getByTestId("content-image")).toBeVisible();
    await expect(page.getByText("This is a SAMPLE poster for testing.", { exact: false })).toBeVisible();
    await expect(page.getByTestId("share-whatsapp")).toHaveAttribute("href", /^https:\/\/wa\.me\/\?text=Don't%20Let%20Fear/);
    await expect(page.getByTestId("share-download")).toHaveAttribute("href", "/samples/campaign-smp009-en.jpg");
  });

  test("unknown content shows 'not found'", async ({ page }) => {
    const response = await page.goto("/en/learn/zzzz99");
    expect(response?.status()).toBe(404);
  });
});

test("core guides are saved for offline use", async ({ page, context }) => {
  const list = await (await page.request.get("/offline-pages.json")).json();
  expect(list.pages).toEqual(expect.arrayContaining(["/en/learn", "/en/learn/smp003", "/ur/learn/smp008"]));
  expect(list.pages).not.toContain("/en/learn/smp007"); // quiz is not a core guide

  await page.goto("/en");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await expect
    .poll(() =>
      page.evaluate(async () => {
        const cache = await caches.open("hifazat-pages-v4");
        return (await cache.keys()).map((r) => new URL(r.url).pathname);
      }),
    )
    .toEqual(expect.arrayContaining(["/en/learn/smp003", "/ur/learn/smp003"]));
  await context.setOffline(true);
  await page.goto("/en/learn/smp003");
  await page.getByTestId("scenario-reveal").click();
  await expect(page.getByTestId("scenario-answer")).toBeVisible();
});

for (const path of ["/en/learn", "/ur/learn", "/en/learn/smp003", "/en/learn/smp007", "/ur/learn/smp009"]) {
  test(`no accessibility problems on ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)).toEqual([]);
  });
}
