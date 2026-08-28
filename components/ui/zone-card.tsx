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
        className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,26,22,0.82)] via-[rgba(20,26,22,0.15)] to-transparent" />
      <div className="absolute inset-x-6 bottom-6 text-white">
        <h3 className="mb-0.5 text-white">{name}</h3>
        <span className="text-[13px] text-[#DADEE3]">{tagline}</span>
      </div>
    </Link>
  );
}
