import { test, expect } from "@playwright/test";

test("Home carga con hero, trust strip y propiedades", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /años acompañando/i })).toBeVisible();
  await expect(page.getByText("20 años de trayectoria").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Recién publicadas" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Ver propiedades", exact: true })).toHaveAttribute("href", "/propiedades");
});

test("Home no tiene overflow horizontal en mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(hasOverflow).toBe(false);
});
