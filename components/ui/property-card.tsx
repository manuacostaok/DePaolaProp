"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

export interface PropertyCardProps {
  href: string;
  title: string;
  neighborhoodName: string;
  price: number | null;
  currency: "ARS" | "USD" | null;
  operationType: "VENTA" | "ALQUILER";
  imageUrl: string;
  imageAlt: string;
  rooms?: number | null;
  bathrooms?: number | null;
  coveredArea?: number | null;
  isSample?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function PropertyCard({
  href,
  title,
  neighborhoodName,
  price,
  currency,
  operationType,
  imageUrl,
  imageAlt,
  rooms,
  bathrooms,
  coveredArea,
  isSample = false,
  isFavorite = false,
  onToggleFavorite,
}: PropertyCardProps) {
  const specs = [
    rooms != null ? `${rooms} amb.` : null,
    bathrooms != null ? `${bathrooms} baños` : null,
    coveredArea != null ? `${coveredArea} m²` : null,
  ].filter(Boolean);

  return (
    <div className="group">
      <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-bg-alt">
        <Link href={href} className="absolute inset-0 block">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className={cn(
              "object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]",
              isSample && "opacity-[0.55]",
            )}
          />
        </Link>
        <Badge className="pointer-events-none absolute left-3 top-3">
          {operationType === "VENTA" ? "Venta" : "Alquiler"}
        </Badge>
        {isSample && (
          <span className="pointer-events-none absolute bottom-3 left-3 rounded-[3px] bg-ink/[0.82] px-2 py-1 text-[10.5px] font-semibold uppercase tracking-wider text-white">
            Ejemplo
          </span>
        )}
        {onToggleFavorite && (
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
            className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/90 text-base"
          >
            {isFavorite ? "♥" : "♡"}
          </button>
        )}
      </div>
      <div className="pt-4">
        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
          {neighborhoodName}
        </span>
        <Link href={href} className="mb-1.5 block text-[16px] font-medium text-ink hover:text-brand-dark">
          {title}
        </Link>
        <p className="mb-2 font-display text-[21px] text-brand-dark">{formatPrice(price, currency)}</p>
        {specs.length > 0 && (
          <p className="text-[12.5px] uppercase tracking-wide text-ink-soft">{specs.join(" · ")}</p>
        )}
      </div>
    </div>
  );
}
