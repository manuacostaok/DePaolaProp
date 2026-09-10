"use client";

import { useState, type ReactNode } from "react";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export function FilterPanelMobile({
  basePath,
  activeCount,
  children,
}: {
  basePath: string;
  activeCount: number;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-8 sm:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Filtros${activeCount > 0 ? ` (${activeCount})` : ""}`}
        className="flex w-full items-center justify-between rounded-control bg-white px-4 py-3.5 text-[14.5px] font-medium text-ink shadow-soft"
      >
        <span aria-hidden="true">
          Filtros
          {activeCount > 0 && (
            <span className="ml-2 rounded-full bg-brand-tint px-2 py-0.5 text-[12px] font-semibold text-brand-dark">
              {activeCount}
            </span>
          )}
        </span>
        <span aria-hidden="true" className="text-ink-soft">
          ▾
        </span>
      </button>

      <Drawer open={open} onOpenChange={setOpen} title="Filtros">
        <form
          method="get"
          action={basePath}
          className="flex flex-col gap-3 p-4"
          // El submit navega (form GET tradicional) — cerrar el drawer acá
          // solo prolija la transición visual antes de que la página cambie.
          onSubmit={() => setOpen(false)}
        >
          {children}
          <Button type="submit">Buscar</Button>
          {basePath && (
            <a href={basePath} className="text-center text-sm text-ink-soft underline">
              Limpiar filtros
            </a>
          )}
        </form>
      </Drawer>
    </div>
  );
}
