"use client";

import { InputHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ink">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          className={cn(
            "rounded-control border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/70",
            "outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-tint",
            error ? "border-alert" : "border-line",
            className,
          )}
          {...props}
        />
        {error && <span className="text-xs text-alert">{error}</span>}
      </div>
    );
  },
);

Input.displayName = "Input";
