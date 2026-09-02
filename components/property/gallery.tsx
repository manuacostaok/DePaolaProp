import Image from "next/image";

export interface GalleryProps {
  images: { url: string; alt: string }[];
  title: string;
}

export function Gallery({ images, title }: GalleryProps) {
  const shown = images.length > 0 ? images : [{ url: "/placeholder-property.svg", alt: title }];
  const [main, ...rest] = shown;

  return (
    <>
      {/* Mobile: carrusel swipeable con TODAS las fotos (scroll-snap nativo,
          sin librería nueva) — antes esta vista solo mostraba la principal,
          el resto quedaba con hidden sm:block, invisible e inalcanzable en
          mobile. Las imágenes sin `priority` no cargan mientras su
          contenedor está en display:none (la versión de desktop de abajo,
          oculta en mobile), así que no se duplica la descarga. */}
      <div className="mb-6 flex snap-x snap-mandatory gap-2 overflow-x-auto rounded-card sm:hidden">
        {shown.map((image, index) => (
          <div key={index} className="relative aspect-[4/3] w-full flex-shrink-0 snap-center bg-bg-alt">
            <Image src={image.url} alt={image.alt} fill sizes="100vw" className="object-cover" priority={index === 0} />
          </div>
        ))}
      </div>

      {/* Desktop: grid sin cambios respecto al diseño original. */}
      <div className="mb-6 hidden gap-2 overflow-hidden rounded-card sm:grid sm:grid-cols-[2fr_1fr]">
        <div className="relative aspect-[4/3] bg-bg-alt sm:row-span-2">
          <Image src={main.url} alt={main.alt} fill sizes="60vw" className="object-cover" priority />
        </div>
        {rest.slice(0, 2).map((image, index) => (
          <div key={index} className="relative aspect-[16/10] bg-bg-alt">
            <Image src={image.url} alt={image.alt} fill sizes="30vw" className="object-cover" />
          </div>
        ))}
      </div>
    </>
  );
}
