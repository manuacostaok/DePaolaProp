# DE PAOLA PROPIEDADES 2.0 — FASE 13: MOTION DESIGN

*Continúa el trabajo de las Fases 1-12. Sigue sin código — especifica intención y reglas de animación para que Claude Code las implemente sin tener que inventarlas.*

Regla rectora explícita del brief, que gobierna toda esta fase: **PERFORMANCE > ANIMACIÓN**. Ninguna animación se justifica si perjudica velocidad, accesibilidad, mobile, SEO o conversión — jerarquía de decisión, no una frase decorativa.

---

## 1. PRINCIPIOS

- Animar para **comunicar**, no para decorar: cada movimiento responde a una pregunta ("¿de dónde vino este elemento?", "¿qué cambió?"), no es un efecto porque sí.
- Duración corta (150-400ms según el caso) y curvas de easing suaves — nada de rebotes exagerados ni animaciones largas que retrasen la percepción de velocidad.
- `prefers-reduced-motion` se respeta siempre: quien lo tenga activado en su sistema recibe transiciones instantáneas o mínimas, sin excepción.

## 2. CATÁLOGO DE ANIMACIONES

| Animación | Dónde se usa | Comportamiento |
|---|---|---|
| Page transitions | Navegación entre páginas principales | Fade/slide sutil, nunca un "loading" que tape todo el contenido — mejor mostrar el layout con skeleton (ya definido en Fase 12) |
| Image reveal | Galerías de propiedad (Fase 3), heroes de zona (Fase 6) | Fade-in progresivo a medida que la imagen carga, no un "pop" brusco |
| Text reveal | Heroes editoriales (Home, Zona, artículo de Insights) | Aparición sutil al entrar en viewport, una sola vez por sesión de scroll — nunca se repite cada vez que se vuelve a scrollear |
| Hover | Cards de propiedad/zona/agente (Fase 12) | Escala muy leve (1.02x) + sombra sutil, feedback inmediato de que el elemento es clickeable |
| Scroll | Secciones largas (páginas de zona, artículos) | Aparición progresiva de bloques al entrar en viewport — sutil, sin parallax agresivo |
| Parallax sutil | Solo en heroes puntuales (Home, hero de zona) | Desplazamiento leve de la imagen de fondo respecto al scroll — nunca en listados ni en la ficha de propiedad, donde compite con la lectura de datos |
| Gallery transitions | Galería de ficha de propiedad (Fase 3) | Transición de swipe/fade entre fotos, con preload de la siguiente imagen para que no haya salto ni espera |
| Map interactions | Buscador con mapa (Fase 3) | Zoom y desplazamiento de pines con transición suave; al seleccionar un pin, la card correspondiente se resalta con una transición de color, no un salto brusco de scroll |
| Microinteracciones | Favorito (corazón), envío de formulario, filtros aplicados | Confirmación visual breve e inmediata (ej. el corazón se llena con una animación corta) — refuerza que la acción del usuario se registró |

## 3. LÍMITES EXPLÍCITOS

- Nada de sliders/carruseles automáticos de imágenes en Home (identificado en la Fase 1 como estética a evitar: "sliders antiguos").
- Nada de animaciones de entrada en cascada exagerada (elementos que aparecen uno por uno con demasiado delay) en listados largos — ralentiza la percepción de velocidad justo donde más importa (resultados de búsqueda).
- El parallax y el text reveal se excluyen por completo de la ficha de propiedad y del buscador: son las dos páginas de mayor intención de conversión (identificadas en Fases 3 y 4) y no pueden tener fricción visual de ningún tipo.
- Ninguna animación bloquea interacción: el usuario siempre puede hacer click/tap durante una transición, nunca tiene que esperar a que termine.

## 4. IMPLICANCIA TÉCNICA (sin definir código, solo criterio)

- Framer Motion para transiciones de UI estándar (hover, reveal, microinteracciones) — ya propuesto en el stack del brief original (Fase 17) y coherente con Next.js.
- GSAP reservado únicamente para los casos puntuales donde Framer Motion no alcance (ej. secuencias más complejas en el hero de Home) — nunca como default, tal como pide el brief ("solamente donde aporte valor").
- Toda animación debe poder desactivarse completamente sin romper el layout — es un enhancement, nunca una dependencia funcional.

---

## Próximo paso

Fase 13 cerrada. Sigo con la **Fase 14 — Mobile First**.
