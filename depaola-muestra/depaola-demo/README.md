# De Paola Propiedades 2.0 — Muestra de diseño

## Qué es esto
Una muestra navegable (Home, Propiedades, Ficha de propiedad, Zonas, Nosotros, Contacto) hecha en HTML/CSS simple, para mostrarle a De Paola antes de cargar datos reales completos.

- Los textos de "Sobre Nosotros" y Tatiana De Paola son **reales**, tomados de su sitio actual.
- Las dos propiedades con foto (Villa Martelli y Martínez) son **reales**, con las mismas fotos que hoy usan.
- Todo lo marcado "Ejemplo" es contenido de relleno para mostrar cómo se va a ver con más inventario cargado.
- El buscador y el formulario de contacto son visuales — todavía no están conectados a ninguna base de datos.

Esto **no es la implementación final** (esa va a ser con Next.js según la Fase 17 del plan de estrategia). Es una muestra rápida en HTML/CSS puro para poder mostrarle algo concreto a De Paola cuanto antes.

**Cambios de esta revisión:**
- Se sacó toda referencia a estimación automática / IA en el flujo de tasación. La página `vender.html` es 100% un flujo humano: se piden datos básicos y un agente contacta al usuario, sin mostrar ningún valor calculado por sistema — coherente con la regla de honestidad definida en la Fase 5.
- Se revisó el front completo: no quedan links muertos (`href="#"`), el menú se abre correctamente en mobile (botón ☰ funcional con JS liviano), y se verificó el balance de etiquetas en las 8 páginas.

## Cómo verlo ahora mismo
Descomprimí el zip y abrí `index.html` en cualquier navegador — no necesita servidor, funciona local.

## Cómo subirlo gratis (y que después escale sin migrar de nuevo)

### Opción recomendada: Vercel
Es la misma plataforma que ya recomendamos para la implementación final (Fase 17), así que cuando pasen a la versión con Next.js, siguen en la misma cuenta sin tener que migrar de proveedor.

**Plan gratis (Hobby)**: alcanza de sobra para esta muestra y para bastante después — incluye dominio propio (`.vercel.app` gratis, o tu propio dominio conectado sin costo extra), certificado SSL automático, CDN global. No tiene límite de tiempo, es gratis mientras el uso sea personal/no comercial.

**Pasos**:
1. Creá una cuenta gratis en vercel.com (podés entrar con GitHub).
2. Opción más simple: en el dashboard de Vercel, buscá "Deploy" → arrastrá la carpeta con estos archivos directamente (drag & drop). Vercel la sube y te da un link público en segundos.
3. Opción más prolija (recomendada a mediano plazo): subí esta carpeta a un repositorio de GitHub, conectá ese repo desde Vercel — así cada cambio que subas a GitHub se publica solo, y cuando migren a Next.js, es el mismo flujo.
4. Cuando el proyecto esté aprobado y quieran el dominio real (`depaolapropiedades.com`), lo conectás desde Vercel sin costo adicional en el plan Hobby.

**Cuándo pagar**: solo hace falta pasar al plan Pro (paga, desde USD 20/mes) si el sitio empieza a recibir tráfico serio de forma comercial, necesitan más de un colaborador en el equipo, o quieren funciones de analytics/soporte avanzadas de Vercel. Para la muestra y para el arranque del sitio real, el plan gratis alcanza.

### Alternativas igual de válidas (por si prefieren no atarse a Vercel)
- **Netlify**: mismo esquema (gratis, drag & drop, dominio propio conectable, escala a plan pago después).
- **GitHub Pages**: 100% gratis siempre, ideal solo para HTML estático como esta muestra — pero no es la mejor base para cuando migren a Next.js con backend, ahí sí conviene pasar a Vercel o Netlify.

## Qué falta antes de la versión real
Ver el documento `de-paola-00-pendientes-y-que-pedir.md` de la Fase 21 — ahí está priorizado qué pedirle a De Paola antes de avanzar a la implementación completa.
