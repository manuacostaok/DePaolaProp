# DE PAOLA PROPIEDADES 2.0 — FASE 12: DISEÑO VISUAL (DESIGN SYSTEM)

*Continúa el trabajo de las Fases 1-11. Es la primera fase puramente de diseño visual — sigue sin código, pero define especificaciones lo suficientemente concretas como para que Claude Code no tenga que decidir estética por su cuenta.*

Posicionamiento definido en la Fase 1: **editorial + arquitectura + premium + tecnología**, en el cruce de Sotheby's/The Agency (fotográfico, editorial) + Corcoran (identidad propia con carácter) + Engel & Völkers (sistema estricto y replicable) — nunca el cliché "negro y dorado" ni la estética inmobiliaria genérica.

---

## 1. PALETA DE COLOR

| Rol | Color | Uso |
|---|---|---|
| Base / fondo | Blanco cálido (no blanco puro de pantalla) | Fondos principales — deja respirar a la fotografía |
| Texto principal | Gris carbón muy oscuro (no negro puro) | Todo el texto de cuerpo y encabezados |
| Color de marca (primario) | Un verde azulado profundo ("petróleo") o un terracota cálido — a definir junto con De Paola entre 2-3 opciones concretas antes de avanzar a implementación, en línea con la identidad ya asociada a Zona Norte (verde por el arbolado, tierra por el barrio residencial) | CTAs principales, acentos de marca, estado activo de filtros |
| Color secundario | Un tono neutro cálido (arena/beige) | Fondos alternos de sección, badges secundarios |
| Éxito / confirmación | Verde funcional estándar | Confirmaciones de formulario, estados "disponible" |
| Alerta | Ámbar | Estados "reservada", avisos no críticos |
| Error | Rojo funcional estándar, sobrio | Validación de formularios |

Regla explícita: **el color de marca se usa con moderación** — protagonismo en CTAs y acentos puntuales, nunca como fondo extenso de página. La fotografía y el blanco cálido son los verdaderos protagonistas visuales, coherente con el principio 2 de Fase 1 ("fotografía primero").

## 2. TIPOGRAFÍA

- **Familia principal (encabezados)**: una serif editorial contemporánea (en el espíritu de las que usa Sotheby's), para dar el carácter "revista/arquitectura" que distingue a De Paola de la estética sans-serif genérica de los portales.
- **Familia secundaria (cuerpo de texto, UI, formularios)**: una sans-serif geométrica y muy legible en pantallas chicas — prioriza claridad sobre personalidad en los textos funcionales (precios, filtros, botones).
- Selección tipográfica final (nombres de fuente concretos, con licencia verificada) se resuelve en conjunto con la Fase 21 (Implementation Master Plan), donde se elige entre opciones de Google Fonts/Adobe Fonts compatibles con Next.js sin penalizar performance.

### Escala tipográfica (base 16px, ratio ~1.25)

| Nivel | Tamaño aprox. | Uso |
|---|---|---|
| Display | 56-72px | Hero de Home y de páginas de zona |
| H1 | 40px | Título principal de página |
| H2 | 28px | Secciones dentro de una página |
| H3 | 20px | Subsecciones, títulos de card |
| Body grande | 18px | Descripciones editoriales (ficha, artículos) |
| Body | 16px | Texto general, formularios |
| Small | 14px | Metadatos, labels, ayudas de formulario |

En mobile, la escala se reduce proporcionalmente (Display baja a ~36-40px) para no romper el layout — se detalla junto con cada componente en la Fase 14 (Mobile First).

## 3. SPACING Y GRID

- Sistema de espaciado en base 8px (8, 16, 24, 32, 48, 64, 96...) — consistente y predecible en todos los componentes.
- Grid de 12 columnas en desktop, 8 en tablet, 4 en mobile, con gutters generosos (mínimo 24px en desktop) — el "espacio en blanco" identificado como principio de diseño en la Fase 1 no es un margen chico, es una decisión deliberada de composición.
- Máximo ancho de contenido: ~1280-1440px, con la fotografía a veces excediendo ese ancho (full-bleed) en momentos clave (hero de propiedad, hero de zona) para reforzar el carácter editorial.

## 4. BOTONES

| Variante | Uso |
|---|---|
| Primario (sólido, color de marca) | Una sola acción principal por pantalla — ej. "Tasá tu propiedad", "Enviar consulta" |
| Secundario (contorno) | Acciones alternativas — ej. "Ver más filtros" |
| Texto (sin fondo) | Acciones de bajo compromiso — ej. "Ver todas las zonas" |
| WhatsApp (variante propia, ícono + color reconocible) | Se trata como categoría aparte por su rol central identificado en la Fase 1 y 4 — no es "un botón secundario más" |

Esquinas ligeramente redondeadas (no rectas ni tipo píldora) — coherente con "premium sobrio", no "tech genérico" ni "clásico inmobiliario".

## 5. INPUTS Y FORMULARIOS

- Bordes finos, sin sombras pesadas; el foco se marca con el color de marca en el borde, no con un halo grueso.
- Labels siempre visibles arriba del campo (nunca solo placeholder que desaparece al escribir) — accesibilidad y claridad, coherente con el principio de formularios cortos y sin fricción ya establecido en la Fase 4.
- Selects de rango (precio, ambientes, superficie) con slider visual + valores numéricos editables a mano.

## 6. CARDS

- **Card de propiedad**: foto en proporción 4:3 o 3:2, precio en tipografía destacada, resto de datos en jerarquía secundaria clara, favorito como ícono superpuesto sobre la foto (esquina superior derecha).
- **Card de zona**: foto full-bleed dentro de la card, texto superpuesto con overlay sutil de degradé (nunca un recuadro de color sólido detrás del texto — se ve genérico).
- **Card de artículo (Insights)**: foto + categoría (badge pequeño) + título + fecha, sin descripción larga en la card (se reserva para el artículo).
- Sombras muy sutiles o ausentes — se prioriza el borde fino o el espacio en blanco como separador, según el principio explícito de Fase 1 de "evitar exceso de sombras".

## 7. BADGES

- "Destacada", "Nueva", "Reservada" — fondo de color funcional discreto (no el color de marca principal, para no competir con los CTAs) + texto corto en mayúsculas pequeñas.
- Badge de categoría en Insights: usa el color secundario/neutro, no colores distintos por categoría (evita que la sección se vea como un arcoíris sin jerarquía).

## 8. NAVEGACIÓN (tratamiento visual)

- Header transparente sobre el hero en Home y fichas de zona/propiedad (con foto de fondo), pasa a sólido (blanco cálido) al hacer scroll — recurso ya estándar en sitios editoriales premium, usado con moderación.
- Ítem activo del menú marcado con el color de marca en un subrayado fino, no con un fondo de color.

## 9. ICONOGRAFÍA

- Set de íconos lineales (stroke, no relleno sólido), consistente en grosor de trazo — nunca mezclar estilos de ícono de distintas librerías.
- Íconos de características de propiedad (pileta, cochera, etc.) diseñados o seleccionados como set unificado, no genéricos de una librería sin curar.

## 10. ESTADOS

- Hover: transición suave (150-200ms), nunca instantánea ni con efectos bruscos — coherente con "movimiento sutil" del principio 2 de Fase 1.
- Loading: skeleton screens (bloques grises con shimmer) en vez de spinners genéricos, para resultados de búsqueda y galerías — se percibe más rápido y más cuidado.
- Vacío (sin resultados, sin favoritos): ilustración o foto simple + mensaje claro + siguiente acción sugerida (nunca una pantalla en blanco).

## 11. COMPONENTES ADICIONALES A ESPECIFICAR EN EL DESIGN SYSTEM FINAL

Se listan para que quede explícito el alcance completo, aunque su detalle visual se resuelve junto con el equipo de diseño en la etapa siguiente al cierre de esta fase:

- Tooltips y mensajes de ayuda en formularios.
- Modal de "guardar búsqueda" / alertas (Fase 3).
- Barra de progreso de formularios multi-paso (Fases 4 y 5).
- Toggle Lista/Mapa (Fase 3).
- Paginación / infinite scroll de resultados (a definir cuál de los dos en la Fase 21, según performance).

---

## Próximo paso

Fase 12 cerrada, a la espera de tu aprobación. Cuando la confirmes, sigo con la **Fase 13 — Motion Design** (animaciones, transiciones, microinteracciones).
