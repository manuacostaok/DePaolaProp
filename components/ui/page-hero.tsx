import Image from "next/image";

// Cabecera de las páginas de captación (Vender, Invertir, Contacto): texto
// alineado a la izquierda sobre azul de marca y una foto real de una
// propiedad de De Paola ocupando el borde derecho. En mobile la foto va
// arriba como franja, para que la primera pantalla ya muestre una casa y
// no solo un bloque de texto.
export function PageHero({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="grid bg-brand-dark text-white lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <div className="relative order-first h-52 sm:h-72 lg:order-last lg:h-auto lg:min-h-[420px]">
        <Image src={imageSrc} alt={imageAlt} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/55 to-transparent lg:bg-gradient-to-r lg:from-brand-dark/60 lg:via-transparent lg:to-transparent" />
      </div>
      <div className="flex items-center px-6 py-12 sm:px-8 lg:py-16 lg:pl-[max(2rem,calc((100vw-1240px)/2+2rem))] lg:pr-14">
        <div className="max-w-xl">
          <span className="mb-4 block text-[12.5px] font-semibold uppercase tracking-[0.12em] text-[#DCDEE7]">{eyebrow}</span>
          <h1 className="mb-5 text-balance text-[clamp(30px,4.4vw,52px)] leading-[1.08] text-white">{title}</h1>
          <p className="text-[17px] leading-relaxed text-[#EDEAE0]">{description}</p>
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}
