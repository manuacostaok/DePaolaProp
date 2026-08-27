import { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant = "brand" | "alert" | "dark" | "outline";

const variants: Record<BadgeVariant, string> = {
  brand: "bg-brand text-white",
  alert: "bg-alert text-white",
  dark: "bg-ink/85 text-white",
  outline: "bg-transparent text-ink-soft border border-line",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ variant = "brand", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[3px] px-2.5 py-[5px] text-[11px] font-bold uppercase tracking-wider",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
