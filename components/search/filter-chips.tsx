"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export interface FilterChip {
  // Params a quitar de la URL al hacer click en la × de este chip. Casi
  // siempre uno solo, salvo el chip de precio (precioMin + precioMax
  // juntos bajo un solo chip).
  keysToRemove: string[];
  // Para params multi-valor (caracteristicas): solo se quita ESTE valor
  // puntual, no todo el param.
  value?: string;
  label: string;
}

export function FilterChips({ basePath, chips }: { basePath: string; chips: FilterChip[] }) {
  const searchParams = useSearchParams();

  if (chips.length === 0) return null;

  function hrefWithout(chip: FilterChip) {
    const params = new URLSearchParams(searchParams.toString());
    for (const key of chip.keysToRemove) {
      if (chip.value != null) {
        const remaining = params.getAll(key).filter((v) => v !== chip.value);
        params.delete(key);
        for (const v of remaining) params.append(key, v);
      } else {
        params.delete(key);
      }
    }
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {chips.map((chip, index) => (
        <Link
          key={`${chip.keysToRemove.join(",")}-${chip.value ?? index}`}
          href={hrefWithout(chip)}
          className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[13px] text-ink hover:border-brand-dark"
        >
          {chip.label}
          <span aria-hidden="true">×</span>
        </Link>
      ))}
      <Link href={basePath} className="text-[13px] text-ink-soft underline">
        Limpiar filtros
      </Link>
    </div>
  );
}
