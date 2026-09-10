// Iconografía de línea en el mismo lenguaje de ArchitectureMark ("plano
// de arquitecto", currentColor, trazo fino) para las texturas de fondo
// de Home — reemplaza el intento anterior con fotos reales en carrusel:
// el usuario pidió dibujos animados (casas/edificios, personas), no
// fotografías, y el trazo fino a baja opacidad es además la única forma
// de garantizar que nunca compita con el texto por encima (una foto,
// por más tenue, puede tener zonas claras/oscuras impredecibles según
// la imagen real; una línea a 10-16% de opacidad nunca lo hace).
import type { ReactNode, CSSProperties } from "react";
import { cn } from "@/lib/cn";

const UNIT = 150;

function HouseIcon({ x, scale = 1 }: { x: number; scale?: number }) {
  return (
    <g transform={`translate(${x + 75 - 50 * scale}, ${80 - 80 * scale}) scale(${scale})`}>
      <path d="M10 90 V50 L50 15 L90 50 V90 Z" stroke="currentColor" strokeWidth="3" />
      <rect x="40" y="62" width="20" height="28" stroke="currentColor" strokeWidth="3" />
      <rect x="17" y="58" width="15" height="15" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.25" />
      <rect x="68" y="58" width="15" height="15" stroke="currentColor" strokeWidth="3" />
    </g>
  );
}

function PersonIcon({ x, scale = 1 }: { x: number; scale?: number }) {
  return (
    <g transform={`translate(${x + 75 - 50 * scale}, ${90 - 90 * scale}) scale(${scale})`}>
      <circle cx="50" cy="28" r="17" stroke="currentColor" strokeWidth="3" />
      <path d="M14 94 Q14 54 50 54 Q86 54 86 94" stroke="currentColor" strokeWidth="3" />
    </g>
  );
}

function DocumentIcon({ x, scale = 1 }: { x: number; scale?: number }) {
  return (
    <g transform={`translate(${x + 75 - 35 * scale}, ${85 - 85 * scale}) scale(${scale})`}>
      <rect x="8" y="4" width="60" height="82" rx="2" stroke="currentColor" strokeWidth="3" />
      <line x1="20" y1="26" x2="56" y2="26" stroke="currentColor" strokeWidth="3" strokeOpacity="0.6" />
      <line x1="20" y1="40" x2="56" y2="40" stroke="currentColor" strokeWidth="3" strokeOpacity="0.6" />
      <line x1="20" y1="54" x2="42" y2="54" stroke="currentColor" strokeWidth="3" strokeOpacity="0.6" />
    </g>
  );
}

const ICONS = { houses: HouseIcon, people: PersonIcon, documents: DocumentIcon };

// Fila repetida del mismo ícono con leve variación de escala (no una
// grilla idéntica) — mismo criterio de irregularidad intencional que el
// skyline de ArchitectureMark.
function MotifRow({ variant, count = 9, className }: { variant: keyof typeof ICONS; count?: number; className?: string }) {
  const Icon = ICONS[variant];
  const width = UNIT * count;
  return (
    // slice (no meet): escala para llenar siempre el alto completo del
    // contenedor, recortando a los costados en vez de dejar aire arriba/
    // abajo — así el dibujo "destaca" igual sea el contenedor angosto
    // (mobile) o ancho (desktop), en vez de encogerse para entrar entero.
    <svg viewBox={`0 0 ${width} 150`} preserveAspectRatio="xMidYMax slice" fill="none" className={className} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <Icon key={i} x={i * UNIT} scale={0.82 + ((i * 37) % 5) * 0.07} />
      ))}
    </svg>
  );
}

const MASK_STYLE: CSSProperties = {
  maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
  WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
};

// Franja decorativa con deriva horizontal continua (loop CSS, ver
// animate-marquee en app/globals.css) — acepta un ícono temático
// (variant) o cualquier otro trazo de línea (children, ej. el skyline
// completo de ArchitectureMark) para reusar el mismo mecanismo de
// scroll infinito sin duplicar el track a mano en cada sección.
//
// A propósito NO es un fondo absolute detrás del contenido: en mobile,
// con todo apilado a una columna, una sección puede ser mucho más alta
// que en desktop y una franja "absolute bottom" terminaba cayendo
// encima de texto/tarjetas reales en vez de en el margen vacío de
// abajo (bug real, reportado por el usuario). Como franja de flujo
// normal, con su propio alto reservado, es estructuralmente imposible
// que se superponga con nada — y de paso puede verse más marcada
// (mayor opacidad) porque ya no necesita "esconderse" detrás de texto.
export function DriftBand({
  variant,
  children,
  className,
  durationS = 60,
  reverse = false,
  heightClassName = "h-[130px] sm:h-[170px]",
}: {
  variant?: keyof typeof ICONS;
  children?: (className: string) => ReactNode;
  className?: string;
  durationS?: number;
  reverse?: boolean;
  heightClassName?: string;
}) {
  const renderTile = (tileClassName: string) =>
    children ? children(tileClassName) : variant ? <MotifRow variant={variant} className={tileClassName} /> : null;

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none relative w-full overflow-hidden", heightClassName, className)}
      style={MASK_STYLE}
    >
      <div
        className={cn("flex h-full w-[200%]", reverse ? "animate-marquee-reverse" : "animate-marquee")}
        style={{ "--marquee-duration": `${durationS}s` } as CSSProperties}
      >
        {renderTile("h-full w-1/2 shrink-0")}
        {renderTile("h-full w-1/2 shrink-0")}
      </div>
    </div>
  );
}
