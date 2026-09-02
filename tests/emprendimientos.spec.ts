import { test, expect } from "@playwright/test";

test("Emprendimientos: Campus Norte (real) no muestra badge de estado de obra sin dato cargado", async ({ page }) => {
  // constructionStatus es opcional a propósito — no se inventa un estado
  // para el único emprendimiento real. El badge "Emprendimiento" sí debe
  // seguir apareciendo (no depende del estado de obra).
  await page.goto("/emprendimientos/campus-norte");

  await expect(page.getByText("Emprendimiento", { exact: true })).toBeVisible();
  for (const label of ["En pozo", "En construcción", "Terminado"]) {
    await expect(page.getByText(label, { exact: true })).toHaveCount(0);
  }
});

test("Emprendimientos: filtrar por estado de obra sin datos cargados muestra el estado vacío honesto", async ({ page }) => {
  await page.goto("/emprendimientos?estado=EN_POZO");

  await expect(page.getByText("No hay emprendimientos con ese estado de obra todavía.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Ver todos" })).toHaveAttribute("href", "/emprendimientos");
});
