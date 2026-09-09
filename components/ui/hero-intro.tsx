"use client";

import { Children, cloneElement, isValidElement, useEffect, useRef, type ReactElement } from "react";
import { createTimeline, stagger } from "animejs";
import { cn } from "@/lib/cn";

// Entrada escalonada del hero de Home (texto + botones) vía Anime.js —
// corre una sola vez al montar, no en scroll. Duración corta y stagger
// chico (ver de-paola-fase13-motion-design.md: "PERFORMANCE > ANIMACIÓN")
// para no atrasar la pintura del H1 (LCP de la página, ver comentario en
// app/page.tsx).
export function HeroIntro({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = Array.from(el.children) as HTMLElement[];
    const timeline = createTimeline({ defaults: { ease: "outExpo" } });
    timeline.add(items, {
      opacity: [0, 1],
      translateY: [16, 0],
      duration: 550,
      delay: stagger(70),
    });
    return () => {
      timeline.revert();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {Children.map(children, (child) =>
        isValidElement(child)
          ? cloneElement(child as ReactElement<{ className?: string }>, {
              className: cn((child.props as { className?: string }).className, "opacity-0 motion-reduce:opacity-100"),
            })
          : child,
      )}
    </div>
  );
}
