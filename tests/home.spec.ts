import { test, expect } from "@playwright/test";

test("Home carga con hero y propiedades", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /años acompañando/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Recién publicadas" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Ver propiedades", exact: true })).toHaveAttribute("href", "/propiedades");
});

test("Home no tiene overflow horizontal en mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(hasOverflow).toBe(false);
});

test("Home en mobile: el botón de menú está visible y funciona sin scrollear (regresión)", async ({ page }) => {
  // Bug real: el wrapper del botón de menú mobile heredaba opacity-0/inert
  // del mismo mecanismo que oculta los links de escritorio mientras el
  // header está "transparente" sobre el hero — pero a diferencia de esos
  // links, no tenía ningún respaldo visible en mobile (la barra flotante
  // del pie del hero es hidden md:block). El usuario quedaba sin forma de
  // navegar hasta scrollear más allá del hero completo.
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  const menuButton = page.getByRole("button", { name: "Abrir menú" });
  await expect(menuButton).toBeVisible();
  await expect(menuButton).not.toHaveAttribute("aria-hidden", "true");

  await menuButton.click();
  await expect(page.getByRole("link", { name: "Campus Norte" })).toBeVisible();
});

test("Home en mobile: el header no parpadea al oscilar el scroll cerca del punto de transición (regresión)", async ({ page }) => {
  // Bug real reportado por el usuario: en mobile, el scroll táctil oscila
  // unos pocos píxeles justo en el punto donde el header pasa de
  // transparente a sólido (momentum, rebote elástico de iOS) — sin
  // histéresis, cada oscilación cruza el umbral exacto y reinicia a mitad
  // de camino las 4 transiciones CSS (fondo, tinte, nav, logo), viéndose
  // como un parpadeo constante.
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  // Encuentra el scrollY real donde el borde del hero cruza HEADER_HEIGHT.
  const threshold = await page.evaluate(() => {
    const heroEl = document.getElementById("home-hero")!;
    let lo = 0;
    let hi = document.documentElement.scrollHeight;
    while (hi - lo > 1) {
      const mid = Math.floor((lo + hi) / 2);
      window.scrollTo(0, mid);
      if (heroEl.getBoundingClientRect().bottom > 76) lo = mid;
      else hi = mid;
    }
    return hi;
  });

  // Oscila +/- unos pocos píxeles alrededor del umbral real y cuenta
  // cuántas veces cambia el estado sólido/transparente del header.
  const transitions = await page.evaluate(async (base) => {
    const header = document.querySelector("header")!;
    let prevSolid = header.className.includes("bg-bg");
    let count = 0;
    const offsets = [0, -3, 2, -5, 4, -2, 6, -8, 3, 0, -4, 5, -6, 2];
    for (const off of offsets) {
      window.scrollTo(0, base + off);
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r as FrameRequestCallback)));
      const solid = header.className.includes("bg-bg");
      if (solid !== prevSolid) count++;
      prevSolid = solid;
    }
    return count;
  }, threshold);

  // Sin histéresis esto cambiaría de estado muchas veces (una por cada
  // cruce del umbral exacto); con histéresis, a lo sumo una vez.
  expect(transitions).toBeLessThanOrEqual(1);
});
