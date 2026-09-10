import Image from "next/image";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

export interface MarqueeImage {
  url: string;
  alt: string;
}

// Textura de fondo animada, temática por sección (casas en Propiedades,
// barrios en Zonas, caras del equipo en Agentes, tapas en Editorial) —
// vive SIEMPRE detrás de un scrim del color de fondo de la sección (lo
// agrega quien la usa, ver Home), así que el efecto real es una franja
// de movimiento y color muy tenue, no un carrusel legible. 100% CSS
// (sin JS ni Anime.js: es un loop continuo, no una secuencia puntual) y
// respeta prefers-reduced-motion vía la utilidad animate-marquee.
export function ImageMarquee({
  images,
  className,
  reverse = false,
  durationS = 46,
  tileClassName = "w-44 sm:w-60",
}: {
  images: MarqueeImage[];
  className?: string;
  reverse?: boolean;
  durationS?: number;
  tileClassName?: string;
}) {
  if (images.length === 0) return null;
  const track = [...images, ...images];

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{
        maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
      }}
    >
      <div
        className={cn("flex h-full items-center gap-4", reverse ? "animate-marquee-reverse" : "animate-marquee")}
        style={{ "--marquee-duration": `${durationS}s` } as CSSProperties}
      >
        {track.map((image, index) => (
          <div key={index} className={cn("relative h-[72%] shrink-0 overflow-hidden rounded-card", tileClassName)}>
            <Image src={image.url} alt="" fill sizes="240px" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
