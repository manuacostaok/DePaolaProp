# DE PAOLA PROPIEDADES 2.0 — FASE 10: IA ("DE PAOLA AI")

*Continúa el trabajo de las Fases 1-9. Sigue siendo estrategia — no hay código todavía. Se diseña la arquitectura conceptual; no se implementa en esta fase.*

---

## 1. QUÉ PROBLEMA RESUELVE

El ejemplo del brief — *"Busco una casa de 3 dormitorios en Martínez hasta USD 400.000 con pileta"* — es, en esencia, el mismo formulario de filtros del buscador (Fase 3) expresado en lenguaje natural en vez de completado campo por campo. El valor de De Paola AI no es "tener un chatbot": es **bajar la fricción de entrada al buscador** para el usuario que prefiere escribir o hablar antes que clickear una decena de filtros, y **derivar a un humano cuando la máquina no puede o no debe resolver sola** — nunca reemplazar al agente en la decisión final.

## 2. ARQUITECTURA CONCEPTUAL DEL FLUJO

```
Usuario escribe en lenguaje natural
        ↓
1. INTERPRETAR INTENCIÓN
   ¿Busca comprar, alquilar, tasar, invertir, o solo pregunta algo informativo?
        ↓
2. EXTRAER FILTROS
   Zona, operación, tipo, precio, ambientes, dormitorios,
   características (pileta, cochera, etc.) — mismo set de filtros
   ya definido en el buscador de la Fase 3, no un set nuevo
        ↓
3. CONSULTAR PROPIEDADES
   Se ejecuta contra la misma base y el mismo motor de búsqueda
   de /propiedades — la IA es una interfaz alternativa al buscador,
   no un sistema paralelo con su propia fuente de datos
        ↓
4. MOSTRAR RESULTADOS
   Mismas cards/ficha ya diseñadas en la Fase 3 — el usuario que
   llega vía IA ve exactamente la misma experiencia de resultados
   que el que llega vía filtros manuales
        ↓
5. RECOMENDAR
   Si hay pocos o cero resultados exactos, sugiere alternativas
   cercanas (mismo patrón de "propiedades similares" ya definido
   en la Fase 3), en vez de responder "no hay nada"
        ↓
6. SOLICITAR DATOS CUANDO SEA NECESARIO
   Si la intención es ambigua o faltan datos clave (ej. no dijo
   presupuesto), pregunta — no asume ni inventa un filtro
        ↓
7. DERIVAR A AGENTE HUMANO CUANDO CORRESPONDA
   Casos de derivación obligatoria: intención de vender/tasar
   (siempre requiere el flujo humano ya definido en Fases 4 y 5),
   negociación de precio, dudas legales/contractuales, o cuando
   el usuario lo pide explícitamente
```

## 3. DÓNDE VIVE DENTRO DE LA PLATAFORMA

- **Punto de entrada principal**: una barra de búsqueda conversacional en `/propiedades` y en Home, coexistiendo con el buscador de filtros tradicional (Fase 3) — nunca reemplazándolo. Hay usuarios que prefieren un filtro visual y usuarios que prefieren escribir; se ofrecen ambos caminos al mismo resultado.
- **No es un widget de chat flotante genérico** en todas las páginas: eso diluye su propósito. Vive donde tiene sentido — búsqueda de propiedades — y se puede evaluar extenderlo a otros puntos (ej. Tasación) en una fase posterior, una vez validado el caso de uso principal.

## 4. LÍMITES EXPLÍCITOS (qué la IA NO debe hacer)

Directamente relacionado con el punto 7 del flujo:

- No cierra operaciones ni negocia precio.
- No reemplaza a Tasación (Fase 5): si el usuario le pregunta "¿cuánto vale mi casa?", deriva al flujo de tasación ya diseñado, no intenta estimar un valor dentro del chat.
- No inventa datos de mercado ni de una propiedad que no estén en la base — mismo principio de honestidad aplicado en Tasación (Fase 5), Zonas (Fase 6) y Mercado (Fase 8).
- No sustituye el contacto humano en los flujos de Vender/Invertir (Fase 4), que por su naturaleza consultiva se definieron como derivación a agente, no autoservicio.

## 5. ARQUITECTURA TÉCNICA CONCEPTUAL (para que Claude Code no tenga que decidir esto solo)

```
Usuario (texto o voz)
      ↓
Frontend (barra de búsqueda conversacional)
      ↓
API de interpretación (NLU: intención + extracción de filtros)
      ↓
Backend de propiedades (mismo motor de búsqueda de la Fase 3)
      ↓
      ├── Si hay match → resultados (mismos componentes de la Fase 3)
      ├── Si falta info → pregunta de vuelta al usuario
      └── Si corresponde derivar → dispara lead hacia el flujo
          humano correspondiente (Fase 4/5) + evento `ai_search`
          para analytics (ya previsto en el brief original)
      ↓
n8n / CRM (Fase 11) — recibe el lead o la consulta derivada,
igual que cualquier otro canal de captación
```

No se define motor/proveedor específico de IA en esta fase — es una decisión técnica que corresponde a la Fase 17 (Tecnología), donde se evaluará con las mismas reglas de "analizar, comparar, recomendar y justificar" que rigen todo el proyecto.

## 6. RELACIÓN CON EL RESTO DE LAS FASES

- Reutiliza el buscador y los filtros ya definidos (Fase 3) — no crea un sistema de búsqueda paralelo.
- Se apoya en los flujos de captación ya diseñados (Fase 4) para toda derivación a humano.
- Respeta el mismo principio de no inventar datos que ya rige Tasación (Fase 5), Zonas (Fase 6) y Mercado (Fase 8).
- Queda preparada para conectarse con backend + base de datos + n8n, tal como pide el brief, sin necesidad de rediseñar la experiencia de resultados que el usuario ya conoce del buscador tradicional.

---

## Próximo paso

Fase 10 cerrada, a la espera de tu aprobación. Cuando la confirmes, sigo con la **Fase 11 — Automatización** (eventos y arquitectura conceptual con n8n).
