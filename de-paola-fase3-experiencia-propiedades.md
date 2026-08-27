# DE PAOLA PROPIEDADES 2.0 — FASE 3: EXPERIENCIA DE PROPIEDADES

*Continúa el trabajo de las Fases 1 (Benchmark + Auditoría) y 2 (Arquitectura). Sigue siendo estrategia — no hay código todavía.*

Esta es la fase más crítica del proyecto: en la Fase 1 identificamos que hoy De Paola no tiene buscador ni fichas propias, y envía a cada usuario interesado hacia Zonaprop/Argenprop/Mercado Libre. Todo lo que sigue está diseñado para que **la propiedad se descubra, se explore y se consulte sin salir nunca de `depaolapropiedades.com`**.

---

## 1. BUSCADOR

### 1.1 Filtros

| Filtro | Tipo | Notas |
|---|---|---|
| Operación | Selector (Comprar / Alquilar) | Determina el resto del set de filtros disponibles (ej. "expensas" solo aplica en alquiler/PH/depto) |
| Ubicación (zona/barrio) | Buscador con autocompletado + selección múltiple | Alimentado por las páginas de `/zonas` de la Fase 2 |
| Precio | Rango (min–max) con slider | — |
| Moneda | Selector (USD / ARS) | Relevante en el mercado argentino; debe convivir con el filtro de precio, no reemplazarlo |
| Tipo de propiedad | Selector múltiple | Casa, Departamento, PH, Terreno, Local, Oficina |
| Ambientes | Rango (min–max) | — |
| Dormitorios | Rango (min–max) | — |
| Baños | Rango (min–max) | — |
| Superficie | Rango (min–max) + selector cubierta/total | — |
| Cochera | Sí/No/Indistinto | — |
| Características | Selección múltiple (pileta, parrilla, balcón, jardín, seguridad, apto profesional, etc.) | Lista inicial acotada; se amplía con datos reales de las propiedades que administra De Paola |

### 1.2 Comportamiento

- Filtros visibles y editables en todo momento (no ocultos detrás de un botón "más filtros" salvo en mobile, ver 1.4).
- Contador de resultados en vivo a medida que se ajustan filtros, sin recargar la página.
- Cada combinación de filtros queda reflejada en la URL (query params, según lo definido en la Fase 2) para poder compartir o guardar una búsqueda.
- Guardar búsqueda + alertas por email/WhatsApp cuando aparezcan propiedades nuevas que cumplan esos filtros — mecanismo de retención inspirado en el patrón de Compass identificado en el benchmark de Fase 1, y de bajísima fricción para captar leads de comprador sin pedirles nada más que el filtro que ya armaron.

### 1.3 Desktop / Tablet

- Layout de dos columnas: filtros a la izquierda (colapsable), resultados a la derecha.
- Toggle Lista / Mapa arriba de los resultados.
- En tablet, los filtros pasan a un panel desplegable superior para no competir por ancho con las cards.

### 1.4 Mobile

- Los filtros no ocupan pantalla por default: botón "Filtros" fijo que abre un panel de pantalla completa, con aplicar/cancelar claros.
- Barra de accesos rápidos arriba de los resultados con los 3 filtros más usados (Operación, Zona, Precio) sin necesidad de abrir el panel completo.
- Toggle Lista/Mapa como pestañas, no como ícono chico — tienen que ser fáciles de tocar con el pulgar.

---

## 2. RESULTADOS

### 2.1 Cards de propiedad

Cada card muestra: foto principal (con indicador de cantidad total de fotos), operación (venta/alquiler), precio, tipo + ambientes, ubicación (barrio), superficie, ícono de favorito, y — si aplica — badge "Destacada" o "Nueva".

### 2.2 Vista lista

- Grid responsivo: 3 columnas en desktop, 2 en tablet, 1 en mobile.
- Ordenamiento: Relevancia (default), Precio (menor a mayor / mayor a menor), Más recientes, Superficie.

### 2.3 Vista mapa

- Mapa interactivo con pines agrupados (clustering) cuando hay muchos resultados cercanos.
- Al pasar el mouse/tocar un pin, se resalta la card correspondiente en la lista lateral (y viceversa) — patrón estándar de portales inmobiliarios, que hoy De Paola no ofrece en absoluto por no tener buscador propio.
- En mobile, mapa y lista son dos pestañas separadas, no una vista partida (poco espacio para ambas a la vez).

### 2.4 Funciones transversales a la vista

- **Favoritos**: ícono de corazón en cada card, persistente en `/favoritos` (con guardado local para usuario no logueado, y asociado a su contacto si deja el dato en algún flujo).
- **Compartir**: link directo a la ficha (WhatsApp, copiar link, email).
- **Propiedades similares**: se muestran al pie de los resultados cuando la búsqueda da pocos o cero resultados, evitando el "sin resultados" como callejón sin salida.

---

## 3. FICHA INDIVIDUAL DE PROPIEDAD

### 3.1 Estructura de contenido

1. **Galería de fotografías** a pantalla completa como elemento dominante (según el principio de Fase 1 "fotografía primero") + video si existe.
2. **Encabezado**: precio, operación, tipo, ubicación, superficie, ambientes/dormitorios/baños — de un vistazo, sin scroll.
3. **Descripción** editorial, no solo una lista de características (según el principio "editorial, no catálogo" de Fase 1).
4. **Características** en grilla de íconos (cochera, pileta, seguridad, etc.).
5. **Mapa** de ubicación (con radio aproximado si el propietario prefiere no mostrar la dirección exacta).
6. **Datos relevantes**: expensas (si aplica), antigüedad, orientación, estado.
7. **Agente a cargo**: foto, nombre, teléfono/WhatsApp directo, link a su ficha en `/equipo` — resuelve el vínculo humano que hoy la web no muestra en la ficha (porque no hay ficha).
8. **Propiedades similares** al pie.

### 3.2 CTAs de conversión (todos visibles sin scroll excesivo, no solo al final)

- **WhatsApp directo** con mensaje prearmado (ej. "Hola, me interesa la propiedad en Yapeyú al 400, Martínez").
- **Solicitar visita**: formulario mínimo (nombre, teléfono, franja horaria preferida).
- **Consultar por email/formulario**: alternativa para quien no usa WhatsApp.
- **Favorito** y **Compartir**, siempre visibles en el encabezado de la ficha.

Estos CTAs reemplazan directamente el único "CONSULTAR" (mailto) que existe hoy, diversificando el canal de contacto según la preferencia del usuario.

### 3.3 Desktop

- Layout de dos columnas: galería + contenido a la izquierda (70%), panel fijo (sticky) con precio, agente y CTAs a la derecha (30%) — el panel de acción nunca se pierde de vista al hacer scroll.

### 3.4 Tablet

- Una columna; el panel de acción pasa a estar fijo en la parte superior tras el primer scroll (sticky header simplificado con precio + botón WhatsApp).

### 3.5 Mobile

- Galería en carrusel de pantalla completa (swipe).
- Barra de acción fija en la parte inferior de la pantalla: **WhatsApp | Solicitar visita | Favorito** — siempre accesible sin buscarla, en línea con el bottom nav ya definido en la Fase 2.
- El resto del contenido (descripción, características, mapa, agente, similares) en scroll vertical simple.

---

## Próximo paso

Fase 3 cerrada, a la espera de tu aprobación. Cuando la confirmes, sigo con la **Fase 4 — Captación de Clientes** (flujos de Comprar, Alquilar, Vender, Tasar e Invertir).
