import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Date.now() solo no alcanza: con --repeat-each o varios workers en
// paralelo, dos instancias del mismo test pueden arrancar en el mismo
// milisegundo y generar el mismo email "único", disparando un falso
// "ya está suscripto" entre tests que no deberían chocar entre sí.
function uniqueEmail(prefix: string) {
  return `playwright-${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
}

// La base de test ES la de producción (DATABASE_URL es la misma en local y
// en Vercel) — cada test borra SOLO el/los emails que él mismo creó, nunca
// un DELETE por prefijo en un afterAll: con fullyParallel:true (ver
// playwright.config.ts) los tests de este archivo se reparten entre varios
// workers, y afterAll corre una vez POR WORKER, no una vez al final de
// todo — un worker que termina antes podía borrar por prefijo la fila que
// OTRO worker acababa de precargar para "mismo email", haciendo que la
// segunda inserción pareciera nueva en vez de duplicada (bug real que
// causó exactamente esa falla intermitente antes de este fix).
async function deleteSubscriber(email: string) {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  await prisma.newsletterSubscriber.deleteMany({ where: { email } });
  await prisma.$disconnect();
}

test("Newsletter: submit exitoso con segmento elegido guarda el registro y muestra confirmación", async ({ page }) => {
  const email = uniqueEmail("comprar");
  await page.goto("/insights");

  await page.getByRole("radio", { name: "Comprar" }).click();
  await page.getByLabel("Email").fill(email);
  await page.getByRole("button", { name: "Suscribirme" }).click();

  await expect(page.getByText("¡Listo! Te vamos a escribir con contenido de comprar.")).toBeVisible();
  await deleteSubscriber(email);
});

test("Newsletter: submit sin elegir segmento muestra error de validación", async ({ page }) => {
  await page.goto("/insights");

  await page.getByLabel("Email").fill(uniqueEmail("sin-segmento"));
  await page.getByRole("button", { name: "Suscribirme" }).click();

  await expect(page.getByText("Elegí qué contenido te interesa recibir.")).toBeVisible();
});

test("Newsletter: email inválido muestra error inline sin borrar el segmento ya elegido", async ({ page }) => {
  await page.goto("/insights");

  await page.getByRole("radio", { name: "Vender" }).click();
  await page.getByLabel("Email").fill("no-es-un-email");
  await page.getByRole("button", { name: "Suscribirme" }).click();

  await expect(page.getByText("Ingresá un email válido.")).toBeVisible();
  await expect(page.getByRole("radio", { name: "Vender" })).toHaveAttribute("aria-checked", "true");
});

test("Newsletter: mismo email dos veces muestra 'ya está suscripto'", async ({ page }) => {
  // Precarga la fila directo en la base (no vía UI): repetir un round-trip
  // real de submit dentro del mismo test resultó ser inestable bajo carga
  // pesada en paralelo con el resto de la suite. Precargar aísla lo que
  // este test realmente quiere probar: que el server action detecta el
  // email ya existente.
  const email = uniqueEmail("dup");
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  await prisma.newsletterSubscriber.create({ data: { email, segment: "INVERSOR" } });
  await prisma.$disconnect();

  await page.goto("/insights");
  await page.getByRole("radio", { name: "Invertir" }).click();
  await page.getByLabel("Email").fill(email);
  await page.getByRole("button", { name: "Suscribirme" }).click();
  await expect(page.getByText("Ese email ya está suscripto.")).toBeVisible();

  await deleteSubscriber(email);
});

test("Newsletter: el grupo de segmento se navega con flechas del teclado", async ({ page }) => {
  await page.goto("/insights");

  const comprar = page.getByRole("radio", { name: "Comprar" });
  await comprar.focus();
  await expect(comprar).toHaveAttribute("tabindex", "0");

  await page.keyboard.press("ArrowRight");
  const vender = page.getByRole("radio", { name: "Vender" });
  await expect(vender).toHaveAttribute("aria-checked", "true");
  await expect(vender).toBeFocused();

  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("radio", { name: "Invertir" })).toHaveAttribute("aria-checked", "true");
});
