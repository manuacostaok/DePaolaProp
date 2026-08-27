# DE PAOLA PROPIEDADES 2.0 — FASE 17: TECNOLOGÍA

*Continúa el trabajo de las Fases 1-16. Evalúa y justifica la stack propuesta en el brief original — no se asume como definitiva sin análisis, tal como pide la regla del proyecto.*

---

## 1. FRONTEND

| Alternativa | Evaluación |
|---|---|
| **Next.js + TypeScript** (propuesta original) | Server Components para páginas de contenido pesado en SEO (zonas, artículos, fichas), rutas dinámicas para propiedades/zonas/agentes, ISR para revalidar contenido sin reconstruir todo el sitio. Ecosistema maduro para exactamente el tipo de sitio híbrido (contenido + búsqueda dinámica) que este proyecto necesita. |
| Alternativa: SPA pura (React + Vite, sin SSR) | Descartada — perdería SEO server-rendered, que es el problema central identificado en la Fase 1. No es una opción seria para un sitio cuyo objetivo principal es indexar contenido propio. |
| Alternativa: WordPress + plugin inmobiliario | Descartada — es esencialmente reproducir el mismo techo estructural que hoy tiene Wix (dependencia de un CMS genérico no pensado para este caso de uso), solo que con más piezas de terceros para mantener. |

**Recomendación: se mantiene Next.js + TypeScript**, justificado por SEO nativo y por ser la base más directa para que Claude Code implemente sin fricción de integración.

**Tailwind CSS**: se mantiene — permite implementar el design system de la Fase 12 (tokens de spacing, color, tipografía) de forma consistente y realizar cambios de tema centralizados. **Framer Motion + GSAP selectivo**: se mantiene, ya justificado en la Fase 13.

## 2. BACKEND

| Alternativa | Evaluación |
|---|---|
| **Next.js API routes / Node.js** (propuesta original) | Mismo lenguaje y mismo repositorio que el frontend — reduce fricción de desarrollo y de despliegue para un equipo/agente (Claude Code) que construye todo el proyecto de punta a punta. |
| Alternativa: backend separado (ej. Python/Django) | Descartada por ahora — no hay un requisito concreto (ej. ML pesado corriendo en el propio backend) que justifique la complejidad de mantener dos lenguajes y dos despliegues distintos. Si en el futuro el motor de IA (Fase 10) o el motor de valuación (Fase 5) requieren un stack de ML más pesado, se puede aislar como servicio aparte sin rehacer el resto. |

**Recomendación: se mantiene Next.js/Node.js** para el backend de la aplicación.

**PostgreSQL + Prisma**: se mantiene — PostgreSQL soporta bien las consultas geoespaciales y de filtrado combinado que requiere el buscador (Fase 3), y Prisma da un modelo tipado consistente con TypeScript en todo el proyecto.

## 3. INFRAESTRUCTURA

- **Vercel**: se mantiene — integración nativa con Next.js (ISR, edge functions), simplifica el despliegue continuo. Alternativa evaluada (infraestructura propia en un VPS) se descarta por ahora: agrega complejidad operativa que no se justifica para el tamaño actual del proyecto, y Vercel ya resuelve CDN de forma nativa.
- **CDN/almacenamiento de imágenes**: se recomienda un proveedor especializado en transformación de imágenes on-the-fly (redimensionado, conversión a WebP/AVIF automática) en vez de solo almacenamiento estático — resuelve directamente los objetivos de la Fase 16 sin tener que pre-generar cada tamaño de imagen manualmente. La elección de proveedor concreto (ej. Cloudinary, Vercel Image Optimization, u otro) se deja como decisión técnica a validar en la Fase 21, según costo y volumen real de imágenes que maneje De Paola.
- **Servicio de mapas**: a elegir entre proveedores estándar (Google Maps o Mapbox) en la Fase 21 — ambos cubren los requisitos ya definidos (clustering, pines interactivos, Fase 3), la decisión final depende de costo por volumen de uso y de la licencia de datos que prefiera De Paola.

## 4. AUTOMATIZACIÓN

**n8n**: se mantiene, ya justificado en detalle en la Fase 11 como orquestador entre la web y CRM/WhatsApp/email.

## 5. ANALYTICS

**Google Analytics + Google Search Console**: se mantienen — son el estándar de facto, sin costo, y compatibles con Next.js sin fricción. Se detallan en la Fase 20.

## 6. RESUMEN DE LA STACK VALIDADA

```
Frontend:        Next.js + TypeScript + Tailwind CSS + Framer Motion (+ GSAP selectivo)
Backend:         Next.js API routes / Node.js
Base de datos:   PostgreSQL + Prisma
Infraestructura: Vercel + CDN de imágenes (proveedor a confirmar) + servicio de mapas (a confirmar)
Automatización:  n8n
Analytics:       Google Analytics + Google Search Console
```

La stack original del brief se confirma casi en su totalidad — el análisis no encontró una alternativa que resuelva mejor los requisitos ya definidos en las fases anteriores. Las únicas decisiones que quedan abiertas (proveedor de CDN de imágenes, proveedor de mapas) son elecciones de costo/volumen, no de arquitectura, y se resuelven en la Fase 21 junto con el resto del plan de implementación.

---

## Próximo paso

Fase 17 cerrada. Sigo con la **Fase 18 — Modelo de Datos**.
