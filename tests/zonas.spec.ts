import { test, expect } from "@playwright/test";

test("Mapa de zona: se monta un mapa real, no el placeholder de texto", async ({ page }) => {
  // Martínez tiene propiedades reales con coordenadas cargadas (ver seed) —
  // el centro se deriva del promedio de esas coordenadas, no de un campo
  // propio en Neighborhood (no existe en el schema).
  await page.goto("/zonas/martinez");

  await expect(page.locator(".leaflet-container")).toBeVisible();
  await expect(page.getByText("Mapa de Martínez")).not.toBeVisible();
  await expect(page.locator(".leaflet-marker-icon").first()).toBeVisible();
});
