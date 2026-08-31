# DE PAOLA PROPIEDADES 2.0 — FASE 2: NUEVA ARQUITECTURA

*Continúa el trabajo de la Fase 1 (Benchmark + Auditoría). Sigue siendo estrategia y arquitectura — no hay código todavía.*

La arquitectura de partida propuesta en el brief original se tomó como punto de partida, se analizó contra el diagnóstico de la Fase 1 y se ajustó donde correspondía. Los cambios más importantes: **Propiedades pasa a tener URLs propias por operación/zona con fines de SEO** (no solo un buscador con filtros por query params), **Zonas se integra con Propiedades** en vez de vivir aislada, y se agrega **Favoritos** e **Insights** (reemplazando "Revista Digital" y "Campus Norte", cuya nomenclatura actual no comunica su contenido).

---

## 1. SITEMAP COMPLETO

```
depaolapropiedades.com
│
├── /                                          Home
│
├── /propiedades                               Buscador (comprar + alquilar, todos los filtros)
│   ├── /propiedades/comprar                   Buscador preseteado en "Venta"
│   ├── /propiedades/alquilar                  Buscador preseteado en "Alquiler"
│   ├── /propiedades/destacadas                Selección curada por De Paola
│   └── /propiedades/[slug-propiedad]          Ficha individual de propiedad
│
├── /zonas                                     Índice de zonas (Zona Norte)
│   ├── /zonas/martinez
│   ├── /zonas/florida
│   ├── /zonas/vicente-lopez
│   ├── /zonas/villa-martelli
│   └── /zonas/[otras-zonas-relevantes]
│
├── /emprendimientos                           Índice de emprendimientos (CORRECCIÓN, ver nota abajo)
│   └── /emprendimientos/campus-norte
│
├── /vender                                    Landing "Quiero vender"
│   └── /vender/tasacion                       Flujo de tasación online
│
├── /invertir                                  Landing "Quiero invertir"
│
├── /insights                                  (reemplaza "Revista Digital")
│   ├── /insights/mercado
│   ├── /insights/inversion
│   ├── /insights/guias
│   ├── /insights/arquitectura
│   ├── /insights/zona-norte
│   ├── /insights/lifestyle
│   ├── /insights/consejos
│   ├── /insights/noticias
│   └── /insights/[slug-articulo]
│
├── /mercado                                   Datos y tendencias de Zona Norte
│
├── /nosotros                                  Historia, 20 años de trayectoria, valores
│
├── /equipo                                    (reemplaza el bloque suelto dentro de Sobre Nosotros)
│   └── /equipo/[nombre-agente]                Ficha individual de agente
│
├── /sucursales                                Villa Martelli + Florida, con mapa
│
├── /contacto                                  Página propia (hoy redirige a Inicio)
│
├── /favoritos                                 Propiedades guardadas por el usuario
│
└── Footer legal
    ├── /aviso-legal
    └── /politica-privacidad
```

## 2. DECISIONES CON ALTERNATIVAS (análisis y justificación)

Donde había más de un camino posible, se comparan las alternativas antes de recomendar.

### 2.1 ¿Zonas vive separada de Propiedades, o integrada?

- **Alternativa A** (la del brief original): "Zonas" como sección independiente en el nivel raíz.
- **Alternativa B**: fusionar Zonas dentro de Propiedades (`/propiedades/zonas/martinez`).
- **Recomendación: A, mantenerla en el nivel raíz**, pero con enlace cruzado fuerte hacia el buscador filtrado por esa zona. Motivo: en la Fase 1 identificamos las páginas de zona como el diferenciador SEO más fuerte del proyecto (contenido editorial + research, no solo un listado). Anidarla bajo `/propiedades/` la subordina visualmente a un simple filtro y le resta jerarquía de indexación como contenido propio. Vive en la raíz, pero cada página de zona embebe el buscador ya filtrado.

### 2.2 ¿URLs de búsqueda con query params, o landing pages estáticas por combinación?

- **Alternativa A**: un único `/propiedades?operacion=venta&zona=martinez&tipo=casa`.
- **Alternativa B**: landing pages indexables para las combinaciones de mayor volumen de búsqueda (`/propiedades/comprar`, y a futuro `/propiedades/comprar/casas-en-martinez`), con el resto de filtros finos (precio, ambientes, cochera) resuelto por query params sobre esa base.
- **Recomendación: B**. Los query params no se indexan bien y es exactamente el error que hoy comete el sitio (cero contenido propio indexable). Las combinaciones de alto volumen ("casas en venta en Martínez", "departamentos en alquiler en Vicente López") necesitan URL propia, título y meta description propios. El resto de los filtros (que son muchos y de bajo volumen de búsqueda individual: baños, cochera, superficie) no justifican una URL propia cada uno y quedan como query params sobre la landing más cercana.

### 2.3 ¿"Vender" e "Invertir" son un único flujo o dos secciones separadas?

- **Alternativa A**: fusionar todo bajo `/vender` con un selector interno.
- **Alternativa B**: secciones separadas `/vender` e `/invertir`.
- **Recomendación: B**. Son dos intenciones de usuario distintas con journeys distintos (el que vende tiene una propiedad y quiere saber cuánto vale; el que invierte busca oportunidades y todavía no tiene una propiedad concreta). Combinarlas obliga a un selector extra que agrega fricción justo en la página de mayor intención de conversión.

### 2.4 ¿Mantener "Revista Digital" y "Campus Norte" como nombres, o renombrar?

- **Recomendación: renombrar "Revista Digital" a "Insights"** (contenido en HTML indexable, no PDF) y **eliminar "Campus Norte" como sección**, distribuyendo lo que hoy contiene entre `/nosotros`, `/equipo` y `/sucursales` según corresponda una vez que se audite su contenido real. Motivo: en el sitio actual ambos nombres no comunican su función (verificado en la auditoría de Fase 1: "Campus Norte" y "Sucursales" apuntan a URLs que no coinciden con su nombre), y "Insights" es más claro para SEO y para el usuario sobre qué va a encontrar.

  **CORRECCIÓN (post-auditoría, ver pendiente #5 de `de-paola-00-pendientes-y-que-pedir.md`): la mitad de esta recomendación estaba mal.** "Campus Norte" no es contenido institucional genérico como "Sucursales" — es un emprendimiento inmobiliario activo (140 unidades en Villa Martelli, financiación propia, dominio y redes propios) que De Paola comercializa. Se audita el contenido real recién ahora, sin haber validado antes la premisa de que era "contenido de relleno". No se elimina: se construye como sección propia (`/emprendimientos`, modelo `Development` en el schema) con la misma jerarquía que Zonas. La recomendación de renombrar "Revista Digital" → "Insights" sigue vigente sin cambios.

## 3. NAVEGACIÓN PRINCIPAL (desktop)

```
[Logo De Paola]   Propiedades ▾   Zonas ▾   Vender ▾   Insights   Mercado   Nosotros ▾        [Buscar]  [Tasá tu propiedad]  [WhatsApp]
```

- **Propiedades ▾**: Comprar / Alquilar / Destacadas
- **Zonas ▾**: Martínez / Florida / Vicente López / Villa Martelli / Ver todas las zonas
- **Vender ▾**: Quiero vender / Tasación online
- **Insights**: sin submenú en el nav (las categorías se navegan dentro de la sección)
- **Mercado**: link directo
- **Nosotros ▾**: Sobre nosotros / Equipo / Sucursales / Contacto
- CTA destacado **"Tasá tu propiedad"** siempre visible (botón, no link de texto) — es el flujo de mayor valor de negocio y hoy no existe.
- Ícono de **Favoritos** y **WhatsApp** persistentes en el header.

## 4. NAVEGACIÓN SECUNDARIA

- Dentro de `/propiedades`: barra de filtros persistente (operación, zona, tipo, precio, ambientes) + toggle lista/mapa.
- Dentro de `/zonas/[zona]`: subnav de anclas internas (Descripción, Propiedades disponibles, Estilo de vida, Cómo llegar, Contenido relacionado).
- Dentro de `/insights`: filtro por categoría (Mercado, Inversión, Guías, Arquitectura, Zona Norte, Lifestyle, Consejos, Noticias).
- Dentro de `/equipo`: filtro por zona de especialización.

## 5. FOOTER

```
Columna 1 — Marca          Columna 2 — Propiedades      Columna 3 — Empresa          Columna 4 — Contacto
Logo + claim                Comprar                       Nosotros                     Sucursal Villa Martelli
20 años de trayectoria      Alquilar                       Equipo                       Sucursal Florida
Redes sociales               Zonas                          Insights                     Teléfono / WhatsApp
                             Tasación                       Mercado                      Email
                                                                                          Formulario de contacto

[Suscribite al newsletter]

Portales asociados: Zonaprop · Argenprop · Mercado Libre · Clarín Inmuebles   (presencia reducida frente al home actual — canal de distribución, no protagonista)

Aviso legal · Política de privacidad · CMCPSI 6308
```

## 6. NAVEGACIÓN MOBILE

- Header fijo: logo + ícono de menú (hamburguesa) + ícono de búsqueda + ícono de WhatsApp.
- Menú hamburguesa: mismas secciones que desktop, en acordeón para los que tienen submenú (Propiedades, Zonas, Vender, Nosotros).
- **Barra inferior fija (bottom nav)**, pensada mobile-first según el principio de Fase 1 de que mobile no es una versión reducida de desktop:

```
[ Buscar ]   [ Zonas ]   [ Tasar ]   [ Favoritos ]   [ WhatsApp ]
```

Este bottom nav prioriza las cuatro acciones de mayor intención (buscar, explorar por zona, tasar, contactar) siempre a un toque de distancia, sin depender del menú hamburguesa.

## 7. JERARQUÍA DE PÁGINAS (profundidad de clics desde Home)

| Nivel | Páginas | Clics desde Home |
|---|---|---|
| 0 | Home | — |
| 1 | Propiedades, Zonas, Vender, Insights, Mercado, Nosotros, Contacto, Favoritos | 1 |
| 2 | Comprar, Alquilar, Destacadas, Tasación, Invertir, Equipo, Sucursales, [zona individual], [categoría de Insights] | 2 |
| 3 | Ficha de propiedad, ficha de agente, artículo individual | 3 (máximo) |

Ninguna página relevante para conversión queda a más de 3 clics de Home — mejora directa sobre el sitio actual, donde la ficha de propiedad ni siquiera es una página propia.

## 8. TABLA DE URLs

| Página | URL |
|---|---|
| Home | `/` |
| Buscador general | `/propiedades` |
| Comprar | `/propiedades/comprar` |
| Alquilar | `/propiedades/alquilar` |
| Destacadas | `/propiedades/destacadas` |
| Ficha de propiedad | `/propiedades/[slug-propiedad]` |
| Índice de zonas | `/zonas` |
| Zona individual | `/zonas/[zona]` (ej. `/zonas/martinez`) |
| Vender | `/vender` |
| Tasación | `/vender/tasacion` |
| Invertir | `/invertir` |
| Insights (home de contenido) | `/insights` |
| Categoría de Insights | `/insights/[categoria]` |
| Artículo | `/insights/[slug-articulo]` |
| Mercado | `/mercado` |
| Nosotros | `/nosotros` |
| Equipo | `/equipo` |
| Ficha de agente | `/equipo/[nombre-agente]` |
| Sucursales | `/sucursales` |
| Contacto | `/contacto` |
| Favoritos | `/favoritos` |

Todas las URLs en minúsculas, sin tildes ni caracteres especiales, con guiones medios — consistente con buenas prácticas de SEO técnico que se detallarán en la Fase 15 (SEO) del proyecto.

---

## Próximo paso

Fase 2 cerrada, a la espera de tu aprobación. Cuando la confirmes, sigo con la **Fase 3 — Experiencia de Propiedades** (buscador, resultados, ficha individual, en desktop/tablet/mobile).
