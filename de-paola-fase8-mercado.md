# DE PAOLA PROPIEDADES 2.0 — FASE 8: MERCADO INMOBILIARIO

*Continúa el trabajo de las Fases 1-7. Sigue siendo estrategia — no hay código todavía.*

Esta sección se apoya directamente en el trabajo de Knight Frank identificado como referencia en la Fase 1: research de mercado como activo de autoridad y de SEO, no como adorno. Se aplica acá la misma regla que ya rigió Tasación (Fase 5) e Insights de categoría Mercado (Fase 7): **no se inventan datos**. Esta fase define qué se puede mostrar hoy, qué falta conseguir, y cómo se visualiza cuando exista.

---

## 1. QUÉ DATOS REALES NECESITAMOS CONSEGUIR

Ninguno de estos datos existe hoy de forma verificada según lo relevado en la Fase 1 — se listan como requisito antes de poder construir la sección, no como algo ya disponible:

| Dato necesario | Fuente posible | Para qué se usa |
|---|---|---|
| Histórico de operaciones cerradas por De Paola (precio, zona, tipo, fecha) | Registros internos de la inmobiliaria (20 años de trayectoria) | Precio promedio por zona (Fase 6), tendencias, motor de estimación de Tasación (Fase 5) |
| Tiempo promedio en mercado por zona/tipo | Registros internos | Indicador de dinamismo por zona |
| Volumen de oferta actual por zona/tipo | Propiedades activas en la plataforma propia una vez migradas | Indicador de oferta vs. demanda |
| Evolución de precio del m² por zona (serie histórica) | Registros internos +, si se decide, fuentes públicas de referencia (ej. informes de cámaras inmobiliarias) citadas explícitamente | Gráficos de evolución |
| Comparativa entre zonas de Zona Norte | Cruce de los datos anteriores | Contenido de Insights (Mercado) y diferenciación entre páginas de zona |

**Ninguno de estos puntos se resuelve con estimaciones genéricas de internet presentadas como propias** — si se usa una fuente externa, se cita como tal, nunca se mezcla con los datos propios sin distinción.

## 2. QUÉ SE PUEDE MOSTRAR DESDE EL LANZAMIENTO (sin depender de esa base histórica)

Mientras se recopila y valida la base de datos interna, la sección `/mercado` no queda vacía — se lanza con lo que sí es honesto mostrar desde el día uno:

- **Oferta actual real**: cantidad de propiedades activas por zona/tipo/operación, calculada en vivo sobre el inventario propio ya cargado en la plataforma (dato 100% verificable, no una estimación).
- **Contenido editorial de la categoría "Mercado" de Insights** (Fase 7): análisis cualitativo con el criterio experto del equipo, que no depende de tener una serie estadística todavía.
- Un mensaje claro donde falte el dato cuantitativo: "Estamos construyendo el histórico de precios de Zona Norte con nuestros 20 años de operaciones — próximamente vas a poder ver la evolución completa acá", en vez de dejar un gráfico vacío o, peor, inventado.

## 3. CÓMO SE VISUALIZA (una vez que existan los datos)

1. **Panel resumen** al tope de `/mercado`: 3-4 indicadores clave de Zona Norte en conjunto (precio promedio del m², tiempo promedio en mercado, zona con más movimiento).
2. **Selector de zona**: al elegir una zona, el panel se actualiza con sus indicadores específicos — reutiliza el mismo dato que alimenta la sección "Precio promedio" de la página de esa zona (Fase 6), sin mantenerlo dos veces.
3. **Gráfico de evolución de precio** (serie temporal) por zona y tipo de propiedad — visualización de línea, simple y legible, no un dashboard sobrecargado.
4. **Comparativa entre zonas**: gráfico de barras horizontal con las zonas ordenadas por precio promedio del m², para que el usuario compare de un vistazo.
5. **Informes descargables** (a futuro, opcional): PDFs generados a partir del mismo contenido HTML, nunca al revés — mismo criterio ya aplicado en Insights (Fase 7) de que el HTML es la fuente primaria y el PDF, si existe, es un derivado.

## 4. INTEGRACIÓN CON EL RESTO DE LA PLATAFORMA

- Los indicadores de `/mercado` y los de cada página de `/zonas/[zona]` (Fase 6) se calculan desde la misma fuente de datos — nunca se cargan por separado, para evitar que un número diga una cosa en una página y otra cosa en otra.
- El motor de estimación de Tasación (Fase 5) se nutre de la misma base histórica que esta sección — cuando haya datos suficientes para mostrar en `/mercado`, también va a haber datos suficientes para que Tasación empiece a dar estimaciones automáticas en más zonas.
- Los artículos de Insights categoría "Mercado" (Fase 7) pueden embeber o referenciar los gráficos de esta sección en vez de reconstruir los datos manualmente en cada artículo.

---

## Próximo paso

Fase 8 cerrada, a la espera de tu aprobación. Cuando la confirmes, sigo con la **Fase 9 — Equipo** ("Nuestros Especialistas": fichas de agentes).
