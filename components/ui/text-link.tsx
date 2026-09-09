import Link from "next/link";
import { cn } from "@/lib/cn";

// Acción de bajo compromiso ("Ver todo el equipo") — DESIGN.md button-text:
// sin fondo ni pill, subrayado solo en hover. Deliberadamente por fuera de
// buttonVariants: ese sistema asume forma de píldora (rounded-pill, padding,
// hover:-translate-y-px) que no aplica acá.
export function TextLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 font-medium text-brand-dark underline decoration-1 underline-offset-4 decoration-transparent transition-colors duration-150 hover:decoration-current",
        className,
      )}
    >
      {children}
    </Link>
  );
}
