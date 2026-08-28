"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { MAIN_NAV, SITE, type NavItem } from "@/lib/nav";
import { DpIcon } from "@/lib/brand-icon";
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
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // En home, arriba de todo solo se ve el logo centrado flotando sobre el
  // hero (sin nav) — recién al scrollear aparece la barra sólida con los
  // links a los costados, y así se queda. En el resto de las páginas la
  // barra siempre está sólida con los links visibles.
  const transparent = isHome && !scrolled;
  const showNav = !transparent;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        transparent ? "border-b border-transparent bg-transparent" : "border-b border-line bg-bg",
      )}
      style={{ height: HEADER_HEIGHT }}
    >
      <div className="relative mx-auto grid h-full max-w-[1240px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 px-6 sm:px-8">
        <nav
          className="hidden items-center gap-7 md:flex"
          inert={!showNav}
          aria-hidden={!showNav}
        >
          {showNav && <NavLinks items={LEFT_NAV} transparent={transparent} />}
        </nav>

        <Link href="/" className="col-start-2 flex items-center justify-self-center gap-2.5">
          {transparent ? (
            <Image src={SITE.logoUrl} alt={SITE.name} width={220} height={62} className="h-11 w-auto" priority />
          ) : (
            <>
              <div className="overflow-hidden rounded-[8px]">
                <DpIcon size={40} padding={0.14} />
              </div>
              <span className="whitespace-nowrap font-sans text-[11.5px] font-semibold uppercase leading-[1.35] tracking-[0.09em] text-brand-dark sm:text-[13px]">
                De Paola
                <br />
                Propiedades
              </span>
            </>
          )}
        </Link>

        <div className="flex items-center justify-end gap-3">
          <nav
            className="hidden items-center gap-7 md:flex"
            inert={!showNav}
            aria-hidden={!showNav}
          >
            {showNav && <NavLinks items={RIGHT_NAV} transparent={transparent} />}
          </nav>
          <span className="hidden sm:block" inert={!showNav} aria-hidden={!showNav}>
            {showNav && (
              <Link href="/vender/tasacion" className={buttonVariants({ size: "sm" })}>
                Tasá tu propiedad
              </Link>
            )}
          </span>
          <div className="md:hidden" inert={!showNav} aria-hidden={!showNav}>
            {showNav && <MobileMenu light={transparent} />}
          </div>
        </div>
      </div>
    </header>
  );
}
