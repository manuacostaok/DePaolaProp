# Guía de estilo extraída de elliman.com (Douglas Elliman)

Análisis técnico del CSS real del sitio (Next.js), pensado para adaptar la estética a **DePaola Propiedades**.

## 1. Sensación general
- Diseño "luxury real estate": muy minimalista, mucho espacio en blanco, fotografía/video a pantalla completa (full-bleed) con overlay oscuro.
- Titulares centrados, en mayúsculas, con letter-spacing amplio (aire "editorial/inmobiliaria de lujo").
- Botones tipo píldora (border-radius 100px) con borde fino, fondo transparente sobre las fotos.
- Micro-animaciones sutiles al hacer scroll (fade + subida), nunca animaciones "ruidosas" o bouncy.

## 2. Paleta de colores (hex reales encontrados en el CSS, ordenados por frecuencia de uso)

| Color | Uso probable |
|---|---|
| `#100b28` | Texto principal / negro azulado de marca (casi negro con tinte azul) |
| `#323744` | Texto secundario oscuro |
| `#535c70` | Texto terciario / gris azulado medio |
| `#a0a6b2` | Gris para bordes y texto deshabilitado |
| `#cfd2d8` | Gris claro para bordes/separadores |
| `#e7e9ec` | Fondo gris muy claro (secciones alternas) |
| `#f4f4f2` | Off-white / crema (fondo general) |
| `#fff` / `#000` | Blanco y negro puros (overlays, texto sobre foto) |
| `#007bff` | Azul de foco/interacción (inputs, focus rings) |
| `#c60000` | Rojo (alertas, "sold", errores) |
| `#009cbd` | Celeste/teal (acento puntual) |
| `#26ab33` | Verde (confirmación, checks) |

Sombras suaves y discretas: `0 1px 4px rgba(0,0,0,.2)`, `0 0 8px rgba(0,0,0,.1)`, `0 0 1px rgba(33,37,41,.08), 0 2px 2px rgba(33,37,41,.06)` (header, cards, inputs).

## 3. Tipografía

Dos familias, contraste clásico "serif elegante + sans geométrica":

- **Display / títulos**: `Sainte Colombe` (serif fina, pesos 200–700, se usa mayormente en extralight/light/regular). Es una fuente **comercial de pago** (no viene incluida ni es open source).
- **Cuerpo / UI**: `Euclid Circular A` (sans geométrica, pesos 300–700). También es **comercial de pago** (Swiss Typefaces).

**Alternativas gratuitas equivalentes** (para no tener que comprar licencias):
- En vez de Sainte Colombe → **Fraunces**, **Cormorant** o **Canela**-like: **"Newsreader"** (Google Fonts, look editorial/lujo similar).
- En vez de Euclid Circular A → **"Jost"**, **"Poppins"** o **"Public Sans"** (Google Fonts, geométrica similar).

Patrones de tipografía:
- Letter-spacing: `.1em` en textos cortos en mayúsculas (labels, botones, eyebrows) y `.03em` en textos largos en mayúsculas; `-.03em` en titulares grandes (más compacto).
- Pesos usados: 300 (light, muy común en body), 400 (regular), 500 (medium), 700 (bold para énfasis).
- Tamaños vistos: 12/14/16/18/20px (UI y texto), 24/28/40/48/64/96/160px (títulos, del más chico al hero gigante).

## 4. Espaciado y formas
- `border-radius`: 8px (cards, inputs), 100px/50px (botones píldora, avatares), 2–4px (elementos chicos), 24–48px (paneles grandes, modales).
- Grillas de listados: ancho de columna ~336px (desktop), 356px (tablet), 343px (mobile).
- Header: alto 118px desktop, 84px tablet, 80px mobile.

## 5. Breakpoints
El sitio combina media queries CSS estándar con clases inyectadas por servidor según el dispositivo (`de-desktop`, `de-tablet`, `de-mobile` en el `<body>`), pero los puntos de corte típicos que aparecen son:
- `max-width: 1280px` (tablet grande / desktop chico)
- `min-width: 1440px` y `min-width: 1760px` (ajustes desktop grande)
- Interacciones hover solo se activan con `@media (pointer:fine) and (hover:hover)` (evita "hover pegado" en touch).

## 6. Animaciones (el corazón de lo que pediste)

### a) Reveal al hacer scroll — la animación insignia del sitio
Se repite igual en decenas de secciones (hero, títulos, tarjetas, galerías, estadísticas, citas):

```css
@keyframes transitionUp {
  0%  { opacity: 0; transform: translateY(12px); }
  100%{ opacity: 1; transform: translateY(0); }
}
```
Se aplica vía JS (IntersectionObserver) agregando una clase cuando el elemento entra en el viewport. Efecto: aparece "flotando suavemente desde abajo", muy sutil (solo 12px de desplazamiento).

### b) Hover de imágenes y tarjetas
```css
transition: transform .3s ease; /* zoom leve al hover */
transition: box-shadow .3s;     /* elevación leve al hover */
transition: opacity .3s;        /* overlays que aparecen */
transition: color .3s ease-in-out; /* links y botones */
```

### c) Menús, dropdowns y tooltips
Fade + scale corto:
```css
@keyframes fadeIn { 0%{opacity:0} 100%{opacity:1} }
@keyframes scale  { 0%{transform:scale(.95)} 100%{transform:scale(1)} }
```

### d) Drawers (menú mobile, filtros)
Deslizan desde el borde correspondiente:
```css
@keyframes Drawer_left   { 0%{transform:translateX(-100%)} 100%{transform:translateX(0)} }
@keyframes Drawer_right  { 0%{transform:translateX(100%)}  100%{transform:translateX(0)} }
@keyframes Drawer_bottom { 0%{transform:translateY(100%)}  100%{transform:translateY(0)} }
@keyframes Drawer_top    { 0%{transform:translateY(-100%)} 100%{transform:translateY(0)} }
```
(Estos coinciden con el patrón de Radix UI Dialog/Drawer.)

### e) Toasts (notificaciones)
Entran deslizando desde abajo y salen igual, con soporte de swipe-to-dismiss (variable `--radix-toast-swipe-end-y`, confirma que usan **Radix UI**).

### f) Carruseles / sliders
Usan **Swiper.js** (paginación tipo bullets, autoplay de banners, preloader con spinner rotando). Se ve en hero, listados destacados y banners promocionales.

### g) Loaders / skeletons
Shimmer horizontal infinito mientras carga contenido:
```css
animation: skeleton 1s ease-in-out infinite; /* background-position-x se mueve -20% */
```

### h) Curva de easing "de marca"
Para elementos tipo carrusel/dots usan una curva personalizada:
```css
transition: .2s cubic-bezier(.455, .03, .515, .955);
```
(ease-out suave, no lineal — dale este valor a Claude Code para que la reutilice en microinteracciones).

## 7. Librerías/tecnología detectadas
- **Next.js** (React) con CSS Modules (de ahí los nombres de clase tipo `ListingCard_listingCard__3bTgl`).
- **Swiper.js** — carruseles.
- **Radix UI** (Dialog/Drawer/Toast) — modales, drawers, notificaciones accesibles.
- **rc-slider** — sliders de rango (filtro de precio).
- **react-calendar** — selector de fechas.
- **CKEditor** (estilos `.ck-content`) — contenido de blog/artículos enriquecido.
- Google Maps JS API — mapa de propiedades.

## 8. Nota sobre licencias
Las fuentes (`Sainte Colombe`, `Euclid Circular A`) y el CSS puntual de Elliman son propiedad de Douglas Elliman. Esta guía documenta **valores de diseño (colores, tamaños, timings)**, que son datos objetivos y no protegibles por copyright, para que puedan usarse como referencia al construir un sitio nuevo y original para DePaola Propiedades — no para clonar el sitio de Elliman literalmente (nombres de clase, textos, logo, estructura exacta de componentes).
