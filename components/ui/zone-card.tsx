import Image from "next/image";
import Link from "next/link";

export interface ZoneCardProps {
  href: string;
  name: string;
  tagline: string;
  imageUrl: string;
  imageAlt: string;
}

export function ZoneCard({ href, name, tagline, imageUrl, imageAlt }: ZoneCardProps) {
  return (
    <Link href={href} className="group relative block aspect-[4/5] overflow-hidden rounded-card">
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        sizes="(min-width: 768px) 25vw, 50vw"
        className="object-cover transition-transform duration-[430ms] ease-brand group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/85 from-5% via-brand-dark/20 via-50% to-transparent" />
      <div className="absolute inset-x-6 bottom-6 text-white">
        <h3 className="mb-1 text-[26px] text-white">{name}</h3>
        <span className="text-[13px] text-white/75">{tagline}</span>
      </div>
    </Link>
  );
}
