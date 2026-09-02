import { test, expect } from "@playwright/test";

test("Home carga con hero y propiedades", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /años acompañando/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Recién publicadas" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Ver propiedades", exact: true })).toHaveAttribute("href", "/propiedades");
});

test("Home no tiene overflow horizontal en mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(hasOverflow).toBe(false);
});

test("Home en mobile: el botón de menú está visible y funciona sin scrollear (regresión)", async ({ page }) => {
  // Bug real: el wrapper del botón de menú mobile heredaba opacity-0/inert
  // del mismo mecanismo que oculta los links de escritorio mientras el
  // header está "transparente" sobre el hero — pero a diferencia de esos
  // links, no tenía ningún respaldo visible en mobile (la barra flotante
  // del pie del hero es hidden md:block). El usuario quedaba sin forma de
  // navegar hasta scrollear más allá del hero completo.
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  const menuButton = page.getByRole("button", { name: "Abrir menú" });
  await expect(menuButton).toBeVisible();
  await expect(menuButton).not.toHaveAttribute("aria-hidden", "true");

  await menuButton.click();
  await expect(page.getByRole("link", { name: "Campus Norte" })).toBeVisible();
});
