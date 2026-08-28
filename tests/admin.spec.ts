import { test, expect } from "@playwright/test";

// Credenciales de la cuenta de PRUEBA sembrada en prisma/seed.ts.
const ADMIN_EMAIL = process.env.ADMIN_TEST_EMAIL ?? "contacto@depaolapropiedades.com";
const ADMIN_PASSWORD = process.env.ADMIN_TEST_PASSWORD ?? "45kzeOAlad9G";

test("Rutas /admin sin sesión redirigen a login", async ({ page }) => {
  await page.goto("/admin/leads");
  await expect(page).toHaveURL(/\/admin\/login/);
});

test("Login correcto entra al panel y muestra los leads", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(ADMIN_EMAIL);
  await page.getByLabel("Contraseña").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Ingresar" }).click();

  await expect(page).toHaveURL(/\/admin\/leads/);
  await expect(page.getByRole("heading", { name: "Leads" })).toBeVisible();
});

test("Login incorrecto muestra error y no entra", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(ADMIN_EMAIL);
  await page.getByLabel("Contraseña").fill("contraseña-incorrecta");
  await page.getByRole("button", { name: "Ingresar" }).click();

  await expect(page.getByText("Email o contraseña incorrectos.")).toBeVisible();
  await expect(page).toHaveURL(/\/admin\/login/);
});

test("Administrador puede crear y eliminar una propiedad de prueba", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(ADMIN_EMAIL);
  await page.getByLabel("Contraseña").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Ingresar" }).click();
  await expect(page).toHaveURL(/\/admin\/leads/);

  await page.goto("/admin/properties/new");
  await page.getByLabel("Título").fill("Propiedad E2E Playwright");
  await page.getByLabel("Slug (URL)").fill("propiedad-e2e-playwright");
  await page.getByLabel("Descripción").fill("Creada por un test automatizado.");
  await page.getByLabel("Zona").selectOption({ index: 1 });
  await page.getByLabel("Agente a cargo").selectOption({ index: 1 });
  await page.getByRole("button", { name: "Crear propiedad" }).click();

  await expect(page).toHaveURL(/\/admin\/properties\//);
  await expect(page.getByRole("heading", { name: "Editar propiedad" })).toBeVisible();

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Eliminar propiedad" }).click();
  await expect(page).toHaveURL(/\/admin\/properties$/);
});
