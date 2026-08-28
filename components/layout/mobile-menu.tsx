"use client";

import { useState } from "react";
import Link from "next/link";
import { MOBILE_NAV } from "@/lib/nav";
import { cn } from "@/lib/cn";

export function MobileMenu({ light = false }: { light?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        className={cn("text-2xl", light ? "text-white" : "text-ink")}
      >
        {open ? "✕" : "☰"}
      </button>
      {open && (
        <nav className="absolute inset-x-0 top-full flex flex-col border-t border-line bg-bg">
          {MOBILE_NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-line px-6 py-3.5 text-[15px] font-medium text-ink hover:bg-brand-tint hover:text-brand-dark"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
