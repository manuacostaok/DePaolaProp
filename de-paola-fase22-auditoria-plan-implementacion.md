# DE PAOLA PROPIEDADES 2.0 — FASE 22: PLAN DE IMPLEMENTACIÓN (de la auditoría al roadmap)

*Generado con `/plan-eng-review` a partir de "DE PAOLA — AUDITORÍA ACTUAL" (lectura de código + navegación real del deploy). Cada hallazgo de la auditoría fue re-verificado contra el código actual antes de entrar acá — ver columna "Confirmado" en la tabla de la sección 1. No se modificó ningún archivo del proyecto para producir este plan. No se ejecutaron migraciones. No se reescribe arquitectura, no se cambia el stack (Next.js 16 / Prisma 7 / PostgreSQL / Vercel), no se agregan librerías salvo las 3 decisiones explícitas de la sección 2.*

---

## 0. Decisiones de alcance ya tomadas con el usuario

Antes de escribir el plan se resolvieron 4 decisiones arquitectónicas que la auditoría dejaba abiertas (todas con AskUserQuestion, todas eligieron la opción recomendada):

| # | Decisión | Elegido | Por qué |
|---|---|---|---|
| D1 | Rate limiting en `/admin/login` | **Contador en Postgres** (tabla nueva, sin dependencias) | Vercel es serverless — un contador en memoria se resetea en cada cold start. Postgres ya está. |
| D2 | Alcance de `/mercado` | **Construir versión mínima real ahora** (oferta activa + Insights categoría Mercado) | El dato ya existe en `Property`. No depende de De Paola. Cierra el 404 con contenido real, no relleno. |
| D3 | Clustering de pines en mapa de resultados | **`leaflet.markercluster`** (dependencia nueva, chica, específica) | Es el estándar de facto para Leaflet — reinventar clustering con 200+ propiedades reales es peor uso del tiempo que una librería madura de ~30kb. |
| D4 | Integración de GA4 | **`@next/third-parties`** (paquete oficial de Vercel/Next) | "Boring by default": lo mantiene el mismo equipo de Next, resuelve carga diferida y consentimiento sin reinventar la inyección de `gtag.js`. |

Estas 4 son las únicas dependencias nuevas de todo el plan: `leaflet.markercluster` (~30kb) y `@next/third-parties` (oficial). Todo lo demás usa lo que ya está instalado.

---

## 1. Hallazgos validados y clasificación por severidad

Cada fila fue confirmada leyendo el código real (columna Confirmado = archivo:línea verificado en esta sesión), no solo aceptando el texto de la auditoría.

| # | Hallazgo | Severidad | Confirmado | Fase |
|---|---|---|---|---|
| 1 | Contraseña real (`45kzeOAlad9G`) hardcodeada para `contacto@depaolapropiedades.com` (email real de la inmobiliaria) | 🔴 **Critical** | `prisma/seed.ts` + `tests/admin.spec.ts` (grep confirma el valor literal en ambos) | 1 |
| 2 | Server actions admin (`createProperty`, `updateProperty`, `deleteProperty`, etc.) no verifican sesión dentro de la función | 🟠 **High** | `app/admin/(dashboard)/properties/actions.ts` — sin `getSession()`, sin `import` de `lib/session` | 1 |
| 3 | Sin rate limiting en `/admin/login` | 🟠 **High** | `app/admin/login/` — sin grep de rate-limit/attempts | 1 |
| 4 | `/mercado` — 404 sin diseño, enlazado desde footer de todo el sitio | 🟠 **High** | `lib/nav.ts:65` enlaza `/mercado`; `app/mercado/` no existe | 2 |
| 5 | `/favoritos` — 404, sin página de destino | 🟠 **High** | `app/favoritos/` no existe; `lib/use-favorites.ts` sí existe y funciona | 2 |
| 6 | Error de hidratación React #418 reproducible en Home/`/propiedades` | 🟠 **High** | `components/layout/header.tsx:118,131,138,147` usa `inert={transparent}` en 4 elementos — candidato confirmado a existir en código, causa raíz aún sin diagnosticar en runtime | 2 |
| 7 | Sin `canonical` en ninguna página | 🟡 **Medium** | 0 matches de `canonical` en `app/**/*.tsx` reales (el único match era un parámetro de URL en el importer, no metadata) | 3 |
| 8 | Sin `loading.tsx` / `error.tsx` / `global-error.tsx` | 🟡 **Medium** | 0 archivos con esos nombres en todo `app/` | 3 |
| 9 | `lifestyleContent` existe en el modelo pero no se renderiza | 🟡 **Medium** | `prisma/schema.prisma:123` define el campo; 0 archivos `.tsx` lo referencian | 3 |
| 10 | Sin `BreadcrumbList` en JSON-LD | 🟡 **Medium** | Solo aparece mencionado en `de-paola-fase15-seo.md`/`fase6-zonas.md` (docs de fase), no en código real | 3 |
| 11 | Cero eventos de Analytics/GA4 instrumentados | 🟡 **Medium** | 0 matches de `gtag`/`googletagmanager`/`G-XXXXXX` en `app/` | 4 |
| 12 | Sin filtro de características ni ordenamiento en el buscador | 🟡 **Medium** | `lib/search.ts:58` (`buildWhere`) no lee `PropertyFeature`; `orderBy` es fijo (`isSample asc, publishedAt desc`) | 5 |
| 13 | Mapa de zona es un placeholder estático | 🟡 **Medium** | `app/zonas/[zona]/page.tsx:89` — texto literal `"Mapa de {neighborhood.name}"` | 5 |
| 14 | Sin clustering en mapa de resultados | 🟡 **Medium** | Componente de mapa usa Leaflet sin `markercluster` en `package.json` | 5 |
| 15 | Sin `@@index` en campos de filtro (zona, operación, precio, tipo) | 🟡 **Medium** | `prisma/schema.prisma` — único `@@` es `@@unique([userId, propertyId])` en `Favorite` | 12 (transversal) |
| 16 | `/api/properties/search` existe sin consumidor en el frontend | 🟢 **Low** | 0 archivos `.tsx` referencian esa ruta | 8 (documentar, no romper) |
| 17 | Logo servido desde `static.wixstatic.com` (dependencia de tercero) | 🟢 **Low** | `lib/nav.ts` — `logoUrl` apunta a Wix | 6 |
| 18 | Íconos de Leaflet desde `unpkg.com` en runtime | 🟢 **Low** | Patrón ya documentado como intencional en el propio código | — |
| 19 | `/contacto` sin `LeadType` de "consulta general" | 🟢 **Low** | `enum LeadType` (schema.prisma:50) solo tiene `COMPRAR/ALQUILER/VENDER/TASAR/INVERTIR` | 5 |
| 20 | Sin newsletter segmentado en Insights | 🟢 **Low** | No hay componente de newsletter en `app/insights/` | 5 |
| 21 | Panel de tasaciones no es vista separada en admin | 🟢 **Low** | Conviven en Leads filtrable — funciona, es una simplificación válida | — (no incluido como tarea, es decisión de diseño aceptable) |
| 22 | Dominio propio + redirects 301 | 🟢 **Low** (bloqueante de negocio) | Deploy sigue en `de-paola-prop.vercel.app` | 6 |
| 23 | Sin monitoreo de errores / backups documentados | 🟢 **Low** | No hay Sentry ni doc de backup de Neon | 6 |
| 24 | CRM/n8n sin conectar | 🟢 **Low** (depende de decisión externa) | 0 webhooks salientes en ninguna server action | 7 |
| 25 | De Paola AI no iniciado | 🟢 **Low** (explícitamente baja prioridad) | `lib/search.ts`/`lib/valuation.ts` ya aislados como funciones puras, listos para reutilizar | 8 |

**Nota sobre el hallazgo #6 (hidratación):** confirmar el uso de `inert` en el código no es lo mismo que confirmar que ES la causa del error #418 — eso requiere un paso de diagnóstico en runtime que está en el plan de la Fase 2 como su propio primer paso, no como una corrección a ciegas.

---

## 2. Qué ya existe y se reutiliza (no se reconstruye)

| Necesidad | Ya existe en | Se reutiliza así |
|---|---|---|
| Datos de favoritos | `lib/use-favorites.ts` (localStorage + `useSyncExternalStore`) | `/favoritos` lee los IDs con este mismo hook, sin tocarlo |
| Cards de propiedad | `components/ui/property-card.tsx` (asumido por convención del proyecto) | `/favoritos` renderiza la misma grilla que `/propiedades` |
| Motor de búsqueda | `lib/search.ts` (`buildWhere`, `searchProperties`) | Fase 5 extiende `buildWhere` para features/orden, no crea un motor paralelo |
| Motor de tasación | `lib/valuation.ts` | Fase 8 (IA) lo reutiliza tal cual si algún día hay búsqueda conversacional |
| Auth/sesión | `lib/session.ts` (`getSession`, JWT + cookie httpOnly) | Fase 1 lo importa dentro de cada server action, no crea un sistema nuevo |
| CSV import (parser + normalización de headers) | `lib/csv.ts`, `app/admin/(dashboard)/properties/import-actions.ts` | Ninguna fase de este plan lo toca — ya cerrado |
| Datos de "estilo de vida" de zona | `Neighborhood.lifestyleContent` (schema) | Fase 3 solo agrega el JSX que lo lee — 0 cambios de schema |
| Coordenadas de zona | `Neighborhood.lat`/`lng` (ya usadas en `PropertyLocation`) | Fase 5 las reutiliza para el mapa interactivo de zona |
| Endpoint REST de búsqueda | `app/api/properties/search/route.ts` | Fase 8 lo documenta como el punto de entrada natural para IA — no se reescribe |

---

## 3. NOT in scope (considerado y diferido explícitamente)

| Ítem | Por qué queda afuera de este plan |
|---|---|
| Reescribir arquitectura (Next.js/Prisma/Postgres/Vercel) | Instrucción explícita del usuario — la auditoría tampoco lo recomienda |
| Revertir el rediseño elliman-inspired | Decisión de diseño ya validada y documentada, mejor que la propuesta original |
| Restaurar el bottom nav mobile | Sacado a pedido explícito del cliente (commit `bb6ffb0`) — los docs de fase que lo mencionan están desactualizados, no el código |
| Vista separada de tasaciones en admin (Fase 19 original) | La versión actual (Leads filtrable por "Tasar") funciona; separar la vista es una mejora de UX de bajo impacto, no un bug |
| Roles adicionales de admin ("Editor de contenido") | El propio plan original lo dejó como propuesta a confirmar, no pendiente técnico |
| Informes de mercado en PDF descargable | Explícitamente fuera de alcance según el documento de pendientes del proyecto |
| Elegir CRM concreto y conectar n8n | Depende de una decisión de negocio que el propio brief marcó como posterior al build inicial |
| Construir "De Paola AI" | Explícitamente de baja prioridad en el brief; además depende de tener datos reales de uso (Fase 4) para justificar la inversión |
| Migrar el logo fuera de Wix ahora mismo | Dependencia real pero de bajo impacto inmediato — se resuelve naturalmente al mover el dominio (Fase 6), no antes |

---

## 4. Plan por fases

Cada fase lista: objetivo, archivos a tocar, cambios, dependencias, riesgos, cómo verificar, tests.

### FASE 1 — Seguridad ✅ IMPLEMENTADA (2026-09-02)

**Estado:** completa. Contraseña real rotada en producción, hardcodes sacados del código, defensa en profundidad agregada a las 6 acciones admin (`properties`, `agents`, `insights`, `leads`, `import-actions`), rate limiting funcionando con incremento atómico (`{ increment: 1 }` — se detectó y corrigió una condición de carrera real durante el testing, ver nota abajo). Suite completa de Playwright en verde (21/21, incluye 2 tests nuevos de rate limiting). Lint y build limpios.

**Nota de implementación no prevista en el plan original:** el diseño inicial de la tarea 1.4 usaba lectura-y-suma en JS (`failedLoginCount: agent.failedLoginCount + 1`) para el incremento. Al testear con Playwright se detectó que esto pierde incrementos bajo escritura concurrente (exactamente el escenario de un ataque de fuerza bruta real). Se corrigió a `{ increment: 1 }` de Prisma, que traduce a un `UPDATE ... SET x = x + 1` atómico en Postgres — sin este cambio, el rate limiter podía subcontar intentos fallidos bajo carga concurrente.

**Objetivo:** cerrar la exposición de credenciales y las dos brechas de defensa en profundidad que la auditoría encontró.

**Acción inmediata, fuera de código (no bloquea nada de lo de abajo):** rotar la contraseña de `contacto@depaolapropiedades.com` en producción hoy mismo desde el panel `/admin` (o directo en la base). Esto no requiere ningún cambio de código — es un dato, no una migración.

| Tarea | Archivos | Cambios | Riesgos |
|---|---|---|---|
| 1.1 Sacar el hardcode de la contraseña de prueba | `prisma/seed.ts` | La contraseña de siembra pasa a leerse de `process.env.SEED_ADMIN_PASSWORD` (con un valor por defecto solo si la env var no está, y un `console.warn` si se usa el default) — nunca un literal en el código. Documentar la nueva env var en `.env.example`. | Si se olvida setear `SEED_ADMIN_PASSWORD` en Vercel antes de una corrida real, el seed usaría el default — mitigado con el `console.warn` explícito y el `update: {}` existente que ya evita pisar contraseñas reales. |
| 1.2 Sacar el mismo hardcode de los tests | `tests/admin.spec.ts` | Ya usa `process.env.ADMIN_TEST_PASSWORD ?? "45kzeOAlad9G"` — sacar el fallback hardcodeado, requerir la env var en CI/local (`.env.test` o similar, gitignoreado). | Los tests fallarían localmente si no se setea la env var — documentar en `AGENTS.md`/`CLAUDE.md`. |
| 1.3 Defensa en profundidad en server actions admin | `app/admin/(dashboard)/properties/actions.ts`, `app/admin/(dashboard)/agents/actions.ts`, `app/admin/(dashboard)/insights/actions.ts` (y cualquier otro `actions.ts` bajo `app/admin/`) | Cada función exportada empieza con `const session = await getSession(); if (!session) throw new Error("No autorizado.")` — mismo patrón ya usado en `import-actions.ts` (que sí lo tiene, confirmado esta sesión). Para acciones que ya requieren rol ADMINISTRADOR (ej. borrar agentes), agregar el chequeo de rol también. | Ninguno funcional — es una verificación adicional sobre un flujo que ya está protegido por middleware; el único riesgo es un typo que rompa el flujo feliz, cubierto por los tests E2E existentes de `admin.spec.ts`. |
| 1.4 Rate limiting en `/admin/login` (Decisión D1, revisada tras outside voice; comportamiento de falla resuelto) | `prisma/schema.prisma` (`Agent`), `app/admin/login/actions.ts` | **Revisado tras la segunda opinión (ver sección "Outside Voice" al final):** en vez de una tabla `LoginAttempt` nueva, agregar 2 columnas a `Agent`: `failedLoginCount Int @default(0)` y `lockedUntil DateTime?`. `lockedUntil` se lee del MISMO `findUnique` por email que el login ya hace para obtener el `passwordHash` — no es una consulta nueva. Si `lockedUntil` está en el futuro, rechazar con mensaje genérico antes de verificar la contraseña. Al fallar un login: incrementar `failedLoginCount`; al llegar a 5, setear `lockedUntil = now() + 15min`. Al loguear con éxito: resetear `failedLoginCount = 0`. **Ese `update` de incremento/reset corre DESPUÉS de decidir el resultado del login y es best-effort** (try/catch que loguea pero nunca bloquea ni altera la respuesta al usuario) — el login ya se resolvió antes de llegar a ese paso, así que un fallo ahí nunca compromete ni la seguridad ni la disponibilidad. Sin tabla nueva, sin política de purga, sin logging de cada intento individual (aceptable con 2 cuentas admin). | Requiere `prisma db push` (aditivo, columnas nuevas con default — no destructivo, verificar con `prisma migrate diff` antes). El incremento/reset de `failedLoginCount` es parte del mismo `update` de login, no una tabla ni un flujo de escritura separado — evita el problema de "iterar en dev contra una tabla que vive en la misma base que producción" que señaló la segunda opinión. |

**Dependencias:** 1.4 depende de que 1.1 esté resuelto primero (no tiene sentido armar rate limiting sobre una contraseña ya filtrada — hay que rotarla ya, en paralelo, sin esperar al código).

**Cómo verificar:**
- `npx tsc --noEmit` + `npm run lint` limpios.
- Login manual con la contraseña rotada real (no la de prueba) funciona en producción.
- 6 intentos fallidos seguidos contra `/admin/login` → el 6to devuelve el mensaje de bloqueo, no un error de servidor.
- Un `grep -r "45kzeOAlad9G"` sobre todo el repo devuelve cero resultados.

**Tests:**
- `tests/admin.spec.ts`: actualizar para leer la contraseña de `ADMIN_TEST_PASSWORD` (ya lo hace, solo sacar el fallback).
- Nuevo test: `tests/rate-limit.spec.ts` — 6 intentos fallidos consecutivos, el 6to debe mostrar el mensaje de bloqueo (no el de "credenciales incorrectas").
- Nuevo test unitario (o E2E ligero): una server action admin llamada sin sesión (simulando bypass del middleware) debe rechazar — esto es lo único de esta fase que un test E2E normal no cubre porque siempre pasa por el middleware; vale la pena un test que invoque la función directamente.

---

### FASE 2 — Bugs críticos

**2.1 y 2.2 — hidratación: ✅ DIAGNOSTICADO Y CORREGIDO (2026-09-02)**

**Diagnóstico real (no se pudo reproducir en `npm run dev` ni en `next start` local — solo en el deploy real de Vercel, consistentemente en Home, nunca en `/propiedades` tras 4 recargas limpias):**
Se pidió el HTML crudo de `https://de-paola-prop.vercel.app/` 5 veces seguidas (`fetch` con `cache: "no-store"`, headers `x-vercel-cache: HIT`, `age` estable) — el header SIEMPRE llega server-side en su estado "sólido" (`aria-hidden="false"`, sin el div de tinte del hero), nunca en el estado "transparente" que le corresponde a Home. `header.tsx` es un Client Component dentro del layout raíz compartido por todas las rutas, y calcula `isHome`/`transparent` con `usePathname()` + `useState`. Bajo ISR (`revalidate=60`), ese cálculo puede quedar cacheado sin el pathname real de la request, mientras el cliente sí hidrata con el pathname real (`/`) y computa `transparent=true` — la discrepancia servidor/cliente en la presencia del div de tinte y en `inert`/`aria-hidden` de los `<nav>` es lo que dispara el error #418. Como el `transparent`/`isHome` de esta rama solo importa en Home, esto explica por qué nunca se reprodujo en `/propiedades` (ahí es `false` en ambos lados siempre).

**Corrección aplicada:** `components/layout/header.tsx` — mismo patrón defensivo que `HeroVideo` ya usa en este mismo código (confirmado al leerlo: arranca en un estado "seguro" y recién cambia en un efecto post-mount). Se agregó un estado `mounted` (arranca en `false`, se pone en `true` en un `useEffect` vacío) y se cambiaron `transparent` y las dos condicionales `isHome && (...)` (el div de tinte y la barra de navegación al pie del hero) a `mounted && isHome && ...` / `mounted && transparent`. El primer render — servidor Y primer paint del cliente — ahora siempre coincide exactamente con lo que el cache realmente sirve; el header pasa a su estado real (transparente sobre el hero) una fracción de segundo después del mount, igual de imperceptible que la transición de HeroVideo de imagen a video.

**Verificado — CONFIRMADO EN PRODUCCIÓN:** reproducido el error 2/2 veces en el deploy real antes del fix; tras el deploy con el fix, 5/5 recargas limpias del mismo `https://de-paola-prop.vercel.app/` sin el error #418; header transparente-sobre-hero visualmente idéntico a antes (screenshot verificado); `/favoritos` y `/mercado` responden 200 en producción real. Suite completa de Playwright (25/25) en verde.
| 2.3 Construir `/favoritos` | Nuevo: `app/favoritos/page.tsx` | Client Component (o Server Component + Client wrapper) que lee los IDs de `useFavorites()`, hace un `prisma.property.findMany({ where: { id: { in: ids } } })` vía una server action o ruta, y renderiza con el mismo `PropertyCard`/grilla que usa `/propiedades`. Estado vacío: mensaje + CTA a `/propiedades` (no una grilla vacía sin contexto). | Ninguno arquitectónico — es composición de piezas existentes. El único matiz: como los IDs viven en `localStorage` (cliente), la página no puede ser 100% Server Component; necesita un Client Component que lea los IDs y después pida los datos (via ruta API o server action que reciba la lista de IDs). |
| 2.4 Construir `/mercado` (Decisión D2, versión mínima) | Nuevo: `app/mercado/page.tsx` | Sección 1: oferta activa agrupada por zona y tipo (`prisma.property.groupBy` o un par de `findMany` con `count`), sin precios promedio inventados (mismo principio que `hasMarketData`). Sección 2: artículos de `Insights` con `category.slug === "mercado"` (verificar que esa categoría exista o crearla en el seed si no). | Si la categoría "Mercado" no existe en `Category`, hay que agregarla al seed (aditivo, no destructivo — mismo patrón `upsert` del resto del seed). |

**Dependencias:** 2.2 depende 100% del resultado de 2.1 — no se escribe el fix hasta tener el mensaje de error real, tal como recomienda la propia auditoría.

**Cómo verificar:**
- Consola del navegador limpia (sin `Minified React error #418`) en Home y `/propiedades`, en una pestaña nueva, verificado tanto en `npm run dev` como contra el build de producción (`npm run build && npm run start`).
- `/mercado` y `/favoritos` responden 200 con el header/footer de la marca, no la página de error genérica de Next.
- Favoritos: guardar 2 propiedades desde `/propiedades`, navegar a `/favoritos`, confirmar que aparecen; sacar una, confirmar que desaparece sin recargar.

**Tests:**
- `tests/favoritos.spec.ts` (nuevo): guardar favorito en ficha de propiedad → navegar a `/favoritos` → aparece la propiedad guardada. Caso vacío: sin favoritos guardados, `/favoritos` muestra el estado vacío con CTA, no un error.
- `tests/mercado.spec.ts` (nuevo): `/mercado` devuelve 200, muestra al menos la sección de oferta activa (aunque esté vacía, no debe romper) y no muestra ningún precio promedio salvo que `hasMarketData` sea real en el futuro.
- Regresión: `tests/home.spec.ts` y el resto de la suite E2E deben seguir en verde después del fix de hidratación (correr la suite completa, no solo los tests nuevos — un fix en `header.tsx` toca cada página).

**FASE 2 — ✅ COMPLETA (2026-09-02).** 2.1/2.2 diagnosticados y corregidos (ver arriba). 2.3 `/favoritos` construido (`app/favoritos/page.tsx` + `components/favoritos/favorites-grid.tsx` + `app/favoritos/actions.ts` + `lib/search.ts#getPropertiesByIds`, reusando `PropertyCard`/`useFavorites` como especificaba el plan; se agregó también un link en el footer ya que no había ninguna forma de llegar a la página desde la navegación). 2.4 `/mercado` construido (`app/mercado/page.tsx`) con oferta activa agrupada por zona (conteos reales, sin precios promedio inventados) + artículos de la categoría "mercado" de Insights (ya existía, no hubo que crearla). Suite completa en verde (25/25, incluye 4 tests nuevos), lint y build limpios.

---

### FASE 3 — SEO / calidad técnica
**Objetivo:** cerrar las brechas que la propia Fase 15 (SEO) del proyecto original ya había especificado y no se habían implementado.

| Tarea | Archivos | Cambios | Riesgos |
|---|---|---|---|
| 3.1 `canonical` en metadata | Cada `generateMetadata` existente (`app/propiedades/page.tsx`, `app/propiedades/[slug]/page.tsx`, `app/zonas/[zona]/page.tsx`, `app/emprendimientos/[slug]/page.tsx`, `app/insights/[slug]/page.tsx`, etc.) | Agregar `alternates: { canonical: \`${SITE_URL}${pathname-sin-querystring}\` }` a cada uno. Para `/propiedades` con filtros por querystring, el canonical apunta a `/propiedades` sin parámetros (evita que Google indexe cada combinación de filtros como página separada). | Ninguno — es metadata pura, no afecta runtime ni datos. |
| 3.2 `loading.tsx` / `error.tsx` | Nuevo: `app/loading.tsx`, `app/error.tsx`, `app/global-error.tsx` | `loading.tsx` con un skeleton simple acorde al design system (Fase 12). `error.tsx` (Client Component, requiere `"use client"`) con mensaje acorde a la marca + botón de reintentar, logueando el error (ver Fase 6 para dónde loguearlo). `global-error.tsx` cubre errores en el layout raíz mismo. | Ninguno funcional — Next.js ya maneja el caso sin esto, esto solo mejora la experiencia percibida. |
| 3.3 `lifestyleContent` en página de zona | `app/zonas/[zona]/page.tsx` | Agregar una sección (con el mismo tratamiento visual que `description`/`transportContent`/`schoolsContent`, que ya se renderizan) que lea `neighborhood.lifestyleContent` si existe. | Ninguno — el dato ya está en la base para las 4 zonas (marcado `needsReview: true`, con su aviso visible ya existente). |
| 3.4 `BreadcrumbList` en JSON-LD | `components/seo/json-ld.tsx` (o donde viva el componente `JsonLd` usado en fichas) | Agregar un segundo bloque JSON-LD tipo `BreadcrumbList` en las páginas que ya tienen breadcrumb visual en HTML (ficha de propiedad, emprendimiento, artículo) — reusar el mismo array de breadcrumbs que ya arma el HTML, no duplicar la lógica. | Ninguno. |

**Dependencias:** ninguna entre sí — las 4 tareas son independientes y paralelizables.

**Cómo verificar:**
- Ver el `<link rel="canonical">` en el `<head>` de al menos 3 páginas distintas (ficha de propiedad, zona, `/propiedades?zona=martinez`).
- Simular un error de datos (ej. desconectar la base localmente) y confirmar que se ve `error.tsx` con la marca, no la página genérica de Next.
- Página de zona muestra el bloque de "estilo de vida" cuando `lifestyleContent` no es null.
- Validar el JSON-LD de `BreadcrumbList` con el [Rich Results Test de Google](https://search.google.com/test/rich-results) contra una ficha de propiedad real.

**Tests:**
- `tests/seo.spec.ts` (nuevo): lee el HTML de 2-3 páginas y verifica presencia de `<link rel="canonical">` con el valor esperado (sin querystring en `/propiedades`).
- Test de `error.tsx`: difícil de automatizar en E2E sin mockear un fallo de datos — cubrir con un test unitario si `error.tsx` tiene lógica propia, o dejar como verificación manual documentada en el test plan (ver artefacto de test plan, sección 8).
- Extender `tests/property-detail.spec.ts` (o el que corresponda) para verificar el `lifestyleContent` cuando existe.

---

### FASE 4 — Analytics
**Objetivo:** instrumentar los 12 eventos ya definidos en `de-paola-fase20-analytics-cro.md`, sin inventar eventos nuevos.

| Tarea | Archivos | Cambios | Riesgos |
|---|---|---|---|
| 4.1 Instalar y configurar GA4 (Decisión D4) | `package.json`, `app/layout.tsx` | `npm install @next/third-parties`. En `app/layout.tsx`: `<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />` dentro del `<body>`. Nueva env var `NEXT_PUBLIC_GA_ID` (pública a propósito, es el ID de medición, no un secreto). | Ninguno — el componente ya maneja la carga diferida. Si `NEXT_PUBLIC_GA_ID` no está seteada, no debe romper el build (verificar que el componente tolere `gaId` vacío o condicionar el render). |
| 4.2 Los 12 eventos de la Fase 20 | Un helper nuevo `lib/analytics.ts` + 12 puntos de disparo distribuidos en el código existente | `lib/analytics.ts` exporta una función `trackEvent(name, params)` que llama a `window.gtag('event', name, params)` con guarda `typeof window !== "undefined"`. Los 12 disparos van en los componentes/acciones donde el evento ya ocurre — ver tabla de mapeo abajo. | El riesgo real es doble disparo o evento faltante por desprolijidad al tocar 12 puntos distintos — mitigado con un test E2E por evento (ver Tests). |
| 4.3 Search Console | — (fuera de código) | Verificar propiedad del dominio en Google Search Console (usando el dominio de Vercel por ahora, re-verificar cuando se mueva a dominio propio en Fase 6). | Ninguno. |
| 4.4 Lighthouse baseline | — (fuera de código, o un script) | Correr Lighthouse (CLI o Chrome DevTools) contra Home, `/propiedades` y una ficha de propiedad en producción. Documentar los 4 números (LCP, INP, CLS, score mobile) en este mismo repo (ej. `PERFORMANCE-BASELINE.md`) para tener contra qué comparar después. | Ninguno — es medición, no cambia código. Hacerlo DESPUÉS de la Fase 2 (fix de hidratación), no antes, para que el baseline sea representativo del sitio arreglado. |

**Mapeo evento → disparo (de `de-paola-fase20-analytics-cro.md`):**

| Evento | Dónde se dispara |
|---|---|
| `property_view` | `app/propiedades/[slug]/page.tsx` (Server Component — requiere un pequeño Client Component wrapper para llamar `trackEvent`, ya que `window.gtag` no existe en el servidor) |
| `property_search` | `lib/search.ts` no puede disparar eventos de cliente — el disparo va en el componente de formulario de búsqueda cuando se ejecuta la búsqueda |
| `property_filter` | Mismo componente de búsqueda, en el `onChange` de cada filtro individual |
| `contact_click` | Botones de email/teléfono en ficha de propiedad y ficha de agente |
| `whatsapp_click` | Botón de WhatsApp (ficha de propiedad, bottom bar del hero, ficha de agente) |
| `valuation_start` | Wizard de tasación, paso 1 |
| `valuation_submit` | Wizard de tasación, al completar |
| `visit_request` | Formulario de solicitud de visita |
| `favorite_property` | `useFavorites().toggle()` — agregar el `trackEvent` ahí mismo, un solo punto para toda la app |
| `share_property` | Botón de compartir en ficha de propiedad |
| `ai_search` | No aplica todavía — De Paola AI no existe (Fase 8). Dejar el evento definido pero sin disparo real hasta esa fase. |
| `lead_created` | Cada server action que crea un `Lead` (comprar, alquilar, vender, tasar, invertir) — con `type` del lead como parámetro |

**Dependencias:** 4.2 depende de 4.1 (necesita `gtag` cargado). 4.4 depende de que la Fase 2 (hidratación) esté resuelta para que el número sea real.

**Cómo verificar:**
- Google Analytics Realtime muestra eventos al navegar el sitio en producción.
- Cada uno de los 12 eventos aparece al menos una vez en el reporte de eventos de GA4 después de ejercitar manualmente cada flujo.
- Lighthouse corrido y documentado, con los 4 números de la Fase 16 anotados (aunque no cumplan el objetivo todavía — el punto es tener la línea de base).

**Tests:**
- Difícil de testear en E2E sin mockear `window.gtag` — para cada uno de los 12 puntos de disparo, agregar un test que mockee `window.gtag` (`page.addInitScript` en Playwright) y verifique que se llama con el nombre de evento correcto al ejercitar la acción. Esto puede vivir en un archivo nuevo `tests/analytics.spec.ts` que reutiliza los flujos ya cubiertos por `leads.spec.ts`/`tasacion.spec.ts`/`property-detail.spec.ts`, solo agregando la aserción de `gtag`.
- **Regresión obligatoria:** `favorite_property` toca `useFavorites()`, que ya tiene comportamiento cubierto por `property-detail.spec.ts` ("El botón de favorito persiste en localStorage") — extender ESE test para verificar también el evento, no crear uno paralelo que pueda divergir.

---

### FASE 5 — Experiencia inmobiliaria
**Objetivo:** cerrar la brecha entre lo que la Fase 3 original pedía para el buscador/zona y lo que hoy existe.

*Esta fase pasó por `/plan-design-review` (ver "Diseño — Fase 5" al final del documento) — las tareas de abajo ya incorporan lo que esa review encontró leyendo el código real de `components/search/`, no solo la descripción funcional original.*

| Tarea | Archivos | Cambios | Riesgos |
|---|---|---|---|
| 5.1 Filtro de características | `lib/search.ts` (`buildWhere`), `components/search/filter-panel.tsx` | `buildWhere` acepta `caracteristicas?: string[]` (keys de `PropertyFeature`) y agrega `where.features = { some: { key: { in: caracteristicas } } }` (cumple ALGUNA, no todas — más permisivo, evita 0 resultados por combinar filtros estrictos). En `filter-panel.tsx`, agregar un checkbox por característica **inline en el mismo `<form>`, con el mismo markup que ya usa "Cochera"** (`label.flex.items-center.gap-2.rounded-control.border-line`, línea 78-81 de ese archivo) — no un componente nuevo. Envolver el grupo en `<fieldset><legend class="sr-only">Características</legend>` para que un lector de pantalla anuncie el grupo (hoy "Cochera" es un único checkbox suelto, no necesita fieldset; un grupo de varios sí). Las keys se generan dinámicamente con `prisma.propertyFeature.findMany({distinct: ['key']})`, nunca hardcodeadas. | Con pocas propiedades reales, pocas keys van a aparecer — comportamiento correcto, no hay nada que arreglar. **Decisión ya tomada (ver Diseño — Fase 5):** los checkboxes van inline como "Cochera" — si el inventario real (200+) genera demasiadas keys y el form se ve saturado, se resuelve con datos reales delante, no ahora. |
| 5.2 Ordenamiento de resultados | `lib/search.ts` (`searchProperties`), `components/search/search-results.tsx` | Nuevo parámetro `orden?: "precio_asc" \| "precio_desc" \| "recientes" \| "superficie"`, mapeado a `orderBy`. El `<Select>` de orden va en la misma fila que ya existe en `search-results.tsx:22-41` (el header con el contador "N propiedades" + el toggle lista/mapa) — entre el contador y el toggle, mismo tratamiento visual que el resto de los `Select` del proyecto. Mantener `isSample: "asc"` como criterio base salvo que el orden elegido sea por precio (ahí no discriminar — un comprador ordenando por precio quiere ver TODO ordenado, ejemplo o no). | Ninguno técnico — es una fila que ya existe, solo se agrega un control más. |
| 5.3 Mapa interactivo real en `/zonas/[zona]` | `app/zonas/[zona]/page.tsx`, extraer `components/map/base-map.tsx` desde `components/search/property-map.tsx` | Reemplazar el `div` placeholder (línea 89) por un mapa real. **Reusar el mismo patrón de carga que ya existe en `search-results.tsx:11-14`**: `dynamic(..., { ssr: false, loading: () => <div className="flex h-[...] items-center justify-center rounded-card border border-line bg-bg-alt text-ink-soft">Cargando mapa…</div> })` — mismo texto, mismas clases, cero inconsistencia visual entre los 3 mapas del sitio (ficha, zona, resultados). Centrado en `neighborhood.lat/lng`, con las propiedades activas de esa zona como pines si el tiempo alcanza. | Ninguno arquitectónico. |
| 5.4 Clustering en mapa de resultados (Decisión D3) | `package.json`, `components/search/property-map.tsx` | `npm install leaflet.markercluster @types/leaflet.markercluster`. Envolver los marcadores en un `MarkerClusterGroup`, con el ícono de clúster estilizado en `brand` (`#00385C`, no el azul default de la librería) para que no se sienta un plugin pegado — un solo `iconCreateFunction` de unas 10 líneas alcanza, sin sumar `react-leaflet-cluster` como segunda dependencia. | Con 11 propiedades el clustering casi no se nota — se construye igual porque el inventario real lo va a necesitar. |
| 5.5 Newsletter segmentado en Insights | Nuevo: `prisma/schema.prisma` (modelo `NewsletterSubscriber`), `components/insights/newsletter-form.tsx`, server action asociada | Tabla separada `NewsletterSubscriber { id, email, segment: "COMPRADOR" \| "VENDEDOR" \| "INVERSOR", createdAt }` — no es un `Lead` (no infla el embudo de la Fase 20 con contactos que no son leads comerciales). **Formulario pide el segmento en el alta** (Decisión ya tomada — ver Diseño — Fase 5): 3 chips tipo pill-button (`buttonVariants({variant: "outline"})` con estado activo en `bg-brand text-white`, mismo componente que ya existe) + un input de email, sin Select genérico — más rápido de completar que un dropdown para elegir entre solo 3 opciones. | Modelo nuevo aditivo — no destructivo, pero decidido antes de implementar para no migrar dos veces. |

**Dependencias:** 5.4 depende de que 5.3 no esté en curso al mismo tiempo si ambas tocan el mismo módulo de mapa — por eso la tarea 5.3 ya incluye extraer `components/map/base-map.tsx` compartido antes de que ambas lo necesiten (ya no es una recomendación a confirmar en implementación, quedó resuelto en la review de diseño).

**Especificación de estados (Fase 5 — pasada de diseño "Interaction State Coverage"):**

| Feature | Loading | Vacío | Error | Éxito |
|---|---|---|---|---|
| Filtro por característica | — (form GET, recarga de página, no hay estado de carga de cliente) | 0 resultados con esa característica → reusa el fallback YA EXISTENTE de `search-results.tsx:43-48` (Callout "No encontramos... te mostramos otras") — no hay que construir nada nuevo acá | N/A (query siempre resuelve) | La grilla se actualiza con los resultados filtrados |
| Orden | — (mismo GET) | N/A | N/A | Grilla reordenada visiblemente |
| Mapa de zona | Mismo `"Cargando mapa…"` que ya existe | Zona sin propiedades activas → mostrar igual el marcador central de la zona, sin pines de propiedades (el mapa en sí nunca está "vacío", siempre tiene al menos el centro) | Si `lat/lng` de la zona es null → mismo fallback ya existente ("Mapa de {zona} no disponible") | Mapa interactivo con marcador(es) |
| Clustering | Igual que el mapa de resultados ya existente | N/A (si hay 0 resultados, ya se ve el estado vacío general de `search-results.tsx:50-54`, el mapa ni se renderiza) | N/A | Clúster con contador; clic expande |
| Newsletter | Botón muestra estado "Enviando…" (deshabilitado) mientras corre la server action | N/A | Email inválido o ya suscripto → mensaje inline debajo del input, en rojo/`text-alert` (mismo patrón que errores de otros forms del sitio), sin perder lo que el usuario ya tipeó | Reemplazar el form por un mensaje de confirmación ("¡Listo! Te vamos a escribir con contenido de {segmento}.") — no un modal, no un toast, consistente con cómo el resto del sitio confirma envíos (ej. wizard de tasación) |

**Accesibilidad (pasada "Responsive & Accessibility"):** el form de filtros ya es responsive por herencia (flex-wrap reordena los campos en mobile sin cambios) — el único ítem nuevo es el `<fieldset>/<legend>` del grupo de características (arriba). Los 3 chips de segmento del newsletter necesitan `role="radiogroup"` con `aria-checked` en cada chip (son mutuamente excluyentes, no checkboxes independientes) y navegación con flechas — no es un `<input type=radio>` visualmente, pero debe comportarse como uno para lectores de pantalla.

**Cómo verificar:**
- Filtrar por una característica real (ej. "Pileta") en `/propiedades` devuelve solo propiedades con esa `PropertyFeature`; el checkbox se ve idéntico al de "Cochera".
- Cambiar el orden a "Precio: mayor a menor" reordena la grilla visiblemente, en la misma fila del contador de resultados.
- `/zonas/martinez` muestra un mapa real con el mismo estado de carga que el resto del sitio, no el placeholder.
- Con datos de prueba (15-20 propiedades de ejemplo cercanas), la vista mapa de `/propiedades` agrupa pines en un clúster color navy con contador; clic expande.
- Newsletter: elegir un segmento + email válido → mensaje de confirmación mencionando el segmento elegido; email inválido → error inline sin perder el segmento seleccionado.
- Navegar el grupo de características y los chips de segmento solo con teclado (Tab + flechas/Space) — sin mouse.

**Tests:**
- Extender `tests/search.spec.ts` con casos de filtro por característica (incluyendo el caso 0-resultados → verifica que aparece el Callout existente, no uno nuevo) y de cada opción de ordenamiento.
- Nuevo test para el mapa de zona: verificar que el contenedor de Leaflet se monta (no queda el texto placeholder) y que el loading state coincide con el de `search-results.tsx`.
- Test de clustering: con datos de fixture densos, aparece un elemento de clúster; verificar el color navy del ícono (no el azul default de la librería).
- Nuevo `tests/newsletter.spec.ts`: submit exitoso con segmento elegido guarda el registro y muestra el mensaje de confirmación con el segmento; submit sin elegir segmento muestra error de validación; email inválido muestra error inline sin borrar el segmento ya elegido; navegación por teclado del `radiogroup` de segmento.

---

### FASE 6 — Producción
**Objetivo:** llevar el sitio a un dominio real con las bases operativas mínimas (monitoreo, backups) que hoy no existen.

| Tarea | Archivos | Cambios | Riesgos |
|---|---|---|---|
| 6.1 Dominio propio | Configuración de Vercel (fuera de código), `lib/site-url.ts` (verificar que ya lee de una env var y no tiene el dominio hardcodeado) | Comprar/configurar el dominio, apuntar DNS a Vercel, actualizar `SITE_URL` (env var). Verificar que `sitemap.ts`, `robots.ts`, JSON-LD y `metadataBase` usan `SITE_URL` y no un string hardcodeado — si alguno lo tiene hardcodeado, corregirlo en esta fase. | **Riesgo real de este proyecto:** dev y producción comparten la MISMA base de datos Neon — un cambio de dominio no toca la base, pero cualquier verificación en este paso que involucre correr algo localmente sigue pegándole a producción; no hay ambiente de staging separado. |
| 6.2 Redirects 301 desde Wix | `next.config.ts` (si los redirects se manejan del lado de Next) o configuración DNS/Wix (si Wix se apaga y el dominio nuevo asume las URLs viejas) | Mapear las URLs indexadas del sitio Wix actual (`/campusnorte`, `/videocampusnorte`, etc., identificadas en la auditoría de Fase 1 original) a sus equivalentes nuevos (`/emprendimientos/campus-norte`, etc.) vía `redirects()` en `next.config.ts`. | Requiere el listado real de URLs indexadas por Google del sitio Wix (Search Console del dominio viejo, si De Paola tiene acceso) — sin eso, el mapeo es una suposición. Ver sección 6 (qué pedirle a De Paola). |
| 6.3 Monitoreo de errores | `app/error.tsx`/`global-error.tsx` (de la Fase 3), o un servicio nuevo | Como mínimo, loguear errores de `error.tsx` a la consola de Vercel (ya gratis, ya existe). Si se quiere más (alertas, agrupación), evaluar Sentry — **esto sí sería una dependencia nueva**, a decidir explícitamente en su momento, no asumida acá. | Ninguno si se queda en el nivel gratuito de Vercel. |
| 6.4 Backups de Postgres/Neon | — (configuración de Neon, fuera de código) | Confirmar el plan de Neon actual incluye point-in-time recovery o backups automáticos; si no, evaluar upgrade de plan. Documentar el proceso de restore en un `RUNBOOK.md`. | Esto es puramente operativo/de cuenta, no de código. |

**Dependencias:** 6.1 debe ir DESPUÉS de las Fases 1-4 (no tiene sentido mover tráfico real a un dominio nuevo con una credencial expuesta o rutas rotas en el footer — mismo orden que ya recomendó la propia auditoría). **No depende de la Fase 5:** filtros de búsqueda, clustering de mapa y newsletter no tienen relación técnica con el dominio, y la auditoría original marca el dominio como bloqueante de negocio — no tiene sentido demorarlo detrás de UX especulativa para un inventario de 11 propiedades (corrección aplicada tras la segunda opinión, ver "Outside Voice").

**Cómo verificar:**
- El dominio nuevo sirve el sitio completo con SSL válido.
- `curl -I` a una URL vieja de Wix conocida devuelve 301 al equivalente nuevo (una vez que Wix se apague o se configure el redirect).
- Provocar un error de datos intencional en un ambiente de prueba y confirmar que aparece en los logs de Vercel.

**Tests:** este es el único bloque del plan sin tests automatizados nuevos — es configuración de infraestructura, no lógica de aplicación. Verificación manual documentada es el criterio de aceptación.

---

### FASE 7 — Automatización
**Objetivo:** dejar preparado (no construido) el camino a CRM/n8n, condicionado a una decisión de negocio.

| Tarea | Archivos | Cambios | Riesgos |
|---|---|---|---|
| 7.1 Definir CRM | — (decisión de negocio, no de código) | N/A hasta que exista una respuesta. | — |
| 7.2 Webhook de salida en creación de Lead | `lib/leads.ts` (o donde se centralice la creación de `Lead`) | Una vez elegido el CRM: agregar una llamada `fetch` (o un webhook de n8n) en el punto donde ya se crea cada `Lead`, con manejo de error que NO bloquee la creación del lead si el webhook falla (el lead ya se guardó en la base — el webhook es best-effort). | Si el webhook no maneja bien los fallos, un servicio externo caído podría bloquear leads reales — por eso el `try/catch` que no propaga el error es un requisito, no un detalle. |

**Dependencias:** 100% depende de 7.1 (decisión de negocio externa). No hay nada más que planificar en detalle hasta esa decisión — el plan de esta fase es intencionalmente breve.

**Cómo verificar / Tests:** no aplica hasta que haya una implementación concreta — se planifica en detalle cuando exista la Fase 7 real, como un plan separado.

---

### FASE 8 — IA
**Objetivo:** dejar claro qué evaluar y con qué datos, no construir nada todavía.

| Tarea | Archivos | Cambios | Riesgos |
|---|---|---|---|
| 8.1 Evaluar "De Paola AI" con datos reales de uso | — (análisis, no código) | Usar los datos de `property_search`/`property_filter` de GA4 (Fase 4, con >= 1 mes de datos reales) para decidir si una búsqueda conversacional resolvería fricción real o es una apuesta sin evidencia. | Ninguno — es la razón por la que esta fase va última: sin Fase 4 corriendo un tiempo, cualquier decisión acá es a ciegas (tal como la propia auditoría concluye en su punto 10 de "próximos pasos"). |
| 8.2 Si se decide avanzar: punto de entrada técnico | `app/api/properties/search/route.ts` (ya existe) | Este endpoint ya está aislado y sin consumidor — es el candidato natural para que una capa de interpretación de lenguaje natural (cualquiera sea el proveedor de IA elegido) lo llame. No se reescribe `lib/search.ts` ni `lib/valuation.ts`, que ya están separados de la UI como funciones puras. | Elegir proveedor de IA es una decisión de negocio/costo que este plan no toma. |

**Dependencias:** depende de que la Fase 4 (Analytics) esté corriendo con datos reales acumulados.

**Cómo verificar / Tests:** no aplica todavía — esta fase es una evaluación, no una implementación.

---

## 5. Diagrama de cobertura de tests (Fases 1-5, lo único con código nuevo real)

```
CODE PATHS                                                    USER FLOWS
[+] app/admin/login/actions.ts                                [+] Login admin
  ├── login() con rate limit                                    ├── [GAP] [→E2E] 6 intentos fallidos → bloqueo (T: rate-limit.spec.ts)
  │   ├── [GAP] Bajo el límite: login normal sigue igual         └── [★★ TESTED] Login correcto/incorrecto — admin.spec.ts
  │   └── [GAP] Igual/sobre el límite: mensaje genérico
  │
[+] app/admin/(dashboard)/*/actions.ts (defensa en profundidad)
  ├── createProperty/updateProperty/deleteProperty            [+] Bypass de middleware (hipotético)
  │   └── [GAP] Sin sesión → throw                               └── [GAP] Test directo a la función sin pasar por HTTP
  │
[+] app/favoritos/page.tsx                                    [+] Favoritos
  ├── lee IDs de useFavorites()                                 ├── [GAP] [→E2E] Guardar → ver en /favoritos (T: favoritos.spec.ts)
  ├── fetch de properties por IDs                                ├── [GAP] Sacar favorito → desaparece sin reload
  └── [GAP] Estado vacío (sin favoritos)                         └── [GAP] Estado vacío con CTA
  │
[+] app/mercado/page.tsx                                      [+] Mercado
  ├── oferta activa agrupada                                     ├── [GAP] [→E2E] Página carga 200, muestra oferta (T: mercado.spec.ts)
  └── artículos categoría Mercado                                └── [GAP] Categoría sin artículos no rompe la página
  │
[+] components/layout/header.tsx (fix hidratación)             [+] Regresión visual
  └── [GAP] [→E2E] Suite completa sigue verde post-fix            └── [GAP] Header transparente-a-sólido sigue funcionando (manual, desktop+mobile)
  │
[+] lib/analytics.ts + 12 puntos de disparo                    [+] Cada uno de los 12 eventos
  └── [GAP] trackEvent llamado con el nombre correcto             └── [GAP] [→E2E] Mock de window.gtag por flujo (T: analytics.spec.ts)
  │
[+] lib/search.ts (buildWhere extendido)                       [+] Buscador
  ├── filtro por características (nuevo)                         ├── [GAP] Filtrar por 1 característica real
  ├── ordenamiento (nuevo)                                       ├── [GAP] Cada opción de orden reordena visiblemente
  └── [★★ TESTED] resto de buildWhere (search.spec.ts)            └── [★★ TESTED] resto del buscador ya cubierto

COVERAGE: 2/26 paths con test existente (8%) — el resto son GAP porque es código que todavía no existe.
Código nuevo con test planificado: 24/24 (100% de lo nuevo tiene un test asignado en este plan).
QUALITY objetivo: ★★★ en rate-limit y defensa en profundidad (son seguridad); ★★ aceptable en el resto.
GAPS: 24 (6 marcados [→E2E], 0 [→EVAL] — no hay LLM en este plan todavía)
```

**Regla de regresión aplicada:** el fix de hidratación (2.2) toca `header.tsx`, que aparece en TODAS las páginas — por eso la tarea explícitamente pide correr la suite E2E completa, no solo un test nuevo. Esto es un requisito **crítico**, no opcional, siguiendo la regla de regresión del proceso de review.

---

## 6. Failure modes (por cada codepath nuevo)

| Codepath | Cómo puede fallar en producción | ¿Test? | ¿Manejo de error? | ¿El usuario ve error claro o falla silencioso? |
|---|---|---|---|---|
| Rate limit de login | El `update` de `Agent` (incremento/reset de `failedLoginCount`) falla (DB caída) | Cubierto — ver tarea 1.4 | **Resuelto:** `lockedUntil` se lee del mismo `findUnique` por email que el login ya hace para verificar la contraseña (no es una consulta nueva que pueda fallar aparte). El `update` que incrementa/resetea el contador corre DESPUÉS de que el resultado del login (correcto/incorrecto) ya se decidió — ese `update` es best-effort: si falla, se loguea el error pero nunca bloquea ni altera la respuesta al usuario, porque el login en sí ya se resolvió antes de llegar a ese paso. | El usuario ve el resultado real de su login (correcto/incorrecto) siempre; en el peor caso, un fallo de ese `update` puntual hace que el contador no se actualice para ese intento — no es un problema de seguridad, es un miscount de a lo sumo 1 |
| `/favoritos` con IDs de propiedades ya borradas | `findMany` simplemente no las devuelve | Cubrir con test | Comportamiento correcto por default de Prisma (no rompe) | El usuario ve menos favoritos de los que "recuerda" haber guardado — aceptable, no crítico |
| GA4 con `NEXT_PUBLIC_GA_ID` no seteada | El componente de `@next/third-parties` recibe `gaId` vacío | Cubrir con test de build | Verificar que no rompe el build/render | Silencioso — correcto, no debería mostrar nada al usuario |
| Webhook de Analytics/gtag bloqueado por un ad-blocker | `window.gtag` no existe | No cubierto (es comportamiento esperado de terceros) | El guard `typeof window.gtag === "function"` debe existir en `trackEvent` | Silencioso — correcto, no debe romper la funcionalidad del sitio por un evento de analytics fallido |
| Clustering con `leaflet.markercluster` y el mapa aún no montado | Referencia a un layer antes de que el mapa exista | Cubrir con test de mount | El patrón `dynamic(..., {ssr:false})` ya usado en el proyecto lo evita | — |

**Gap crítico identificado:** el comportamiento de rate-limiting cuando la propia consulta de conteo falla no está definido en el plan tal como está escrito arriba — es una decisión de producto (fail-open vs fail-closed) que hay que tomar explícitamente antes de implementar 1.4, no dejarla implícita en el código.

---

## 7. Estrategia de paralelización (worktrees)

| Fase/tarea | Módulos tocados | Depende de |
|---|---|---|
| Fase 1 (seguridad) | `prisma/`, `app/admin/` | — |
| Fase 2.1-2.2 (hidratación) | `components/layout/` | — |
| Fase 2.3 (`/favoritos`) | `app/favoritos/`, reusa `components/ui/` | — |
| Fase 2.4 (`/mercado`) | `app/mercado/`, `prisma/seed.ts` (categoría) | — |
| Fase 3 (SEO) | `app/**/page.tsx` (metadata), `app/*.tsx` (loading/error), `components/seo/` | — |
| Fase 4 (Analytics) | `app/layout.tsx`, `lib/analytics.ts`, puntos dispersos en `components/` | Debería ir DESPUÉS de Fase 2 (necesita el sitio sin el error de hidratación para medir bien) |
| Fase 5.1-5.2 (filtro/orden) | `lib/search.ts`, componente de búsqueda | — |
| Fase 5.3-5.4 (mapas) | `components/map/` (nuevo, compartido) | Fase 5.3 y 5.4 comparten módulo — van en la misma lane, secuenciales entre sí |
| Fase 5.5 (newsletter) | `components/insights/`, `prisma/` (modelo nuevo) | — |

**Lanes:**
- **Lane A (independiente):** Fase 1 completa.
- **Lane B (independiente):** Fase 2.1-2.2 (hidratación) — recomendado que vaya SOLA en su propio lane porque toca `header.tsx`, que todo lo demás renderiza; mezclar con otro trabajo en paralelo complica el diagnóstico si algo más rompe la consola al mismo tiempo.
- **Lane C (independiente):** Fase 2.3 + 2.4 (`/favoritos` + `/mercado`) — no comparten módulos entre sí ni con nada más.
- **Lane D (independiente):** Fase 3 completa (SEO/calidad técnica) — toca muchos archivos pero todos de forma aditiva y no conflictiva con las otras lanes.
- **Lane E (depende de B):** Fase 4 (Analytics) — mejor esperar a que Lane B cierre para no medir Core Web Vitals sobre un sitio con el bug de hidratación todavía activo.
- **Lane F (independiente):** Fase 5.1-5.2 (filtro/orden del buscador).
- **Lane G (independiente, secuencial internamente):** Fase 5.3 → 5.4 (mapas).
- **Lane H (independiente):** Fase 5.5 (newsletter).

**Orden de lanzamiento:** A, B, C, D, F, G, H en paralelo (7 worktrees si hay capacidad) → mergear todas → lanzar E al final. Fase 6 arranca en cuanto A, B, C, D estén en producción — **no espera a F/G/H (Fase 5)**, que puede seguir corriendo en paralelo a Fase 6 sin bloquearla (corregido tras la segunda opinión). Fases 7 y 8 no son de código en su mayor parte y son secuenciales por definición (7 depende de una decisión externa; 8 depende de datos acumulados de E).

**Conflictos a vigilar:** Lane D (SEO) toca casi todos los `page.tsx` con `generateMetadata` — si alguna otra lane también edita el mismo archivo (ej. Lane C edita `app/mercado/page.tsx` para crearlo, y Lane D le agregaría canonical al mismo archivo), coordinar el orden: crear la página en Lane C primero, agregarle canonical en Lane D después, no en paralelo sobre el mismo archivo nuevo.

---

## 8. Test Plan Artifact

Ver artefacto separado para `/qa` y `/qa-only`: rutas afectadas (`/admin/login`, `/favoritos`, `/mercado`, `/zonas/[zona]`, `/propiedades`, `/insights`), interacciones clave (login con rate limit, guardar/sacar favorito, filtrar por característica, cambiar orden, ver mapa de zona) y casos límite (0 favoritos, 0 artículos de categoría Mercado, 0 propiedades con una característica dada). *(Nota: el artefacto JSONL/markdown estándar de `/qa` no se pudo escribir en `~/.gstack/projects/` en este entorno por falta de `jq` — el contenido equivalente queda documentado acá; instalar `jq` para que futuras corridas de `/plan-eng-review` generen el artefacto automáticamente.)*

---

## A. Plan técnico completo
Es este documento completo (secciones 1 a 8 más abajo, B a G).

## B. Orden exacto de ejecución

1. **Hoy, sin código:** rotar la contraseña real de `contacto@depaolapropiedades.com` en producción.
2. Fase 1 completa (seguridad).
3. Fase 2.1-2.2 (diagnosticar y resolver hidratación) — antes que nada más porque afecta a todo el sitio y a la medición de la Fase 4.
4. Fase 2.3 + 2.4 (`/favoritos`, `/mercado`) — en paralelo entre sí, y en paralelo con el punto 3 si hay capacidad de dos lanes.
5. Fase 3 completa (SEO/calidad técnica) — en paralelo con lo anterior.
6. Fase 4 (Analytics) — recién después de que el punto 3 esté cerrado.
7. Fase 6 (dominio + producción) — en cuanto 1-4 estén en producción. **No espera a Fase 5** (corregido tras la segunda opinión: el dominio es un bloqueante de negocio sin relación técnica con filtros/clustering/newsletter).
8. Fase 5 completa — en paralelo con Fase 6, no depende de ella ni la bloquea.
9. En paralelo a todo lo anterior, sin bloquear nada: pedirle a De Paola la información de la sección D.
10. Fase 7 (definir CRM, conectar n8n) — cuando exista la decisión de negocio.
11. Fase 8 (evaluar IA) — cuando la Fase 4 tenga al menos un mes de datos reales acumulados.

## C. Qué se puede implementar ya sin depender de De Paola

Todo el código de las Fases 1 a 5 es implementable hoy sin ningún insumo externo:
- Rotar contraseña, defensa en profundidad, rate limiting.
- Diagnosticar y resolver hidratación.
- `/favoritos` y `/mercado` (versión mínima con datos que ya existen).
- `canonical`, `loading.tsx`/`error.tsx`, `lifestyleContent`, `BreadcrumbList`.
- GA4 + los 12 eventos + Search Console + Lighthouse.
- Filtro de características, ordenamiento, mapa de zona, clustering.
- Newsletter (la mecánica — el contenido editorial que se manda sí puede necesitar validación de Tatiana más adelante, pero el mecanismo de suscripción no).

## D. Qué información hay que pedirle a De Paola

1. **Fotos y confirmación de zona/datos de cada agente** — bloqueante para que `/equipo` deje de ser la ficha de una sola persona (ya identificado en el documento de pendientes del proyecto).
2. **Validación del contenido editorial de las 4 zonas** (`needsReview: true` hoy) — antes de sacarle el aviso de borrador.
3. **Confirmación de horarios reales si difieren entre Florida y Villa Martelli** (ya cargado con el mismo valor para ambas sucursales, marcado como pendiente de confirmar en el seed).
4. **Listado de URLs indexadas del sitio Wix actual** (vía Google Search Console del dominio viejo, si tienen acceso) — necesario para armar los redirects 301 de la Fase 6 con datos reales, no una suposición.
5. **Si van a seguir publicando en portales de terceros** (Zonaprop/Argenprop/Mercado Libre) como canal secundario — afecta si vale la pena, más adelante, automatizar el `sourceUrl` del importer CSV hacia un flujo de sincronización, o si alcanza con la carga manual periódica actual.
6. **Definición de CRM concreto** (Fase 7) — sin esto, la fase completa queda parada.
7. **Datos de mercado histórico, si existen** — para saber si `hasMarketData` puede pasar a `true` en algún momento, o si el promedio de precios por zona queda deshabilitado indefinidamente (ambas son decisiones legítimas, pero hoy no está definida cuál).
8. **Confirmación del dominio elegido** (Fase 6) — para arrancar la compra/configuración DNS.

## E. Qué partes NO tocar

- La arquitectura (Next.js 16 + Prisma 7 + PostgreSQL + Vercel).
- El rediseño visual inspirado en elliman.com (`reference/STYLE_GUIDE.md`) — es una mejora deliberada y documentada.
- La decisión de sacar el bottom nav mobile (commit `bb6ffb0`) — no restaurarlo aunque los docs de fase originales todavía lo mencionen.
- El patrón `isSample` / `needsReview` / `hasMarketData` — es la pieza que permite pasar de datos de ejemplo a datos reales sin reescribir componentes.
- El importer CSV (`lib/csv.ts`, `import-actions.ts`) — ya cerrado, ninguna fase de este plan lo modifica.
- El motor de tasación (`lib/valuation.ts`) y su regla de nunca mostrar un rango con menos de 3 comparables.
- La vista de tasaciones dentro de Leads en el admin (no separarla — es una simplificación válida, no un bug).

## F. Estimación de complejidad por fase

| Fase | Complejidad | Por qué |
|---|---|---|
| 1 — Seguridad | **Media** | Técnicamente simple (env vars, un `if` de sesión, una tabla nueva), pero exige cuidado extremo por tratarse de la base de datos compartida de producción y de credenciales reales. |
| 2 — Bugs críticos | **Media-Alta** | `/favoritos` y `/mercado` son bajos; el diagnóstico de hidratación es la única incógnita real del plan — puede ser un fix de una línea o requerir repensar el mecanismo del header. |
| 3 — SEO/calidad técnica | **Baja** | Cambios aditivos, mecánicos, bien acotados, sin lógica de negocio nueva. |
| 4 — Analytics | **Media** | El paquete resuelve la parte difícil; el trabajo real es no olvidar ninguno de los 12 puntos de disparo dispersos en el código. |
| 5 — Experiencia inmobiliaria | **Alta** | Es la fase con más superficie de código nuevo (filtros, orden, dos features de mapa, newsletter con modelo de datos nuevo) y la única con una decisión de UX pendiente (checkbox "alguna" vs "todas" las características). |
| 6 — Producción | **Media** (poco código, alta coordinación externa) | El código es mínimo; la complejidad real es DNS/dominio/redirects, que dependen de acceso a cuentas externas y de datos que hay que pedirle a De Paola. |
| 7 — Automatización | **Sin estimar** | Depende enteramente de qué CRM se elija — no se puede estimar en abstracto. |
| 8 — IA | **Sin estimar** | Depende de la Fase 4 y de una decisión de negocio sobre invertir o no en esto. |

## G. Criterios de aceptación por fase

- **Fase 1:** `grep` de la contraseña vieja en todo el repo da cero resultados; 6 intentos fallidos de login bloquean el 7mo; una llamada directa a una server action admin sin sesión lanza error; contraseña real rotada en producción confirmada por el usuario.
- **Fase 2:** consola del navegador sin el error #418 en Home y `/propiedades` (dev y producción); `/favoritos` y `/mercado` devuelven 200 con la marca completa; suite E2E completa en verde.
- **Fase 3:** las páginas principales tienen `<link rel="canonical">` correcto; `error.tsx`/`loading.tsx` se disparan ante un fallo simulado; `lifestyleContent` visible en al menos una zona; `BreadcrumbList` válido en el Rich Results Test de Google.
- **Fase 4:** eventos visibles en GA4 Realtime para los 12 disparos; Search Console verificado; Lighthouse corrido y documentado con números concretos (aunque no cumplan el objetivo todavía).
- **Fase 5:** filtrar por una característica real devuelve solo matches; cada opción de orden reordena visiblemente; `/zonas/[zona]` muestra mapa real; clustering visible con datos de prueba densos; newsletter guarda suscripciones.
- **Fase 6:** el dominio propio sirve el sitio con SSL; al menos un redirect 301 real verificado con `curl -I`; un error real queda visible en los logs de Vercel.
- **Fase 7:** definido cuando exista la decisión de CRM — criterio de aceptación a redactar en ese momento.
- **Fase 8:** definido cuando exista al menos un mes de datos de GA4 acumulados — criterio de aceptación a redactar en ese momento.

---

## Implementation Tasks
Sintetizado de los hallazgos de este plan. Listo para correr con Claude Code — marcar como hecho a medida que se implementa.

- [ ] **T1 (P1, human: ~15min / CC: ~5min)** — seguridad — Rotar la contraseña real de `contacto@depaolapropiedades.com` en producción
  - Surfaced by: Hallazgo #1 (Critical) — `prisma/seed.ts` + `tests/admin.spec.ts`
  - Files: ninguno (cambio de dato en producción, fuera de código)
  - Verify: login con la contraseña nueva funciona; la vieja ya no
- [ ] **T2 (P1, human: ~1h / CC: ~15min)** — seguridad — Sacar el hardcode de `prisma/seed.ts` y `tests/admin.spec.ts` a variables de entorno
  - Surfaced by: Hallazgo #1
  - Files: `prisma/seed.ts`, `tests/admin.spec.ts`, `.env.example`
  - Verify: `grep -r "45kzeOAlad9G"` sobre el repo da cero resultados
- [ ] **T3 (P1, human: ~2h / CC: ~20min)** — seguridad — Agregar `getSession()` explícito a cada server action admin sensible
  - Surfaced by: Hallazgo #2
  - Files: `app/admin/(dashboard)/**/actions.ts`
  - Verify: llamar la función directamente sin sesión lanza error
- [ ] **T4 (P1, human: ~2h / CC: ~25min)** — seguridad — Rate limiting en `/admin/login` vía columnas `failedLoginCount`/`lockedUntil` en `Agent`
  - Surfaced by: Hallazgo #3, Decisión D1 (revisada tras outside voice — sin tabla nueva)
  - Files: `prisma/schema.prisma`, `app/admin/login/actions.ts`, `tests/rate-limit.spec.ts`
  - Verify: 6to intento fallido consecutivo devuelve mensaje de bloqueo; login exitoso resetea el contador; simular un fallo del `update` de contador (ej. mock de Prisma) y confirmar que el login sigue respondiendo correctamente (nunca cuelga ni tira 500)
- [ ] **T5 (P1, human: ~2-6h / CC: ~30-90min, variable)** — bugs — Diagnosticar y resolver React hydration error #418
  - Surfaced by: Hallazgo #6 — `components/layout/header.tsx:118,131,138,147`
  - Files: por determinar en el diagnóstico (candidato: `components/layout/header.tsx`)
  - Verify: consola limpia en Home y `/propiedades`; suite E2E completa en verde
- [ ] **T6 (P1, human: ~3h / CC: ~30min)** — bugs — Construir `/favoritos`
  - Surfaced by: Hallazgo #5
  - Files: `app/favoritos/page.tsx`, `tests/favoritos.spec.ts`
  - Verify: guardar/sacar favorito refleja en `/favoritos` sin reload
- [ ] **T7 (P1, human: ~4h / CC: ~40min)** — bugs — Construir `/mercado` en versión mínima
  - Surfaced by: Hallazgo #4, Decisión D2
  - Files: `app/mercado/page.tsx`, `prisma/seed.ts` (categoría Mercado si falta), `tests/mercado.spec.ts`
  - Verify: página 200 con oferta activa real, sin datos inventados
- [ ] **T8 (P2, human: ~2h / CC: ~20min)** — SEO — `canonical` en todos los `generateMetadata`
  - Surfaced by: Hallazgo #7
  - Files: todos los `page.tsx` con `generateMetadata`
  - Verify: `<link rel="canonical">` correcto en 3+ páginas
- [ ] **T9 (P2, human: ~2h / CC: ~20min)** — SEO — `loading.tsx`/`error.tsx`/`global-error.tsx`
  - Surfaced by: Hallazgo #8
  - Files: `app/loading.tsx`, `app/error.tsx`, `app/global-error.tsx`
  - Verify: error simulado muestra la página de marca, no la genérica
- [ ] **T10 (P2, human: ~1h / CC: ~10min)** — SEO — Renderizar `lifestyleContent` en página de zona
  - Surfaced by: Hallazgo #9
  - Files: `app/zonas/[zona]/page.tsx`
  - Verify: sección visible cuando el campo no es null
- [ ] **T11 (P2, human: ~1h / CC: ~15min)** — SEO — `BreadcrumbList` en JSON-LD
  - Surfaced by: Hallazgo #10
  - Files: `components/seo/json-ld.tsx` y consumidores
  - Verify: válido en Rich Results Test
- [ ] **T12 (P2, human: ~4h / CC: ~45min)** — analytics — Instalar `@next/third-parties` + GA4
  - Surfaced by: Hallazgo #11, Decisión D4
  - Files: `package.json`, `app/layout.tsx`
  - Verify: eventos visibles en GA4 Realtime
- [ ] **T13 (P2, human: ~6h / CC: ~1h)** — analytics — Instrumentar los 12 eventos de la Fase 20
  - Surfaced by: Hallazgo #11
  - Files: `lib/analytics.ts` + 12 puntos dispersos, `tests/analytics.spec.ts`
  - Verify: cada evento dispara con el nombre correcto en test mockeado
- [ ] **T14 (P3, human: ~1h / CC: ~10min)** — analytics — Baseline de Lighthouse documentado
  - Surfaced by: Sección 10 de la auditoría
  - Files: `PERFORMANCE-BASELINE.md` (nuevo)
  - Verify: 4 números (LCP/INP/CLS/score) documentados
- [ ] **T15 (P2, human: ~3h / CC: ~35min)** — experiencia — Filtro de características (inline, mismo patrón que "Cochera") + ordenamiento (en la fila del contador)
  - Surfaced by: Hallazgo #12; especificado con file:line reales en /plan-design-review
  - Files: `lib/search.ts`, `components/search/filter-panel.tsx`, `components/search/search-results.tsx`, `tests/search.spec.ts`
  - Verify: filtro y cada orden funcionan visiblemente; checkbox nuevo visualmente idéntico a "Cochera"; grupo con `<fieldset>/<legend>`
- [ ] **T16 (P2, human: ~4h / CC: ~40min)** — experiencia — Extraer `components/map/base-map.tsx` compartido + mapa interactivo real en `/zonas/[zona]`
  - Surfaced by: Hallazgo #13; DRY identificado en /plan-design-review (5.3 y 5.4 comparten módulo)
  - Files: `components/map/base-map.tsx` (nuevo), `components/search/property-map.tsx` (refactor para usarlo), `app/zonas/[zona]/page.tsx`
  - Verify: mapa real reemplaza el placeholder; mismo loading state "Cargando mapa…" que el resto del sitio
- [ ] **T17 (P2, human: ~4h / CC: ~45min)** — experiencia — Clustering en mapa de resultados con ícono navy de marca
  - Surfaced by: Hallazgo #14, Decisión D3
  - Files: `package.json`, `components/search/property-map.tsx`
  - Verify: clúster visible con datos densos de prueba, color `#00385C` no el azul default de la librería
- [ ] **T18 (P3, human: ~5h / CC: ~50min)** — experiencia — Newsletter segmentado (chips de segmento + email)
  - Surfaced by: Sección 4/20 de la auditoría; forma del formulario resuelta en /plan-design-review
  - Files: `prisma/schema.prisma` (modelo `NewsletterSubscriber`), `components/insights/newsletter-form.tsx`, `tests/newsletter.spec.ts`
  - Verify: suscripción guardada con segmento correcto; chips navegables por teclado como `radiogroup`; mensaje de confirmación menciona el segmento elegido
- [ ] **T19 (P3, human: variable / CC: variable)** — producción — Dominio propio + redirects 301 + monitoreo + backups
  - Surfaced by: Sección 6, hallazgos #17/#22/#23
  - Files: `next.config.ts`, `lib/site-url.ts`, configuración externa
  - Verify: dominio activo, redirect real verificado, error visible en logs

_No new tasks from Fase 7 y Fase 8 — ambas son decisiones de negocio pendientes, sin tarea de código actionable todavía._

---

## TODOS.md — candidatos a agregar

No existe `TODOS.md` en el repo hoy. Se proponen estos ítems para crearlo (uno por uno, a confirmar):

1. ~~Extraer un componente de mapa base compartido antes de 5.3/5.4~~ — **resuelto directamente en el plan** (ya no es un TODO diferido), ver tarea 5.3 y T16 en Implementation Tasks: `/plan-design-review` encontró la dependencia real entre 5.3 y 5.4 y la resolvió como parte de la tarea, no como deuda a futuro.
2. ~~Definir fail-open vs fail-closed para el rate limiter~~ — **resuelto directamente en el plan**, ver tarea 1.4: la lectura de `lockedUntil` viaja en el `findUnique` que el login ya hace (no hay consulta nueva que pueda fallar aparte), y el `update` del contador es best-effort porque corre después de que el resultado del login ya se decidió.
3. **Decidir si el newsletter usa un `LeadType` nuevo o una tabla separada `NewsletterSubscriber`.**
   - Por qué: afecta el modelo de datos y el embudo de Analytics de la Fase 20.
   - Pros de tabla separada: no infla el embudo de leads comerciales.
   - Contras de tabla separada: un modelo más para mantener.
   - Contexto: recomendación de este plan es tabla separada (sección Fase 5.5), pero queda como decisión a confirmar antes de escribir el schema.
   - Depende de: nada, es independiente.

**Opciones para cada uno:** A) Agregar a TODOS.md, B) Descartar, C) Resolverlo ya como parte de la fase correspondiente (no diferir).

---

## Outside Voice — Independent Plan Challenge

Codex CLI no está instalado en este entorno (`command -v codex` → no encontrado) y no hay conexión configurada. Se ejecutó el fallback: un subagente Claude con contexto fresco (mismo modelo, no una IA externa — se ponderó en consecuencia) revisó este plan de forma independiente, sin ver esta conversación.

**Hallazgos de la segunda opinión:**
1. El plan trataba cada migración nueva como "sin riesgo" por ser aditiva, sin abordar que desarrollar/iterar sobre una tabla nueva significa hacerlo contra la misma base que usa producción — señalado 3 veces (login, newsletter, índices) sin tratarse como el mismo problema recurrente.
2. Contradicción real de orden: la Fase 6 (dominio, marcado como bloqueante de negocio por la propia auditoría) esperaba a la Fase 5 completa (UX especulativa para 11 propiedades) en el orden maestro, aunque la sección de Fase 6 decía lo contrario.
3. Sobre-ingeniería en el diseño original del rate limiter: una tabla `LoginAttempt` con logging completo y política de purga sin definir, para un panel con 2 cuentas admin.

**CROSS-MODEL TENSION — resuelto con el usuario:**
- **Rate limiting:** se reemplazó el diseño de tabla `LoginAttempt` por 2 columnas en `Agent` (`failedLoginCount`, `lockedUntil`) — el usuario eligió la opción recomendada por la segunda opinión. Aplicado en la sección Fase 1 (tarea 1.4), Implementation Tasks (T4), Test Plan y TODOS.md de este documento.
- **Orden de Fase 6:** se corrigió la contradicción — Fase 6 ahora depende solo de Fases 1-4, no de Fase 5. Aplicado en la sección Fase 6, sección B (orden de ejecución) y sección 7 (worktrees) de este documento.

Ambos cambios ya están reflejados en el cuerpo del plan de arriba — no quedan como notas separadas.

---

## Completion summary

- Step 0: Scope Challenge — scope aceptado con reducción de proceso (review condensada, no una AskUserQuestion por cada hallazgo menor — elegido explícitamente por el usuario dado que son 8 fases, no un PR puntual)
- Architecture Review: 6 issues found (4 decisiones de dependencias nuevas D1-D4 + 2 tensiones cross-model post outside-voice) — las 6 resueltas con el usuario
- Code Quality Review: 1 issue found (oportunidad de DRY: componente de mapa compartido para zona + clustering — agregado a TODOS.md)
- Test Review: diagrama producido, 24 gaps identificados (100% del código nuevo tiene un test asignado en el plan; 0% tiene el test escrito todavía porque el código tampoco existe)
- Performance Review: 0 issues nuevos (el trabajo de medición ya está capturado como tarea explícita en Fase 4.4 — Lighthouse baseline)
- NOT in scope: escrito (sección 3)
- What already exists: escrito (sección 2)
- TODOS.md updates: 1 ítem propuesto al usuario (los otros 2 candidatos originales se resolvieron directo en el plan, no quedaron diferidos — ver notas tachadas en "TODOS.md — candidatos")
- Failure modes: 1 critical gap flagged y luego resuelto (comportamiento del rate limiter ante un fallo de DB — ver tarea 1.4)
- Outside voice: corrió (Claude subagent — Codex no instalado en este entorno)
- Parallelization: 8 lanes (A-H), 7 paralelas entre sí (A,B,C,D,F,G,H) / 1 secuencial-después (E, tras B) / Fase 6 corre en paralelo a Fase 5 tras cerrar A-D (corregido)
- Lake Score: 6/6 recomendaciones eligieron la opción completa/recomendada (D1: columnas en Agent, D2: /mercado real ahora, D3: leaflet.markercluster, D4: @next/third-parties, Tensión 1: simplificar rate limiter, Tensión 2: desacoplar Fase 6 de Fase 5)

## Retrospective learning

Sin commits previos de refactors motivados por reviews en este branch (`main` es el único branch del repo, historia lineal de 33+ commits de feature work, no de corrección post-review) — no hay áreas "previamente problemáticas" que ameriten escrutinio extra más allá de lo ya cubierto en la sección 1 de este documento.

## Unresolved decisions

Ninguna. Las 4 decisiones de Step 0 (D1-D4), las 2 tensiones cross-model, las 2 decisiones de diseño de la Fase 5 y el gap crítico del comportamiento del rate limiter ante un fallo de DB se resolvieron todas con el usuario antes de cerrar este documento.

---

## Diseño — Fase 5 (`/plan-design-review`)

*Review de diseño enfocada exclusivamente en la Fase 5 ("Experiencia inmobiliaria"), la única del plan con superficie de UI/UX nueva real. Sin `DESIGN.md` en el repo — se calibró contra `reference/STYLE_GUIDE.md` (paleta, tipografía Newsreader/Jost, botones píldora, reveal-on-scroll de elliman.com). Generación de mockups visuales no disponible (falta API key de OpenAI para el generador de gstack) — review basada en lectura directa del código real de `components/search/filter-panel.tsx`, `search-results.tsx` y `property-map.tsx`, no en descripciones abstractas.*

**Rating inicial: 3/10.** La Fase 5 tal como estaba escrita antes de esta review especificaba QUÉ hace cada feature pero no QUÉ VE el usuario en casi ningún caso — sin estados, sin especificidad de dónde vive cada control, sin calibrar contra los componentes que ya existen.

**Hallazgo clave de esta review:** el buscador NO necesitaba un panel de filtros nuevo, un Drawer, ni una decisión de "sidebar vs mobile" — `components/search/filter-panel.tsx` ya es un `<form method="get">` simple con `flex flex-wrap`, sin JavaScript, con un checkbox de "Cochera" que es exactamente el patrón que las nuevas características necesitan. La primera lectura de la Fase 5 (antes de leer el código real) hubiera diseñado una interacción nueva para un problema que el proyecto ya resolvió bien. Esto está corregido directamente en la sección Fase 5 de arriba — no quedó como nota aparte.

| Pasada | Rating inicial | Rating final | Hallazgo principal |
|---|---|---|---|
| 1. Arquitectura de información | 4/10 | 9/10 | No decía dónde vive cada control nuevo — resuelto: orden en la fila del contador (`search-results.tsx:22-41`), características inline en el form existente |
| 2. Cobertura de estados | 2/10 | 9/10 | Cero estados especificados — agregada la tabla completa (loading/vacío/error/éxito) por feature en la sección Fase 5 |
| 3. Journey emocional | 7/10 | 7/10 | Es UX utilitaria (buscador, filtros), no una pieza de marca — no ameritaba más trabajo acá; sin hallazgos |
| 4. Riesgo de AI slop | 5/10 | 9/10 | La redacción original ("checkboxes de características") era genérica; especificado como reuso exacto de un patrón real y visible del propio sitio, no un patrón de SaaS genérico |
| 5. Alineación con design system | 4/10 | 9/10 | Sin `DESIGN.md`, pero ahora cada pieza mapea a un componente/patrón real ya existente (`Select`, `Input`, checkbox de "Cochera", `buttonVariants`) salvo el newsletter, que es genuinamente nuevo y quedó especificado con el mismo lenguaje visual (pill buttons, chips) |
| 6. Responsive y accesibilidad | 3/10 | 8/10 | Sin nada especificado — agregado `<fieldset>/<legend>` para el grupo de características y `role="radiogroup"` para los chips de segmento del newsletter; responsive del form se hereda gratis del `flex-wrap` ya existente |
| 7. Decisiones sin resolver | — | 0 pendientes | 2 decisiones genuinamente ambiguas identificadas y resueltas con el usuario (ver abajo) |

**Decisiones resueltas con el usuario:**
- **Checkboxes de características:** inline, igual que "Cochera" — no un componente de disclosure nuevo. Un problema de volumen que no existe todavía (11 propiedades reales) no se diseña a ciegas hoy.
- **Newsletter:** el segmento (Comprador/Vendedor/Inversor) se pide en el alta, como 3 chips tipo pill-button — no un email suelto con segmentación diferida, porque eso contradice el objetivo explícito de la Fase 20 ("newsletter segmentado").

**NOT in scope (diseño):**
- Mockups visuales generados por IA — bloqueado por falta de API key de OpenAI; la especificidad de la review vino de leer el código real, no de imágenes. Si se configura la key más adelante, se puede correr `$D variants` sobre el brief ya preparado para validar el resultado visualmente antes de implementar.
- Rediseño del resto del buscador (filtros existentes: zona, tipo, precio, ambientes) — no tenían gaps de diseño, ya seguían el patrón correcto; esta review solo tocó lo que la Fase 5 agrega.

**What already exists (diseño) — reutilizado, no reinventado:**
`components/ui/select.tsx`, `input.tsx`, `button.tsx` (variante `outline` para los chips), `Callout` (fallback de 0 resultados), el checkbox de "Cochera" en `filter-panel.tsx`, el header de resultados con contador+toggle en `search-results.tsx`, y el patrón de loading de mapa `dynamic(..., {ssr:false})` ya usado en ese mismo archivo.

**Approved Mockups:** ninguno generado (ver NOT in scope — sin API key de OpenAI). La especificación queda en la sección Fase 5 del plan, a nivel de archivo y línea concreta en vez de imagen.

### Completion Summary — Design Review

```
+====================================================================+
|         DESIGN PLAN REVIEW — COMPLETION SUMMARY                    |
+====================================================================+
| System Audit         | Sin DESIGN.md, se usó reference/STYLE_GUIDE.md |
| Step 0               | 3/10 inicial, foco acordado: panel filtros/orden |
| Pass 1  (Info Arch)  | 4/10 -> 9/10                                 |
| Pass 2  (States)     | 2/10 -> 9/10                                 |
| Pass 3  (Journey)    | 7/10 -> 7/10 (sin cambios, UX utilitaria)     |
| Pass 4  (AI Slop)    | 5/10 -> 9/10                                 |
| Pass 5  (Design Sys) | 4/10 -> 9/10                                 |
| Pass 6  (Responsive) | 3/10 -> 8/10                                 |
| Pass 7  (Decisions)  | 2 resueltas, 0 diferidas                     |
+--------------------------------------------------------------------+
| NOT in scope         | escrito (2 items)                            |
| What already exists  | escrito                                      |
| TODOS.md updates     | 0 nuevos (todo lo encontrado se resolvió directo en el plan) |
| Approved Mockups     | 0 generados (sin API key OpenAI), 0 aprobados |
| Decisions made       | 2 agregadas al plan                          |
| Decisions deferred   | 0                                             |
| Overall design score | 3/10 -> 8.6/10 (promedio de las 7 pasadas)   |
+====================================================================+
```

Plan de diseño de la Fase 5: completo. `/design-review` (auditoría visual en vivo) queda pendiente para después de implementar, cuando haya UI real que mirar.

---

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | — | not run |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | — | not run |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 1 | ISSUES_OPEN (PLAN) | 25 issues, 1 critical gap |
| Design Review | `/plan-design-review` | UI/UX gaps | 1 | CLEAR (PLAN) | score: 3/10 → 8.6/10, 2 decisions |
| DX Review | `/plan-devex-review` | Developer experience gaps | 0 | — | not run |

**CROSS-MODEL:** el subagente independiente (Claude, sin ver esta conversación) coincidió en el diagnóstico general del plan y detectó 2 gaps reales que la review por fases no había visto (sobre-ingeniería en el diseño del rate limiter, contradicción de orden en Fase 6 vs Fase 5). Ambos fueron presentados al usuario y resueltos — ver sección "Outside Voice" arriba.
**VERDICT:** ENG REVIEW CLEARED, DESIGN REVIEW CLEARED — los 25 hallazgos están clasificados, planificados, con las 6 decisiones arquitectónicas y el único gap crítico (comportamiento del rate limiter ante un fallo de DB) ya resueltos con el usuario. La Fase 5 (única con superficie de UI/UX nueva) pasó `/plan-design-review` limpia. El plan queda listo para implementación — arrancar por Fase 1.

NO UNRESOLVED DECISIONS
