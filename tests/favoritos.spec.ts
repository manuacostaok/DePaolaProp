import { test, expect } from "@playwright/test";

test("Favoritos vacío muestra estado vacío con CTA a propiedades", async ({ page }) => {
  await page.goto("/favoritos");
  await expect(page.getByText("Todavía no guardaste ninguna propiedad.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Ver propiedades" })).toBeVisible();
});

test("Guardar una propiedad en /propiedades la muestra en /favoritos, y sacarla la quita", async ({ page }) => {
  await page.goto("/propiedades");
  // ".group" es una clase de Tailwind reusada por el dropdown del nav —
  // no sirve como identificador de card. Se correlaciona por href de la
  // ficha (más robusto que el texto del título) en vez de por nombre.
  // Scoped a <main> para no matchear los links del dropdown de navegación
  // ("Comprar"/"Alquilar" -> /propiedades/comprar, etc.), que también
  // empiezan con "/propiedades/".
  const firstPropertyHref = await page.locator('main a[href^="/propiedades/"]').first().getAttribute("href");
  expect(firstPropertyHref).toBeTruthy();
  const favoriteButton = page.getByRole("button", { name: "Guardar en favoritos" }).first();
  await favoriteButton.click();

  await page.goto("/favoritos");
  await expect(page.getByText("1 propiedad guardada")).toBeVisible();
  await expect(page.locator(`main a[href="${firstPropertyHref}"]`).first()).toBeVisible();

  await page.getByRole("button", { name: "Quitar de favoritos" }).click();
  await expect(page.getByText("Todavía no guardaste ninguna propiedad.")).toBeVisible();
});
