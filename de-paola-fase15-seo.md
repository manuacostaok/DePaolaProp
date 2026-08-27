# DE PAOLA PROPIEDADES 2.0 — FASE 15: SEO

*Continúa el trabajo de las Fases 1-14. Consolida en una estrategia única las decisiones de SEO ya adelantadas por página (Fase 2 URLs, Fase 6 Zonas, Fase 7 Insights, Fase 9 Equipo) y agrega lo que falta a nivel sitio completo.*

---

## 1. PUNTO DE PARTIDA (de la Fase 1)

El diagnóstico fue contundente: hoy casi todo el contenido de valor (fotos, precios, descripciones de propiedades) vive en dominios de terceros, no en `depaolapropiedades.com`. Esta fase consolida cómo la nueva arquitectura revierte eso.

## 2. ARQUITECTURA Y URLs

- Ya definidas en detalle en la Fase 2: URLs limpias, en minúsculas, sin tildes, con guiones medios, con landing pages propias para las combinaciones de mayor volumen de búsqueda (`/propiedades/comprar`, `/zonas/[zona]`) en vez de depender solo de query params.
- Cada URL tiene un único propósito y una sola versión canónica — se evita el problema típico de portales inmobiliarios de generar decenas de URLs casi idénticas por combinación de filtro, que diluyen autoridad en vez de concentrarla.

## 3. METADATA

| Tipo de página | Patrón de Title | Patrón de Meta description |
|---|---|---|
| Home | "De Paola Propiedades — Inmobiliaria en Zona Norte, Buenos Aires" | Presentación breve + trayectoria de 20 años + CTA implícito |
| Propiedades (comprar/alquilar) | "Comprar/Alquilar propiedades en Zona Norte \| De Paola Propiedades" | Resumen de cobertura geográfica + tipos de propiedad disponibles |
| Ficha de propiedad | "[Tipo] en [operación] en [Zona] — [dato distintivo] \| De Paola" | Datos clave (ambientes, superficie, precio) en formato legible, no lista de keywords |
| Zona | ya definido en Fase 6 | ya definido en Fase 6 |
| Insights / artículo | Título del artículo + " \| De Paola Insights" | Resumen genuino del artículo, nunca copiado del primer párrafo sin adaptar |
| Equipo / agente | "[Nombre] — Especialista inmobiliario en [zona] \| De Paola" | Breve presentación + zona de especialización |

## 4. SCHEMA.ORG

| Página | Marcado |
|---|---|
| Sitio completo | `RealEstateAgent` + `LocalBusiness` (con las dos sucursales como `Place` asociados) |
| Ficha de propiedad | `Residence` (o el tipo más específico según corresponda: casa, departamento) con precio, ubicación, características |
| Zona | `Place` + `BreadcrumbList` (ya definido en Fase 6) |
| Artículo de Insights | `Article` con autor, fecha, categoría |
| Ficha de agente | `Person`, vinculado al `RealEstateAgent` general (ya definido en Fase 9) |
| Toda página | `BreadcrumbList` consistente en toda la navegación |

## 5. SITEMAP, ROBOTS Y CANONICAL

- `sitemap.xml` generado dinámicamente, incluyendo propiedades activas, zonas, artículos de Insights y fichas de agente — se actualiza solo cuando cambia el contenido, sin intervención manual.
- Propiedades que pasan a estado "vendida/reservada" (evento `cambio_estado`, Fase 11): se retiran del sitemap pero no se eliminan de golpe (devuelven un estado claro — "propiedad no disponible, ver similares" — en vez de un error 404 seco, para no perder el valor SEO ya acumulado de esa URL ni frustrar a quien llega por un link viejo).
- `robots.txt` permite indexación completa del contenido propio; bloquea rutas administrativas y de utilidad interna (panel admin, Fase 19).
- `canonical` en toda página con posibles variantes de URL por filtros, apuntando siempre a la versión "limpia" de esa combinación.

## 6. OPEN GRAPH Y TWITTER CARDS

- Cada ficha de propiedad, artículo y página de zona con su propia imagen de Open Graph (la foto principal/hero de esa página, no un genérico de marca) — relevante porque, según lo definido en la Fase 7, cada artículo se piensa también como pieza de redes sociales.

## 7. CONTENIDO LOCAL

- El foco geográfico ya está resuelto estructuralmente por el propio diseño del proyecto: páginas de zona (Fase 6), contenido de categoría "Zona Norte" en Insights (Fase 7), y fichas de agente con su zona de especialización (Fase 9) — el contenido local no depende de una táctica aislada de SEO sino que está entretejido en la arquitectura completa.
- Cobertura inicial confirmada por el brief: Martínez, Florida, Vicente López, Villa Martelli — se amplía a otras zonas relevantes según lo que confirme De Paola (queda como pendiente en el documento de consolidación final).

## 8. QUÉ NO SE HACE

- Sin keyword stuffing en ningún texto — cada página se escribe para la persona que la lee primero, y se optimiza técnicamente (URL, title, headings, schema) por encima, no metiendo repeticiones forzadas en el cuerpo del texto.
- Sin contenido duplicado entre la ficha propia y lo publicado en portales externos (Zonaprop, Argenprop, etc.) — se recomienda variar al menos la descripción entre el listado propio y el de terceros, dado que Google penaliza contenido idéntico republicado en múltiples dominios.

## 9. RELACIÓN CON EL RESTO DEL PROYECTO

- Toda esta fase depende de que la Fase 3 (fichas de propiedad propias) y la Fase 6 (zonas) efectivamente existan — sin eso, no hay contenido propio que optimizar, que es exactamente el problema del sitio actual.
- Se conecta con la Fase 16 (Performance): un sitio técnicamente sólido en SEO pero lento pierde igual posicionamiento por Core Web Vitals — ambas fases se diseñan en conjunto, no aisladas.

---

## Próximo paso

Fase 15 cerrada. Sigo con la **Fase 16 — Performance**.
