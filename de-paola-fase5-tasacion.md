# DE PAOLA PROPIEDADES 2.0 — FASE 5: TASACIÓN

*Continúa el trabajo de las Fases 1-4. Sigue siendo estrategia — no hay código todavía.*

Identificado en la Fase 1 como el flujo de mayor valor de negocio ausente hoy en el sitio, y en la Fase 4 como el punto de llegada natural desde Vender, Comprar e Invertir. Se diseña acá como una experiencia premium propia — "¿Cuánto vale tu propiedad?" — no como un formulario de contacto disfrazado.

---

## 1. PRINCIPIO RECTOR

**No prometer un número que no podemos respaldar con datos reales.** En la Fase 1 se dejó explícito que no hay datos de mercado propios verificados todavía (se detallará qué falta conseguir en la Fase 8 — Mercado). Por eso esta experiencia se diseña con dos niveles de resultado, y solo entrega una cifra automática cuando existe suficiente información comparable — nunca inventa un número para no defraudar la confianza que es el activo central de la marca.

## 2. EL FLUJO PASO A PASO

Formulario progresivo (2-3 campos por paso, según el principio ya establecido en la Fase 4), con barra de progreso visible para que el usuario sepa cuánto falta.

1. **Paso 1 — Ubicación**: dirección o zona/barrio + tipo de propiedad (casa, departamento, PH, terreno).
2. **Paso 2 — Dimensiones**: superficie cubierta y total, ambientes, dormitorios, baños.
3. **Paso 3 — Estado**: antigüedad, estado general (a nuevo / muy bueno / bueno / a refaccionar), cochera (sí/no).
4. **Paso 4 — Contacto**: nombre + teléfono/WhatsApp o email. Se pide acá y no antes, una vez que el usuario ya invirtió los tres pasos anteriores.

Sin campos abiertos de texto libre en ningún paso — todo selección o número, para que el paso sea rápido y el dato quede estructurado y usable por el sistema.

## 3. QUÉ PASA DESPUÉS DE ENVIAR (los dos niveles de resultado)

### 3.1 Con datos comparables suficientes

- Se muestra una **estimación inicial en forma de rango** (nunca un número exacto — un rango comunica más honestidad y es más defendible frente al usuario que un número único que después no se sostiene).
- Debajo del rango, CTA claro: **"Quiero una tasación profesional"**, que confirma el interés y no requiere volver a cargar ningún dato ya ingresado.
- El rango queda igual disponible como excusa de conversación: "esta es una estimación automática, un agente puede afinarla con una visita".

### 3.2 Sin datos comparables suficientes (caso más probable al lanzamiento, mientras se construye la base de datos de mercado)

- No se muestra ningún número. Se comunica con transparencia: "Esta zona/tipo de propiedad todavía no tiene suficientes datos para una estimación automática confiable. Un especialista de De Paola te va a contactar con una tasación profesional."
- Se ofrece agendar directamente día/franja horaria de preferencia para la tasación presencial.

En ambos casos el resultado final es la generación de un **lead calificado enviado al CRM**, con la diferencia de que en 3.1 el usuario recibe valor inmediato (el rango) antes de dejar sus datos de contacto, lo cual mejora la tasa de finalización del formulario.

## 4. INTEGRACIÓN CON EL RESTO DE LA PLATAFORMA

- Accesible desde: CTA permanente "Tasá tu propiedad" en el header (Fase 2), desde el flujo de Vender cuando el usuario no sabe el valor (Fase 4), y como página propia `/vender/tasacion` (Fase 2).
- Envía el evento `valuation_start` al comenzar el paso 1 y `valuation_submit` al completar el paso 4 — estos dos eventos ya estaban previstos en el brief original para analytics/CRO y se retoman en la Fase 20.
- El lead generado alimenta el mismo pipeline de CRM/n8n que el resto de los flujos de captación (Fase 11), con un campo que lo distingue como `tipo_lead: tasacion` para que el equipo comercial lo priorice según corresponda.

## 5. PREPARACIÓN PARA IA Y DATOS INMOBILIARIOS (a futuro, no en esta fase)

Esta funcionalidad se diseña para poder evolucionar sin rehacerse:

- El motor de estimación (hoy: reglas simples basadas en comparables cargados por De Paola) está pensado como un módulo separado del formulario — el formulario no cambia cuando el motor de cálculo mejore.
- A futuro, ese módulo puede reemplazarse o enriquecerse con un modelo de IA entrenado sobre datos históricos de Zona Norte (propiedades vendidas, tiempo en mercado, ajuste de precio), sin tocar la experiencia de usuario ya construida.
- Los datos que hoy se piden en los 4 pasos (ubicación, dimensiones, estado) son exactamente los inputs mínimos que cualquier motor de valuación —simple o con IA— va a necesitar, así que no hay retrabajo de formulario cuando eso ocurra.

---

## Próximo paso

Fase 5 cerrada, a la espera de tu aprobación. Cuando la confirmes, sigo con la **Fase 6 — Zonas** (páginas de barrio: Martínez, Florida, Vicente López, Villa Martelli y demás).
