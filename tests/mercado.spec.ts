import { test, expect } from "@playwright/test";

test("Mercado muestra oferta activa agrupada por zona, sin promedios inventados", async ({ page }) => {
  const response = await page.goto("/mercado");
  expect(response?.status()).toBe(200);

  await expect(page.getByRole("heading", { name: "Mercado", level: 1 })).toBeVisible();
  await expect(page.getByText("Oferta activa por zona")).toBeVisible();
  // No debe mencionar un precio promedio por m² inventado — solo conteos reales.
  await expect(page.getByText(/precio promedio/i)).toHaveCount(0);
});

test("Mercado muestra artículos de la categoría Mercado de Insights", async ({ page }) => {
  await page.goto("/mercado");
  await expect(page.getByText("Análisis y guías de mercado")).toBeVisible();
});
