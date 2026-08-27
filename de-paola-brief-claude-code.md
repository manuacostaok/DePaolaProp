# DE PAOLA PROPIEDADES 2.0 — BRIEF PARA CLAUDE CODE

*Pegá este documento completo como primer mensaje a Claude Code (terminal, VS Code o JetBrains). Es el resumen ejecutable de las 21 fases de estrategia ya aprobadas — Claude Code no tiene que inventar arquitectura, diseño ni alcance: está todo definido acá.*

---

## 0. CONTEXTO Y OBJETIVO

Construir la implementación real de **De Paola Propiedades 2.0**, una plataforma inmobiliaria para Zona Norte de Buenos Aires (Martínez, Florida, Vicente López, Villa Martelli). Hoy la inmobiliaria tiene un sitio Wix sin buscador propio, que deriva cada propiedad a Zonaprop/Argenprop/Mercado Libre. El objetivo de este proyecto es traer toda la experiencia (búsqueda, fichas, tasación, contenido) al dominio propio.

**Regla de trabajo más importante: construir con datos de ejemplo/placeholder ahora, y reemplazarlos por datos reales de De Paola más adelante, sin tener que rearmar estructura.** Todo el modelo de datos y los componentes se diseñan pensando en eso desde el día uno — nunca hardcodear un dato de ejemplo directamente en un componente; siempre debe salir de la base de datos/seed, para que cambiarlo después sea solo cuestión de reemplazar filas, no de tocar código.

Hay una **muestra visual de referencia** (HTML/CSS estático) ya aprobada por el cliente interno — usarla como referencia de diseño y de contenido real ya recolectado (adjuntar la carpeta `depaola-demo/` al repo o pasarla como contexto). De ahí sale: paleta de color, tipografía, textos reales de "Sobre Nosotros" y de la fundadora Tatiana De Paola, datos de contacto, y las dos propiedades reales con fotos.

---

## 1. STACK TÉCNICO (Fase 17 — ya evaluado y confirmado, no reabrir la decisión)

```
Frontend:        Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion (+ GSAP solo si hace falta algo puntual)
Backend:         Next.js API routes / Node.js (mismo repo)
Base de datos:   PostgreSQL + Prisma
Infraestructura: Vercel (Hobby/free para empezar, escala a Pro después — ver nota de hosting al final)
Automatización:  n8n (se conecta más adelante, Fase 15 del master plan — no es parte del build inicial)
Analytics:       Google Analytics 4 + Google Search Console (se instrumenta en Phase 11 del master plan)
```

Proveedor de imágenes/CDN, proveedor de mapas (Google Maps o Mapbox) y proveedor de IA para el buscador conversacional: **decisiones abiertas** — usar Vercel Image Optimization y Google Maps como default razonable para arrancar (son gratis para volumen bajo), documentar en el código con un comentario `// TODO: confirmar proveedor definitivo` donde corresponda, sin bloquear el desarrollo por esto.

---

## 2. DESIGN SYSTEM (Fase 12 — tokens ya definidos, implementar tal cual)

```css
--bg:            #FAF8F3;   /* blanco cálido, no crema genérico */
--bg-alt:        #EFE9DC;
--ink:           #211F1B;
--ink-soft:      #57534A;
--brand:         #24443F;   /* verde petróleo profundo — identidad Zona Norte */
--brand-dark:    #172C29;
--brand-tint:    #E4EDE9;
--line:          #DED7C6;
--success:       #3F7A5C;
--alert:         #B9853A;
--whatsapp:      #25D366;
```

- Tipografía: **Fraunces** (serif editorial, encabezados) + **Inter** (sans, cuerpo/UI). Google Fonts, cargar con `next/font` para no penalizar performance.
- Spacing en base 8px (8, 16, 24, 32, 48, 64, 96).
- Radios de esquina chicos (4px componentes, 10px cards) — nunca esquinas rectas tipo "broadsheet" ni píldora completa.
- Sombras muy sutiles o ausentes; separar con borde fino o espacio en blanco.
- Motion: transiciones cortas (150-400ms), respetar `prefers-reduced-motion` siempre. Nada de sliders automáticos ni parallax en ficha de propiedad ni buscador (son las páginas de mayor conversión, no llevan efectos).
- Ver la carpeta `depaola-demo/style.css` de la muestra como implementación de referencia de estos mismos tokens en CSS plano — portar la lógica a Tailwind config, no copiar el CSS tal cual.

---

## 3. SITEMAP COMPLETO (Fase 2)

```
/                                Home
/propiedades                     Buscador general
/propiedades/comprar             Preseteado en Venta
/propiedades/alquilar            Preseteado en Alquiler
/propiedades/destacadas          Selección curada
/propiedades/[slug]              Ficha individual
/zonas                           Índice de zonas
/zonas/[zona]                    Zona individual (martinez, florida, vicente-lopez, villa-martelli)
/vender                          Landing "Quiero vender"
/vender/tasacion                 Flujo de tasación
/invertir                        Landing "Quiero invertir"
/insights                        Home de contenido
/insights/[categoria]            Categoría
/insights/[slug]                 Artículo
/mercado                         Datos y tendencias
/nosotros                        Historia y valores
/equipo                          Índice de agentes
/equipo/[nombre-agente]          Ficha de agente
/sucursales                      Villa Martelli + Florida
/contacto                        Formulario + datos
/favoritos                       Propiedades guardadas
/admin/*                         Panel administrativo (protegido)
```

URLs en minúsculas, sin tildes, guiones medios. Sin query params para las combinaciones de alto volumen (comprar/alquilar por zona ya tienen landing propia); sí usar query params para filtros finos (precio, ambientes, etc.) sobre esas landing.

---

## 4. MODELO DE DATOS (Fase 18 — usar como base del schema Prisma)

Entidades principales y relaciones:

```
Property ── PropertyLocation ── Neighborhood
Property ── PropertyImage (muchas)
Property ── PropertyFeature (muchas)
Property ── Agent (a cargo)
Property ── Office (sucursal, opcional)
Property ── Favorite (muchos, por User)

Agent ── Office
Agent ── Neighborhood (especialización, muchos a muchos)
Agent ── Property (a cargo, muchas)
Agent ── Lead (asignados)

Lead: tipo (comprar/alquilar/vender/tasar/invertir), datos de contacto, filtros capturados,
      estado (nuevo/contactado/en_proceso/cerrado), asignado a Agent
      → genera Inquiry / Appointment / ValuationRequest según el flujo de origen

ValuationRequest: ubicación, dimensiones, estado de la propiedad a tasar,
                  resultado (rango estimado O derivación directa — ver sección 6), vinculado a Lead

Article ── Category
Article ── Neighborhood (opcional)

Neighborhood: descripción editorial, datos de estilo de vida/transporte/colegios,
              indicadores de mercado (solo si existen datos reales — ver sección 7)

User ── Favorite ── Property
```

Generar el schema Prisma completo a partir de esto, con los campos de detalle que corresponden a cada entidad (precio, moneda, superficie, ambientes, etc. — ya están listados con detalle en el documento `de-paola-fase18-modelo-datos.md` si está disponible en el repo; si no, inferir campos razonables de tipo texto/número/enum según el nombre).

---

## 5. QUÉ CONTENIDO ES REAL HOY Y QUÉ ES PLACEHOLDER (usar como seed inicial)

**Real — cargar tal cual como seed de base de datos:**
- Textos de "Sobre Nosotros" y bio de Tatiana De Paola (fundadora) — están en `depaola-demo/nosotros.html`.
- Datos de contacto: Villa Martelli (Av. Laprida 3731), Florida (Av. San Martín 2890 esq. Beiro, Vicente López), teléfono 4709-1179/6164/0357, WhatsApp 11 2875-5265, email contacto@depaolapropiedades.com.
- Dos propiedades reales con fotos (Casa 5 ambientes Barrio Parque, Villa Martelli / Chalet 6 ambientes, Martínez) — datos y URLs de imagen en `depaola-demo/propiedad-detalle.html` y `depaola-demo/index.html`.
- Logo de la marca.

**Placeholder — usar contenido de ejemplo, dejar preparado para reemplazo fácil vía seed/CMS, NUNCA hardcodeado en el componente:**
- El resto del inventario de propiedades (usar 8-10 propiedades de ejemplo con datos ficticios realistas, con una marca clara en el campo `isSample: true` en la base para poder filtrarlas/borrarlas de un saque cuando lleguen datos reales).
- Fotos de agentes (usar placeholder visual, no fotos de stock de personas reales — un bloque de color con iniciales alcanza).
- Contenido editorial de zonas (descripción de barrio, estilo de vida, colegios, transporte) — escribir un borrador razonable por zona, marcado con un comentario o campo `needsReview: true`, nunca presentado como definitivo.
- Datos de mercado (precio promedio, evolución) — **no inventar gráficos con números falsos**. La sección de mercado y el bloque de precio promedio en cada zona deben quedar condicionalmente ocultos (`if (hasMarketData)`) hasta que exista data real cargada — mismo criterio que ya se aplicó en la muestra HTML.

El documento `de-paola-00-pendientes-y-que-pedir.md` (si está en el repo) tiene el detalle completo de qué dato falta y por qué — seguirlo como fuente de verdad para decidir qué mostrar condicionalmente y qué no.

---

## 6. TASACIÓN — CÓMO TIENE QUE FUNCIONAR (Fase 5, importante no simplificar de más)

Formulario progresivo de 4 pasos (ubicación, dimensiones, estado, contacto) → al enviar:

- **Si hay suficientes propiedades comparables cargadas** (mismo tipo + zona + rango de superficie): calcular y mostrar un **rango de precio** (nunca un número único), con el texto explícito "esta es una estimación automática — un agente puede afinarla con una visita". El cálculo en esta etapa es una regla simple (promedio ± desvío de comparables), **no hace falta IA para esto todavía** — la mejora con un modelo más sofisticado es un paso futuro, no bloquea el lanzamiento.
- **Si no hay comparables suficientes** (el caso más probable al arrancar, mientras se carga inventario real): no mostrar ningún número. Mostrar: "Todavía no tenemos suficientes datos en esta zona para una estimación automática. Un especialista de De Paola te contacta con una tasación profesional." + opción de agendar horario.
- En **ambos** casos se genera un `Lead` tipo `tasacion`, visible en el panel admin, asignado a un agente — la salida siempre termina en contacto humano, la diferencia es solo si hubo o no un rango orientativo antes de pedir el contacto.
- No mostrar la palabra "IA" en la interfaz para este flujo — es un cálculo por reglas, no un modelo de IA (evitar prometer algo que todavía no existe).

---

## 7. BUSCADOR CONVERSACIONAL ("DE PAOLA AI", Fase 10) — separado de la tasación

Esto sí usa un modelo de lenguaje, pero es una funcionalidad **distinta** de la tasación: una barra de búsqueda en lenguaje natural (ej. "casa de 3 ambientes en Martínez hasta USD 400.000 con pileta") que interpreta la intención y arma los mismos filtros del buscador tradicional — no inventa datos de propiedades ni de mercado, solo traduce lenguaje natural a filtros y corre la misma búsqueda. Es de prioridad más baja: implementarlo recién cuando el buscador tradicional (Fase 3) ya esté sólido — no bloquea el resto del sitio. Documentado en detalle en `de-paola-fase10-ia.md`.

---

## 8. ORDEN DE CONSTRUCCIÓN (seguir el Master Plan de la Fase 21, resumen ejecutable)

Pedile a Claude Code que vaya fase por fase, mostrando qué construyó y pidiendo confirmación antes de seguir a la próxima (igual que se hizo en la etapa de estrategia):

1. **Phase 0** — repo, Next.js + TS + Tailwind + Prisma + Postgres, deploy inicial en Vercel.
2. **Phase 1** — Design system: tokens de Tailwind, componentes base (Button, Input, Card, Badge, Skeleton).
3. **Phase 2** — Layout: header, footer, nav principal/secundaria, bottom nav mobile.
4. **Phase 3** — Home, con seed de datos cargado (real + ejemplo según sección 5).
5. **Phase 4** — Buscador de propiedades (filtros, lista, mapa).
6. **Phase 5** — Ficha de propiedad individual.
7. **Phase 6** — Páginas de zona.
8. **Phase 7** — Flujo de tasación (sección 6 de este documento).
9. **Phase 8** — Los otros 4 flujos de captación (comprar, alquilar, vender, invertir).
10. **Phase 9** — Panel admin (propiedades, leads, agentes).
11. **Phase 10** — CMS de Insights + fichas de equipo.
12. **Phase 11** — Analytics (eventos de la Fase 20).
13. **Phase 12** — SEO (metadata, schema.org, sitemap.xml).
14. **Phase 13** — Performance (Core Web Vitals, Fase 16).
15. **Phase 14** — De Paola AI (sección 7 de este documento) — opcional según tiempo disponible.
16. **Phase 15** — Integración n8n (cuando haya CRM definido).
17. **Phase 16** — Testing.
18. **Phase 17** — Producción, dominio propio, redirecciones desde el sitio Wix actual.

No hace falta terminar las 18 fases de una — se puede lanzar una versión funcional apenas estén completas las Phases 0 a 7 (repo, diseño, layout, home, buscador, ficha, zonas, tasación), que ya es infinitamente superior al sitio Wix actual, e ir sumando el resto en producción.

---

## 9. HOSTING (mismo criterio que la muestra: gratis ahora, escala después)

Desplegar en **Vercel, plan Hobby (gratis)** desde el día u1 — sin límite de tiempo, dominio propio conectable sin costo, SSL automático, CDN incluido. Recién pasar a un plan pago (Pro, ~USD 20/mes) cuando el proyecto esté aprobado comercialmente y necesiten más de un colaborador en el equipo o el sitio reciba tráfico serio. Conectar el repo de GitHub a Vercel para que cada push despliegue automáticamente.

---

## 10. QUÉ NO HACER

- No inventar datos de mercado, precios promedio, ni cifras que no salgan de una fuente real o estén claramente marcadas como ejemplo.
- No mostrar "IA" en la tasación — es cálculo por reglas.
- No hardcodear contenido de ejemplo directamente en componentes — todo sale de la base de datos/seed.
- No usar animaciones pesadas en el buscador ni en la ficha de propiedad.
- No copiar el CSS de la muestra HTML tal cual — usarlo como referencia de tokens, implementar en Tailwind.

---

*Fin del brief. Si Claude Code necesita más detalle de alguna fase puntual, los documentos completos de las 21 fases (de-paola-fase1 a fase21) y el de pendientes están disponibles para adjuntar como contexto adicional.*
