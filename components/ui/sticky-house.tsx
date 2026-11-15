"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { clamp01, onScrollFrame } from "@/lib/scroll-frame";
import { cn } from "@/lib/cn";

// Momento firma de Home: la pantalla queda anclada (sticky) mientras el
// scroll cuenta la historia de "un solo agente, del primer contacto al
// cierre" — una casa de Zona Norte se dibuja trazo a trazo (con su sol, su
// árbol y, al final, el cartel "SE VENDE" de la marca) y el texto va
// cambiando de etapa. Es la misma firma visual de línea fina que las
// bandas de fondo, pero acá es protagonista y responde al scroll.
//
// Importante: el <section> que contiene esto NO puede tener overflow-hidden
// (rompe el sticky) — usar overflow-clip.

type SvgExtra = Omit<import("react").SVGProps<SVGElement>, "ref">;
type Stage = { label: string; text: string };

const STAGES: Stage[] = [
  { label: "Primera visita", text: "Quien te recibe conoce la propiedad, el barrio y a vos. No es un formulario: es una persona." },
  { label: "Tasación", text: "Un valor real para el mercado de hoy, en 24 horas — no un número armado para conseguir la publicación." },
  { label: "Negociación", text: "La misma persona acompaña cada oferta y cada contraoferta. Nadie te pasa de mano." },
  { label: "Escritura", text: "Y sigue ahí hasta que se firma. El proceso completo, con un solo interlocutor." },
];

// Cada trazo se dibuja entre [start, end] del avance total (0–1). Todos
// usan pathLength=1 para animar stroke-dashoffset sin medir longitudes.
type Draw = { key: string; start: number; end: number; node: (props: SvgExtra) => React.ReactElement };

const stroke = { fill: "none", stroke: "currentColor", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const DRAWINGS: Draw[] = [
  { key: "ground", start: 0, end: 0.1, node: (p) => <line x1="20" y1="262" x2="380" y2="262" {...stroke} {...p} /> },
  { key: "walls", start: 0.08, end: 0.28, node: (p) => <path d="M96 262 V138 H296 V262" {...stroke} {...p} /> },
  { key: "sun", start: 0.1, end: 0.2, node: (p) => <circle cx="340" cy="52" r="16" {...stroke} {...p} /> },
  { key: "rays", start: 0.18, end: 0.27, node: (p) => <path d="M340 24 V30 M340 74 V80 M312 52 H318 M362 52 H368 M320 32 L324 36 M356 68 L360 72 M360 32 L356 36 M324 68 L320 72" {...stroke} {...p} /> },
  { key: "roof", start: 0.26, end: 0.42, node: (p) => <path d="M76 146 L196 64 L316 146" {...stroke} {...p} /> },
  { key: "chimney", start: 0.4, end: 0.46, node: (p) => <path d="M262 96 V68 H284 V112" {...stroke} {...p} /> },
  { key: "door", start: 0.44, end: 0.54, node: (p) => <path d="M178 262 V200 H218 V262" {...stroke} {...p} /> },
  { key: "win-l", start: 0.52, end: 0.6, node: (p) => <rect x="114" y="164" width="44" height="44" {...stroke} {...p} /> },
  { key: "win-r", start: 0.56, end: 0.64, node: (p) => <rect x="236" y="164" width="44" height="44" {...stroke} {...p} /> },
  { key: "trunk", start: 0.62, end: 0.68, node: (p) => <line x1="352" y1="262" x2="352" y2="226" {...stroke} {...p} /> },
  { key: "canopy", start: 0.66, end: 0.76, node: (p) => <circle cx="352" cy="198" r="28" {...stroke} {...p} /> },
  { key: "post", start: 0.72, end: 0.78, node: (p) => <line x1="50" y1="262" x2="50" y2="198" {...stroke} {...p} /> },
  { key: "board", start: 0.76, end: 0.84, node: (p) => <rect x="14" y="150" width="72" height="48" {...stroke} {...p} /> },
  { key: "sign-1", start: 0.84, end: 0.9, node: (p) => <line x1="24" y1="166" x2="76" y2="166" {...stroke} {...p} strokeWidth={5} /> },
  { key: "sign-2", start: 0.88, end: 0.94, node: (p) => <line x1="32" y1="182" x2="68" y2="182" {...stroke} {...p} strokeWidth={2.5} /> },
];

export function StickyHouse() {
  const trackRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    const svg = svgRef.current;
    if (!track || !svg) return;

    const strokes = Array.from(svg.querySelectorAll<SVGElement>("[data-draw]"));
    const lit = Array.from(svg.querySelectorAll<SVGElement>("[data-lit]"));

    return onScrollFrame(() => {
      const rect = track.getBoundingClientRect();
      const scrollable = Math.max(rect.height - window.innerHeight, 1);
      const p = clamp01(-rect.top / scrollable);

      for (const el of strokes) {
        const start = Number(el.dataset.start);
        const end = Number(el.dataset.end);
        el.style.strokeDashoffset = String(1 - clamp01((p - start) / (end - start)));
      }
      const glow = clamp01((p - 0.92) / 0.08);
      for (const el of lit) el.style.fillOpacity = String(0.22 * glow);

      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      const next = Math.min(STAGES.length - 1, Math.floor(p * STAGES.length));
      setStage((current) => (current === next ? current : next));
    });
  }, []);

  return (
    <div ref={trackRef} className="relative h-[280svh] sm:h-[300svh]">
      <div className="sticky top-0 flex h-svh items-center">
        <div className="mx-auto grid w-full max-w-[1240px] gap-5 px-6 pt-16 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16 lg:pt-12">
          <div>
            <div className="grid">
              {STAGES.map((s, i) => (
                <div
                  key={s.label}
                  aria-hidden={i !== stage}
                  className={cn(
                    "col-start-1 row-start-1 transition-[opacity,transform] duration-500 ease-brand motion-reduce:transition-none",
                    i === stage ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
                  )}
                >
                  <p className="mb-3 font-display text-[clamp(28px,5vw,46px)] leading-[1.1] text-white">{s.label}</p>
                  <p className="max-w-[34ch] text-[16px] leading-relaxed text-white/80 sm:text-[17px]">{s.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 h-px w-full max-w-[34ch] bg-white/20 sm:mt-8">
              <div ref={barRef} className="h-px origin-left bg-white" style={{ transform: "scaleX(0)" }} />
            </div>
          </div>

          <div className="order-first lg:order-last">
            <svg
              ref={svgRef}
              viewBox="0 0 400 290"
              role="img"
              aria-label="Ilustración de una casa de Zona Norte que se dibuja a medida que avanzás por la página"
              className="mx-auto max-h-[34svh] w-full text-white/90 lg:max-h-[62svh]"
              strokeWidth="2.5"
            >
              {DRAWINGS.map((d) => (
                <Fragment key={d.key}>
                  {d.node({
                  pathLength: 1,
                  "data-draw": "",
                  "data-start": d.start,
                  "data-end": d.end,
                  style: { strokeDasharray: 1, strokeDashoffset: 1 },
                  } as unknown as SvgExtra)}
                </Fragment>
              ))}
              <rect data-lit="" x="114" y="164" width="44" height="44" fill="currentColor" fillOpacity="0" />
              <rect data-lit="" x="236" y="164" width="44" height="44" fill="currentColor" fillOpacity="0" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
