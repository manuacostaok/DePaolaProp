import Image from "next/image";
import Link from "next/link";

export interface ArticleCardProps {
  href: string;
  title: string;
  categoryName: string;
  imageUrl: string;
  imageAlt: string;
  publishedAt?: string;
}

// Foto-primero + bloque tipográfico, misma familia que PropertyCard/ZoneCard
// — reemplaza la card blanca con borde + sombra (el "card kit" genérico) que
// tenía antes, ver DESIGN.md Etapa 2.
export function ArticleCard({ href, title, categoryName, imageUrl, imageAlt, publishedAt }: ArticleCardProps) {
  return (
    <Link href={href} className="group block">
      <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-card bg-bg-alt">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition-transform duration-[430ms] ease-brand group-hover:scale-[1.08]"
        />
      </div>
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-brand">{categoryName}</span>
      <h3 className="mb-1 font-display text-[19px] leading-snug text-ink group-hover:text-brand-dark">{title}</h3>
      {publishedAt && <span className="text-[13px] text-ink-soft">{publishedAt}</span>}
    </Link>
  );
}
