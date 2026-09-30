import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Phase 2: "I'm in Danger" and My Safety Plan.

async function addTrustedContact(page: Page, name: string, phone: string) {
  const section = page.getByTestId("plan-trusted");
  await section.getByLabel("Name").fill(name);
  await section.getByLabel("Phone number").fill(phone);
  await section.getByRole("button", { name: "Add" }).click();
  await expect(section.getByText(name)).toBeVisible();
}

test.describe("I'm in Danger", () => {
  test("emergency call buttons come first, from the database, with a test-number warning", async ({ page }) => {
    await page.goto("/en/now");
    await expect(page.getByText("Test numbers: not verified")).toBeVisible();
    const calls = page.getByTestId("call-button");
    // The first button on the page is an emergency number.
    await expect(calls.first()).toHaveAttribute("data-kind", "emergency");
    await expect(calls.first()).toHaveAttribute("href", "tel:0000000001");
    await expect(calls.first()).toContainText("TEST NUMBER");
    // 2 national emergency numbers + 3 helplines are shown (district numbers only after choosing).
    await expect(page.locator('[data-testid="call-button"][data-kind="emergency"]')).toHaveCount(2);
    await expect(page.locator('[data-testid="call-button"][data-kind="helpline"]')).toHaveCount(3);
    // Honest wording.
    await expect(page.getByText("Hifazat does not send police and cannot guarantee a response.", { exact: false }).first()).toBeVisible();
  });

  test("no phone numbers are written in the page code except those from the database", async ({ page }) => {
    await page.goto("/en/now");
    const hrefs = await page.locator('a[href^="tel:"]').evaluateAll((as) => as.map((a) => a.getAttribute("href")));
    for (const href of hrefs) expect(href).toMatch(/^tel:0000000/); // all PLACEHOLDER test numbers
  });

  test("Urdu page shows Urdu labels, right-to-left", async ({ page }) => {
    await page.goto("/ur/now");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByText("عارضی نمبر — پولیس ایمرجنسی")).toBeVisible();
  });

  test("district picker shows that district's numbers and remembers the choice", async ({ page }) => {
    await page.goto("/en/now");
    await page.getByTestId("district-select").selectOption("gilgit");
    await expect(page.getByText("PLACEHOLDER — Gilgit police station")).toBeVisible();
    await page.reload();
    await expect(page.getByTestId("district-select")).toHaveValue("gilgit");
    await page.getByTestId("district-select").selectOption("nagar");
    await expect(page.getByText("No numbers are listed for this district yet.")).toBeVisible();
  });

  test("without trusted contacts, it points to My Safety Plan", async ({ page }) => {
    await page.goto("/en/now");
    await expect(page.getByTestId("trusted-message")).toContainText("You have not added trusted contacts yet.");
  });
});

test.describe("My Safety Plan", () => {
  test("saves on this device, encrypted, and survives a reload", async ({ page }) => {
    await page.goto("/en/plan");
    await expect(page.getByText("Saved only on this device")).toBeVisible();
    await addTrustedContact(page, "Amina Test", "0300 1234567");
    await page.getByLabel("Some money").check();
    await page.reload();
    await expect(page.getByTestId("plan-trusted").getByText("Amina Test")).toBeVisible();
    await expect(page.getByLabel("Some money")).toBeChecked();

    // What is stored in the browser is encrypted: the name is not readable.
    const raw = await page.evaluate(
      () =>
        new Promise<string>((resolve) => {
          const open = indexedDB.open("hifazat-private");
          open.onsuccess = () => {
            const get = open.result.transaction("items").objectStore("items").get("safety-plan");
            get.onsuccess = () => {
              const bytes = new Uint8Array(get.result.data);
              resolve(new TextDecoder("latin1").decode(bytes));
            };
          };
        }),
    );
    expect(raw.length).toBeGreaterThan(20);
    expect(raw).not.toContain("Amina");
    expect(raw).not.toContain("0300");
  });

  test("delete everything asks for confirmation, then removes the plan", async ({ page }) => {
    await page.goto("/en/plan");
    await addTrustedContact(page, "To Be Deleted", "0300 0000000");
    await page.getByTestId("plan-delete").click();
    await page.getByTestId("plan-delete-confirm").click();
    await expect(page.getByText("Your safety plan was deleted.")).toBeVisible();
    await page.reload();
    await expect(page.getByTestId("plan-trusted").getByText("To Be Deleted")).toHaveCount(0);
  });
});

test.describe("Message someone you trust", () => {
  test.use({ permissions: ["geolocation"], geolocation: { latitude: 35.9208, longitude: 74.3144 } });

  test("prepares SMS and WhatsApp messages; location only when chosen", async ({ page }) => {
    await page.goto("/en/plan");
    await addTrustedContact(page, "Sister", "0300 1234567");
    await page.goto("/en/now");
    const box = page.getByTestId("trusted-message");
    await expect(box.getByText("Sister")).toBeVisible();

    const sms = box.getByTestId("send-sms");
    await expect(sms).toHaveAttribute("href", /^sms:03001234567\?&body=I%20need%20help/);
    await expect(sms).not.toHaveAttribute("href", /openstreetmap/);
    // WhatsApp needs the international form: 0300... becomes 92300...
    await expect(box.getByTestId("send-whatsapp")).toHaveAttribute("href", /^https:\/\/wa\.me\/923001234567\?text=/);

    await box.getByTestId("add-location").check();
    await expect(sms).toHaveAttribute("href", /openstreetmap\.org%2F%3Fmlat%3D35\.92080%26mlon%3D74\.31440/);
    await box.getByTestId("add-location").uncheck();
    await expect(sms).not.toHaveAttribute("href", /openstreetmap/);
  });
});

test("Danger and Safety Plan pages work offline", async ({ page, context }) => {
  await page.goto("/en/plan");
  await addTrustedContact(page, "Offline Friend", "0311 7654321");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await expect
    .poll(() =>
      page.evaluate(async () => {
        const cache = await caches.open("hifazat-pages-v3");
        return (await cache.keys()).map((r) => new URL(r.url).pathname);
      }),
    )
    .toEqual(expect.arrayContaining(["/en/now", "/en/plan"]));

  await context.setOffline(true);
  await page.goto("/en/now");
  await expect(page.getByTestId("call-button").first()).toHaveAttribute("href", "tel:0000000001");
  await expect(page.getByTestId("trusted-message").getByText("Offline Friend")).toBeVisible();
  await page.goto("/en/plan");
  await expect(page.getByTestId("plan-trusted").getByText("Offline Friend")).toBeVisible();
});

for (const path of ["/en/now", "/ur/now", "/en/plan", "/ur/plan"]) {
  test(`no accessibility problems on ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    if (path.endsWith("/plan")) await expect(page.getByTestId("plan-trusted")).toBeVisible();
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)).toEqual([]);
  });
}

test("emergency call buttons are the first action on the danger page", async ({ page }) => {
  await page.goto("/en/now");
  const firstInMain = await page.locator("main a, main button").first().getAttribute("data-testid");
  // After the Back button, the first thing is an emergency call.
  const actions = await page.locator("main a, main button").evaluateAll((els) => els.map((e) => e.getAttribute("data-testid")));
  expect(actions.indexOf("call-button")).toBe(1);
  expect(firstInMain).toBeNull(); // the Back button
});
