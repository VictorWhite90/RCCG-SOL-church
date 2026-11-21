import { expect, test, type Page } from "@playwright/test";
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

// Guards against DOM-ownership bugs: animations must never restructure nodes
// React owns, or React throws "removeChild / insertBefore: not a child of this node".
function watch(page: Page) {
  const problems: string[] = [];
  page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error" && /removeChild|insertBefore|NotFoundError|not a child/i.test(m.text())) problems.push(`console: ${m.text()}`);
  });
  return problems;
}

async function nav(page: Page, href: string) {
  await page.evaluate((h) => {
    const a = document.querySelector<HTMLAnchorElement>(`a[href="${h}"]`);
    if (!a) throw new Error(`no link to ${h}`);
    a.click();
  }, href);
  await page.waitForURL((u) => u.pathname + u.search === href, { timeout: 15_000 });
  await page.waitForTimeout(600);
  await page.mouse.wheel(0, 1800);
  await page.waitForTimeout(400);
}

test("client navigation across animated pages stays stable", async ({ page }) => {
  test.setTimeout(120_000);
  const problems = watch(page);
  await page.goto("/");
  await page.waitForTimeout(3500); // let the intro + hero choreography finish
  await page.mouse.wheel(0, 2500);
  await page.waitForTimeout(500);

  await nav(page, "/sermons");
  await nav(page, "/sermons/deep-roots-strong-faith");
  // Same route, different slug — React reuses the page component.
  const next = await page.evaluate(() => Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="/sermons/"]')).map((a) => a.getAttribute("href")).find((h) => h !== "/sermons/deep-roots-strong-faith"));
  if (next) await nav(page, next);
  await page.goBack();
  await page.waitForTimeout(800);
  await page.goForward();
  await page.waitForTimeout(800);
  await nav(page, "/events");
  await nav(page, "/");
  await page.waitForTimeout(800);
  await page.mouse.wheel(0, 4000);
  await page.waitForTimeout(800);
  await nav(page, "/visit");
  await page.goBack();
  await page.waitForTimeout(1500);

  expect(problems).toEqual([]);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("hot reload while animations are mid-flight stays stable", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop" || !process.env.PLAYWRIGHT_HMR, "dev-server only");
  test.setTimeout(90_000);
  const problems = watch(page);
  await page.goto("/");
  await page.waitForTimeout(3500);
  await page.mouse.wheel(0, 3000);
  await page.waitForTimeout(400);
  const file = path.join(process.cwd(), "src/components/ui.tsx");
  const original = readFileSync(file, "utf8");
  try {
    appendFileSync(file, "\n// hmr-probe\n");
    await page.waitForTimeout(4000);
  } finally {
    writeFileSync(file, original);
  }
  await page.waitForTimeout(4000);
  expect(problems).toEqual([]);
});
