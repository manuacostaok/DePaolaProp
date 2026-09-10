import Image from "next/image";
import Link from "next/link";

export interface AgentCardProps {
  href: string;
  name: string;
  title: string | null;
  photoUrl: string | null;
  isPlaceholderPhoto: boolean;
  isSample?: boolean;
}

export function AgentCard({ href, name, title, photoUrl, isPlaceholderPhoto, isSample = false }: AgentCardProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <Link href={href} className="group block">
      {!isPlaceholderPhoto && photoUrl ? (
        <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-card bg-bg-alt">
          <Image
            src={photoUrl}
            alt={name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
            className="object-cover transition-transform duration-[430ms] ease-brand group-hover:scale-[1.06]"
          />
          {/* Mismo criterio que PropertyCard: nunca presentar una persona
              de ejemplo como si fuera parte real del equipo. */}
          {isSample && (
            <span className="pointer-events-none absolute bottom-3 left-3 rounded-[3px] bg-ink/[0.82] px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-white">
              Ejemplo
            </span>
          )}
        </div>
      ) : (
        <div className="mb-4 flex aspect-[3/4] items-center justify-center rounded-card bg-brand-tint font-display text-4xl text-brand-dark">
          {initials}
        </div>
      )}
      <p className="font-display text-[17px] text-ink group-hover:text-brand-dark">{name}</p>
      {title && <p className="text-[13px] text-ink-soft">{title}</p>}
    </Link>
  );
}
