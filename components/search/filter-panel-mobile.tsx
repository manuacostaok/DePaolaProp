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
        className="flex w-full items-center justify-between rounded-card border border-line bg-white px-4 py-3 text-sm font-medium text-ink"
      >
        <span>Filtros{activeCount > 0 ? ` (${activeCount})` : ""}</span>
        <span aria-hidden="true">▾</span>
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
