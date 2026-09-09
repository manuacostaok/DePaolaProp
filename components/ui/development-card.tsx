import Image from "next/image";
import Link from "next/link";
import type { ConstructionStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { CONSTRUCTION_STATUS_LABELS } from "@/lib/development-options";

export interface DevelopmentCardProps {
  href: string;
  name: string;
  tagline: string | null;
  neighborhoodName: string;
  totalUnits: number | null;
  unitTypes: string | null;
  imageUrl: string;
  imageAlt: string;
  // Opcional: hoy ningún emprendimiento real tiene este dato cargado — el
  // badge simplemente no aparece hasta que se cargue.
  constructionStatus?: ConstructionStatus | null;
}

export function DevelopmentCard({
  href,
  name,
  tagline,
  neighborhoodName,
  totalUnits,
  unitTypes,
  imageUrl,
  imageAlt,
  constructionStatus,
}: DevelopmentCardProps) {
  const specs = [totalUnits != null ? `${totalUnits} unidades` : null, unitTypes].filter(Boolean);

  return (
    <div className="group">
      <div className="relative aspect-[16/10] overflow-hidden rounded-card bg-bg-alt">
        <Link href={href} className="absolute inset-0 block">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
          />
        </Link>
        <span className="pointer-events-none absolute left-3 top-3 rounded-[3px] bg-bg/90 px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-[0.12em] text-brand-dark backdrop-blur-[2px]">
          Emprendimiento
        </span>
        {constructionStatus && (
          <Badge variant="outline" className="pointer-events-none absolute right-3 top-3 bg-white">
            {CONSTRUCTION_STATUS_LABELS[constructionStatus]}
          </Badge>
        )}
      </div>
      <div className="pt-4">
        <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.1em] text-ink-soft">
          {neighborhoodName}
        </span>
        <Link href={href} className="mb-1.5 block font-display text-[19px] leading-snug text-ink hover:text-brand-dark">
          {name}
        </Link>
        {tagline && <p className="mb-2 text-[14.5px] text-ink-soft">{tagline}</p>}
        {specs.length > 0 && (
          <p className="text-[12.5px] uppercase tracking-wide text-ink-soft">{specs.join(" · ")}</p>
        )}
      </div>
    </div>
  );
}
