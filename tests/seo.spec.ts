import { test, expect } from "@playwright/test";

// El canonical usa SITE_URL (lib/site-url.ts), fijo al dominio real de
// producción vía metadataBase — no al baseURL local del test runner (Fase
// 17 todavía no migró a dominio propio).
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://de-paola-prop.vercel.app";

test("Canonical: /propiedades apunta a la ruta sin querystring de filtros", async ({ page }) => {
  await page.goto("/propiedades?zona=martinez&operacion=venta");
  const href = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(href).toBe(`${SITE_URL}/propiedades`);
});

test("Canonical: ficha de propiedad apunta a su propia URL", async ({ page }) => {
  await page.goto("/propiedades/chalet-6-ambientes-martinez");
  const href = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(href).toBe(`${SITE_URL}/propiedades/chalet-6-ambientes-martinez`);
});

test("Home tiene canonical a la raíz", async ({ page }) => {
  await page.goto("/");
  const href = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(href).toBe(SITE_URL);
});

test("Ficha de propiedad incluye BreadcrumbList válido en JSON-LD", async ({ page }) => {
  await page.goto("/propiedades/chalet-6-ambientes-martinez");
  const breadcrumb = await page.evaluate(() => {
    const scripts = [...document.querySelectorAll('script[type="application/ld+json"]')];
    return scripts.map((s) => JSON.parse(s.textContent ?? "{}")).find((d) => d["@type"] === "BreadcrumbList");
  });
  expect(breadcrumb).toBeTruthy();
  expect(breadcrumb.itemListElement).toHaveLength(3);
  expect(breadcrumb.itemListElement[0].name).toBe("Inicio");
});

test("Una propiedad inexistente sigue devolviendo 404 (regresión: loading.tsx global lo rompía)", async ({ page }) => {
  const response = await page.goto("/propiedades/esta-propiedad-no-existe");
  expect(response?.status()).toBe(404);
});
