# DE PAOLA PROPIEDADES 2.0 — FASE 14: MOBILE FIRST

*Continúa el trabajo de las Fases 1-13. Consolida y completa las decisiones mobile ya adelantadas en fases anteriores (Fases 2, 3, 4, 12) en un criterio único.*

La mayoría de las decisiones mobile de cada componente ya se tomaron dentro de su propia fase (navegación en Fase 2, buscador/ficha en Fase 3, formularios en Fase 4, tipografía/spacing en Fase 12). Esta fase las consolida y agrega lo que falta: por qué se diseñó así y las reglas transversales que faltaban precisar.

---

## 1. POR QUÉ MOBILE FIRST Y NO "RESPONSIVE" A SECAS

La mayoría de las búsquedas inmobiliarias en Argentina ocurren en el celular, muchas veces en momentos cortos (esperando algo, en el trayecto). Diseñar mobile como una reducción de desktop —que es lo que hoy hace, de hecho, el sitio actual construido en Wix— produce jerarquías equivocadas: elementos secundarios en desktop terminan compitiendo por el mismo espacio reducido que los elementos críticos en mobile. Por eso cada componente de este proyecto se diseñó pensando primero en el caso mobile y ampliándolo después a tablet/desktop, no al revés.

## 2. CONSOLIDADO DE DECISIONES MOBILE YA TOMADAS

| Componente | Decisión mobile | Definida en |
|---|---|---|
| Navegación | Header + hamburguesa + bottom nav fijo de 5 accesos (Buscar, Zonas, Tasar, Favoritos, WhatsApp) | Fase 2 |
| Buscador | Filtros ocultos por default, botón "Filtros" a pantalla completa + accesos rápidos a los 3 filtros más usados | Fase 3 |
| Resultados | Grid de 1 columna, mapa y lista como pestañas separadas (no vista partida) | Fase 3 |
| Ficha de propiedad | Galería en carrusel full-screen, barra de acción fija abajo (WhatsApp / Visita / Favorito) | Fase 3 |
| Formularios de captación | Progresivos, 2-3 campos por paso, con barra de progreso | Fase 4 |
| Tipografía | Escala reducida proporcionalmente (Display ~36-40px en vez de 56-72px) | Fase 12 |

## 3. REGLAS TRANSVERSALES QUE FALTABAN DEFINIR

### 3.1 Galerías

- Todas las galerías del sitio (propiedad, zona, artículo de Insights) usan el mismo patrón: swipe horizontal, indicador de posición (puntos o "3/12"), sin necesidad de pellizcar para hacer zoom salvo en la vista de foto individual ampliada.

### 3.2 Mapas

- El mapa nunca ocupa más del 60% de la pantalla en mobile cuando convive con otro contenido (ej. dentro de una ficha de zona) — deja lugar para que el usuario siga scrolleando sin quedar "atrapado" en el gesto de mapa (problema típico de UX mobile con mapas embebidos).
- En la vista de resultados con mapa a pantalla completa (Fase 3), un botón flotante "Ver lista (N)" permite volver a la lista sin perder el estado del mapa.

### 3.3 CTAs

- Ningún CTA crítico (WhatsApp, Tasar, Solicitar visita) queda debajo del pliegue sin una alternativa fija — es la razón de ser del bottom nav (Fase 2) y de la barra de acción fija en la ficha de propiedad (Fase 3).
- Los botones táctiles respetan un área mínima de toque de 44x44px (estándar de accesibilidad táctil), sin excepción incluso en componentes densos como los filtros.

### 3.4 Performance percibida en mobile (conexiones más lentas o inestables)

- Imágenes servidas en el tamaño real que se van a mostrar (no una imagen grande escalada por CSS) — se detalla técnicamente en la Fase 16 (Performance).
- Skeleton screens (Fase 12) en toda carga de contenido que tarde más de ~300ms, para que la app se perciba activa incluso en conexión más lenta.

### 3.5 IA en mobile

- La barra de búsqueda conversacional de De Paola AI (Fase 10) es accesible desde el mismo lugar que el buscador tradicional — no requiere una pantalla dedicada aparte, para no sumar un nivel de navegación extra en un dispositivo donde cada tap cuenta.

## 4. QUÉ NO SE REDUCE, SE REDISEÑA

Ejemplos concretos de la regla "mobile no es una versión achicada de desktop" ya aplicados en fases anteriores:

- El buscador no es el mismo panel de filtros de desktop comprimido: es una experiencia de pantalla completa distinta, pensada para el pulgar.
- La ficha de propiedad no apila los mismos bloques en el mismo orden que desktop reducido a una columna: prioriza galería y barra de acción fija por sobre el panel lateral sticky que sí tiene sentido en desktop.
- El mapa de resultados no es "el mismo mapa pero chico": cambia de interacción (pestaña propia en vez de vista partida).

---

## Próximo paso

Fase 14 cerrada. Sigo con la **Fase 15 — SEO**.
