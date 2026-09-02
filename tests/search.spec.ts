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

test("Filtro por característica: Pileta devuelve solo propiedades con esa feature", async ({ page }) => {
  await page.goto("/propiedades");

  // Datos reales sembrados: 2 propiedades tienen la feature "pileta"
  // ("casa-6-ambientes-jardin-martinez" y "casa-4-ambientes-pileta-martinez").
  await page.getByRole("checkbox", { name: "Pileta" }).check();
  await page.getByRole("button", { name: "Buscar" }).click();

  await expect(page.getByText(/^2 propiedades$/)).toBeVisible();
  await expect(page.locator('main a[href="/propiedades/casa-4-ambientes-pileta-martinez"]').first()).toBeVisible();
});

test("Filtro por característica: Jardín agrupa variantes con y sin tilde de la misma key", async ({ page }) => {
  // Los datos reales tienen "jardín" y "jardin" cargados como keys distintas
  // (inconsistencia de tipeo entre agentes) — el checkbox único debe
  // matchear las 4 propiedades reales que tienen cualquiera de las dos, sin
  // tocar los datos ni mostrar dos checkboxes duplicados.
  await page.goto("/propiedades");

  await expect(page.getByRole("checkbox", { name: "Jardín" })).toHaveCount(1);
  await page.getByRole("checkbox", { name: "Jardín" }).check();
  await page.getByRole("button", { name: "Buscar" }).click();

  await expect(page.getByText(/^4 propiedades$/)).toBeVisible();
});

test("Orden: precio menor a mayor arranca en USD y en el más barato", async ({ page }) => {
  await page.goto("/propiedades");

  await page.getByLabel("Ordenar por").selectOption("precio_asc");
  await expect(page).toHaveURL(/orden=precio_asc/);

  // USD 480 es el precio más bajo del inventario real — el único listado en
  // ARS (local comercial, 700.000) queda agrupado aparte para no comparar
  // monedas distintas como si fueran el mismo número.
  const firstCard = page.locator('main a[href^="/propiedades/"]').first();
  await expect(firstCard).toHaveAttribute("href", "/propiedades/departamento-1-ambiente-alquiler-vicente-lopez");
});

test("Orden: precio mayor a menor arranca en el USD más caro", async ({ page }) => {
  await page.goto("/propiedades");

  await page.getByLabel("Ordenar por").selectOption("precio_desc");
  await expect(page).toHaveURL(/orden=precio_desc/);

  const firstCard = page.locator('main a[href^="/propiedades/"]').first();
  await expect(firstCard).toHaveAttribute("href", "/propiedades/casa-6-ambientes-jardin-martinez");
});
