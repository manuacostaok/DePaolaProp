"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { cn } from "@/lib/cn";

// Reveal al hacer scroll (fade + translateY sutil vía Anime.js), disparado
// una sola vez por elemento vía IntersectionObserver — ver reference/STYLE_GUIDE.md.
export function Reveal({
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

    // prefers-reduced-motion ya deja el elemento visible por CSS
    // (motion-reduce:opacity-100 abajo) — acá solo evitamos correr la
    // animación (y el observer) de más para esos usuarios.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        animate(el, {
          opacity: [0, 1],
          translateY: [14, 0],
          duration: 600,
          delay: delayMs,
          ease: "outCubic",
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delayMs]);

  return (
    <div ref={ref} className={cn(className, "opacity-0 motion-reduce:opacity-100")}>
      {children}
    </div>
  );
}
