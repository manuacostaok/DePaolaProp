# DE PAOLA PROPIEDADES 2.0 — FASE 19: PANEL ADMINISTRATIVO

*Continúa el trabajo de las Fases 1-18. Sigue sin código — diseña la funcionalidad, no la interfaz pixel a pixel.*

El panel es la herramienta de trabajo diaria del equipo de De Paola — se diseña con el mismo criterio de "cero fricción" que rige el sitio público, no como un backoffice genérico.

---

## 1. PROPIEDADES

- Crear / editar / eliminar / publicar / despublicar / destacar — según el brief original.
- Al crear una propiedad, el formulario pide exactamente los campos definidos en el modelo de datos (Fase 18) — carga de fotos con reordenamiento simple (arrastrar para definir cuál es la foto principal, que determina el LCP de la ficha según la Fase 16).
- Cambiar estado (activa/reservada/vendida) dispara automáticamente el evento `cambio_estado` (Fase 11) — no requiere un paso manual aparte para notificar.
- Asignación de agente a cargo desde el mismo formulario (vínculo ya definido en el modelo de datos, Fase 18).

## 2. LEADS

- Visualizar todos los leads entrantes de los 5 flujos de captación (Fase 4) más consultas y solicitudes de visita (Fase 3), en una vista unificada con filtro por tipo.
- Asignar/reasignar a un agente (por default ya llega asignado según la lógica de ruteo de la Fase 11, pero el panel permite corregirlo manualmente).
- Cambiar estado de seguimiento: nuevo → contactado → en proceso → cerrado (ganado/perdido) — mencionado como pendiente de definir en la Fase 18, se resuelve acá.
- Notas internas por lead, visibles solo para el equipo, no para el cliente.

## 3. AGENTES

- Administrar fichas de agente (Fase 9): foto, presentación, zonas de especialización, datos de contacto directo.
- Alta/baja de agentes sin afectar el historial de propiedades ya cerradas por ese agente (se mantiene el registro histórico, aunque el agente ya no esté activo).

## 4. ARTÍCULOS

- Crear / editar / publicar contenido de Insights (Fase 7): editor con soporte de imágenes intercaladas, selector de categoría y de zona relacionada (obligatorio completar antes de publicar, según la regla de gobernanza ya definida en la Fase 7).
- Vista previa antes de publicar, para revisar cómo se ve el artículo con su CTA contextual ya aplicado.

## 5. TASACIONES

- Administrar las solicitudes generadas por el flujo de Tasación (Fase 5): ver el detalle completo cargado por el usuario, marcar como contactada, adjuntar la tasación profesional final una vez realizada.
- Vista agregada de tasaciones por zona — insumo directo para ir construyendo la base de datos de mercado real que hoy falta (Fase 8), sin depender de un proceso de carga manual aparte.

## 6. ESTADÍSTICAS

- Visitas, consultas, leads, propiedades más vistas, conversiones — según el brief original, con el detalle de qué eventos alimentan cada métrica desarrollado en la Fase 20 (Analytics y CRO), que sigue a continuación.
- Vista específica de rendimiento por agente (leads asignados, tasa de respuesta) — útil para la gestión interna del equipo, no visible públicamente.

## 7. ROLES Y PERMISOS (lo que quedó pendiente de la Fase 18)

| Rol | Puede |
|---|---|
| Administrador (Tatiana De Paola / dirección) | Acceso completo a todas las secciones, incluida la gestión de agentes y de otros usuarios del panel |
| Agente | Ver y editar solo sus propias propiedades y leads asignados; puede crear artículos de Insights si el negocio decide habilitarlo, sujeto a aprobación del administrador antes de publicar |
| Editor de contenido (si se define ese rol a futuro) | Solo acceso a Insights — sin ver leads ni datos de propiedades |

Esta tabla es una propuesta inicial de niveles de acceso: la asignación final de quién tiene cada rol es una decisión de negocio de De Paola, no técnica — queda como punto a confirmar en el documento de consolidación final.

---

## Próximo paso

Fase 19 cerrada. Sigo con la **Fase 20 — Analytics y CRO**.
