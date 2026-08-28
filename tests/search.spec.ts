import { test, expect } from "@playwright/test";

test("El buscador filtra por zona y operación", async ({ page }) => {
  await page.goto("/propiedades?zona=martinez&operacion=venta");

  await expect(page.locator("select[name=zona]")).toHaveValue("martinez");
  await expect(page.locator("select[name=operacion]")).toHaveValue("venta");

  // Martínez + Venta da 3 resultados con los datos sembrados (ver seed.ts)
  await expect(page.getByText(/^3 propiedades$/)).toBeVisible();
});

test("Sin resultados exactos muestra propiedades similares, no una grilla vacía", async ({ page }) => {
  await page.goto("/propiedades?tipo=TERRENO");

  await expect(page.getByText("No encontramos propiedades con esos filtros exactos")).toBeVisible();
});

test("Toggle a vista de mapa muestra el mapa con pines", async ({ page }) => {
  await page.goto("/propiedades");
  await page.getByRole("button", { name: "mapa", exact: true }).click();

  await expect(page.locator(".leaflet-container")).toBeVisible();
  await expect(page.locator(".leaflet-marker-icon").first()).toBeVisible();
});

test("Comprar y Alquilar preseteados no muestran el filtro de operación", async ({ page }) => {
  await page.goto("/propiedades/comprar");
  await expect(page.locator("select[name=operacion]")).toHaveCount(0);

  await page.goto("/propiedades/alquilar");
  await expect(page.locator("select[name=operacion]")).toHaveCount(0);
});
