"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HEADER_HEIGHT } from "@/lib/layout-constants";

// Mismo margen de histéresis que components/layout/header.tsx: evita que la
// barra parpadee al oscilar el scroll cerca del punto de aparición en mobile
// (momentum, rebote elástico de iOS).
const SCROLL_HYSTERESIS_PX = 24;

// Barra de búsqueda compacta que reemplaza al buscador del hero una vez que
// el usuario scrolleó más allá de él — el buscador real del hero (form
// dentro de HeroIntro en app/page.tsx) "colapsa" a este acceso rápido en
// vez de perderse del todo. Sigue el mismo punto de referencia que el
// header (borde inferior real de #home-hero, ver el comentario de esa
// fórmula en header.tsx) para aparecer justo cuando el header pasa a
// sólido — pero vive aparte, sin tocar la lógica de scroll del header.
export function StickySearchBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const heroEl = document.getElementById("home-hero");
    if (!heroEl) return;
    let rafId: number | null = null;

    const measure = () => {
      rafId = null;
      const heroBottom = heroEl.getBoundingClientRect().height - window.scrollY;
      setVisible((prev) => (prev ? heroBottom > HEADER_HEIGHT + SCROLL_HYSTERESIS_PX : heroBottom <= HEADER_HEIGHT));
    };
    const onScroll = () => {
      if (rafId != null) return;
      rafId = requestAnimationFrame(measure);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="fixed inset-x-0 z-40 border-b border-line bg-bg/95 px-4 py-3 shadow-soft backdrop-blur-sm transition-[top] duration-300 ease-out sm:px-8"
      style={{ top: visible ? HEADER_HEIGHT : -100 }}
      inert={!visible}
    >
      <Link
        href="/propiedades"
        className="mx-auto flex max-w-[1240px] items-center gap-3 rounded-pill border border-line bg-white px-4 py-2.5 text-sm text-ink-soft shadow-soft transition-colors hover:border-brand sm:px-5"
      >
        <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0 text-brand">
          <circle cx="7" cy="7" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <line x1="11.2" y1="11.2" x2="15" y2="15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span className="flex-1">Buscar en Zona Norte</span>
        <span className="hidden font-semibold text-brand sm:inline">Ver propiedades →</span>
      </Link>
    </div>
  );
}
