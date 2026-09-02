# Línea de base de performance (Fase 22, tarea 4.4)

*Corrido con Lighthouse CLI real contra `https://de-paola-prop.vercel.app` el 2026-09-02, después del fix de hidratación de la Fase 2. Simulación mobile por defecto de Lighthouse (throttling de red/CPU). Es la primera vez que el proyecto tiene un número real contra el cual medir los objetivos de la Fase 16 (LCP < 2.5s, INP < 200ms, CLS < 0.1, Lighthouse mobile 90+) — hasta ahora no había ninguna medición corriendo.*

| Página | Performance | Accesibilidad | Best Practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Home (`/`) | 79 | 98 | 100 | 100 | 4.7s | 0 | 20ms |
| Buscador (`/propiedades`) | 97 | 89 | 100 | 100 | 2.6s | 0 | 40ms |
| Ficha de propiedad | 76 | 94 | 96 | 100 | 5.0s | 0 | 50ms |

**Contra los objetivos de la Fase 16:** CLS ya cumple (0 en las 3 páginas). LCP cumple en el buscador (2.6s, cerca del objetivo) pero NO en Home ni en la ficha de propiedad (4.7s y 5.0s) — sospecha razonable: el video del hero en Home, y las imágenes de la galería en la ficha, son los candidatos más probables (ambas páginas tienen contenido visual pesado above-the-fold). Lighthouse mobile 90+ solo se cumple en el buscador.

## Hallazgos concretos que Lighthouse encontró (no está en el audit original)

- **`heading-order`** falla en las 3 páginas — hay un salto en la jerarquía de encabezados (ej. de `h1` a `h3` sin `h2` intermedio) en algún componente compartido. No identificado todavía cuál.
- **`color-contrast`** falla en `/propiedades` y en la ficha de propiedad — algún texto no cumple el contraste mínimo AA.
- **`select-name`** falla en `/propiedades` — algún `<select>` del buscador no tiene un `<label>` asociado correctamente para lectores de pantalla.
- **`unused-javascript`** / **`legacy-javascript-insight`** — margen de optimización de bundle, esperable en cualquier proyecto sin haberlo auditado antes.

Estos 3 primeros son bugs de accesibilidad reales y acotados — quedan como candidatos a un quick-fix, no necesitan tocar el diseño ni datos.

## Cómo reproducir

```bash
npx lighthouse https://de-paola-prop.vercel.app/ --output=json --output-path=./lighthouse-home.json --chrome-flags="--headless" --only-categories=performance,seo,accessibility,best-practices
```

(reemplazar la URL por `/propiedades` o una ficha real para las otras dos filas)

## Pendiente

- Repetir esta medición después de optimizar el LCP de Home/ficha (candidatos: `next/image priority` en la primera imagen de la galería, revisar el peso del video del hero).
- Conectar Google Search Console (tarea 4.3 del plan — necesita acceso a la cuenta de Google de De Paola, no se puede hacer sin eso).
