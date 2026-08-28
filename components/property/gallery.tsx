import Image from "next/image";

export interface GalleryProps {
  images: { url: string; alt: string }[];
  title: string;
}

export function Gallery({ images, title }: GalleryProps) {
  const shown = images.length > 0 ? images : [{ url: "/placeholder-property.svg", alt: title }];
  const [main, ...rest] = shown;

  return (
    <div className="mb-6 grid grid-cols-1 gap-2 overflow-hidden rounded-card sm:grid-cols-[2fr_1fr]">
      <div className="relative aspect-[4/3] bg-bg-alt sm:row-span-2">
        <Image src={main.url} alt={main.alt} fill sizes="(min-width: 640px) 60vw, 100vw" className="object-cover" priority />
      </div>
      {rest.slice(0, 2).map((image, index) => (
        <div key={index} className="relative hidden aspect-[16/10] bg-bg-alt sm:block">
          <Image src={image.url} alt={image.alt} fill sizes="30vw" className="object-cover" />
        </div>
      ))}
    </div>
  );
}
