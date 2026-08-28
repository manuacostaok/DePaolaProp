"use client";

import { useState, type ReactNode } from "react";
import { Button, type ButtonVariant } from "@/components/ui/button";

export function LeadModal({
  triggerLabel,
  triggerVariant = "outline",
  title,
  children,
}: {
  triggerLabel: string;
  triggerVariant?: ButtonVariant;
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" variant={triggerVariant} onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/50 p-4" onClick={() => setOpen(false)}>
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-card bg-white p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <h2 className="text-xl">{title}</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar" className="text-xl text-ink-soft">
                ✕
              </button>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
}
