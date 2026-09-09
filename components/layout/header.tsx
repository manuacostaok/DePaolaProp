"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { MAIN_NAV, type NavItem } from "@/lib/nav";
import { LogoMark } from "@/lib/brand-icon";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { cn } from "@/lib/cn";
import { HEADER_HEIGHT } from "@/lib/layout-constants";

const LEFT_NAV: NavItem[] = MAIN_NAV.slice(0, 4);
const RIGHT_NAV: NavItem[] = MAIN_NAV.slice(4);

function NavLinks({ items, transparent }: { items: NavItem[]; transparent: boolean }) {
  return (
    <>
      {items.map((item) => (
        <div key={item.href} className="group relative">
          <Link
            href={item.href}
            className={cn(
              "py-1.5 text-[13.5px] font-medium tracking-[0.01em] transition-colors duration-200",
              transparent ? "text-white/80 hover:text-white" : "text-ink-soft hover:text-brand-dark",
            )}
          >
            {item.label}
          </Link>
          {item.children && (
            <div className="invisible absolute left-0 top-full min-w-44 rounded-card border border-line bg-white py-2 opacity-0 shadow-soft transition-opacity duration-150 group-hover:visible group-hover:opacity-100">
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="block px-4 py-2 text-sm text-ink hover:bg-brand-tint hover:text-brand-dark"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );
}

const SCROLL_TINT_RAMP_PX = 260;
// Margen de histéresis para el cambio transparente/sólido: sin esto, un
// scroll táctil en mobile que oscila unos pocos píxeles justo en el punto
// de cruce (momentum, rebote elástico de iOS) hace que `scrolled` cambie
// de true a false varias veces por segundo, reiniciando a mitad de camino
// las transiciones CSS (fondo, tinte, logo) — eso es el "bug" real
// reportado en mobile, no las transiciones en sí. Con el margen, una vez
// sólido hace falta volver a subir HYSTERESIS_PX de más para volver a
// transparente, absorbiendo esa jitter sin agregar demora perceptible.
const SCROLL_HYSTERESIS_PX = 24;

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const tintRef = useRef<HTMLDivElement>(null);

  // Home vive bajo ISR (revalidate=60): el HTML que Vercel sirve para "/"
  // puede quedar cacheado desde un render donde este header (Client
  // Component compartido en el layout raíz) no vio el pathname real de la
  // request — confirmado pidiendo el HTML crudo varias veces: siempre
  // vuelve con el header en su estado "sólido", nunca transparente. El
  // cliente, ya en el browser real, sí calcula isHome=true y difiere de
  // eso — dispara error de hidratación #418 en cada carga de Home. Mismo
  // patrón defensivo que HeroVideo: el primer render (server Y primer
  // paint del cliente) siempre coincide con lo que el cache realmente
  // sirve, y recién en el efecto post-mount se corrige al valor real.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect --
       mismo patrón que HeroVideo: a propósito corre solo client-side,
       después del primer paint, para no desalinear el HTML de SSR/ISR. */
    setMounted(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // El primer flip sólido→transparente (disparado por `mounted`, no por
  // scroll) no debe animarse: si arranca con las mismas transition-* que
  // el resto, en producción quedaban ~300-700ms de header sólido visible
  // sobre el hero antes de decidir su estado real — se leía como una
  // navbar mal posicionada, no como parte del Hero. transitionsReady se
  // activa recién un frame después de montar, así ese primer cambio se
  // aplica de forma instantánea (sin flash) y el scroll real sigue
  // animando suave como antes.
  const [transitionsReady, setTransitionsReady] = useState(false);
  useEffect(() => {
    if (!mounted) return;
    const raf = requestAnimationFrame(() => setTransitionsReady(true));
    return () => cancelAnimationFrame(raf);
  }, [mounted]);

  useEffect(() => {
    if (!isHome) return;
    // Un degradé oscuro detrás del header ya empieza a notarse apenas se
    // scrollea un poco (como en elliman.com), para que la respuesta no se
    // sienta recién "al terminar de bajar". El degradé se actualiza directo
    // por CSS var (no por estado de React) para no re-renderizar en cada
    // pixel.
    const heroEl = document.getElementById("home-hero");
    let rafId: number | null = null;

    const measure = () => {
      rafId = null;
      // No usar heroEl.getBoundingClientRect().bottom acá: ese valor incluye
      // la altura del spacer de más abajo (0 ↔ HEADER_HEIGHT, según este
      // mismo `scrolled`), así que queda atado en un ciclo de
      // realimentación con lo que este cálculo está por decidir — un
      // re-render de React entre un scroll y el siguiente puede dejar el
      // spacer todavía en el valor viejo, y ese desfasaje de HEADER_HEIGHT
      // px se lee como un "parpadeo" real del estado sólido/transparente
      // (regresión encontrada al correr tests/home.spec.ts con contenido
      // de hero más alto). La altura propia del hero (`min-h-svh`, no
      // afectada por el spacer) más scrollY da el mismo resultado sin la
      // dependencia circular.
      const heroBottom = heroEl ? heroEl.getBoundingClientRect().height - window.scrollY : window.innerHeight - window.scrollY;

      // Pasado este punto el header ya está sólido — seguir recalculando
      // el degradé en cada frame de scroll durante el resto de la página
      // (que puede ser mucho más larga que el hero) es puro trabajo
      // desperdiciado: reinicia un setState, y por lo tanto un re-render
      // del header, en cada frame mientras se scrollea, lo que se ve como
      // parpadeo/jank durante todo el scroll. Una vez acá no hace falta
      // más que sostener scrolled=true (no-op: setScrolled con el mismo
      // valor no re-renderiza).
      if (heroBottom < -HEADER_HEIGHT) {
        flushSync(() => setScrolled(true));
        return;
      }

      const tint = Math.min(1, window.scrollY / SCROLL_TINT_RAMP_PX);
      tintRef.current?.style.setProperty("--scroll-tint", String(tint));

      // flushSync: sin esto, el className del <header> puede quedar
      // aplicado recién 1-2 frames después de este cálculo — un re-render
      // diferido de React, no un problema de la lógica en sí. Eso deja una
      // ventana en la que un scroll rápido siguiente todavía ve el estado
      // viejo, lo que se leía como una transición de más en
      // tests/home.spec.ts. Forzar el commit acá adentro del mismo
      // callback de rAF elimina esa ventana.
      flushSync(() => {
        // Histéresis: una vez sólido, solo vuelve a transparente si el borde
        // del hero sube más allá del margen — absorbe la jitter del scroll
        // táctil en vez de parpadear en cada pixel de oscilación.
        // FINDING-001 (/design-review): esta condición estaba invertida — devolvía
        // `true` (sólido) justo cuando heroBottom superaba el margen de histéresis,
        // que es exactamente el caso en el que debía volver a transparente. Eso
        // dejaba el header pegado en sólido para siempre después de scrollear
        // hasta el fondo y volver arriba (repro: scrollTo bottom → scrollTo 0).
        setScrolled((prev) => (prev ? heroBottom <= HEADER_HEIGHT + SCROLL_HYSTERESIS_PX : heroBottom <= HEADER_HEIGHT));
      });
    };
    // rAF-throttled: en mobile el evento scroll puede disparar más rápido
    // que un frame de pintado — sin esto, React procesa un setState por
    // cada evento en vez de uno por frame, otra fuente real de jank.
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
  }, [isHome]);

  // Un solo navbar, siempre arriba: sobre el hero de Home es transparente
  // (nav + logo en color claro, degradé de contraste detrás) y al pasar el
  // hero pasa a sólido — ya no hay una barra aparte al pie del hero.
  const transparent = mounted && isHome && !scrolled;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50",
          transitionsReady && "transition-colors duration-300",
          transparent ? "border-b border-transparent bg-transparent" : "border-b border-line bg-bg",
        )}
        style={{ height: HEADER_HEIGHT }}
      >
        {mounted && isHome && (
          <div
            ref={tintRef}
            className={cn(
              "pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 to-transparent",
              transitionsReady && "transition-opacity duration-300",
            )}
            style={{ opacity: scrolled ? 0 : "var(--scroll-tint, 0)" }}
          />
        )}
        <div className="relative mx-auto grid h-full max-w-[1240px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 px-6 sm:px-8">
          <nav className="hidden items-center gap-7 md:flex">
            <NavLinks items={LEFT_NAV} transparent={transparent} />
          </nav>

          <Link href="/" className="col-start-2 justify-self-center">
            <LogoMark className="h-12 sm:h-16" colorClassName={transparent ? "bg-[#F5E7CB]" : "bg-brand-dark"} />
          </Link>

          <div className="flex items-center justify-end gap-3">
            <nav className="hidden items-center gap-7 md:flex">
              <NavLinks items={RIGHT_NAV} transparent={transparent} />
            </nav>
            <span className="hidden sm:block">
              <Link href="/vender/tasacion" className={buttonVariants({ size: "sm", variant: transparent ? "onDark" : "primary" })}>
                Tasá tu propiedad
              </Link>
            </span>
            <div className="md:hidden">
              <MobileMenu light={transparent} />
            </div>
          </div>
        </div>
      </header>

      <div style={{ height: transparent ? 0 : HEADER_HEIGHT }} />
    </>
  );
}
