"use client";

import { SelectHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "@/lib/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  // "lg" se usa para el filtro primario (Zona) — más presencia táctil y
  // tipográfica que los selects secundarios. No se mergea vía className
  // (lib/cn.ts no dedupea clases en conflicto) para evitar que ambos
  // tamaños de padding/texto terminen aplicados a la vez. Se llama
  // "uiSize" (no "size") porque size ya es un atributo HTML nativo de
  // <select> (cantidad de filas visibles) con tipo number.
  uiSize?: "default" | "lg";
}

const SIZE_CLASSES: Record<"default" | "lg", string> = {
  default: "px-3.5 py-2.5 pr-9 text-sm",
  lg: "px-4 py-3.5 pr-10 text-[15px]",
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, placeholder, id, className, uiSize = "default", ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-ink">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "w-full appearance-none rounded-control border border-line bg-white text-ink",
              SIZE_CLASSES[uiSize],
              "outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-tint",
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className={cn(
              "pointer-events-none absolute top-1/2 -translate-y-1/2 text-ink-soft",
              uiSize === "lg" ? "right-3.5 size-4.5" : "right-3 size-4",
            )}
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.08 1.04l-4.24 4.65a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    );
  },
);

Select.displayName = "Select";
