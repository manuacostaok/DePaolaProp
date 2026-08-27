# DE PAOLA PROPIEDADES 2.0 — FASE 6: ZONAS

*Continúa el trabajo de las Fases 1-5. Sigue siendo estrategia — no hay código todavía.*

En la Fase 1 identificamos las páginas de zona como **el diferenciador más grande y más accesible de construir de todo el proyecto**: ni los portales agregadores (Zonaprop, Argenprop) ni las inmobiliarias internacionales de referencia tienen 20 años de conocimiento hiperlocal de Zona Norte. En la Fase 2 se decidió que Zonas vive en el nivel raíz del sitio, no anidada bajo Propiedades, precisamente para que tenga jerarquía propia como contenido — no como un simple filtro.

---

## 1. OBJETIVO DE LA SECCIÓN

Cada página de zona tiene que responder, mejor que cualquier portal, la pregunta que se hace alguien que todavía no decidió dónde comprar/alquilar: **"¿cómo es vivir acá?"** — no solo "¿qué hay en venta acá?". Esa pregunta es la que un agregador de listados no puede responder y De Paola sí, por trayectoria.

## 2. ESTRUCTURA DE CONTENIDO DE UNA PÁGINA DE ZONA

Usando `/zonas/martinez` como ejemplo, aplicable a Florida, Vicente López, Villa Martelli y demás zonas que se definan:

1. **Hero editorial**: fotografía representativa de la zona (no una foto de propiedad) + descripción breve que capture el carácter del barrio.
2. **Descripción extendida**: texto editorial sobre la identidad de la zona — historia, perfil de quien vive ahí, qué la distingue de las zonas vecinas.
3. **Mapa** con los límites de la zona y puntos de interés superpuestos.
4. **Propiedades disponibles**: buscador ya preseteado con el filtro de zona (misma experiencia definida en la Fase 3), no una lista aparte que haya que mantener dos veces.
5. **Precio promedio**, solo si existen datos reales propios — mismo principio de honestidad que en la Fase 5: nunca se muestra un número sin respaldo. Si no hay datos suficientes para esa zona todavía, esta sección directamente no se muestra (no se rellena con un placeholder ni una estimación genérica).
6. **Características del barrio**: seguridad, espacios verdes, tipo de construcción predominante, perfil socioeconómico general — descrito con criterio editorial, no como una lista de "pros y contras" tipo folleto.
7. **Estilo de vida**: qué se hace ahí — gastronomía, comercios, actividades, vida social del barrio.
8. **Transporte**: accesos, estaciones de tren/colectivo, cercanía a autopistas, distancia al centro/CABA.
9. **Colegios**: instituciones educativas relevantes de la zona (dato de alto valor de búsqueda para familias, uno de los perfiles más frecuentes en Zona Norte).
10. **Puntos importantes**: hospitales, clubes, espacios verdes, centros comerciales — lo que un vecino nuevo necesita ubicar.
11. **Contenido relacionado**: artículos de `/insights` etiquetados con esa zona (ej. "Guía para mudarte a Martínez", "Cómo evolucionó el precio en Vicente López") — conecta directamente con la Fase 7 (Insights/Revista).
12. **CTA de cierre**: "¿Querés vender o tasar tu propiedad en [zona]?" — cross-sell directo hacia el flujo de Vender/Tasación de las Fases 4 y 5, aprovechando que quien llegó hasta acá ya demostró interés específico en esa zona.

## 3. PÁGINA ÍNDICE `/zonas`

- Grid de tarjetas, una por zona, con foto representativa + nombre + una frase que capture su identidad (no una descripción larga, eso vive en la página individual).
- Ordenadas por relevancia/volumen de propiedades disponibles, no alfabéticamente — la zona con más inventario y más consultas va primero.
- Sin buscador propio en esta página índice: es una puerta de entrada editorial, el buscador vive dentro de cada zona y en `/propiedades`.

## 4. ARQUITECTURA SEO DE ESTAS PÁGINAS

Esta sección es, según lo definido en la Fase 1, el activo SEO más importante del proyecto por su potencial de long-tail geográfico.

### 4.1 Estructura de URLs y metadata

- URL: `/zonas/[zona]`, ya definida en la Fase 2.
- Title tag: patrón `"Departamentos y casas en [Zona] | Zona Norte | De Paola Propiedades"`.
- Meta description: patrón centrado en la propuesta de valor local, ej. `"Conocé [Zona]: propiedades disponibles, precios, transporte, colegios y estilo de vida. 20 años de trayectoria en Zona Norte."`.
- H1 único por página: `"[Zona], Zona Norte"` — nunca duplicar el H1 entre zonas.

### 4.2 Schema.org

- Marcado `Place` para la zona en sí (nombre, geo, descripción).
- Marcado `BreadcrumbList` (Inicio > Zonas > [Zona]).
- Cada propiedad listada dentro de la página hereda su propio marcado `Residence`/`Product`, que se define en la Fase 15 (SEO) junto con el resto del schema del sitio.

### 4.3 Contenido interno enlazado (linking)

- Cada zona enlaza a: sus propiedades filtradas, sus artículos de Insights relacionados, y las zonas vecinas (ej. Martínez enlaza a Vicente López y Florida) — refuerzo de relevancia temática entre páginas del mismo clúster geográfico.
- La página índice `/zonas` enlaza a todas las zonas individuales, consolidando autoridad hacia ellas desde una página de nivel 1.

### 4.4 Long-tail a cubrir

Esta arquitectura deja preparado el terreno para capturar búsquedas del tipo "casas en venta en Martínez", "departamentos en alquiler Vicente López", "colegios en Florida Zona Norte" — combinaciones que hoy el sitio actual no puede capturar porque no tiene ni la página de zona ni la ficha de propiedad propia (diagnóstico de Fase 1).

## 5. DEPENDENCIA DE DATOS (qué hace falta conseguir, sin inventar)

Siguiendo la regla de "no inventar datos" del brief:

- **Precio promedio por zona**: requiere data histórica propia de operaciones cerradas (se retoma en la Fase 8 — Mercado). Hasta tenerla, esa sección no se muestra.
- **Colegios, transporte, puntos de interés**: son datos públicos/verificables, se pueden cargar con investigación real por zona antes del lanzamiento — no dependen de data propietaria de De Paola.
- **Descripción editorial y estilo de vida**: requiere el conocimiento de campo de Tatiana De Paola y su equipo — es contenido que solo ellos pueden aportar con autoridad real, y es exactamente el activo que ningún competidor puede copiar.

---

## Próximo paso

Fase 6 cerrada, a la espera de tu aprobación. Cuando la confirmes, sigo con la **Fase 7 — Revista / Content** (evolución de la Revista Digital hacia "De Paola Insights").
