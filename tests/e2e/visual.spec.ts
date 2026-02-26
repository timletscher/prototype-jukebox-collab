import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 1280, height: 720 } });

test("home visual snapshot", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await page.getByLabel("Display name").fill("Ada");
  await page.getByRole("button", { name: "Save" }).click();

  await expect(page).toHaveScreenshot("home.png", { fullPage: true });
});

test("genre modal visual snapshot", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await page.getByLabel("Display name").fill("Ada");
  await page.getByRole("button", { name: "Save" }).click();

  await page.getByRole("button", { name: "Set Genre" }).click();
  await expect(page.getByRole("dialog", { name: "Set Genre" })).toBeVisible();

  await expect(page).toHaveScreenshot("set-genre-modal.png", { fullPage: true });
});
