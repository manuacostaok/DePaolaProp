# DE PAOLA PROPIEDADES 2.0 — FASE 20: ANALYTICS Y CRO

*Continúa el trabajo de las Fases 1-19. Sigue sin código — define eventos y funnel.*

---

## 1. EVENTOS (según el brief original, con la fuente ya diseñada de cada uno)

| Evento | Se dispara desde |
|---|---|
| `property_view` | Al abrir una ficha de propiedad (Fase 3) |
| `property_search` | Al ejecutar una búsqueda con filtros (Fase 3) |
| `property_filter` | Al aplicar/modificar un filtro individual dentro del buscador (Fase 3) |
| `contact_click` | Al tocar cualquier CTA de contacto (email, teléfono) en ficha de propiedad o agente (Fases 3 y 9) |
| `whatsapp_click` | Al tocar el CTA de WhatsApp (ficha de propiedad, bottom nav mobile, ficha de agente — Fases 2, 3, 9) |
| `valuation_start` | Al comenzar el flujo de Tasación (Fase 5) |
| `valuation_submit` | Al completar el flujo de Tasación (Fase 5) |
| `visit_request` | Al enviar una solicitud de visita (Fase 3) |
| `favorite_property` | Al guardar una propiedad como favorita (Fase 3) |
| `share_property` | Al usar el botón compartir de una ficha (Fase 3) |
| `ai_search` | Al usar De Paola AI (Fase 10) |
| `lead_created` | Al completar cualquiera de los 5 flujos de captación (Fase 4), con el tipo de flujo como parámetro |

Este set no es una lista aparte de la de eventos de automatización (`nuevo_lead`, etc., Fase 11): ambas comparten el mismo momento de disparo en el código, pero cumplen roles distintos — los de la Fase 11 alimentan CRM/notificación operativa, estos alimentan medición agregada y optimización. Se implementan juntos, no dos veces.

## 2. FUNNEL (según el brief original)

```
VISITA
  ↓
PROPIEDAD (property_view)
  ↓
INTERÉS (favorite_property / property_filter repetido / ai_search)
  ↓
CONTACTO (contact_click / whatsapp_click / visit_request)
  ↓
LEAD (lead_created)
  ↓
VISITA (coordinada por agente, fuera del sitio)
  ↓
NEGOCIACIÓN (fuera del sitio, seguida en el panel administrativo — Fase 19)
  ↓
OPERACIÓN (se marca en el panel administrativo, Fase 19, no es un evento del sitio)
```

Los primeros cinco pasos del funnel son medibles directamente desde el sitio; los últimos tres (visita presencial, negociación, operación cerrada) dependen del seguimiento manual del agente, registrado en el panel administrativo (Fase 19) — el análisis completo del funnel requiere cruzar datos de analytics con datos del CRM, no vive todo en Google Analytics.

## 3. CRO — QUÉ SE OPTIMIZA CON ESTOS DATOS

- Tasa de abandono por paso en los formularios progresivos (Fase 4/5): con eventos discretos por paso (a definir con más detalle en implementación, ej. `valuation_step_1`, `valuation_step_2`...) se puede detectar en qué paso específico se pierde gente, y ajustar ese paso puntual en vez de rediseñar todo el flujo a ciegas.
- Comparación de conversión entre búsqueda tradicional (filtros) y De Paola AI (`ai_search` vs. `property_search`) — insumo real para decidir si vale la pena invertir en expandir el asistente de IA a otras zonas del sitio, en vez de asumirlo.
- Propiedades más vistas vs. propiedades con más contacto — dos métricas distintas (una mide interés, otra mide intención real), útil para el equipo comercial a la hora de priorizar seguimiento.

## 4. HERRAMIENTAS

- Google Analytics 4 (eventos custom, ya justificado en la Fase 17) + Google Search Console (rendimiento de búsqueda orgánica, cobertura de indexación, Core Web Vitals reales — conecta directo con los objetivos de la Fase 16).
- Los datos de leads/CRM (Fase 19) y los datos de analytics conviven en herramientas separadas por ahora — cruzarlos en un solo dashboard es una posible evolución futura, no parte del alcance de esta etapa de diseño.

---

## Próximo paso

Fase 20 cerrada. Sigo con la **Fase 21 — Plan de Implementación para Claude Code**, la última de esta etapa de estrategia.
