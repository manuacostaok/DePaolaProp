"use client";

import { useEffect, useState } from "react";
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

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    // El corte pasa a sólido recién cuando se scrolleó casi una pantalla
    // completa (el hero mide 100dvh) — mientras tanto la barra de nav
    // vive abajo del hero, no arriba.
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight - HEADER_HEIGHT * 1.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isHome]);

  // En home, arriba de todo solo se ve el logo centrado flotando sobre el
  // hero, y los links de navegación viven en una barra aparte al pie del
  // hero (que ocupa toda la pantalla) — recién al scrollear esa barra pasa
  // a ser la barra sólida de arriba. En el resto de las páginas la barra
  // de arriba siempre está sólida con todo visible.
  const transparent = isHome && !scrolled;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          transparent ? "border-b border-transparent bg-transparent" : "border-b border-line bg-bg",
        )}
        style={{ height: HEADER_HEIGHT }}
      >
        <div className="relative mx-auto grid h-full max-w-[1240px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 px-6 sm:px-8">
          <nav className="hidden items-center gap-7 md:flex" inert={transparent} aria-hidden={transparent}>
            {!transparent && <NavLinks items={LEFT_NAV} transparent={false} />}
          </nav>

          <Link href="/" className="col-start-2 justify-self-center">
            <LogoMark className="h-9 sm:h-11" colorClassName={transparent ? "bg-[#F5E7CB]" : "bg-brand-dark"} />
          </Link>

          <div className="flex items-center justify-end gap-3">
            <nav className="hidden items-center gap-7 md:flex" inert={transparent} aria-hidden={transparent}>
              {!transparent && <NavLinks items={RIGHT_NAV} transparent={false} />}
            </nav>
            <span className="hidden sm:block" inert={transparent} aria-hidden={transparent}>
              {!transparent && (
                <Link href="/vender/tasacion" className={buttonVariants({ size: "sm" })}>
                  Tasá tu propiedad
                </Link>
              )}
            </span>
            <div className="md:hidden" inert={transparent} aria-hidden={transparent}>
              {!transparent && <MobileMenu light={false} />}
            </div>
          </div>
        </div>
      </header>

      {transparent && (
        <div className="fixed inset-x-0 bottom-0 z-50 hidden md:block">
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
