"use client";

import { useEffect } from "react";
import { clamp01, onScrollFrame } from "@/lib/scroll-frame";

// Publica el avance del scroll sobre el hero (0 → 1) como variable CSS
// --hp en la <section> padre. El video hace zoom lento y el titular sube y
// se desvanece a medida que se sale del hero — todo vía transform/opacity
// leyendo esa variable (ver app/page.tsx), sin estado de React por frame.
export function HeroScrollFx() {
  useEffect(() => {
    const hero = document.getElementById("home-hero");
    if (!hero) return;
    return onScrollFrame(() => {
      const p = clamp01(window.scrollY / Math.max(hero.offsetHeight, 1));
      hero.style.setProperty("--hp", p.toFixed(4));
    });
  }, []);

  return null;
}
