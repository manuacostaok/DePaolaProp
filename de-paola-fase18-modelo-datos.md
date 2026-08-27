# DE PAOLA PROPIEDADES 2.0 — FASE 18: MODELO DE DATOS

*Continúa el trabajo de las Fases 1-17. Modelo conceptual — no es todavía el schema Prisma definitivo, tal como pide el brief.*

Cada entidad listada corresponde a algo ya diseñado en una fase anterior — este modelo no inventa alcance nuevo, lo traduce a estructura de datos.

---

## 1. ENTIDADES Y RELACIONES PRINCIPALES

```
Property (Propiedad)
 ├── pertenece a → PropertyLocation (ubicación/zona)
 ├── tiene muchas → PropertyImage
 ├── tiene muchas → PropertyFeature (características: pileta, cochera, etc.)
 ├── pertenece a → Agent (agente a cargo)
 ├── pertenece a → Office (sucursal de origen, opcional)
 └── tiene muchos → Favorite (de distintos User)

PropertyLocation
 └── pertenece a → Neighborhood (zona/barrio)

Neighborhood (Zona — Fase 6)
 ├── tiene muchas → Property (vía PropertyLocation)
 ├── tiene muchos → Article (contenido relacionado, Fase 7)
 └── tiene indicadores de mercado (vínculo con Fase 8)

Agent (Fase 9)
 ├── pertenece a → Office
 ├── se especializa en → Neighborhood (una o varias)
 ├── tiene muchas → Property (a cargo)
 └── tiene muchos → Lead (asignados)

Office (Sucursal — Villa Martelli, Florida)
 └── tiene muchos → Agent

Lead (Fase 4)
 ├── tipo: comprar / alquilar / vender / tasar / invertir
 ├── vinculado opcionalmente a → Property (si vino de una ficha)
 ├── vinculado opcionalmente a → Neighborhood (si vino de una zona)
 ├── asignado a → Agent
 └── genera → Inquiry / ValuationRequest / Appointment según su tipo

Inquiry (Consulta — Fase 3/4)
 └── vinculado a → Property y → Agent

Appointment (Solicitud de visita — Fase 3/4)
 └── vinculado a → Property, → Agent, y datos de franja horaria

ValuationRequest (Tasación — Fase 5)
 ├── datos de la propiedad a tasar (ubicación, dimensiones, estado)
 ├── resultado: rango estimado (si hubo datos suficientes) o derivación directa
 └── vinculado a → Lead

Article (Insights — Fase 7)
 ├── pertenece a → Category
 └── vinculado opcionalmente a → Neighborhood

Category (categorías de Insights: Mercado, Inversión, Guías, etc.)
 └── tiene muchos → Article

User (usuario del sitio, no necesariamente registrado)
 ├── tiene muchos → Favorite
 └── puede tener → búsquedas guardadas (alertas, Fase 3)

Favorite
 └── vincula → User + Property
```

## 2. CAMPOS CLAVE POR ENTIDAD (nivel conceptual, sin tipos de base de datos todavía)

- **Property**: título, descripción, operación (venta/alquiler), tipo, precio, moneda, superficie cubierta/total, ambientes, dormitorios, baños, cochera (sí/no), antigüedad, estado, estado de publicación (activa/reservada/vendida — evento `cambio_estado`, Fase 11), fecha de publicación.
- **PropertyLocation**: dirección (puede ser aproximada si el propietario lo pide), coordenadas geográficas, zona.
- **Agent**: nombre, foto, especialización, zonas, contacto directo, presentación (texto).
- **Neighborhood**: nombre, descripción editorial, datos de estilo de vida/transporte/colegios (Fase 6), indicadores de mercado (si existen, Fase 8).
- **Lead**: tipo, datos de contacto, filtros/intención capturados en el flujo correspondiente (Fase 4), estado de seguimiento (nuevo/contactado/en proceso/cerrado — se detalla en la Fase 19).
- **Article**: título, slug, categoría, zona relacionada (opcional), cuerpo, imagen de portada, fecha de publicación, autor.

## 3. RELACIONES QUE MERECEN ACLARACIÓN

- Un **Lead** no es lo mismo que una **Inquiry/Appointment/ValuationRequest** — Lead es la entidad general de negocio (para CRM y asignación a agente), mientras que las otras tres son el detalle específico según el flujo de origen (Fase 4). Esto evita forzar campos que no aplican a todos los tipos de lead dentro de una sola tabla gigante.
- **Favorite** no requiere que el usuario esté registrado formalmente — se sostiene primero por sesión/dispositivo, y se vincula a un **User** con datos reales solo si esa persona efectivamente deja su contacto en algún flujo (ej. al guardar una alerta). Evita pedir registro obligatorio, coherente con el principio de "cero fricción" de la Fase 1.
- **Office** existe como entidad propia (no un campo suelto en Agent) porque las sucursales tienen datos propios (dirección, horario, teléfono) que se muestran también en `/sucursales` (Fase 2), independientemente de qué agentes trabajen ahí.

## 4. LO QUE ESTE MODELO DEJA EXPLÍCITAMENTE FUERA DE ALCANCE POR AHORA

- No define todavía el modelo de datos del motor de valuación con IA (Fase 5, sección 5) — hoy `ValuationRequest` guarda los inputs y el resultado (rango o derivación), pero el modelo de comparables/histórico que alimentará una futura mejora del motor se diseña recién cuando exista la base de datos de mercado real (Fase 8, pendiente de datos de De Paola).
- No define todavía roles y permisos del panel administrativo (quién puede editar qué) — se resuelve en la Fase 19, que sigue a continuación.

---

## Próximo paso

Fase 18 cerrada. Sigo con la **Fase 19 — Panel Administrativo**.
