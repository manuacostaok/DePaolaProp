"use client";

import { useState } from "react";
import Image from "next/image";
import { GalleryLightbox } from "@/components/property/gallery-lightbox";

export interface GalleryProps {
  images: { url: string; alt: string }[];
  title: string;
}

// Foto grande a todo el ancho + tira de miniaturas, en vez de la grilla
// fija de "principal + 2 al costado" (que además solo mostraba hasta 3
// fotos sin ninguna forma de ver el resto). Una sola composición para
// todos los tamaños de pantalla — en mobile, la miniatura scrollea
// horizontal en vez de depender de un carrusel de swipe aparte.
export function Gallery({ images, title }: GalleryProps) {
  const shown = images.length > 0 ? images : [{ url: "/placeholder-property.svg", alt: title }];
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [mainIndex, setMainIndex] = useState(0);
  const main = shown[mainIndex];

  return (
    <>
      <button
        type="button"
        onClick={() => setLightboxIndex(mainIndex)}
        className="group relative block aspect-[3/2] w-full overflow-hidden rounded-card bg-bg-alt sm:aspect-[16/9]"
      >
        <Image
          src={main.url}
          alt={main.alt}
          fill
          priority
          sizes="(min-width: 1024px) 1100px, 100vw"
          className="object-cover transition-transform duration-[430ms] ease-brand group-hover:scale-[1.015]"
        />
        {shown.length > 1 && (
          <span className="absolute bottom-4 right-4 rounded-[3px] bg-ink/70 px-3 py-1.5 text-[12.5px] font-medium text-white">
            Ver las {shown.length} fotos
          </span>
        )}
      </button>

      {shown.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {shown.map((image, index) => (
            <button
              key={image.url + index}
              type="button"
              onClick={() => setMainIndex(index)}
              aria-label={`Ver foto ${index + 1}`}
              aria-current={index === mainIndex}
              className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-[6px] bg-bg-alt outline-2 outline-offset-2 outline-brand-dark sm:w-28"
              style={{ outlineStyle: index === mainIndex ? "solid" : "none" }}
            >
              <Image src={image.url} alt={image.alt} fill sizes="112px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightboxIndex != null && (
        <GalleryLightbox images={shown} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </>
  );
}
