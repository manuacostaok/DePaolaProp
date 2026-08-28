import Image from "next/image";
import Link from "next/link";

export interface AgentCardProps {
  href: string;
  name: string;
  title: string | null;
  photoUrl: string | null;
  isPlaceholderPhoto: boolean;
}

export function AgentCard({ href, name, title, photoUrl, isPlaceholderPhoto }: AgentCardProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <Link href={href} className="text-center">
      {!isPlaceholderPhoto && photoUrl ? (
        <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-card">
          <Image src={photoUrl} alt={name} fill className="object-cover" />
        </div>
      ) : (
        <div className="mb-3 flex aspect-[3/4] items-center justify-center rounded-card bg-brand-tint text-4xl font-semibold text-brand-dark">
          {initials}
        </div>
      )}
      <p className="font-semibold text-ink">{name}</p>
      {title && <p className="text-sm text-ink-soft">{title}</p>}
    </Link>
  );
}
