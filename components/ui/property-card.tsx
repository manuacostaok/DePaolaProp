"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";

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
  return (
    <Card className={isSample ? "opacity-[0.55]" : undefined}>
      <div className="relative aspect-[4/3] overflow-hidden bg-bg-alt">
        <Link href={href} className="absolute inset-0 block">
          <Image src={imageUrl} alt={imageAlt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
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
      <CardBody className="p-6">
        <p className="mb-1 font-display text-[22px] text-brand-dark">{formatPrice(price, currency)}</p>
        <Link href={href} className="mb-1 block text-[15px] font-semibold text-ink hover:text-brand-dark">
          {title}
        </Link>
        <p className="mb-2.5 text-[13.5px] text-ink-soft">{neighborhoodName}</p>
        <div className="flex gap-3.5 border-t border-line pt-2.5 text-[13px] text-ink-soft">
          {rooms != null && <span>{rooms} amb.</span>}
          {bathrooms != null && <span>{bathrooms} baños</span>}
          {coveredArea != null && <span>{coveredArea} m²</span>}
        </div>
      </CardBody>
    </Card>
  );
}
