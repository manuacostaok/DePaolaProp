"use client";

import { useEffect, useRef, useState } from "react";
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
              "border-b-2 border-transparent py-1.5 text-[14.5px] font-medium",
              transparent ? "text-white/90 hover:border-white hover:text-white" : "text-ink hover:border-brand hover:text-brand-dark",
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
// las 4 transiciones CSS (fondo, tinte, nav, logo) — eso es el "bug" real
// reportado en mobile, no las transiciones en sí. Con el margen, una vez
// sólido hace falta volver a subir HYSTERESIS_PX de más para volver a
// transparente, absorbiendo esa jitter sin agregar demora perceptible.
const SCROLL_HYSTERESIS_PX = 24;

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [footTop, setFootTop] = useState<number | null>(null);
  const tintRef = useRef<HTMLDivElement>(null);
  const footNavRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!isHome) return;
    // La barra de links vive pegada al pie real del hero (#home-hero, el
    // <section> de app/page.tsx), no al fondo de la pantalla: sigue la
    // posición del borde inferior del hero a medida que se scrollea (se
    // "tapa" con el resto de la página como cualquier otro contenido) y
    // recién cuando ese borde desaparece bajo la barra sólida de arriba
    // (es decir, el pie del hero deja de verse) se corta a la barra
    // sólida de siempre. Un degradé oscuro detrás del logo ya empieza a
    // notarse apenas se scrollea un poco (como en elliman.com), para que
    // la respuesta no se sienta recién "al terminar de bajar". El
    // degradé se actualiza directo por CSS var (no por estado de React)
    // para no re-renderizar en cada pixel.
    const heroEl = document.getElementById("home-hero");
    let rafId: number | null = null;

    const measure = () => {
      rafId = null;
      const tint = Math.min(1, window.scrollY / SCROLL_TINT_RAMP_PX);
      tintRef.current?.style.setProperty("--scroll-tint", String(tint));

      const heroBottom = heroEl ? heroEl.getBoundingClientRect().bottom : window.innerHeight - window.scrollY;
      const footHeight = footNavRef.current?.offsetHeight ?? 0;
      setFootTop(heroBottom - footHeight);
      // Histéresis: una vez sólido, solo vuelve a transparente si el borde
      // del hero sube más allá del margen — absorbe la jitter del scroll
      // táctil en vez de parpadear en cada pixel de oscilación.
      setScrolled((prev) => (prev ? heroBottom > HEADER_HEIGHT + SCROLL_HYSTERESIS_PX : heroBottom <= HEADER_HEIGHT));
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

  // En home, arriba de todo solo se ve el logo centrado flotando sobre el
  // hero, y los links de navegación viven en una barra aparte al pie del
  // hero (que ocupa toda la pantalla) — recién al scrollear esa barra pasa
  // a ser la barra sólida de arriba. En el resto de las páginas la barra
  // de arriba siempre está sólida con todo visible.
  const transparent = mounted && isHome && !scrolled;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          transparent ? "border-b border-transparent bg-transparent" : "border-b border-line bg-bg",
        )}
        style={{ height: HEADER_HEIGHT }}
      >
        {mounted && isHome && (
          <div
            ref={tintRef}
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 to-transparent transition-opacity duration-300"
            style={{ opacity: scrolled ? 0 : "var(--scroll-tint, 0)" }}
          />
        )}
        <div className="relative mx-auto grid h-full max-w-[1240px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 px-6 sm:px-8">
          <nav
            className={cn("hidden items-center gap-7 transition-opacity duration-300 md:flex", transparent ? "opacity-0" : "opacity-100")}
            inert={transparent}
            aria-hidden={transparent}
          >
            <NavLinks items={LEFT_NAV} transparent={false} />
          </nav>

          <Link href="/" className="col-start-2 justify-self-center">
            <LogoMark className="h-10 sm:h-11" colorClassName={transparent ? "bg-[#F5E7CB]" : "bg-brand-dark"} />
          </Link>

          <div className="flex items-center justify-end gap-3">
            <nav
              className={cn("hidden items-center gap-7 transition-opacity duration-300 md:flex", transparent ? "opacity-0" : "opacity-100")}
              inert={transparent}
              aria-hidden={transparent}
            >
              <NavLinks items={RIGHT_NAV} transparent={false} />
            </nav>
            <span
              className={cn("hidden transition-opacity duration-300 sm:block", transparent ? "opacity-0" : "opacity-100")}
              inert={transparent}
              aria-hidden={transparent}
            >
              <Link href="/vender/tasacion" className={buttonVariants({ size: "sm" })}>
                Tasá tu propiedad
              </Link>
            </span>
            <div className="md:hidden">
              <MobileMenu light={transparent} />
            </div>
          </div>
        </div>
      </header>

      {/* hidden md:block es intencional, no un bug de responsive: esta barra
          es el respaldo de escritorio para los links de nav mientras el
          header de arriba está transparente sobre el hero. En mobile ese
          rol lo cumple el drawer (MobileMenu, más arriba en este archivo),
          que compite por espacio con el resto del hero — no debe mostrarse
          acá también. */}
      {mounted && isHome && (
        <div
          ref={footNavRef}
          className={cn(
            "fixed inset-x-0 z-50 hidden transition-opacity duration-300 md:block",
            transparent ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          style={footTop == null ? { bottom: 0 } : { top: footTop }}
        >
          <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-6 sm:px-8">
            <nav className="flex items-center gap-7">
              <NavLinks items={LEFT_NAV} transparent />
            </nav>
            <div className="flex items-center gap-7">
              <nav className="flex items-center gap-7">
                <NavLinks items={RIGHT_NAV} transparent />
              </nav>
              <Link href="/vender/tasacion" className={buttonVariants({ size: "sm", variant: "onDark" })}>
                Tasá tu propiedad
              </Link>
            </div>
          </div>
        </div>
      )}

      <div style={{ height: transparent ? 0 : HEADER_HEIGHT }} />
    </>
  );
}
