"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

// Cifra que sube hasta su valor final al montar. El HTML servido ya trae el
// número final (nada de "0" para quien no ejecuta JS ni de salto de layout);
// el efecto solo reproduce la cuenta. Respeta prefers-reduced-motion.
export function CountUp({ to, delayMs = 500, durationMs = 1400 }: { to: number; delayMs?: number; durationMs?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.textContent = "0";
    const counter = { value: 0 };
    const animation = animate(counter, {
      value: to,
      duration: durationMs,
      delay: delayMs,
      ease: "outExpo",
      onUpdate: () => {
        el.textContent = String(Math.round(counter.value));
      },
      onComplete: () => {
        el.textContent = String(to);
      },
    });
    return () => {
      animation.revert();
      el.textContent = String(to);
    };
  }, [to, delayMs, durationMs]);

  return <span ref={ref}>{to}</span>;
}
