"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";

// El botón se inclina hacia el puntero con el mouse y vuelve con un
// resorte corto. Solo pointerType "mouse": en celular no hay hover, y el
// equivalente táctil es el feedback de presión del propio botón
// (active:scale en buttonVariants).
export function Magnetic({ children, className, strength = 0.28 }: { children: React.ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  function onMove(event: React.PointerEvent<HTMLSpanElement>) {
    if (event.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    el.style.transition = "transform 90ms linear";
    el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 450ms cubic-bezier(0.34, 1.56, 0.64, 1)";
    el.style.transform = "translate(0, 0)";
  }

  return (
    <span ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={cn("inline-block motion-reduce:!transform-none", className)}>
      {children}
    </span>
  );
}
