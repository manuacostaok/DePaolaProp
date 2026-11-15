"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { cn } from "@/lib/cn";

// Aparición por recorte (clip-path) en vez de fade: la foto se "abre" de
// abajo hacia arriba como una persiana, una sola vez al entrar en pantalla.
// rootMargin (no threshold) para que las imágenes con carga diferida
// aparezcan siempre. Con reduced-motion se muestra completa sin animar.
export function ClipReveal({
  children,
  className,
  delayMs = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.clipPath = "none";
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        animate(el, {
          clipPath: ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"],
          duration: 900,
          delay: delayMs,
          ease: "outExpo",
          onComplete: () => {
            el.style.clipPath = "none";
          },
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delayMs]);

  return (
    <div ref={ref} className={cn(className)} style={{ clipPath: "inset(100% 0% 0% 0%)" }}>
      {children}
    </div>
  );
}
