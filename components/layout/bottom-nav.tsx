"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { BOTTOM_NAV } from "@/lib/nav";

const ICONS: Record<(typeof BOTTOM_NAV)[number]["icon"], string> = {
  home: "M3 11.5 12 4l9 7.5M5.5 10v9h13v-9",
  search: "M9.5 16a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13ZM20 20l-4.35-4.35",
  map: "M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2Zm0 0v14m6-14v14",
  heart: "M12 20s-7-4.35-9.5-8.5C.7 8 2 4.5 5.5 4A5 5 0 0 1 12 7a5 5 0 0 1 6.5-3c3.5.5 4.8 4 3 7.5C19 15.65 12 20 12 20Z",
  chat: "M4 5h16v11H8l-4 4V5Z",
};

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t border-line bg-bg pb-[env(safe-area-inset-bottom)] md:hidden">
      {BOTTOM_NAV.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
              active ? "text-brand-dark" : "text-ink-soft",
            )}
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d={ICONS[item.icon]} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
