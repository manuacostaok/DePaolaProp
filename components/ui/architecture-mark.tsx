// Firma visual propia de De Paola: un horizonte de fachadas en línea fina,
// como un plano de arquitecto — no una foto, no un ícono. Pensado para
// vivir muy tenue, como textura detrás de una frase editorial, nunca
// como panel de color propio. Un solo color (currentColor) a distintas
// opacidades. Recupera el concepto de siluetas de edificios explorado en
// una sesión anterior de /design-html que nunca se había llevado al
// código — ver Home, sección editorial entre el Hero y "Propiedades".
export function ArchitectureMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1600 420" preserveAspectRatio="xMidYMax meet" fill="none" className={className} aria-hidden="true">
      <line x1="0" y1="360" x2="1600" y2="360" stroke="currentColor" strokeWidth="1" />

      {/* Skyline: alturas y anchos irregulares a propósito, como un
          horizonte real, no una grilla repetida. */}
      <rect x="60" y="180" width="90" height="180" stroke="currentColor" strokeWidth="1" />
      <rect x="180" y="230" width="60" height="130" stroke="currentColor" strokeWidth="1" />
      <path d="M 280 360 V 140 H 340 V 100 H 400 V 360 Z" stroke="currentColor" strokeWidth="1" />
      <rect x="440" y="260" width="70" height="100" stroke="currentColor" strokeWidth="1" />
      <rect x="540" y="200" width="50" height="160" stroke="currentColor" strokeWidth="1" />

      <rect x="980" y="210" width="55" height="150" stroke="currentColor" strokeWidth="1" />
      <path d="M 1070 360 V 160 H 1130 V 200 H 1180 V 360 Z" stroke="currentColor" strokeWidth="1" />
      <rect x="1220" y="250" width="80" height="110" stroke="currentColor" strokeWidth="1" />
      <rect x="1340" y="190" width="60" height="170" stroke="currentColor" strokeWidth="1" />
      <rect x="1440" y="270" width="100" height="90" stroke="currentColor" strokeWidth="1" />

      {/* Ventanas: dispersas y esporádicas, algunas "encendidas" a más
          opacidad — sugiere luz sin ilustrar literalmente una fachada. */}
      {[
        [80, 210], [110, 210], [80, 250], [190, 260], [190, 300], [455, 285], [455, 320], [555, 230], [555, 270],
        [995, 240], [995, 280], [1090, 190], [1150, 220], [1235, 280], [1355, 220], [1355, 260], [1460, 300],
      ].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="12" height="16" fill="currentColor" fillOpacity={i % 4 === 0 ? 0.6 : 0.18} />
      ))}

      {/* Detalle de plano: cota + círculo, no decoración suelta. */}
      <line x1="620" y1="120" x2="740" y2="120" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="620" y1="114" x2="620" y2="126" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="740" y1="114" x2="740" y2="126" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
      <circle cx="860" cy="150" r="26" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
    </svg>
  );
}
