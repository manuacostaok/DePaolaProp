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
  chapter-heading:
    numberColor: "{colors.accent}"
    numberOpacity: 0.35
  button-text:
    textColor: "{colors.primary}"
    textDecoration: "underline on hover only"
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

**card** (propiedad/zona/artículo/agente): foto-primero, sin chrome de card (sin fondo blanco, sin borde, sin sombra) — imagen con `aspect-ratio` fijo y `object-fit: cover`, bloque tipográfico debajo o superpuesto con scrim. Estados: hover escala la imagen interna (nunca el bloque completo) con la curva de marca — ver Motion, riesgo #3. El primitivo `Card`/`CardBody` (fondo blanco + borde + sombra) queda reservado para contexto funcional (paneles de filtro, formularios), no para contenido editorial — Etapa 2 retiró ese patrón de `ArticleCard`, que hasta ahí era literalmente el "card kit" genérico (borde + sombra + hover-lift) señalado como anti-patrón.

**chapter-heading** (`components/ui/chapter-heading.tsx`, Etapa 2): device estructural de la Home — número de capítulo (01–07) + eyebrow + título, porque la Home se lee como una secuencia real (Identidad → Propiedades → Zonas → Diferencial → Agentes → Editorial → Contacto), no como numeración decorativa. No usar este patrón fuera de una secuencia genuina.

**button-text** (`components/ui/text-link.tsx`, Etapa 2): acción de bajo compromiso ("Ver todo el equipo") — sin fondo ni pill, subrayado solo en hover. Deliberadamente fuera de `buttonVariants` (que asume forma de píldora); `cn()` en este proyecto no hace merge de clases Tailwind en conflicto, así que un variant "text" dentro de `buttonVariants` pelearía con `rounded-pill`/`gap-2`/padding del size — de ahí el componente separado.

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

- **Approach:** intentional — cada animación tiene un trigger claro (montaje una vez, scroll una vez, o loop continuo cuando es textura de fondo explícitamente pedida — ver excepción de `DriftBand` abajo).
- **Easing:** entrada de hero `outExpo` (550ms, stagger 70ms por elemento — `HeroIntro`, `components/ui/hero-intro.tsx`); reveal al scroll `outCubic` (600ms, translateY 14px — `Reveal`, `components/ui/reveal.tsx`); drawers/overlays `cubic-bezier(.455,.03,.515,.955)` (curva de marca propia, ver `app/globals.css`).
- **Duration:** micro(150ms, hover de botones/inputs) short(250ms) medium(550–600ms, entradas de hero/reveal) long(400–700ms, drawers).
- **The one authored moment (riesgo #3, implementado):** zoom sutil de imagen en cards de propiedad al hover — `duration-[430ms] ease-brand group-hover:scale-[1.08]` en `components/ui/property-card.tsx`, con `--ease-brand` (`cubic-bezier(.455,.03,.515,.955)`) como token en `app/globals.css`. Valores acordados en vivo vía prototipo de `/design-html` (comparación lado a lado con el `ease-out` genérico anterior).
- **Regla dura:** buscador y ficha de propiedad no llevan motion decorativo — ninguna de las animaciones de esta sección aplica ahí.
- **Excepción explícita — texturas de fondo en Home (`DriftBand`/`MotifRow`, `components/ui/section-motifs.tsx`):** banda de ilustraciones de línea (mismo lenguaje que `ArchitectureMark`: trazo fino, `currentColor`, "plano de arquitecto") en loop CSS infinito (`animate-marquee`, `app/globals.css`), a la deriva detrás del contenido — casas en 01, el skyline de `ArchitectureMark` en 02 y 03 (dirección/velocidad distinta en cada una para variar), personas en 04, documentos en 05. Reemplaza un primer intento con fotos reales en carrusel: el usuario pidió dibujos, no fotografías, y el trazo de línea a baja opacidad (~0.14–0.16) es además la única forma de garantizar que nunca compita en contraste con el texto — una foto por tenue que sea puede tener zonas claras/oscuras impredecibles, una línea fina no. Sin scrim adicional (no hace falta: mismo criterio que `ArchitectureMark` ya usaba sin scrim en la pausa editorial). Pausa con `prefers-reduced-motion`. Solo Home — buscador/ficha siguen sin este patrón.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-09-09 | DESIGN.md creado formalizando el sistema existente (no reemplazo) | `/design-consultation` corrido sobre proyecto ya maduro; usuario eligió "evolucionar el sistema actual" en vez de rediseño desde cero |
| 2026-09-09 | Newsreader se mantiene pese a estar en la lista de fuentes sobreusadas del catálogo 2026 | Ya licenciada, cargada y aprobada por el cliente; diferenciación se juega en composición y motion, no en tipografía — revisar si el cliente pide cambio |
| 2026-09-09 | Riesgo aceptado: full-bleed en hero de Home/zona, contenido normal en buscador/ficha | Refuerza "editorial" en páginas de descubrimiento sin arriesgar conversión en páginas de decisión |
| 2026-09-09 | Riesgo aceptado: motion propio en cards de propiedad (curva de marca en hover de imagen) | Complementa el hero animado (`HeroIntro`) y el `Reveal` ya implementados con anime.js sin duplicar su rol |
| 2026-09-09 | Riesgo #3 implementado: `duration-[430ms] ease-brand scale-[1.08]` en `property-card.tsx`, token `--ease-brand` sumado a `app/globals.css` | Valores acordados por el usuario comparando lado a lado con el `duration-300 ease-out` anterior en un prototipo de `/design-html` |
| 2026-09-09 | Etapa 2 — transformación editorial: retira el "card kit" genérico (borde + sombra + hover-lift) de `ArticleCard`; `PropertyCard`/`ZoneCard`/`AgentCard` pasan a foto-primero puro; `ActionPanel` de la ficha pierde el chrome de buy-box (caja blanca bordeada); Home se reordena en capítulos numerados (Identidad → Propiedades → Zonas → Diferencial → Agentes → Editorial → Contacto), con dos secciones nuevas (Agentes, Editorial) que antes no existían ahí | Usuario pidió transformación visual significativa ("premium/editorial, no SaaS genérico"), no otro refinamiento — DESIGN.md no se trata como cárcel, evoluciona donde una decisión anterior limitaba esa dirección |
| 2026-09-09 | Se mantiene sin cambios: paleta, tipografías (Newsreader/Jost), full-bleed solo Home/zona, cero motion decorativo en buscador/ficha, toda la lógica de scroll del header | Explícito en el pedido del usuario — la transformación sale de composición/tipografía/foto, no de tokens de color ni de reglas de performance ya validadas |
| 2026-09-10 | Home suma texturas de fondo animadas por capítulo — loop CSS continuo, algo que la regla de Motion anterior ("nunca... en loop") no contemplaba | Pedido explícito del usuario: "en las secciones... algo animado que tenga que ver con la sección". Se acota a Home (buscador/ficha mantienen la regla dura sin motion decorativo) |
| 2026-09-10 | Footer suma línea de crédito "Hecho por Aura Tech Solutions" | Pedido explícito del usuario |
| 2026-09-10 | Primer intento de las texturas (fotos reales en `ImageMarquee`) se reemplaza por ilustraciones de línea (`section-motifs.tsx`, mismo lenguaje que `ArchitectureMark`) — componente y archivo eliminados | El usuario aclaró que se refería a "dibujos animados de casas/edificios o personas", no fotografías; de paso resuelve el riesgo de contraste que señaló ("que no se superponga texto con los fondos") — trazo fino a baja opacidad nunca compite con texto, a diferencia de una foto real |
