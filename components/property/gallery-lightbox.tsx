"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";

export interface GalleryLightboxProps {
  images: { url: string; alt: string }[];
  initialIndex: number;
  onClose: () => void;
}

// Ver todas las fotos, no solo las 3 que caben en la composición de
// arriba — antes no había forma de acceder a la 4ta foto en adelante.
// Reusa Radix Dialog (ya es dependencia del proyecto, ver drawer.tsx) en
// vez de sumar una librería de lightbox nueva.
export function GalleryLightbox({ images, initialIndex, onClose }: GalleryLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const touchStartX = useRef(0);
  const multiple = images.length > 1;

  const goPrev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const goNext = () => setIndex((i) => (i + 1) % images.length);

  useEffect(() => {
    if (!multiple) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- goPrev/goNext se recrean cada render, no hace falta re-suscribir por eso
  }, [multiple]);

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="animate-overlay-in fixed inset-0 z-[70] bg-ink/95" />
        <Dialog.Content
          className="animate-overlay-in fixed inset-0 z-[80] flex flex-col focus:outline-none"
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            if (dx > 50) goPrev();
            else if (dx < -50) goNext();
          }}
        >
          <Dialog.Title className="sr-only">Galería de fotos</Dialog.Title>
          <div className="flex items-center justify-between px-6 py-4 text-white/80">
            {multiple ? (
              <span className="text-[13px] tabular-nums">
                {index + 1} / {images.length}
              </span>
            ) : (
              <span />
            )}
            <Dialog.Close aria-label="Cerrar" className="text-2xl leading-none hover:text-white">
              ✕
            </Dialog.Close>
          </div>
          <div className="relative flex-1">
            <Image src={images[index].url} alt={images[index].alt} fill sizes="100vw" className="object-contain" priority />
          </div>
          {multiple && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Foto anterior"
                className="absolute left-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20 sm:left-6"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Foto siguiente"
                className="absolute right-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20 sm:right-6"
              >
                ›
              </button>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
