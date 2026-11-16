import Image from "next/image";
import Link from "next/link";

export interface PropertyTypeTile {
  label: string;
  href: string;
  count: number;
  imageSrc: string;
  imageAlt: string;
}

// Atajo típico de portal inmobiliario: entrar por tipo de propiedad en un
// toque. Cada baldosa es una foto real de una propiedad de De Paola con el
// conteo vivo del inventario — si un tipo no tiene propiedades activas no
// se muestra, para no mandar a una búsqueda vacía.
export function PropertyTypeTiles({ tiles }: { tiles: PropertyTypeTile[] }) {
  const visible = tiles.filter((t) => t.count > 0);
  if (visible.length === 0) return null;

  return (
    <nav aria-label="Buscar por tipo de propiedad" className="mb-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {visible.map((tile) => (
        <Link
          key={tile.label}
          href={tile.href}
          className="group relative block aspect-[4/3] overflow-hidden rounded-card bg-brand-dark outline-offset-2 sm:aspect-[5/4]"
        >
          <Image
            src={tile.imageSrc}
            alt={tile.imageAlt}
            fill
            sizes="(min-width: 1024px) 22vw, 50vw"
            className="object-cover transition-transform duration-[430ms] ease-brand group-hover:scale-[1.06] group-active:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/85 via-brand-dark/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
            <span className="font-display text-[clamp(19px,2.4vw,24px)] leading-tight text-white">{tile.label}</span>
            <span className="shrink-0 text-[12.5px] text-white/85">
              {tile.count} {tile.count === 1 ? "propiedad" : "propiedades"}
            </span>
          </div>
        </Link>
      ))}
    </nav>
  );
}
