import { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Callout({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mb-6 rounded-control border border-dashed border-[#9FB6AC] bg-brand-tint px-4 py-3 text-sm text-brand-dark",
        className,
      )}
      {...props}
    />
  );
}
