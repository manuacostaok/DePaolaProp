"use client";

import { useEffect, useRef } from "react";
import { clamp01, onScrollFrame } from "@/lib/scroll-frame";

// Indicador de progreso propio de la marca: un trazo fino con una casita
// que lo recorre (en vez de la barra genérica). mix-blend-difference lo
// hace legible tanto sobre el video oscuro del hero como sobre el header
// crema, sin lógica de colores. Solo transform — sin reflow por frame.
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return onScrollFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? clamp01(window.scrollY / max) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      if (markerRef.current) markerRef.current.style.transform = `translateX(${p * 100}vw)`;
    });
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-4 overflow-clip mix-blend-difference">
      <div ref={barRef} className="h-[2px] origin-left bg-white will-change-transform" style={{ transform: "scaleX(0)" }} />
      <div ref={markerRef} className="absolute left-0 top-[3px] will-change-transform" style={{ transform: "translateX(0)" }}>
        <svg viewBox="0 0 20 16" className="-ml-[10px] h-3 w-[15px] text-white" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 8 L10 2 L17 8 V14 H3 Z" />
          <path d="M8.5 14 V10 H11.5 V14" />
        </svg>
      </div>
    </div>
  );
}
