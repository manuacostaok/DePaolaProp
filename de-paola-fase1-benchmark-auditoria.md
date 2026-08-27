# DE PAOLA PROPIEDADES 2.0 — FASE 1: BENCHMARK + AUDITORÍA

*Documento de estrategia. No contiene código ni decisiones de implementación — es la base sobre la que se construirán las fases siguientes (arquitectura, UX/UI, design system, modelo de datos, plan de implementación para Claude Code).*

---

## 1. DIAGNÓSTICO DE LA WEB ACTUAL

Sitio auditado: `https://www.depaolapropiedades.com` (Wix). Se relevaron Inicio, Propiedades y Sobre Nosotros directamente.

### 1.1 Hallazgo central

**De Paola no tiene una plataforma inmobiliaria propia: tiene un sitio institucional Wix que redirige el tráfico a portales de terceros.** La sección "Propiedades" — que en cualquier inmobiliaria debería ser el corazón del sitio — no tiene buscador, filtros, ni mapa propios; solo un banner y un botón para descargar un PDF de la revista. Cada propiedad que aparece en el Inicio enlaza a Zonaprop, Argenprop o Mercado Libre en vez de a una ficha propia. Esto es la oportunidad más grande de todo el proyecto: hoy De Paola le regala su propio tráfico a los portales que la compiten por el mismo lead.

### 1.2 UX / Arquitectura

- Navegación principal con 6 ítems (Inicio, Propiedades, Revista Digital, Campus Norte, Sobre Nosotros, Sucursales) más "Contacto", que en realidad redirige a Inicio — es un link roto conceptualmente, no una página de contacto propia.
- No existe una experiencia de búsqueda: no hay filtros por operación, zona, precio, ambientes ni tipo de propiedad.
- No hay fichas de propiedad individuales dentro del dominio propio; el "detalle" vive en Zonaprop/Argenprop.
- "Campus Norte" y "Sucursales" apuntan a URLs (`/campusnorte`, `/videocampusnorte`) cuya nomenclatura no es clara ni consistente con su contenido real.
- Cero jerarquía de contenido por zona/barrio (Martínez, Florida, Vicente López, Villa Martelli aparecen solo como texto suelto en direcciones, no como páginas).
- El único CTA de conversión real es "CONSULTAR" (mailto) por propiedad y un formulario de contacto genérico al pie — no hay flujos diferenciados para comprador, vendedor, propietario que quiere tasar, o inversor.

### 1.3 UI

- Estética institucional genérica de plantilla Wix: logo, banner ancho, bloques apilados sin grid editorial.
- Tipografía y paleta sin sistema aparente (heurística, no un design system).
- Imágenes de propiedades en baja resolución y proporciones inconsistentes entre tarjetas.
- Los "badges" de portal (Zonaprop, Argenprop) funcionan como el verdadero CTA visual — más protagonismo que la marca De Paola.

### 1.4 Conversión

- Se pierden leads en el punto de mayor intención: al hacer clic en una propiedad, el usuario **sale del sitio** hacia un portal de terceros donde puede ver propiedades de la competencia.
- No hay captura de lead antes de esa salida (ni siquiera un modal de "dejanos tu contacto para más info").
- No existe ningún flujo de tasación online — la propuesta de valor "vendé con nosotros" no tiene una puerta de entrada digital.
- El newsletter es una suscripción genérica sin lead magnet ni segmentación (comprador/vendedor/inversor).
- No hay WhatsApp click-to-chat en la ficha de propiedad (sí como texto en el pie, sin CTA prominente).

### 1.5 SEO

- Contenido casi inexistente en HTML propio: la mayoría de la información valiosa (fotos, descripciones, precios) vive en dominios de terceros, no en `depaolapropiedades.com`. Esto significa que Google indexa muy poco contenido propio de valor.
- No hay páginas de barrio/zona — pierden por completo el long-tail geográfico ("departamentos en Martínez", "casas en Vicente López") que es exactamente donde un comprador de Zona Norte busca.
- Generador Wix con URLs poco descriptivas para algunas secciones (`/proyectoresidencial`, `/videocampusnorte`) que no reflejan el contenido real ni ayudan al posicionamiento.
- No se observó blog/revista indexable en HTML — la "Revista Digital" es un PDF descargable, contenido invisible para buscadores y sin posibilidad de linkear artículos individuales.

### 1.6 Performance

- Al ser Wix, el sitio depende de la infraestructura y el JS del builder: no hay control fino sobre Core Web Vitals, carga de imágenes (se ven servidas sin `srcset` responsivo consistente) ni lazy loading real.
- No hay forma de auditar ni optimizar más allá de lo que Wix permite — es un techo estructural, no solo un detalle a ajustar.

### 1.7 Qué SÍ conservar

- **20 años de trayectoria y presencia física real en Zona Norte** (dos sucursales, Villa Martelli y Florida) — activo de confianza que la nueva plataforma debe traducir visualmente, no solo mencionar en un párrafo.
- **Relación con los grandes portales** (Zonaprop, Argenprop, Mercado Libre, Clarín) — no hay que cortar esa distribución, hay que dejar de depender de ella como única vidriera: debe ser un canal más, no el único lugar donde vive la propiedad.
- La marca personal de **Tatiana De Paola** como fundadora — humaniza la marca y es un activo de storytelling que hoy está subutilizado (un párrafo de texto, sin foto de equipo completo ni fichas de agentes).
- El concepto "Revista/Campus Norte" como intención editorial ya existente — hay una intuición correcta de que el contenido debe formar parte de la propuesta, solo falta ejecutarlo en formato web indexable en vez de PDF.

---

## 2. BENCHMARK — REFERENCIAS INTERNACIONALES

Análisis basado en los patrones de producto y diseño conocidos y consistentes de cada marca (no cifras de negocio, que cambian trimestre a trimestre).

| Empresa | UX | UI | Buscador | Propiedades | Contenido | Conversión | Mobile | Innovación |
|---|---|---|---|---|---|---|---|---|
| **Compass** | Muy alta — flujos guiados, todo centrado en el agente como intermediario | Producto tech, limpia, funcional más que "de lujo" | Mapa + filtros avanzados, guardado de búsquedas, alertas | Ficha rica con datos de mercado y comparables | Bajo peso editorial, foco en herramientas | Agente como CTA constante ("contact agent") | App nativa muy pulida | Fuerte apuesta en IA aplicada a productividad del agente y del comprador |
| **Sotheby's International Realty** | Editorial, pausada, invita a explorar | Fotografía a pantalla completa, tipografía serif premium, mucho espacio en blanco | Buscador simple pero con fuerte curaduría por "collections" | Fichas tipo revista: storytelling + datos | Muy alto — historias de propiedades, arquitectura, lifestyle | Conversión sutil, prioriza marca sobre urgencia | Cuidada pero secundaria a desktop | Curaduría editorial como diferenciador |
| **Douglas Elliman** | Híbrida: portal + revista | Fotografía editorial fuerte, marca con carácter | Buscador robusto por NYC/mercados clave | Fichas densas en datos de mercado | Contenido de mercado/reportes propio | CTAs de agente muy presentes | Buena, orientada a búsqueda rápida | Reportes de mercado propios como activo de marca |
| **Knight Frank** | Corporativa-premium, internacional | Sobria, corporativa, confía en la fotografía | Buscador global multi-país/multi-moneda | Fichas con foco en inversión y research | Muy fuerte en informes de mercado/research | CTA a "speak to an advisor" | Sólida, prioriza claridad sobre efectos | Research/insights como pilar central del negocio |
| **Corcoran** | Cálida, con identidad de marca fuerte (el punto rosa) | Uso de color e identidad distintiva poco común en el rubro | Buscador claro, buena UX de filtros | Fichas balanceadas foto/datos | Contenido de barrio/neighborhood guides fuerte | Bien resuelta, sin agresividad | Buena | Identidad de marca como diferenciador (rompe el cliché "serio") |
| **The Agency** | Muy visual, "lifestyle brand" más que portal | Estética editorial de revista de diseño/arquitectura | Buscador funcional, no es el foco principal | Fotografía cinematográfica, video fuerte | Fuerte storytelling de estilo de vida | Conversión vía relación/agente, no formularios agresivos | Buena, prioriza imagen sobre densidad de datos | Trata cada propiedad como una pieza editorial, no un listado |
| **Engel & Völkers** | Consistente globalmente, franquicia ordenada | Marca muy sistematizada (negro/blanco, grid estricto) | Buscador multi-mercado con selector de país/región | Fichas ordenadas, consistentes entre oficinas | Contenido de marca global + local | CTA claro a oficina local | Muy consistente | Sistema de marca replicable a escala — relevante para De Paola con 2 sucursales |
| **Christie's International Real Estate** | Premium, curada, orientada a "showcase" | Fotografía como protagonista absoluto, mínima interfaz | Buscador simple, prioriza exploración sobre filtrado exhaustivo | Fichas minimalistas, la imagen manda | Editorial ligado a arte/diseño/arquitectura | Conversión de bajo perfil, marca > urgencia | Buena | Trata el sitio como una galería, no como un clasificado |

### 2.1 Qué hace bien cada una (síntesis)

- **Compass / Douglas Elliman**: tecnología y datos al servicio del agente y del lead — el sitio es una herramienta de trabajo, no solo una vidriera.
- **Sotheby's / The Agency / Christie's**: fotografía y storytelling como eje — la propiedad se presenta como una pieza editorial, no como un ítem de catálogo.
- **Knight Frank**: el contenido de research/mercado como activo de autoridad y SEO, no como adorno.
- **Corcoran**: una identidad de marca con carácter propio rompe la estética "inmobiliaria genérica" sin perder seriedad.
- **Engel & Völkers**: un sistema de diseño estricto y replicable — clave para una marca con múltiples sucursales/agentes, como De Paola.

### 2.2 Qué NO debemos copiar

- El tono ultra-lujo de Sotheby's/Christie's aplicado sin filtro sería falso para el segmento y la geografía de De Paola (Zona Norte de Buenos Aires, no Manhattan ni Aspen).
- La escasez de filtros de búsqueda de Christie's/The Agency: ellas pueden darse ese lujo por volumen de marca; De Paola necesita un buscador funcional y completo porque compite directamente con Zonaprop/Argenprop en intención de búsqueda.
- Cualquier estética "negro y dorado" o de lujo genérico — el propio brief lo excluye explícitamente y el benchmark confirma que las marcas más sofisticadas de hecho evitan ese cliché.
- Réplicas literales de layout — el objetivo es un lenguaje propio inspirado en estos principios, no un clon.

### 2.3 Ideas aplicables a De Paola

1. Ficha de propiedad como pieza editorial (estilo Sotheby's/The Agency) pero con la densidad de filtros y datos de Compass/Douglas Elliman — es el punto óptimo para el segmento medio-alto de Zona Norte.
2. Páginas de research/mercado (estilo Knight Frank) aplicadas a Zona Norte: constituyen el diferencial de autoridad y SEO más accesible de construir con datos propios de 20 años de operación.
3. Identidad de marca con carácter (estilo Corcoran) en vez de una plantilla neutra — hay una oportunidad de dar a De Paola un lenguaje visual propio y memorable.
4. Sistema de diseño estricto y replicable (estilo Engel & Völkers) pensado para escalar a fichas de agente y a las dos sucursales sin perder consistencia.
5. Buscador con guardado de búsquedas y alertas (estilo Compass) como mecanismo de retención y de generación de leads calificados sin fricción.

### 2.4 Diferenciadores que podemos crear

- **Autoridad hiperlocal de Zona Norte**: ninguna de las referencias internacionales tiene ese foco geográfico; con 20 años de trayectoria, De Paola puede convertirse en *la* fuente de research de Martínez, Florida, Vicente López y Villa Martelli — algo que ni Zonaprop ni Argenprop ofrecen (son agregadores, no curadores locales).
- **Puente entre el agregador y la marca propia**: en vez de competir contra Zonaprop/Argenprop, integrarlos como canal de distribución adicional mientras la ficha "canónica" y el lead viven en el dominio propio.
- **Tasación como producto digital**, no como trámite — hoy no existe en absoluto; construirla bien puede ser el mayor generador de leads de vendedores de todo el proyecto.

### 2.5 Ranking de las mejores experiencias (para inspiración de diseño, no de copia)

1. **Sotheby's International Realty** — mejor equilibrio entre fotografía, tipografía y storytelling.
2. **The Agency** — mejor tratamiento editorial/lifestyle de la propiedad individual.
3. **Compass** — mejor producto funcional (buscador, herramientas, datos).
4. **Knight Frank** — mejor uso del contenido de research como activo de marca y SEO.
5. **Corcoran** — mejor ejemplo de identidad de marca diferenciada sin caer en el lujo genérico.
6. **Engel & Völkers** — mejor sistema de diseño escalable multi-oficina.
7. **Douglas Elliman** — buen híbrido portal + contenido de mercado.
8. **Christie's International Real Estate** — la más "pura" en minimalismo, la menos trasladable directamente al caso de uso de De Paola.

### 2.6 Recomendaciones finales de esta fase

- La prioridad #1 del proyecto, por encima de cualquier decisión estética, es **traer la ficha de propiedad y el buscador dentro del dominio propio de De Paola**. Sin esto, ningún rediseño visual va a mover la aguja de conversión ni de SEO.
- La segunda prioridad es **convertir la trayectoria y el conocimiento hiperlocal en contenido indexable** (zonas + research de mercado), que es el activo que ni los portales ni las inmobiliarias internacionales referenciadas pueden replicarle a De Paola en su propio territorio.
- La estética debe ubicarse en el cruce **Sotheby's/The Agency (editorial, fotográfico) + Corcoran (identidad propia) + Engel & Völkers (sistema replicable)** — nunca en el cruce "portal genérico" ni en el cliché "negro y dorado".

---

## 3. DE PAOLA DIGITAL DESIGN PRINCIPLES

Principios rectores que deben respetarse durante todo el proyecto, en todas las fases siguientes.

1. **La propiedad vive acá, no en otro dominio.** Toda propiedad tiene una ficha propia, completa y compartible dentro de `depaolapropiedades.com`; los portales externos son un canal de distribución, nunca el destino final del lead.
2. **Fotografía primero.** Cada decisión de layout se subordina a mostrar la propiedad lo mejor posible — nunca al revés.
3. **Editorial, no catálogo.** Cada propiedad y cada zona se presentan con storytelling, no como una fila de datos de planilla.
4. **Autoridad local sobre lujo genérico.** El diferencial es "los que más saben de Zona Norte", no "los más lujosos" — eso se traduce en research, contenido de barrio y 20 años de trayectoria visibles, no en dorados ni mármoles.
5. **Cero fricción en la conversión, cero formularios largos.** Cada flujo (comprar, alquilar, vender, tasar, invertir) pide solo lo mínimo indispensable para dar el siguiente paso.
6. **Todo dato disponible es un dato pedido una sola vez.** Búsquedas, favoritos y consultas no deben repetir información que el usuario ya dio.
7. **El mapa y los filtros son ciudadanos de primera clase**, no un accesorio — el buscador debe estar a la altura de Zonaprop/Argenprop en funcionalidad y por encima en experiencia.
8. **Mobile no es una versión reducida de desktop.** Se diseña la experiencia mobile como el caso principal, porque ahí ocurre la mayoría de las búsquedas.
9. **Cada página tiene un objetivo de conversión claro** (contactar, guardar, tasar, suscribirse, llamar) — ninguna página es "solo informativa" sin una salida de acción.
10. **Performance es una feature, no un detalle técnico.** Ninguna animación o efecto visual puede degradar velocidad, accesibilidad ni SEO.
11. **Sistema de diseño único y replicable** entre sucursales, agentes y zonas — coherencia visual total, sin excepciones ad hoc.
12. **El contenido (Revista/Insights, Zonas, Mercado) se escribe una vez y trabaja tres veces**: SEO, marca y captación, simultáneamente.
13. **Cada evento de usuario es un dato para el negocio.** Toda acción relevante (ver propiedad, buscar, guardar, tasar, contactar) debe quedar preparada para alimentar CRM, analytics y automatización — desde el día uno del diseño, no como parche posterior.
14. **Confianza visible, no declarada.** Los 20 años de trayectoria, las sucursales físicas y el equipo humano se muestran con evidencia (fotos, fichas, datos reales), no solo se mencionan en un párrafo de "Sobre nosotros".
15. **Ninguna funcionalidad se agrega sin justificar su valor** en al menos una de estas ocho dimensiones: UX, UI, conversión, SEO, performance, accesibilidad, escalabilidad, negocio.

---

## Próximo paso

Esta fase queda cerrada acá, a la espera de tu aprobación. Cuando la confirmes, sigo con la **Fase 2 — Nueva Arquitectura** (sitemap, navegación, URLs y jerarquía de páginas), sin avanzar sola más allá de eso.
