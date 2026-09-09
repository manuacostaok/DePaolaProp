// Firma visual propia de De Paola: elevación arquitectónica en línea fina,
// no una foto ni un ícono — geometría de fachadas + grilla de ventanas,
// como un plano de arquitecto. Un solo color (currentColor) a distintas
// opacidades, sin relleno sólido, para que lea "línea y luz", no
// ilustración decorativa. Etapa 2, iteración 2 — recupera el concepto
// explorado en /design-html que nunca se había llevado al código.
export function ArchitectureMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 800" fill="none" className={className} aria-hidden="true">
      {/* Línea de base */}
      <line x1="0" y1="640" x2="640" y2="640" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />

      {/* Edificio A — el más alto, al fondo */}
      <rect x="70" y="120" width="120" height="520" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1" />
      {Array.from({ length: 11 }).map((_, row) =>
        Array.from({ length: 4 }).map((_, col) => (
          <rect
            key={`a-${row}-${col}`}
            x={70 + 16 + col * 26}
            y={120 + 24 + row * 42}
            width="14"
            height="20"
            fill="currentColor"
            fillOpacity={(row + col) % 5 === 0 ? 0.22 : 0.06}
          />
        )),
      )}

      {/* Edificio B — mediano, con cubierta escalonada */}
      <path
        d="M 230 640 V 300 H 300 V 240 H 380 V 640 Z"
        stroke="currentColor"
        strokeOpacity="0.5"
        strokeWidth="1"
      />
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 3 }).map((_, col) => (
          <rect
            key={`b-${row}-${col}`}
            x={244 + col * 30}
            y={320 + row * 38}
            width="16"
            height="22"
            fill="currentColor"
            fillOpacity={(row * 3 + col) % 4 === 0 ? 0.24 : 0.05}
          />
        )),
      )}

      {/* Edificio C — bajo, en primer plano, con marquesina */}
      <rect x="420" y="460" width="150" height="180" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1" />
      <line x1="420" y1="500" x2="570" y2="500" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1" />
      {Array.from({ length: 3 }).map((_, row) =>
        Array.from({ length: 4 }).map((_, col) => (
          <rect
            key={`c-${row}-${col}`}
            x={434 + col * 32}
            y={514 + row * 36}
            width="18"
            height="24"
            fill="currentColor"
            fillOpacity={(row + col) % 3 === 0 ? 0.28 : 0.07}
          />
        )),
      )}

      {/* Planos / cotas — detalle de plano de arquitecto, no decoración suelta */}
      <line x1="70" y1="100" x2="190" y2="100" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />
      <line x1="70" y1="94" x2="70" y2="106" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />
      <line x1="190" y1="94" x2="190" y2="106" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />
      <circle cx="560" cy="140" r="34" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" />
    </svg>
  );
}
