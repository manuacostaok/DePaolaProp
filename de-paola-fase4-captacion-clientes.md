# DE PAOLA PROPIEDADES 2.0 — FASE 4: CAPTACIÓN DE CLIENTES

*Continúa el trabajo de las Fases 1-3. Sigue siendo estrategia — no hay código todavía.*

Cinco intenciones de usuario distintas → cinco flujos distintos. Cada uno respeta el principio de Fase 1 "cero fricción en la conversión, cero formularios largos": se pide solo lo mínimo necesario para dar el siguiente paso, nunca todo de una vez.

---

## Principio de diseño de formularios (aplica a los cinco flujos)

- **Progresivo, no todo junto**: 2-3 campos por paso como máximo, con barra de progreso simple.
- **El primer campo nunca es un dato de contacto** — primero se pide la intención/necesidad (qué busca, qué quiere vender, cuánto cree que vale), el dato de contacto (nombre + teléfono o email) va al final, cuando el usuario ya invirtió algo de esfuerzo y tiene más motivo para completarlo.
- **WhatsApp como alternativa siempre presente** al formulario tradicional, no como aviso al pie sino como botón con el mismo peso visual.
- Cada envío dispara un evento (`lead_created` con su tipo) preparado para CRM/n8n, como se definirá en detalle en la Fase 11 (Automatización).

---

## 1. COMPRAR — "Estoy buscando una propiedad"

**Entrada**: banner en Home, CTA en `/propiedades/comprar`, o resultado de una búsqueda sin match exacto.

**Flujo**:
1. Operación ya implícita (Comprar). Paso 1: zona(s) de interés + tipo de propiedad.
2. Paso 2: presupuesto (rango) + ambientes/dormitorios deseados.
3. Paso 3: nombre + WhatsApp o email + (opcional) "¿tenés que vender una propiedad para comprar esta?" — pregunta clave de negocio: detecta cross-sell hacia el flujo de Vender/Tasación sin obligar a completarlo ahí mismo.

**Salida**: confirmación + oferta de activar alerta automática de nuevas propiedades que matcheen esos filtros (mismo mecanismo definido en la Fase 3).

## 2. ALQUILAR — "Estoy buscando alquilar"

**Entrada**: banner en Home, CTA en `/propiedades/alquilar`.

**Flujo**: idéntica lógica que Comprar, con dos diferencias de contenido:
- Se pregunta "¿con o sin garantía propietaria?" como filtro adicional relevante al mercado de alquileres en Argentina.
- No se incluye la pregunta de cross-sell "vender para comprar" (no aplica a un inquilino).

**Salida**: igual que Comprar — alerta automática de nuevas propiedades en alquiler.

## 3. VENDER — "Quiero vender mi propiedad"

**Entrada**: CTA "Tasá tu propiedad" del header (definido en Fase 2), banner en Home, `/vender`.

**Flujo**:
1. Paso 1: dirección o zona de la propiedad + tipo.
2. Paso 2: "¿Ya sabés cuánto vale?" → Sí / No, quiero una estimación.
   - Si responde "No, quiero una estimación" → deriva directo al flujo de Tasación (sección 4), sin repetir los datos ya ingresados.
   - Si responde "Sí" → sigue directo al paso 3.
3. Paso 3: nombre + teléfono/WhatsApp + disponibilidad para que un agente se contacte.

**Salida**: confirmación + próximo paso claro ("un agente te va a contactar en las próximas horas hábiles"), no un genérico "gracias por tu mensaje".

## 4. TASAR — "Quiero saber cuánto vale"

Es el flujo de mayor valor de negocio identificado en la Fase 1 (hoy no existe en absoluto). Se desarrolla en detalle en la **Fase 5 — Tasación**, que sigue a continuación de esta. Acá solo se define su rol dentro de la captación general:

- Es el punto de llegada natural desde Vender (cuando el usuario no sabe el valor) y desde Comprar (cuando el usuario indica que necesita vender para comprar).
- Es también un flujo de entrada directa (CTA permanente en el header) para el propietario que ni siquiera está pensando en vender todavía, solo quiere saber cuánto vale — top of funnel de negocio a mediano plazo.

## 5. INVERTIR — "Quiero invertir"

**Entrada**: `/invertir`, sección propia definida en la arquitectura de Fase 2, y cross-link desde `/mercado`.

**Flujo**:
1. Paso 1: tipo de inversión (renta / reventa / desarrollo) + presupuesto disponible (rango).
2. Paso 2: zona(s) de interés (o "abierto a recomendación").
3. Paso 3: nombre + email/WhatsApp.

**Diferencia clave con Comprar**: el usuario no busca "una casa para vivir" sino oportunidad y rentabilidad, así que en vez de derivar a resultados de búsqueda estándar, la confirmación ofrece agendar una conversación con un agente especializado en inversión — es un perfil de lead que vale la pena tratar de forma más consultiva, no autoservicio.

---

## Matriz resumen

| Flujo | Entrada principal | Pregunta clave que reemplaza al form largo | Cross-sell detectado | Salida |
|---|---|---|---|---|
| Comprar | Header / `/propiedades/comprar` | Zona + tipo + presupuesto | ¿Necesita vender para comprar? → Vender | Alerta automática |
| Alquilar | Header / `/propiedades/alquilar` | Zona + tipo + presupuesto + garantía | — | Alerta automática |
| Vender | CTA "Tasá tu propiedad" / `/vender` | ¿Ya sabés cuánto vale? | → Tasación si no lo sabe | Contacto de agente |
| Tasar | CTA permanente / `/vender/tasacion` | (desarrollado en Fase 5) | → Vender una vez tasada | Estimación + contacto |
| Invertir | `/invertir` / `/mercado` | Tipo de inversión + presupuesto | — | Conversación con agente especializado |

---

## Próximo paso

Fase 4 cerrada, a la espera de tu aprobación. Cuando la confirmes, sigo con la **Fase 5 — Tasación** (experiencia completa de "¿Cuánto vale tu propiedad?").
