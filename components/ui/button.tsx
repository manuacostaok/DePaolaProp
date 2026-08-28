import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "outline" | "whatsapp" | "ghost" | "onDark";
export type ButtonSize = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-control font-semibold font-sans transition-[transform,background-color,border-color] duration-150 ease-out hover:-translate-y-px disabled:pointer-events-none disabled:opacity-50 motion-reduce:transform-none motion-reduce:transition-none";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white border border-transparent hover:bg-brand-dark",
  outline: "bg-transparent text-ink border border-ink hover:border-brand hover:text-brand-dark",
  whatsapp: "bg-whatsapp text-white border border-transparent hover:brightness-95",
  ghost: "bg-transparent text-ink-soft border border-transparent hover:text-brand-dark",
  // Para CTAs sobre fondos oscuros (ej. el hero con foto), donde el
  // variant "primary" (bg-brand) queda invisible sobre un fondo también navy.
  onDark: "bg-white text-brand-dark border border-transparent hover:bg-white/90",
};

const sizes: Record<ButtonSize, string> = {
  md: "text-sm px-5 py-[11px]",
  sm: "text-[13px] px-3.5 py-2",
};

export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, ...props }, ref) => {
    return <button ref={ref} className={buttonVariants({ variant, size, className })} {...props} />;
  },
);

Button.displayName = "Button";
