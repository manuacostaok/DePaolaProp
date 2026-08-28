"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { MAIN_NAV, SITE } from "@/lib/nav";
import { DpIcon } from "@/lib/brand-icon";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { cn } from "@/lib/cn";
import { HEADER_HEIGHT } from "@/lib/layout-constants";

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

  const transparent = isHome && !scrolled;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        transparent ? "border-b border-transparent bg-transparent" : "border-b border-line bg-bg",
      )}
      style={{ height: HEADER_HEIGHT }}
    >
      <div className="relative mx-auto flex h-full max-w-[1240px] items-center justify-between px-6 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          {transparent ? (
            <Image
              src={SITE.logoUrl}
              alt={SITE.name}
              width={220}
              height={62}
              className="h-11 w-auto"
              priority
            />
          ) : (
            <>
              <div className="overflow-hidden rounded-[8px]">
                <DpIcon size={40} padding={0.14} />
              </div>
              <span className="whitespace-nowrap font-display text-[15px] text-brand-dark sm:text-[19px]">
                De Paola Propiedades
              </span>
            </>
          )}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {MAIN_NAV.map((item) => (
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
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden sm:block">
            <Link
              href="/vender/tasacion"
              className={buttonVariants({
                size: "sm",
                variant: transparent ? "onDark" : "primary",
              })}
            >
              Tasá tu propiedad
            </Link>
          </span>
          <MobileMenu light={transparent} />
        </div>
      </div>
    </header>
  );
}
