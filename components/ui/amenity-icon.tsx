// Set chico de íconos de trazo (mismo lenguaje visual que los íconos del
// sitio: viewBox 24, stroke actual, sin relleno) para las amenities de un
// emprendimiento. "key" no matcheado cae a un ícono genérico de estrella.
const PATHS: Record<string, string> = {
  pileta: "M3 17c1.5 1.3 3 1.3 4.5 0s3-1.3 4.5 0 3 1.3 4.5 0 3-1.3 4.5 0M4 12V6a2 2 0 0 1 2-2h6l8 8M4 12h16",
  gimnasio: "M4 8v8M2 10v4M20 8v8M22 10v4M7 12h10M4 8h3v8H4z",
  salon: "M4 20V10l8-6 8 6v10M9 20v-6h6v6",
  vinoteca: "M8 3h8l-1 7a3 3 0 0 1-6 0L8 3ZM12 13v8M8 21h8",
  coffee: "M4 8h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8ZM17 9h1.5a2.5 2.5 0 0 1 0 5H17M7 3v2M10 3v2M13 3v2",
  parrilla: "M4 10h16M6 10a6 6 0 0 0 12 0M9 14v6M15 14v6",
  chillout: "M4 18v-4a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v4M3 18h18M6 11V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3",
  conferencias: "M3 5h18v11H8l-4 4V5Z M7 9h10M7 12h6",
  cochera: "M4 11l1.5-5A2 2 0 0 1 7.4 5h9.2a2 2 0 0 1 1.9 1.4L20 11M4 11h16v6H4z M7 17v2M17 17v2M6.5 14a1 1 0 1 0 2 0 1 1 0 0 0-2 0ZM15.5 14a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z",
  default: "M12 3l2.6 5.7 6.4.6-4.8 4.3 1.4 6.2L12 16.9l-5.6 2.9 1.4-6.2-4.8-4.3 6.4-.6L12 3Z",
};

export function AmenityIcon({ amenityKey, className }: { amenityKey: string; className?: string }) {
  const d = PATHS[amenityKey] ?? PATHS.default;
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
