import { expect, test, type Page } from "@playwright/test";

const routes = [
  "/",
  "/about",
  "/visit",
  "/connect",
  "/contact",
  "/sermons",
  "/sermons/planted-by-the-waters",
  "/live",
  "/events",
  "/events/carols-by-candlelight",
  "/ministries",
  "/ministries/youth",
  "/groups",
  "/give",
  "/projects",
  "/projects/building-for-generations",
  "/prayer",
];

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

for (const route of routes) {
  test(`${route} renders without errors or horizontal overflow`, async ({ page }) => {
    const errors = trackErrors(page);
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}

test("unknown pages return the custom 404", async ({ page }) => {
  const res = await page.goto("/sermons/does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("found");
});

test("visit RSVP validates and then submits", async ({ page }) => {
  await page.goto("/visit#rsvp");
  const form = page.locator("#rsvp form");
  await form.getByRole("button", { name: "Reserve my seat" }).click();
  await expect(form.getByRole("alert").first()).toContainText("check the highlighted fields");
  await form.getByLabel("Your name").fill("Test Visitor");
  await form.getByLabel("Email").fill("visitor@example.com");
  await form.getByLabel("Which Sunday?").fill("2026-11-29");
  await form.getByRole("button", { name: "Reserve my seat" }).click();
  await expect(page.getByRole("status")).toContainText("See you soon");
});

test("sermon library filters by search", async ({ page }) => {
  await page.goto("/sermons");
  const search = page.getByRole("searchbox").first();
  await search.fill("Elijah");
  await expect(page.getByText(/1 (message|sermon)/i).first()).toBeVisible();
  await search.fill("zzzz-nothing");
  await expect(page.getByText(/no (messages|sermons)/i).first()).toBeVisible();
});

test("fellowship finder filters by area and opens the join dialog", async ({ page }) => {
  await page.goto("/groups?area=Gwarinpa");
  await expect(page.getByText("1 fellowship found")).toBeVisible();
  await page.getByRole("button", { name: "Ask to join" }).click();
  await expect(page.getByRole("dialog")).toContainText("Gwarinpa");
});

test("event calendar file downloads as text/calendar", async ({ request }) => {
  const res = await request.get("/api/events/carols-by-candlelight/ics");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("text/calendar");
  expect(await res.text()).toContain("BEGIN:VEVENT");
});

test("give form updates the total when an amount is chosen", async ({ page }) => {
  await page.goto("/give");
  await page.getByText("₦50,000", { exact: true }).first().click();
  await expect(page.locator("[aria-live=polite]").filter({ hasText: "Total today" })).toContainText(/₦50,\d{3}/);
});

test("mobile menu opens and navigates", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile", "mobile only");
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.locator("#mobile-menu").getByRole("link", { name: "Plan a visit" }).last().click();
  await expect(page).toHaveURL(/\/visit$/);
});

test("capture screenshots", async ({ page }, info) => {
  test.setTimeout(150_000);
  for (const route of ["/", "/visit", "/sermons", "/give", "/events", "/prayer"]) {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    await page.waitForFunction(() => (window as Window & { __reveal?: boolean }).__reveal === true);
    // Scroll through so reveal animations trigger before the full-page capture.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        scrollTo({ top: y, behavior: "instant" });
        await new Promise((r) => setTimeout(r, 120));
      }
      scrollTo({ top: 0, behavior: "instant" });
    });
    await page.waitForTimeout(2200);
    const name = route === "/" ? "home" : route.slice(1);
    await page.screenshot({ path: `../docs/screens/${name}-${info.project.name}.png`, fullPage: true });
  }
});
