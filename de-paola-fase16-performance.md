# DE PAOLA PROPIEDADES 2.0 — FASE 16: PERFORMANCE

*Continúa el trabajo de las Fases 1-15. Sigue sin código — define objetivos concretos y medibles.*

En la Fase 1 se identificó que el techo de performance del sitio actual es estructural (depende de Wix, sin control fino de Core Web Vitals). Migrar a la stack propuesta en la Fase 17 resuelve ese techo, pero solo si se fijan objetivos concretos desde el diseño — no basta con "elegir una tecnología más rápida".

---

## 1. OBJETIVOS CONCRETOS (Core Web Vitals)

| Métrica | Objetivo | Por qué importa para De Paola específicamente |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | La imagen principal de cada ficha/hero es casi siempre el elemento más grande de la página — clave para un sitio "fotografía primero" |
| INP (Interaction to Next Paint) | < 200ms | Filtros del buscador y formularios progresivos (Fases 3 y 4) dependen de respuesta inmediata para no sentirse "trabados" |
| CLS (Cumulative Layout Shift) | < 0.1 | Las cards de propiedad no deben "saltar" mientras cargan imágenes de tamaños distintos — reserva de espacio (aspect-ratio) desde el layout |
| Lighthouse Performance (mobile) | 90+ | Dado que la mayoría de las búsquedas ocurren en mobile (Fase 14), este es el score que realmente importa, no el de desktop |

## 2. IMÁGENES

- Formatos modernos (WebP/AVIF) con fallback automático, servidas en el tamaño exacto que se muestran (no una imagen de 4000px escalada por CSS a 400px).
- `srcset`/`sizes` responsivo en toda imagen — coherente con lo detectado como carencia en la Fase 1 sobre el sitio actual.
- Lazy loading en toda imagen fuera del viewport inicial, excepto la imagen principal del hero (que debe cargar de inmediato, siendo el elemento de LCP).
- CDN de imágenes dedicado (a definir proveedor concreto en la Fase 17), no servido directo desde el mismo servidor de la aplicación.

## 3. JAVASCRIPT Y DEPENDENCIAS

- Minimizar JS que se envía al cliente: Server Components de Next.js para todo lo que no requiera interactividad (fichas, artículos, páginas de zona en su mayor parte son lectura, no interacción).
- Cargar librerías pesadas (mapas, animación avanzada) solo en las páginas donde efectivamente se usan, nunca en el bundle global del sitio.
- GSAP (Fase 13) se carga únicamente en los componentes puntuales que lo requieren, nunca en el layout base.

## 4. CACHING Y CDN

- Contenido estático (páginas de zona, artículos publicados, fichas de propiedad ya indexadas) servido desde CDN con revalidación incremental (ISR de Next.js) — se regenera solo cuando cambia el dato, no en cada visita.
- Resultados de búsqueda con filtros dinámicos: no se cachean igual que el contenido estático, pero sí se optimiza la consulta a base de datos (índices sobre los campos de filtro más usados: zona, operación, precio, tipo).

## 5. MEDICIÓN CONTINUA

- Los objetivos de esta fase no son "una vez y listo": se integran con Google Search Console (Fase 20 — Analytics) para monitoreo continuo de Core Web Vitals reales de usuarios, no solo de pruebas de laboratorio.
- Cualquier funcionalidad nueva que se agregue después del lanzamiento (ej. una animación adicional, un widget nuevo) se evalúa contra estos objetivos antes de aprobarse — coherente con el principio 10 de Fase 1 ("performance es una feature, no un detalle técnico").

## 6. RELACIÓN CON MOTION DESIGN (Fase 13)

- La regla "performance > animación" de la Fase 13 se vuelve medible acá: ninguna animación puede degradar el INP por debajo de 200ms ni introducir CLS. Es el criterio objetivo que reemplaza a un juicio subjetivo de "se ve bien".

---

## Próximo paso

Fase 16 cerrada. Sigo con la **Fase 17 — Tecnología**.
