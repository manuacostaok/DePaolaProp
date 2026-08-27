# DE PAOLA PROPIEDADES 2.0 — FASE 7: REVISTA / CONTENT → DE PAOLA INSIGHTS

*Continúa el trabajo de las Fases 1-6. Sigue siendo estrategia — no hay código todavía.*

En la Fase 1 se detectó que la intuición de tener una revista ya existe (hoy es un PDF descargable), pero está mal ejecutada: contenido invisible para buscadores, sin artículos individuales enlazables. En la Fase 2 se decidió renombrarla a **"Insights"** y moverla a HTML indexable en `/insights`. Esta fase define cómo se estructura y qué rol cumple.

---

## 1. POR QUÉ "DE PAOLA INSIGHTS" Y NO "REVISTA DIGITAL"

"Revista" comunica un objeto (una publicación periódica que se descarga y se guarda); "Insights" comunica el valor real que aporta (conocimiento y criterio experto sobre Zona Norte, consultable en cualquier momento). Es coherente con el principio de Fase 1 de que el contenido "se escribe una vez y trabaja tres veces": marca, SEO y captación — algo que un PDF no puede hacer porque no se indexa ni se comparte artículo por artículo.

## 2. CATEGORÍAS

Las ocho categorías del brief original se mantienen porque cubren bien los tres objetivos (marca, SEO, captación) sin solaparse entre sí:

| Categoría | Rol principal | Ejemplo de tema |
|---|---|---|
| Mercado | SEO + autoridad | "Cómo evolucionó el precio del m² en Vicente López" |
| Inversión | Captación (nutre `/invertir`) | "Qué zonas de Zona Norte tienen mejor relación renta/precio" |
| Guías | SEO long-tail + captación | "Guía para comprar tu primera propiedad en Argentina" |
| Arquitectura | Marca / diferenciación editorial | "Estilos de construcción típicos de Martínez" |
| Zona Norte | SEO hiperlocal (conecta con Fase 6) | "Los barrios con más crecimiento de Zona Norte en el último año" |
| Lifestyle | Marca / engagement, no siempre transaccional | "Los mejores planes de fin de semana en Vicente López" |
| Consejos | Captación (nutre Vender/Tasación) | "5 cosas para preparar tu propiedad antes de tasarla" |
| Noticias | Marca / vigencia | Novedades de la empresa, cambios regulatorios relevantes |

## 3. PÁGINA PRINCIPAL DE INSIGHTS (`/insights`)

- Artículo destacado (el más reciente o el de mejor desempeño) en la parte superior, con foto grande — mismo criterio de "fotografía primero" que rige toda la plataforma.
- Grid de artículos debajo, con filtro por categoría (definido ya como navegación secundaria en la Fase 2).
- Sin PDF descargable como pieza central — si en algún momento se quiere ofrecer un compendio descargable, es un extra opcional generado a partir del contenido HTML existente, nunca el formato primario.

## 4. PÁGINA DE CATEGORÍA (`/insights/[categoria]`)

- Listado de artículos de esa categoría, mismo patrón de grid que la principal.
- Encabezado con una breve descripción de qué tipo de contenido encontrará el usuario en esa categoría — refuerza el H1/meta description propios de cada categoría para SEO.

## 5. ARTÍCULO INDIVIDUAL (`/insights/[slug-articulo]`)

1. Imagen de portada + título + categoría + fecha + tiempo estimado de lectura.
2. Cuerpo del artículo en formato editorial largo, con subtítulos, imágenes intercaladas cuando corresponda.
3. **Contenido relacionado**: 2-3 artículos de la misma categoría o zona.
4. **CTA contextual según categoría**, no genérico:
   - Mercado/Zona Norte → CTA hacia la página de zona correspondiente (`/zonas/[zona]`), si el artículo la menciona.
   - Inversión → CTA hacia `/invertir`.
   - Consejos (relacionados a vender) → CTA hacia `/vender` o `/vender/tasacion`.
   - Guías → CTA hacia `/propiedades` (comprar/alquilar).
5. **Newsletter**: bloque de suscripción al pie, con segmentación por interés (comprador/vendedor/inversor) en vez de una suscripción genérica — resuelve la debilidad detectada en la Fase 1, donde el newsletter actual no distingue el interés del suscriptor.

## 6. CÓMO SIRVE A LOS TRES OBJETIVOS SIMULTÁNEOS

- **Marca**: cada artículo refuerza la autoridad de 20 años de trayectoria y el criterio experto de De Paola, sin necesidad de "venderse" en cada línea.
- **SEO**: cada artículo es una oportunidad de capturar búsquedas informativas (no solo transaccionales como "comprar casa en Martínez") que hoy el sitio no puede capturar por no tener contenido HTML indexable propio.
- **Redes sociales**: cada artículo es una pieza reutilizable como posteo o carrusel en Instagram/Facebook (canales que la marca ya usa, según lo relevado en la Fase 1), con su propio link de vuelta al sitio en vez de perder ese tráfico en la red social.
- **Captación**: los CTAs contextuales de cada artículo derivan directo a los flujos ya definidos en las Fases 4 y 5, convirtiendo lectores en leads sin depender únicamente del newsletter genérico.

## 7. GOBERNANZA DE CONTENIDO (para no repetir el problema del PDF abandonado)

- Cada artículo requiere: categoría, zona relacionada (si aplica), y al menos un CTA contextual definido antes de publicarse — evita artículos "huérfanos" sin conexión al resto de la plataforma.
- No se inventan datos de mercado en los artículos de categoría "Mercado": se conectan con la misma fuente de datos reales que alimentará la Fase 8, evitando contradecir el principio de honestidad ya aplicado en Tasación (Fase 5) y Zonas (Fase 6).

---

## Próximo paso

Fase 7 cerrada, a la espera de tu aprobación. Cuando la confirmes, sigo con la **Fase 8 — Mercado Inmobiliario** (qué datos reales necesitamos y cómo se visualizan).
