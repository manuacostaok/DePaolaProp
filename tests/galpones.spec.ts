import { test, expect } from "@playwright/test";

test("Galpones: la landing carga, filtra por tipo GALPON y no muestra campos residenciales", async ({ page }) => {
  await page.goto("/propiedades/galpones");

  await expect(page.getByRole("heading", { name: "Galpones y depósitos en Zona Norte" })).toBeVisible();

  // No hay galpones reales cargados todavía — debe mostrar el estado
  // vacío honesto, no inventar resultados ni caer en el fallback de
  // "propiedades similares" mostrando otros tipos.
  await expect(page.getByText("No hay propiedades disponibles por el momento")).toBeVisible();

  // El select de Tipo no debe aparecer (ya está fijo a Galpón) — a
  // diferencia de Ambientes/Cochera, que tampoco aplican a industriales.
  await expect(page.locator("select[name=tipo]")).toHaveCount(0);
  await expect(page.locator("select[name=ambientes]")).toHaveCount(0);
  await expect(page.locator('input[name=cochera]')).toHaveCount(0);
});

// Paso 4 del documento (link en nav/footer) queda a propósito sin hacer
// todavía: sin galpones reales cargados, promocionar el link dejaría la
// página linkeada y vacía — ver resumen final.
