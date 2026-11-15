"use client";

import { useEffect, useRef } from "react";
import { clamp01, onScrollFrame } from "@/lib/scroll-frame";
import { cn } from "@/lib/cn";

// Texto que "se lee" con el scroll: cada palabra pasa de tenue a plena a
// medida que el párrafo sube por la pantalla. El color lo pone el padre
// (currentColor) — acá solo se mueve la opacidad. Con reduced-motion queda
// todo a opacidad plena, sin atar nada al scroll.
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const rootRef = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const spans = Array.from(root.querySelectorAll<HTMLElement>("[data-word]"));
    return onScrollFrame(() => {
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 cuando el párrafo asoma por abajo, 1 cuando llegó al 45% de la pantalla.
      const p = clamp01((vh * 0.92 - rect.top) / (vh * 0.47));
      spans.forEach((span, i) => {
        const wordP = clamp01(p * (spans.length + 3) - i);
        span.style.opacity = String(0.2 + 0.8 * wordP);
      });
    });
  }, []);

  return (
    <p ref={rootRef} className={cn(className)}>
      {words.map((word, i) => (
        <span key={i} data-word className="transition-opacity duration-150 motion-reduce:transition-none">
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
