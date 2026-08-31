# DE PAOLA PROPIEDADES 2.0 — QUÉ FALTA Y QUÉ HAY QUE PEDIRLE A DE PAOLA

*Documento de consolidación final de las Fases 1-21. Reúne, en un solo lugar, todo lo que quedó marcado como pendiente, dato a conseguir, o decisión abierta a lo largo de la estrategia completa — para que antes de pasar a implementación (Claude Code) quede claro qué falta resolver y con quién.*

---

## 1. DATOS Y CONTENIDO QUE SOLO DE PAOLA PUEDE PROVEER

Esto es lo más importante del documento: ninguno de estos puntos se puede inventar, según la regla de honestidad que atravesó todo el proyecto (Fases 5, 6 y 8).

### 1.1 Datos de mercado (bloquean Fase 5 — Tasación con estimación automática, Fase 6 — precio promedio por zona, y Fase 8 — Mercado)

- Histórico de operaciones cerradas por De Paola: precio, zona, tipo de propiedad, fecha de cierre — idealmente de los últimos años de los 20 de trayectoria.
- Tiempo promedio que una propiedad estuvo en mercado antes de cerrarse, por zona/tipo.
- Volumen de oferta activa actual por zona/tipo (se resuelve solo una vez que las propiedades estén migradas a la plataforma propia).
- Si existe, cualquier fuente externa de referencia que De Paola ya use hoy para orientar precios (informes de cámaras inmobiliarias, comparables de portales) — para decidir si se cita como fuente complementaria.

**Sin esto**: Tasación funciona igual (deriva a un agente humano, Fase 5), pero sin la estimación automática en rango; las páginas de zona se publican sin la sección de precio promedio; `/mercado` se lanza solo con oferta actual en vivo y contenido editorial, sin gráficos de evolución.

### 1.2 Contenido editorial de zonas (Fase 6)

- Conocimiento de campo de Tatiana De Paola y su equipo sobre cada zona: qué distingue a Martínez de Vicente López, perfil de quien vive en cada barrio, anécdotas o criterio propio de 20 años de operación ahí. Es contenido que ningún research externo puede reemplazar con la misma autoridad.
- Confirmación de qué otras zonas, además de Martínez, Florida, Vicente López y Villa Martelli, deberían tener página propia.

### 1.3 Equipo (Fase 9)

- Fotos profesionales y actualizadas de cada agente (hoy solo existe la de Tatiana De Paola).
- Confirmación de la zona/especialización real de cada agente — no se debe asumir una distribución pareja.
- Definición de si cada agente va a tener contacto directo (WhatsApp/teléfono propio) visible en su ficha, o si todo se centraliza en el número general de la inmobiliaria.

### 1.4 Identidad de marca (Fase 12)

- Validar con De Paola 2-3 opciones concretas de color de marca primario (se propuso explorar un verde azulado profundo o un terracota cálido, en línea con la identidad de Zona Norte) antes de fijarlo en el design system.
- Confirmar si existe algún lineamiento de marca ya establecido (manual de marca, paleta usada en redes sociales) que debiera respetarse o evolucionar, en vez de partir de cero.

### 1.5 Datos operativos generales

- Confirmar si van a seguir publicando en los cuatro portales actuales (Zonaprop, Argenprop, Mercado Libre, Clarín Inmuebles) como canal secundario una vez migrado el contenido principal a la plataforma propia (recomendado en Fase 1: sí, como canal, no como destino).
- Definir si quieren ofrecer alquiler con o sin garantía propietaria como filtro (mencionado en Fase 4) — confirmar si es una práctica que efectivamente manejan.
- ~~Confirmar el contenido real de las secciones actuales "Campus Norte" y el video de "Sucursales" del sitio Wix~~ — **"Campus Norte" ya se auditó: es un emprendimiento activo (140 unidades, Villa Martelli), no contenido institucional. Se corrigió la Fase 2 (ver nota ahí) y se construyó como sección propia `/emprendimientos`.** Sigue pendiente auditar el video de "Sucursales".

---

## 2. DECISIONES TÉCNICAS DEJADAS ABIERTAS (para la Fase 21 / arranque de implementación)

Estas no requieren datos de De Paola sobre su negocio, sino una decisión de costo/proveedor antes de que Claude Code empiece a construir (todas mencionadas en la Fase 17):

- **Proveedor de CDN/transformación de imágenes** (ej. Cloudinary, Vercel Image Optimization, u otro) — depende del volumen real de fotos que maneje De Paola.
- **Proveedor de servicio de mapas** (Google Maps vs. Mapbox) — depende de costo por volumen de uso y preferencia de licencia de datos.
- **Proveedor de IA para De Paola AI** (Fase 10) — no se definió motor/proveedor específico a propósito, se resuelve con el mismo criterio de comparar y justificar que rigió toda la estrategia.
- **CRM concreto** a conectar vía n8n (Fase 11 y Fase 15 del Master Plan) — el brief no especificó si ya usan uno hoy; si no, hay que elegir uno.
- Nombre concreto de las tipografías (serif editorial + sans funcional, Fase 12), verificando licencia y performance.

---

## 3. LO QUE QUEDÓ EXPLÍCITAMENTE FUERA DE ALCANCE POR AHORA (a futuro, no en esta etapa)

Cosas que se identificaron durante la estrategia pero que se decidió no resolver todavía, con la razón de por qué:

- **Modelo de datos del motor de valuación con IA** (Fase 5, sección 5 y Fase 18): se diseñó la estructura para que sea compatible a futuro, pero el motor en sí (hoy: reglas simples) recién se puede mejorar con IA una vez que exista la base histórica de datos de mercado (punto 1.1 de este documento).
- **Extender De Paola AI más allá del buscador** (ej. a la sección de Tasación) — se prioriza validar el caso de uso principal (búsqueda conversacional) antes de expandirlo, con datos reales de uso (evento `ai_search` vs. `property_search`, Fase 20) que hoy no existen todavía.
- **Rol de "Editor de contenido"** en el panel administrativo (Fase 19) — se dejó como propuesta a confirmar si De Paola efectivamente va a tener alguien dedicado solo a Insights, distinto de los agentes.
- **Dashboard único que cruce analytics (GA4) con datos de CRM** (Fase 20) — por ahora ambos sistemas conviven separados; cruzarlos en una sola vista es una mejora posible más adelante, no parte de esta etapa.
- **Informes de mercado descargables en PDF** (Fase 8) — se definió como opcional y derivado del contenido HTML (nunca al revés), a evaluar una vez que exista la sección `/mercado` con datos reales funcionando.
- **Paginación vs. infinite scroll** en resultados de búsqueda (Fase 12) — queda pendiente de definir en la Fase 21 según pruebas de performance, no es una decisión de diseño sino de rendimiento medido.

---

## 4. RESUMEN EJECUTIVO — LO PRIMERO QUE HAY QUE CONSEGUIR

Si hay que priorizar por dónde arrancar la conversación con De Paola antes de que Claude Code empiece a construir:

1. **Histórico de operaciones y datos de mercado** (punto 1.1) — es lo que más tiempo de recopilación va a llevar y lo que más fases distintas del proyecto depende de que exista (Tasación, Zonas, Mercado).
2. **Fotos y confirmación de datos del equipo** (punto 1.3) — es rápido de conseguir y desbloquea la Fase 9 completa.
3. **Validación del color de marca** (punto 1.4) — es una decisión chica pero bloquea el arranque de la Phase 1 del Master Plan (Design System).
4. **Confirmación de zonas a cubrir** (punto 1.2) — define el alcance real de la Phase 6 del Master Plan (Neighborhoods).
5. Recién después, las decisiones de proveedor técnico (sección 2), que no dependen de De Paola sino de una comparación de costo/beneficio a resolver internamente antes de la Phase 0 del Master Plan.

---

Con este documento se cierra la etapa de estrategia completa (Fases 1 a 21) pedida en el brief original. El siguiente paso natural, cuando lo definas, es avanzar hacia la implementación real con Claude Code siguiendo el Master Plan de la Fase 21 — priorizando primero conseguir lo listado en la sección 4.
