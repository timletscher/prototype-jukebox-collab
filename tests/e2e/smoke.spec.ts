import { test, expect } from "@playwright/test";

test("basic flow: username, add song, vote", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Display name").fill("Ada");
  await page.getByRole("button", { name: "Save" }).click();

  await page.getByLabel("Search songs").fill("Neon");
  await page.getByRole("button", { name: "Add" }).first().click();

  await expect(page.getByText("Neon Skyline")).toBeVisible();
  await expect(page.getByText("1/25 slots filled")).toBeVisible();

  const thumbsUp = page.getByRole("button", { name: /Thumbs up/ });
  await thumbsUp.click();
  await expect(thumbsUp).toContainText("1");
});
