// Iconografía de línea en el mismo lenguaje de ArchitectureMark ("plano
// de arquitecto", currentColor, trazo fino) para las texturas de fondo
// de Home — reemplaza el intento anterior con fotos reales en carrusel:
// el usuario pidió dibujos animados (casas/edificios, personas), no
// fotografías, y el trazo fino a baja opacidad es además la única forma
// de garantizar que nunca compita con el texto por encima (una foto,
// por más tenue, puede tener zonas claras/oscuras impredecibles según
// la imagen real; una línea a 10-16% de opacidad nunca lo hace).
//
// Cada variante cicla entre VARIOS íconos distintos (no el mismo
// repetido) — el usuario pidió explícitamente variedad ("que sean
// distintas") en vez de una sola casa clonada.
import type { ReactNode, CSSProperties } from "react";
import { cn } from "@/lib/cn";

const UNIT = 150;

type IconProps = { x: number; scale?: number };

function HouseIcon({ x, scale = 1 }: IconProps) {
  return (
    <g transform={`translate(${x + 75 - 50 * scale}, ${80 - 80 * scale}) scale(${scale})`}>
      <path d="M10 90 V50 L50 15 L90 50 V90 Z" stroke="currentColor" strokeWidth="3" />
      <rect x="40" y="62" width="20" height="28" stroke="currentColor" strokeWidth="3" />
      <rect x="17" y="58" width="15" height="15" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.25" />
      <rect x="68" y="58" width="15" height="15" stroke="currentColor" strokeWidth="3" />
    </g>
  );
}

// Edificio de departamentos — grilla de ventanas, sin techo a dos aguas,
// para que se lea claramente distinto de la casa individual.
function BuildingIcon({ x, scale = 1 }: IconProps) {
  return (
    <g transform={`translate(${x + 75 - 45 * scale}, ${92 - 92 * scale}) scale(${scale})`}>
      <rect x="10" y="6" width="70" height="86" stroke="currentColor" strokeWidth="3" />
      {[0, 1, 2, 3].flatMap((row) =>
        [0, 1, 2].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={21 + col * 19}
            y={16 + row * 19}
            width="11"
            height="11"
            stroke="currentColor"
            strokeWidth="2"
            fill="currentColor"
            fillOpacity={(row + col) % 3 === 0 ? 0.25 : 0}
          />
        )),
      )}
    </g>
  );
}

// Casa moderna de techo plano con ventanal + cochera — tercera silueta
// para que el "barrio" no se vea como una sola casa clonada.
function ModernHouseIcon({ x, scale = 1 }: IconProps) {
  return (
    <g transform={`translate(${x + 75 - 46 * scale}, ${90 - 90 * scale}) scale(${scale})`}>
      <rect x="6" y="30" width="86" height="8" stroke="currentColor" strokeWidth="3" />
      <rect x="10" y="38" width="78" height="52" stroke="currentColor" strokeWidth="3" />
      <rect x="20" y="54" width="26" height="36" stroke="currentColor" strokeWidth="3" />
      <rect x="56" y="54" width="24" height="36" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.16" />
    </g>
  );
}

function ManIcon({ x, scale = 1 }: IconProps) {
  return (
    <g transform={`translate(${x + 75 - 50 * scale}, ${90 - 90 * scale}) scale(${scale})`}>
      <circle cx="50" cy="26" r="16" stroke="currentColor" strokeWidth="3" />
      <path d="M16 94 Q16 52 50 52 Q84 52 84 94" stroke="currentColor" strokeWidth="3" />
    </g>
  );
}

// Pictograma de mujer (cabeza + pollera triangular) — misma convención
// minimalista universal que la señalética de baños públicos: el usuario
// pidió explícitamente que también haya mujeres, no solo la silueta
// unisex genérica.
function WomanIcon({ x, scale = 1 }: IconProps) {
  return (
    <g transform={`translate(${x + 75 - 50 * scale}, ${90 - 90 * scale}) scale(${scale})`}>
      <circle cx="50" cy="24" r="15" stroke="currentColor" strokeWidth="3" />
      <path d="M50 42 L24 94 L76 94 Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <line x1="38" y1="60" x2="30" y2="78" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.6" />
      <line x1="62" y1="60" x2="70" y2="78" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.6" />
    </g>
  );
}

function DocumentIcon({ x, scale = 1 }: IconProps) {
  return (
    <g transform={`translate(${x + 75 - 35 * scale}, ${85 - 85 * scale}) scale(${scale})`}>
      <rect x="8" y="4" width="60" height="82" rx="2" stroke="currentColor" strokeWidth="3" />
      <line x1="20" y1="26" x2="56" y2="26" stroke="currentColor" strokeWidth="3" strokeOpacity="0.6" />
      <line x1="20" y1="40" x2="56" y2="40" stroke="currentColor" strokeWidth="3" strokeOpacity="0.6" />
      <line x1="20" y1="54" x2="42" y2="54" stroke="currentColor" strokeWidth="3" strokeOpacity="0.6" />
    </g>
  );
}

// Sol — trazo simple, círculo + rayos, para la textura de barrio.
function SunIcon({ x, scale = 1 }: IconProps) {
  const rays = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <g transform={`translate(${x + 75 - 36 * scale}, ${86 - 36 * scale}) scale(${scale})`}>
      <circle cx="36" cy="36" r="17" stroke="currentColor" strokeWidth="3" />
      {rays.map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 36 + Math.cos(rad) * 24;
        const y1 = 36 + Math.sin(rad) * 24;
        const x2 = 36 + Math.cos(rad) * 34;
        const y2 = 36 + Math.sin(rad) * 34;
        return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="3" strokeLinecap="round" />;
      })}
    </g>
  );
}

// Perro (silueta simplificada de línea continua: cuerpo + oreja + cola)
// — a esta escala y opacidad no busca precisión anatómica, busca leerse
// como "hay un perro" a simple vista, mismo criterio que los rects del
// skyline de ArchitectureMark no dibujan ventanas reales.
function DogIcon({ x, scale = 1 }: IconProps) {
  return (
    <g transform={`translate(${x + 75 - 42 * scale}, ${88 - 44 * scale}) scale(${scale})`}>
      <path
        d="M6 44 Q4 26 22 24 L58 21 Q76 21 78 32 Q80 41 69 42 L66 42 L66 58 L57 58 L57 45 L23 45 L23 58 L14 58 L14 44 Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M58 21 L54 6 L70 18 Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M6 34 Q-4 28 -2 14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

// Cartel "SE VENDE" con la marca — poste + tablero, el mismo recurso de
// líneas-como-texto que ya usa DocumentIcon (nunca <text> real: a esta
// escala un <text> se vería como una mancha ilegible, no como palabras).
function SignIcon({ x, scale = 1 }: IconProps) {
  return (
    <g transform={`translate(${x + 75 - 36 * scale}, ${90 - 90 * scale}) scale(${scale})`}>
      <line x1="36" y1="46" x2="36" y2="90" stroke="currentColor" strokeWidth="3" />
      <rect x="2" y="8" width="68" height="38" stroke="currentColor" strokeWidth="3" />
      <line x1="12" y1="21" x2="60" y2="21" stroke="currentColor" strokeWidth="4.5" strokeOpacity="0.75" strokeLinecap="round" />
      <line x1="18" y1="33" x2="54" y2="33" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.5" strokeLinecap="round" />
    </g>
  );
}

const ICON_SETS = {
  houses: [HouseIcon, BuildingIcon, ModernHouseIcon],
  people: [ManIcon, WomanIcon],
  documents: [DocumentIcon],
  // Barrio: casa + cartel "se vende" + perro + sol, mezclados — lo que
  // el usuario pidió puntualmente para la sección de Zonas.
  neighborhood: [HouseIcon, SignIcon, DogIcon, SunIcon, BuildingIcon],
} satisfies Record<string, Array<(props: IconProps) => ReturnType<typeof HouseIcon>>>;

// Fila con variedad real: cicla entre los íconos del set (no repite
// siempre el mismo) y varía levemente la escala — mismo criterio de
// irregularidad intencional que el skyline de ArchitectureMark.
function MotifRow({ variant, count = 9, className }: { variant: keyof typeof ICON_SETS; count?: number; className?: string }) {
  const icons = ICON_SETS[variant];
  const width = UNIT * count;
  return (
    // slice (no meet): escala para llenar siempre el alto completo del
    // contenedor, recortando a los costados en vez de dejar aire arriba/
    // abajo — así el dibujo "destaca" igual sea el contenedor angosto
    // (mobile) o ancho (desktop), en vez de encogerse para entrar entero.
    <svg viewBox={`0 0 ${width} 150`} preserveAspectRatio="xMidYMax slice" fill="none" className={className} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => {
        const Icon = icons[i % icons.length];
        return <Icon key={i} x={i * UNIT} scale={0.82 + ((i * 37) % 5) * 0.07} />;
      })}
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
  variant?: keyof typeof ICON_SETS;
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
