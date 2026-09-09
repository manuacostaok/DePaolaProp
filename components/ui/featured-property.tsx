import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

export interface FeaturedPropertyProps {
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
}

// La pieza protagonista de "Propiedades" en Home — foto grande estilo
// portada de revista con el texto superpuesto, no otra card más del
// mismo tamaño que las demás. DESIGN.md Etapa 2, iteración 2: "property
// feature + secondary properties" en vez de grid uniforme.
export function FeaturedProperty({
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
}: FeaturedPropertyProps) {
  const specs = [
    rooms != null ? `${rooms} amb.` : null,
    bathrooms != null ? `${bathrooms} baños` : null,
    coveredArea != null ? `${coveredArea} m²` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link href={href} className="group relative block overflow-hidden rounded-card bg-bg-alt">
      <div className="relative aspect-[4/3] sm:aspect-[21/10]">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover transition-transform duration-[430ms] ease-brand group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 from-10% via-black/15 via-50% to-transparent" />
      </div>
      <div className="absolute inset-x-6 bottom-6 text-white sm:inset-x-10 sm:bottom-10">
        <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.12em] text-white/75">
          {operationType === "VENTA" ? "Venta" : "Alquiler"} · {neighborhoodName}
        </span>
        <h3 className="mb-2 max-w-xl text-balance font-display text-[clamp(24px,3.4vw,40px)] leading-tight text-white">
          {title}
        </h3>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <p className="font-display text-[22px] sm:text-[26px]">{formatPrice(price, currency)}</p>
          {specs && <p className="text-[13px] text-white/75">{specs}</p>}
        </div>
      </div>
    </Link>
  );
}
