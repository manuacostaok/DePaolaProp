"use client";

import { useState } from "react";
import Link from "next/link";
import { MOBILE_NAV } from "@/lib/nav";
import { cn } from "@/lib/cn";
import { Drawer } from "@/components/ui/drawer";

export function MobileMenu({ light = false }: { light?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        className={cn("text-2xl", light ? "text-white" : "text-ink")}
      >
        ☰
      </button>
      <Drawer open={open} onOpenChange={setOpen} title="Menú">
        <nav className="flex flex-col">
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
      </Drawer>
    </div>
  );
}
