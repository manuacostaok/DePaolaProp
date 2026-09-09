---
# gstack: design-md-format=spec
name: De Paola Propiedades
description: Inmobiliaria editorial de Zona Norte GBA — fotografía primero, acento navy con moderación, tipografía con carácter de revista de arquitectura.
colors:
  primary: "#00385c"          # brand — azul marino casi negro, validado contra depaolapropiedades.com
  on-primary: "#ffffff"
  surface: "#faf8f3"          # bg — blanco cálido, no crema genérico
  surface-alt: "#efe9dc"      # bg-alt — fondos alternos de sección
  text: "#211f1b"             # ink
  text-muted: "#57534a"       # ink-soft
  accent: "#00385c"           # mismo token que primary — un solo acento, sin color secundario propio
  accent-tint: "#e1e8ee"      # brand-tint — fondos suaves de acento, badges activos
  line: "#ded7c6"             # bordes y separadores
  success: "#3f7a5c"
  warning: "#b9853a"          # alert
  error: "#b3402f"
  whatsapp: "#25d366"         # categoría propia, no "un botón secundario más"
typography:
  display:
    fontFamily: Newsreader
    fontWeight: 400
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)"
    letterSpacing: "-0.02em"
  body:
    fontFamily: Jost
    fontSize: 1rem
    lineHeight: 1.6
  label:
    fontFamily: Jost
    fontSize: 0.75rem
    letterSpacing: 0.1em
  mono:
    fontFamily: none
rounded:
  sm: 4px
  md: 10px
  lg: 24px
  full: 9999px
spacing:
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  2xl: 64px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
  button-primary-hover:
    backgroundColor: "#002740"
  button-whatsapp:
    backgroundColor: "{colors.whatsapp}"
    textColor: "{colors.on-primary}"
  input:
    borderColor: "{colors.line}"
    rounded: "{rounded.sm}"
  card:
    backgroundColor: "#ffffff"
    rounded: "{rounded.md}"
  nav-link:
    textColor: "{colors.text}"
---

# De Paola Propiedades

## Overview

**Creative North Star:** Editorial de arquitectura, no portal inmobiliario — la fotografía manda, el color de marca aparece con moderación, y cada decisión visual defiende "esto es una inmobiliaria seria" frente a Zonaprop/Argenprop genéricos.

**Product context:** Plataforma inmobiliaria propia (Next.js) para De Paola Propiedades, Zona Norte del Gran Buenos Aires (Martínez, Florida, Vicente López, Villa Martelli). Reemplaza un sitio Wix que derivaba todo a portales de terceros. Posicionamiento definido en Fase 1: cruce de Sotheby's International Realty / The Agency (fotográfico, editorial) + Corcoran (identidad con carácter) + Engel & Völkers (sistema estricto y replicable) — nunca negro-y-dorado ni estética inmobiliaria de portal.

**Mode per surface:** Home / páginas de zona → Persuade (editorial, full-bleed). Buscador y ficha de propiedad → Operate (las dos páginas de mayor conversión: sin sliders automáticos, sin parallax, prioridad absoluta a claridad y velocidad). Insights / Nosotros → Read.

**Reference sites:** elliman.com (análisis técnico completo en `reference/STYLE_GUIDE.md`), theagencyre.com (research en vivo, sep. 2026). Sotheby's International Realty y Corcoran bloquearon el research automatizado (bot-check / CloudFront); se usó conocimiento de diseño ya construido sobre esas marcas.

**Key characteristics:**
- Fotografía a pantalla completa excediendo el ancho de contenido en momentos clave (hero de Home, hero de zona) — nunca contenida en una card en esos puntos.
- Un único acento de marca (`#00385c`) — nunca fondo extenso de página, solo CTAs y estados activos.
- Serif editorial (Newsreader) para todo titular, sans geométrica (Jost) para cuerpo, UI y datos.
- Motion sutil y funcional: entrada del hero una sola vez al montar, reveal al scroll una sola vez por elemento, nunca en las dos páginas de conversión (buscador, ficha).
- Botón de WhatsApp como categoría visual propia, no una variante más de botón secundario.

## Colors

**Strategy:** Restrained — un acento (`primary`/`accent`, mismo token) más neutros cálidos. El verde de la Fase 12 original fue corregido: el azul marino (`#00385c`) es el que corresponde a la marca real (ver comentario en `app/globals.css`), no reabrir esa decisión sin validar con el cliente.

**Light or dark:** Solo modo claro. El uso real es de día, navegando fichas de propiedad con fotografía como protagonista — un modo oscuro no tiene escena de uso que lo justifique y diluiría "blanco cálido, fotografía primero". No se propone toggle.

Named rules: `primary` lleva toda la interacción (CTAs, links activos, foco de inputs); `text-muted` (nunca `primary`) para jerarquía secundaria de texto; `accent-tint` solo para fondos suaves de estado activo/badge, nunca como fondo de sección; `line` es el único separador — evitar sombra donde un borde de 1px alcanza.

## Typography

**Newsreader** (display) es una serif editorial ya evaluada y aprobada por el cliente — cumple el rol "revista de arquitectura" que la Fase 1 pide. Nota de trade-off: en el catálogo anti-slop de gstack (2026) Newsreader aparece entre las serifs editoriales sobreusadas por generadores de IA; se mantiene aquí porque (a) ya está licenciada, cargada y en producción, (b) fue validada visualmente contra la muestra aprobada por el cliente, y (c) la diferenciación de De Paola se juega en composición (full-bleed, moderación del acento) y en el motion propio de las cards, no en la elección tipográfica. Revalidar con el cliente antes de cambiarla.

**Jost** (body/UI/labels) — sans geométrica, letter-spacing `.1em` en labels cortos en mayúsculas, `-.02em` en titulares grandes. Pesos: 300 (default, cuerpo), 400–500 (énfasis, botones).

Loading strategy: ambas vía `next/font` (`--font-newsreader`, `--font-jost`), sin FOUT — ya implementado.

## Layout

Grid de 12 columnas desktop / 8 tablet / 4 mobile, gutters mínimo 24px desktop (Fase 12). Ancho máximo de contenido ~1280–1440px, con la fotografía excediendo ese ancho en hero de Home y hero de zona (full-bleed intencional — ver riesgo aceptado #2 en el Decisions Log). El buscador y la ficha de propiedad NO rompen el grid ni llevan full-bleed: son las páginas de conversión, priorizan escaneo rápido sobre efecto editorial.

## Elevation & Depth

`--shadow-soft`: dos capas suaves (`0 1px 2px rgba(0,39,64,.07)`, `0 8px 24px rgba(0,39,64,.08)`) — nunca sombra dura ni halo con blur sin offset. Alternativa preferida a la sombra: borde de 1px en `line` quando el contraste con `surface`/`surface-alt` ya separa visualmente.

## Shapes

`sm` (4px): controles chicos, inputs, badges rectangulares. `md` (10px): cards de propiedad, paneles, formularios. `lg` (24px): paneles grandes, drawers, modales. `full`: botón WhatsApp y avatares únicamente — nunca botones de texto genéricos (ver Fase 12: "ligeramente redondeadas, no tipo píldora completa" para botones estándar).

## Components

**button-primary**: sólido `primary`, texto blanco, `rounded.sm`, hover a `#002740` (brand-dark) + `translateY(-1px)`, transición `background-color .25s` con la curva de marca (ver Motion). Una sola acción principal por pantalla.

**button-secondary**: contorno `line` (o blanco translúcido sobre foto), hover a fondo `accent-tint` (o `rgba(255,255,255,.08)` sobre foto) + borde `primary`.

**button-text**: sin fondo, subrayado en hover únicamente — para acciones de bajo compromiso ("Ver todas las zonas").

**button-whatsapp**: fondo `#25d366`, categoría aparte, siempre con ícono — nunca tratado como "otro botón secundario".

**card** (propiedad): fondo blanco, `rounded.md`, `shadow-soft`, imagen con `aspect-ratio` fijo y `object-fit: cover`. Estados: hover escala la imagen interna (nunca la card completa) con la curva de marca — ver Motion, riesgo #3.

**input**: borde `line` 1px, `rounded.sm`, foco cambia borde a `primary` sin halo ni sombra adicional.

## Do's and Don'ts

- Do: fotografía full-bleed solo en Home/zona, nunca en buscador/ficha.
- Do: un acento de marca por pantalla — si hay dos elementos en `primary` compitiendo, bajar uno a `text-muted` o `line`.
- Do: WhatsApp siempre como categoría visual propia.
- Do: reveal al scroll una sola vez por elemento, respetando `prefers-reduced-motion` (ya implementado en `Reveal`).
- Don't: sliders automáticos ni parallax en buscador o ficha de propiedad (Fase 12, explícito — son las páginas de conversión).
- Don't: negro y dorado, ni ningún cliché de "inmobiliaria de lujo" genérica.
- Don't: grid de 3 columnas con ícono en círculo + título + descripción (anti-patrón de IA) para presentar zonas o servicios — usar composición editorial asimétrica en su lugar.
- Don't: sombra dura o halo sin offset — usar `shadow-soft` o un borde de 1px.
- Don't: cambiar Newsreader sin revalidar con el cliente (ver nota en Typography).

## Motion

- **Approach:** intentional — cada animación tiene un trigger claro (montaje una vez, scroll una vez), nunca decorativa ni en loop.
- **Easing:** entrada de hero `outExpo` (550ms, stagger 70ms por elemento — `HeroIntro`, `components/ui/hero-intro.tsx`); reveal al scroll `outCubic` (600ms, translateY 14px — `Reveal`, `components/ui/reveal.tsx`); drawers/overlays `cubic-bezier(.455,.03,.515,.955)` (curva de marca propia, ver `app/globals.css`).
- **Duration:** micro(150ms, hover de botones/inputs) short(250ms) medium(550–600ms, entradas de hero/reveal) long(400–700ms, drawers).
- **The one authored moment (riesgo #3, aceptado):** zoom sutil de imagen en cards de propiedad al hover, con la curva de marca (`.455,.03,.515,.955`) en vez de un `ease` genérico — distingue las cards de cualquier competidor que use `ease` o `ease-in-out` por defecto. Pendiente de implementar en `components/property/`.
- **Regla dura:** buscador y ficha de propiedad no llevan motion decorativo — ninguna de las animaciones de esta sección aplica ahí.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-09-09 | DESIGN.md creado formalizando el sistema existente (no reemplazo) | `/design-consultation` corrido sobre proyecto ya maduro; usuario eligió "evolucionar el sistema actual" en vez de rediseño desde cero |
| 2026-09-09 | Newsreader se mantiene pese a estar en la lista de fuentes sobreusadas del catálogo 2026 | Ya licenciada, cargada y aprobada por el cliente; diferenciación se juega en composición y motion, no en tipografía — revisar si el cliente pide cambio |
| 2026-09-09 | Riesgo aceptado: full-bleed en hero de Home/zona, contenido normal en buscador/ficha | Refuerza "editorial" en páginas de descubrimiento sin arriesgar conversión en páginas de decisión |
| 2026-09-09 | Riesgo aceptado: motion propio en cards de propiedad (curva de marca en hover de imagen) | Complementa el hero animado (`HeroIntro`) y el `Reveal` ya implementados con anime.js sin duplicar su rol |
