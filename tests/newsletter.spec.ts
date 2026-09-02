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
// en Vercel) — los suscriptores de prueba se identifican con el prefijo
// "playwright-" y se borran al final para no dejar basura en la tabla real.
test.afterAll(async () => {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  await prisma.newsletterSubscriber.deleteMany({ where: { email: { startsWith: "playwright-" } } });
  await prisma.$disconnect();
});

test("Newsletter: submit exitoso con segmento elegido guarda el registro y muestra confirmación", async ({ page }) => {
  await page.goto("/insights");

  await page.getByRole("radio", { name: "Comprar" }).click();
  await page.getByLabel("Email").fill(uniqueEmail("comprar"));
  await page.getByRole("button", { name: "Suscribirme" }).click();

  await expect(page.getByText("¡Listo! Te vamos a escribir con contenido de comprar.")).toBeVisible();
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
  await page.goto("/insights");
  const email = uniqueEmail("dup");

  await page.getByRole("radio", { name: "Invertir" }).click();
  await page.getByLabel("Email").fill(email);
  await page.getByRole("button", { name: "Suscribirme" }).click();
  await expect(page.getByText(/¡Listo!/)).toBeVisible();

  await page.goto("/insights");
  // Barrera explícita: confirma que es el form fresco (estado "idle") antes
  // de interactuar, no la confirmación que dejó la primera vuelta — bajo
  // carga en paralelo, page.goto puede resolver antes de que la navegación
  // reemplace el DOM anterior.
  await expect(page.getByRole("button", { name: "Suscribirme" })).toBeVisible();
  await page.getByRole("radio", { name: "Invertir" }).click();
  await page.getByLabel("Email").fill(email);
  await page.getByRole("button", { name: "Suscribirme" }).click();
  // Timeout más generoso: este test hace 2 round-trips reales al server
  // action + Postgres en la misma corrida, y bajo carga en paralelo con el
  // resto de la suite el segundo puede tardar más que el default de 5s sin
  // que sea un bug real (confirmado: 100% estable corriendo en aislado).
  await expect(page.getByText("Ese email ya está suscripto.")).toBeVisible({ timeout: 15000 });
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
