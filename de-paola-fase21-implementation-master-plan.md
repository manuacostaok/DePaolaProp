# DE PAOLA PROPIEDADES 2.0 — FASE 21: CLAUDE CODE IMPLEMENTATION MASTER PLAN

*Última fase de estrategia. Traduce todo lo definido en las Fases 1-20 a un plan de construcción por etapas, para que Claude Code lo ejecute sin tener que decidir arquitectura por su cuenta.*

---

## PHASE 0 — Repository + Architecture

- **Objetivo**: dejar la base técnica lista para todo lo que sigue.
- **Funcionalidades**: repo inicializado, configuración de Next.js + TypeScript + Tailwind, conexión a PostgreSQL vía Prisma, entorno de desarrollo/staging/producción en Vercel (Fase 17).
- **Componentes**: —
- **Páginas**: —
- **APIs**: —
- **Database changes**: schema Prisma inicial basado en el modelo conceptual de la Fase 18.
- **Dependencias**: ninguna (fase de arranque).
- **Criterios de aceptación**: build corre sin errores, conexión a base de datos verificada, despliegue de "hola mundo" accesible en Vercel.
- **Tests**: smoke test de build y despliegue.
- **Posibles problemas**: elección final de proveedor de CDN de imágenes y de mapas (dejada abierta en la Fase 17) debe resolverse antes de esta fase para configurar las variables de entorno correspondientes.
- **Definición de terminado**: repo desplegado, accesible, con CI básico corriendo.

## PHASE 1 — Design System

- **Objetivo**: implementar los tokens y componentes base definidos en la Fase 12.
- **Funcionalidades**: paleta, tipografía, spacing, grid como tokens de Tailwind; componentes base (botones, inputs, cards, badges) como librería reutilizable.
- **Componentes**: Button, Input, Select (rango), Card (propiedad/zona/artículo), Badge, Skeleton.
- **Páginas**: página de referencia interna (styleguide) para verificar visualmente cada componente.
- **Dependencias**: Phase 0.
- **Criterios de aceptación**: cada componente definido en la Fase 12 existe, es responsivo (Fase 14) y respeta el sistema de spacing en base 8px.
- **Tests**: pruebas visuales de regresión sobre el styleguide.
- **Posibles problemas**: la elección final de tipografía (nombre concreto de fuente, Fase 12) y del color de marca definitivo (a validar con De Paola, Fase 12) debe estar resuelta antes de esta fase.
- **Definición de terminado**: styleguide navegable con todos los componentes base funcionando en las tres resoluciones (mobile/tablet/desktop).

## PHASE 2 — Layout + Navigation

- **Objetivo**: header, footer, navegación principal/secundaria y bottom nav mobile (Fase 2).
- **Funcionalidades**: menú desktop con submenús, menú hamburguesa mobile, bottom nav fijo, footer completo.
- **Páginas**: layout raíz de la aplicación.
- **Dependencias**: Phase 1.
- **Criterios de aceptación**: navegación funcional en las tres resoluciones, ítem activo marcado correctamente (Fase 12), header transparente/sólido según scroll donde corresponda.
- **Tests**: navegación end-to-end entre secciones principales.
- **Posibles problemas**: ninguno mayor identificado.
- **Definición de terminado**: se puede navegar el sitio completo (aunque las páginas internas estén vacías) usando solo el header/footer/bottom nav.

## PHASE 3 — Home

- **Objetivo**: página de inicio con hero, propiedades destacadas, acceso a zonas y CTAs principales.
- **Dependencias**: Phase 2, y al menos datos de prueba de Property y Neighborhood cargados (Phase 0 seed).
- **Criterios de aceptación**: Home carga con LCP < 2.5s (Fase 16) con datos reales o de prueba.
- **Tests**: prueba de performance (Lighthouse) sobre Home.
- **Definición de terminado**: Home navegable, con CTAs funcionales hacia Propiedades, Zonas y Tasación.

## PHASE 4 — Property Search

- **Objetivo**: buscador completo (Fase 3): filtros, resultados en lista y mapa.
- **Componentes**: panel de filtros, card de resultado, toggle lista/mapa, integración con servicio de mapas (Fase 17).
- **Páginas**: `/propiedades`, `/propiedades/comprar`, `/propiedades/alquilar`.
- **APIs**: endpoint de búsqueda con filtros combinados sobre PostgreSQL (índices sobre zona/operación/precio/tipo, Fase 16).
- **Dependencias**: Phase 1, Phase 0 (con datos de propiedades reales o de prueba cargados).
- **Criterios de aceptación**: todos los filtros de la Fase 3 funcionan y son combinables; resultado en mapa y lista sincronizados.
- **Tests**: pruebas de filtrado con distintas combinaciones, incluyendo casos de cero resultados (debe mostrar propiedades similares, Fase 3).
- **Definición de terminado**: buscador funcional end-to-end en desktop y mobile.

## PHASE 5 — Property Detail

- **Objetivo**: ficha individual de propiedad (Fase 3).
- **Componentes**: galería, panel sticky de acción, bloque de agente, propiedades similares.
- **Páginas**: `/propiedades/[slug]`.
- **APIs**: endpoint de detalle de propiedad + endpoint de propiedades similares.
- **Dependencias**: Phase 4.
- **Criterios de aceptación**: los CTAs de WhatsApp, solicitar visita y favorito funcionan y disparan los eventos correspondientes (Fase 11 y Fase 20).
- **Tests**: prueba de carga de galería con distinta cantidad de fotos, prueba de barra de acción fija en mobile.
- **Definición de terminado**: ficha completa, compartible, indexable (metadata y schema de la Fase 15 aplicados).

## PHASE 6 — Neighborhoods

- **Objetivo**: páginas de zona (Fase 6).
- **Páginas**: `/zonas`, `/zonas/[zona]`.
- **APIs**: endpoint de datos de zona + buscador preseteado embebido.
- **Dependencias**: Phase 4 (reutiliza el buscador ya construido, filtrado por zona).
- **Criterios de aceptación**: cada zona muestra su contenido editorial, su buscador filtrado, y omite correctamente la sección de precio promedio si no hay datos suficientes (regla de honestidad de la Fase 6).
- **Tests**: verificar que la ausencia de datos de mercado no rompe el layout de la página.
- **Definición de terminado**: al menos las 4 zonas confirmadas en el brief (Martínez, Florida, Vicente López, Villa Martelli) publicadas con contenido real.

## PHASE 7 — Valuation

- **Objetivo**: flujo de tasación (Fase 5).
- **Componentes**: formulario progresivo de 4 pasos, resultado en rango o derivación.
- **Páginas**: `/vender`, `/vender/tasacion`.
- **APIs**: endpoint de estimación (motor de reglas simple, Fase 5) + creación de ValuationRequest (Fase 18).
- **Dependencias**: Phase 1, Phase 0.
- **Criterios de aceptación**: el flujo nunca muestra un número sin datos comparables suficientes (regla de honestidad, Fase 5); dispara `solicitud_tasacion` y `valuation_submit` (Fases 11 y 20).
- **Tests**: prueba de ambos caminos (con y sin datos suficientes).
- **Definición de terminado**: flujo completo, con el lead resultante visible en el panel administrativo (Phase 9).

## PHASE 8 — Leads (flujos de captación)

- **Objetivo**: los 5 flujos de la Fase 4 (Comprar, Alquilar, Vender, Invertir — Tasar ya cubierto en Phase 7).
- **APIs**: endpoint de creación de Lead (Fase 18), con lógica de derivación cross-sell (ej. Comprar → Vender, Fase 4).
- **Dependencias**: Phase 1, Phase 7 (comparte patrón de formulario progresivo).
- **Criterios de aceptación**: cada flujo pide solo los campos definidos en su fase correspondiente, dispara `nuevo_lead` y `lead_created` (Fases 11 y 20).
- **Tests**: prueba de cada uno de los 4 flujos restantes de punta a punta.
- **Definición de terminado**: los 5 flujos de captación (incluida Tasación) generan Lead visible en el panel administrativo.

## PHASE 9 — Admin

- **Objetivo**: panel administrativo (Fase 19) — Propiedades, Leads, Agentes.
- **Páginas**: área `/admin` protegida por autenticación.
- **APIs**: CRUD de Property, Lead, Agent.
- **Dependencias**: Phase 0, Phase 5 (para reutilizar el modelo de Property).
- **Criterios de aceptación**: roles y permisos básicos (Administrador/Agente, Fase 19) funcionando; cambios de estado de propiedad disparan `cambio_estado` (Fase 11).
- **Tests**: prueba de acceso restringido por rol.
- **Definición de terminado**: el equipo de De Paola puede cargar y gestionar propiedades y leads sin intervención técnica.

## PHASE 10 — CMS (Insights + Equipo)

- **Objetivo**: gestión de contenido de Insights (Fase 7) y fichas de agente (Fase 9) desde el panel.
- **Páginas públicas**: `/insights`, `/insights/[categoria]`, `/insights/[slug]`, `/equipo`, `/equipo/[nombre-agente]`.
- **Páginas admin**: gestión de artículos dentro de `/admin`.
- **Dependencias**: Phase 9.
- **Criterios de aceptación**: no se puede publicar un artículo sin categoría y (si aplica) zona relacionada (regla de gobernanza, Fase 7); CTA contextual se aplica automáticamente según categoría.
- **Tests**: prueba de publicación de artículo con y sin los campos obligatorios.
- **Definición de terminado**: al menos un artículo por categoría publicado, y todas las fichas de agente disponibles con datos reales.

## PHASE 11 — Analytics

- **Objetivo**: instrumentar los eventos de la Fase 20 en todo el sitio ya construido.
- **Dependencias**: Phases 3 a 10 (requiere que las páginas/CTAs ya existan para instrumentarlos).
- **Criterios de aceptación**: los 12 eventos de la Fase 20 se disparan correctamente y son visibles en Google Analytics 4.
- **Tests**: verificación manual de cada evento en el panel de tiempo real de GA4.
- **Definición de terminado**: funnel completo (Fase 20) medible de punta a punta.

## PHASE 12 — SEO

- **Objetivo**: aplicar metadata, schema.org, sitemap, robots.txt y canonical (Fase 15) en todo el sitio.
- **Dependencias**: Phases 3 a 10.
- **Criterios de aceptación**: cada tipo de página tiene su schema correspondiente validado (Rich Results Test de Google), sitemap.xml generándose dinámicamente.
- **Tests**: validación de schema y de indexación en Google Search Console tras el primer despliegue.
- **Definición de terminado**: sitio verificado en Search Console, sin errores de indexación críticos.

## PHASE 13 — Performance

- **Objetivo**: alcanzar los objetivos concretos de la Fase 16 en todo el sitio ya construido.
- **Dependencias**: Phases 3 a 12 (es una fase de optimización sobre lo ya construido, no de features nuevas).
- **Criterios de aceptación**: Lighthouse mobile 90+, LCP < 2.5s, INP < 200ms, CLS < 0.1 en las páginas críticas (Home, buscador, ficha de propiedad).
- **Tests**: Lighthouse CI corriendo sobre cada página crítica.
- **Definición de terminado**: los cuatro objetivos de la Fase 16 cumplidos y documentados.

## PHASE 14 — AI

- **Objetivo**: implementar De Paola AI (Fase 10) como capa conversacional sobre el buscador ya existente.
- **Dependencias**: Phase 4 (reutiliza el motor de búsqueda), decisión de proveedor de IA a tomar antes de esta fase (dejada abierta en la Fase 10 y 17).
- **Criterios de aceptación**: interpreta correctamente el ejemplo del brief ("casa de 3 dormitorios en Martínez hasta USD 400.000 con pileta"), deriva a agente humano en los casos definidos en la Fase 10.
- **Tests**: batería de consultas de prueba en lenguaje natural, incluyendo casos de derivación obligatoria.
- **Definición de terminado**: barra de búsqueda conversacional funcional en Home y `/propiedades`, evento `ai_search` instrumentado.

## PHASE 15 — n8n Integration

- **Objetivo**: conectar los eventos de automatización (Fase 11) con n8n → CRM/WhatsApp/email.
- **Dependencias**: Phases 7 y 8 (requiere que los flujos de leads ya existan), decisión de CRM concreto a confirmar con De Paola.
- **Criterios de aceptación**: los 10 eventos de la Fase 11 disparan correctamente el webhook, y n8n rutea cada uno según la lógica ya definida (ej. Vender/Tasar/Invertir siempre a un humano).
- **Tests**: prueba de cada evento de punta a punta, verificando que llega a destino (CRM/WhatsApp/email según corresponda).
- **Definición de terminado**: un lead generado en el sitio aparece automáticamente en el CRM y dispara la notificación correspondiente, sin intervención manual.

## PHASE 16 — Testing

- **Objetivo**: cobertura de pruebas end-to-end sobre los flujos críticos de negocio (búsqueda, ficha de propiedad, los 5 flujos de captación, tasación).
- **Dependencias**: todas las fases anteriores.
- **Criterios de aceptación**: suite de pruebas automatizadas corriendo en CI antes de cada despliegue a producción.
- **Definición de terminado**: ningún flujo crítico se puede romper sin que falle un test.

## PHASE 17 — Production

- **Objetivo**: lanzamiento.
- **Dependencias**: todas las anteriores.
- **Criterios de aceptación**: dominio propio configurado, certificado SSL, redirecciones 301 desde las URLs relevantes del sitio Wix actual (para no perder el poco valor SEO que ya tenga indexado), monitoreo de errores activo.
- **Definición de terminado**: sitio en producción, accesible en `depaolapropiedades.com`, con el equipo de De Paola capacitado en el uso del panel administrativo (Phase 9).

---

## Próximo paso

Con esta fase se cierra toda la etapa de estrategia y arquitectura. Como pediste, ahora armo el documento de consolidación final con todo lo que quedó pendiente y lo que hay que pedirle a De Paola antes de empezar la implementación.
