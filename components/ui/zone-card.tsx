import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

export interface ZoneCardProps {
  href: string;
  name: string;
  tagline: string;
  imageUrl: string;
  imageAlt: string;
  // "large": la pieza protagonista del mosaico de zonas en Home — mismo
  // componente, aspecto más panorámico y tipografía más grande en vez de
  // un tile más entre cuatro iguales.
  size?: "default" | "large";
  className?: string;
}

export function ZoneCard({ href, name, tagline, imageUrl, imageAlt, size = "default", className }: ZoneCardProps) {
  const large = size === "large";

  return (
    <Link
      href={href}
      className={cn(
        "group relative block overflow-hidden rounded-card",
        large ? "aspect-[16/11] sm:aspect-[16/9]" : "aspect-[4/5]",
        className,
      )}
    >
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        sizes={large ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
        className="object-cover transition-transform duration-[430ms] ease-brand group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/85 from-5% via-brand-dark/20 via-50% to-transparent" />
      <div className={cn("absolute inset-x-6 text-white", large ? "bottom-8" : "bottom-6")}>
        <h3 className={cn("mb-1 text-white", large ? "text-[34px] sm:text-[40px]" : "text-[26px]")}>{name}</h3>
        <span className={cn("text-white/75", large ? "text-[14.5px]" : "text-[13px]")}>{tagline}</span>
      </div>
    </Link>
  );
}
