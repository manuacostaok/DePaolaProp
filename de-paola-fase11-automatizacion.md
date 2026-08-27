# DE PAOLA PROPIEDADES 2.0 — FASE 11: AUTOMATIZACIÓN

*Continúa el trabajo de las Fases 1-10. Sigue siendo estrategia — no hay código todavía. Se diseña la arquitectura conceptual de eventos; no se implementa en esta fase.*

---

## 1. ARQUITECTURA CONCEPTUAL GENERAL

```
WEB (De Paola Propiedades 2.0)
        ↓
API / WEBHOOK
        ↓
n8n  (orquestador — decide a dónde va cada evento y con qué lógica)
        ↓
   ┌────────────┬─────────────┬────────────┬──────────────┐
   CRM         WhatsApp        Email        Agente asignado
```

La plataforma web nunca habla directo con WhatsApp, el CRM o el email — todo pasa por el webhook hacia n8n, que centraliza la lógica de ruteo. Esto evita que cada flujo de la web tenga que saber cómo integrarse con cada herramienta por separado, y permite cambiar de CRM o de proveedor de WhatsApp en el futuro sin tocar el frontend.

## 2. EVENTOS Y QUÉ INFORMACIÓN ENVÍA CADA UNO

Cada evento corresponde a un flujo ya definido en fases anteriores — esta tabla no inventa funcionalidad nueva, solo especifica qué dato viaja cuando ese flujo ya diseñado se completa.

| Evento | Se dispara desde | Información que envía |
|---|---|---|
| `nuevo_lead` | Cualquiera de los 5 flujos de captación (Fase 4) | Tipo de flujo (comprar/alquilar/vender/tasar/invertir), datos del formulario, nombre + contacto, zona/propiedad de interés si aplica, timestamp |
| `nueva_consulta` | CTA "Consultar" o "Solicitar visita" en ficha de propiedad (Fase 3) | ID de propiedad, agente a cargo, datos de contacto del interesado, mensaje si lo escribió |
| `solicitud_tasacion` | Flujo de Tasación (Fase 5), al completar el paso 4 | Todos los datos de los 4 pasos (ubicación, dimensiones, estado, contacto), si se mostró rango automático o no |
| `solicitud_visita` | CTA "Solicitar visita" en ficha de propiedad (Fase 3) | ID de propiedad, agente a cargo, franja horaria preferida, datos de contacto |
| `nuevo_contacto` | Formulario de contacto general (`/contacto`, Fase 2) | Motivo de contacto, datos del usuario |
| `newsletter` | Suscripción segmentada (Fase 7) | Email, segmento de interés (comprador/vendedor/inversor) |
| `nueva_propiedad` | Panel administrativo (Fase 19), al publicar una propiedad | Datos completos de la propiedad — dispara notificación a quienes tengan alertas guardadas que matcheen (Fase 3) |
| `cambio_estado` | Panel administrativo, al cambiar estado de una propiedad (activa/reservada/vendida) | ID de propiedad, estado anterior, estado nuevo |
| `nuevo_articulo` | Panel administrativo (Fase 19), al publicar en Insights | Título, categoría, zona relacionada, URL — útil para disparar difusión en redes |
| `ai_search` | De Paola AI (Fase 10), cuando deriva a agente humano | Consulta original del usuario, filtros interpretados, motivo de derivación |

## 3. LÓGICA DE RUTEO (qué hace n8n con cada evento, a alto nivel)

- **Leads de Vender/Tasar/Invertir**: van siempre a un agente humano (nunca solo a una casilla de email genérica) — según lo ya definido en la Fase 4 como flujos de perfil consultivo, no autoservicio.
- **Leads de Comprar/Alquilar**: se registran en el CRM y, si coinciden con una búsqueda guardada de otro usuario, no generan ruido — solo se notifica al propio usuario que la generó (evento `nueva_propiedad`), no a leads pasados sin relación.
- **Notificación por WhatsApp**: para los eventos que requieren respuesta rápida (`nueva_consulta`, `solicitud_visita`, `solicitud_tasacion`), se prioriza WhatsApp al agente asignado por sobre el email, dado que ya es el canal de contacto principal identificado en la Fase 1.
- **Asignación a agente**: se apoya en la relación conceptual entre lead y agente ya establecida en la Fase 9 (zona/especialización) — el ruteo automático no es una funcionalidad nueva, es la ejecución automatizada de un criterio ya definido.

## 4. RELACIÓN CON EL RESTO DE LAS FASES

- Ningún evento de esta fase corresponde a una funcionalidad nueva: cada uno es la instrumentación de algo ya diseñado (los 5 flujos de captación, la ficha de propiedad, el panel administrativo, De Paola AI).
- El panel administrativo (Fase 19) es quien dispara `nueva_propiedad`, `cambio_estado` y `nuevo_articulo` — se retoma en esa fase con el detalle de la interfaz que los genera.
- Los eventos de analytics/CRO (`property_view`, `contact_click`, etc., previstos en el brief para la Fase 20) son un set complementario a este: los de esta fase alimentan CRM y notificación operativa; los de la Fase 20 alimentan medición y optimización de conversión. No se solapan pero comparten la misma disciplina de nomenclatura de eventos.

---

## Próximo paso

Fase 11 cerrada, a la espera de tu aprobación. Cuando la confirmes, sigo con la **Fase 12 — Diseño Visual** (sistema visual, paleta, tipografías, Design System).
