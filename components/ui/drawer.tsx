"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/cn";

// Drawer accesible (Radix Dialog) que desliza desde el borde derecho —
// ver reference/STYLE_GUIDE.md, patrón "Drawer_right" de elliman.com.
export function Drawer({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-[60] bg-ink/40",
            "data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out",
          )}
        />
        <Dialog.Content
          className={cn(
            "fixed inset-y-0 right-0 z-[70] flex h-full w-[86vw] max-w-sm flex-col bg-bg shadow-soft focus:outline-none",
            "data-[state=open]:animate-drawer-right-in data-[state=closed]:animate-drawer-right-out",
          )}
        >
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <Dialog.Title className="font-sans text-[13px] font-semibold uppercase tracking-[0.09em] text-brand-dark">
              {title}
            </Dialog.Title>
            <Dialog.Close aria-label="Cerrar" className="text-2xl leading-none text-ink">
              ✕
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
