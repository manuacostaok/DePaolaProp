import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { MAIN_NAV } from "@/lib/nav";
import { DpIcon } from "@/lib/brand-icon";
import { MobileMenu } from "@/components/layout/mobile-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg">
      <div className="relative mx-auto flex max-w-[1240px] items-center justify-between px-6 py-3.5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="overflow-hidden rounded-[8px]">
            <DpIcon size={40} padding={0.14} />
          </div>
          <span className="font-display text-[19px] text-brand-dark">De Paola</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {MAIN_NAV.map((item) => (
            <div key={item.href} className="group relative">
              <Link
                href={item.href}
                className="border-b-2 border-transparent py-1.5 text-[14.5px] font-medium text-ink hover:border-brand hover:text-brand-dark"
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
            <Link href="/vender/tasacion" className={buttonVariants({ size: "sm" })}>
              Tasá tu propiedad
            </Link>
          </span>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
