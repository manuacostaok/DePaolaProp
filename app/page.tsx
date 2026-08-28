import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { PropertyCarousel } from "@/components/ui/property-carousel";
import { ZoneCard } from "@/components/ui/zone-card";
import { Callout } from "@/components/ui/callout";
import { Reveal } from "@/components/ui/reveal";
import { HeroVideo } from "@/components/ui/hero-video";
import { neighborhoodImage } from "@/lib/neighborhood-images";
import { SITE } from "@/lib/nav";

const HERO_POSTER =
  "https://static.wixstatic.com/media/c9cb98_b4fa934656eb46c799f51dfb47964edb~mv2_d_3238_1347_s_2.png/v1/fill/w_2400,h_998,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c9cb98_b4fa934656eb46c799f51dfb47964edb~mv2_d_3238_1347_s_2.png";

// ISR: evita pegarle a Postgres en cada visita a la página más
// concurrida del sitio (Fase 16 — LCP crítico en Home).
export const revalidate = 60;

async function getFeaturedProperties() {
  return prisma.property.findMany({
    where: { status: "ACTIVA" },
    orderBy: [{ isSample: "asc" }, { publishedAt: "desc" }],
    take: 6,
    include: {
      location: { include: { neighborhood: true } },
      images: { orderBy: { order: "asc" }, take: 1 },
    },
  });
}

async function getNeighborhoods() {
  return prisma.neighborhood.findMany({ orderBy: { name: "asc" } });
}

export default async function Home() {
  const [properties, neighborhoods] = await Promise.all([getFeaturedProperties(), getNeighborhoods()]);

  return (
    <main>
      <section className="relative flex min-h-dvh items-end overflow-hidden bg-brand">
        <HeroVideo posterUrl={HERO_POSTER} className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand from-10% via-brand/55 via-45% to-brand/10" />
        <div className="animate-fade-up relative mx-auto w-full max-w-[1240px] px-6 pt-16 pb-16 sm:px-8 md:pb-32">
          <span className="mb-4 block text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand-tint">
            Zona Norte · Buenos Aires
          </span>
          <h1 className="mb-6 max-w-3xl text-[clamp(34px,5vw,64px)] text-white">
            20 años acompañando cada operación inmobiliaria de Zona Norte.
          </h1>
          <p className="mb-8 max-w-xl text-lg text-white/85">
            Martínez, Florida, Vicente López y Villa Martelli. Comprá, alquilá o vendé con la inmobiliaria que
            conoce el barrio casa por casa.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/propiedades" className={buttonVariants({ variant: "onDark" })}>
              Ver propiedades
            </Link>
            <Link
              href="/vender/tasacion"
              className={buttonVariants({ variant: "outline", className: "border-white/55 bg-white/10 text-white" })}
            >
              Tasá tu propiedad
            </Link>
          </div>
        </div>
      </section>

      <div className="bg-brand-dark py-3.5 text-[#EFE9DC]">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-center gap-8 px-6 text-[13px] tracking-wide sm:px-8">
          <span>
            <strong className="text-white">20 años</strong> de trayectoria
          </span>
          <span>
            <strong className="text-white">2</strong> sucursales en Zona Norte
          </span>
          <span>
            Publicamos en <strong className="text-white">Zonaprop · Argenprop · Mercado Libre · Clarín</strong>
          </span>
        </div>
      </div>

      <section className="py-16">
        <div className="mx-auto max-w-[1240px] px-6 sm:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="mb-2 block text-[12.5px] font-semibold uppercase tracking-wider text-brand">
                Últimas propiedades
              </span>
              <h2 className="text-[clamp(26px,3vw,36px)]">Recién publicadas</h2>
            </div>
            <Link href="/propiedades" className={buttonVariants({ variant: "outline", size: "sm" })}>
              Ver todas
            </Link>
          </div>

          <Callout>
            Las dos primeras son propiedades reales de De Paola. Las marcadas &quot;Ejemplo&quot; muestran cómo se
            va a ver la grilla completa una vez cargado el resto del inventario real.
          </Callout>

          <Reveal>
            <PropertyCarousel
              properties={properties.map((property) => ({
                id: property.id,
                href: `/propiedades/${property.slug}`,
                title: property.title,
                neighborhoodName: property.location.neighborhood.name,
                price: property.price ? Number(property.price) : null,
                currency: property.currency,
                operationType: property.operationType,
                imageUrl: property.images[0]?.url ?? "/placeholder-property.svg",
                imageAlt: property.images[0]?.alt ?? property.title,
                rooms: property.rooms,
                bathrooms: property.bathrooms,
                coveredArea: property.coveredArea,
                isSample: property.isSample,
              }))}
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-bg-alt py-16">
        <div className="mx-auto max-w-[1240px] px-6 sm:px-8">
          <span className="mb-2 block text-[12.5px] font-semibold uppercase tracking-wider text-brand">
            Zona Norte
          </span>
          <h2 className="mb-3 text-[clamp(26px,3vw,36px)]">Conocé cada barrio antes de decidir</h2>
          <p className="mb-8 max-w-xl">
            No solo mostramos lo que está en venta: te contamos cómo se vive en cada zona, para que elijas con
            información real, no solo con un listado de precios.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {neighborhoods.map((neighborhood, i) => (
              <Reveal key={neighborhood.id} delayMs={i * 60}>
                <ZoneCard
                  href={`/zonas/${neighborhood.slug}`}
                  name={neighborhood.name}
                  tagline="Ver propiedades y guía del barrio"
                  imageUrl={neighborhoodImage(neighborhood.slug)}
                  imageAlt={neighborhood.name}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-dark py-16 text-center text-white">
        <div className="mx-auto max-w-[560px] px-6 sm:px-8">
          <svg viewBox="0 0 24 24" className="mx-auto mb-5 size-9" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4.2" />
            <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
          </svg>
          <h2 className="mb-2 text-white">Seguinos en Instagram</h2>
          <p className="mb-6 text-[#CCD3D8]">
            Propiedades nuevas, recorridos y novedades de Zona Norte todos los días en @{SITE.instagramHandle}.
          </p>
          <a
            href={SITE.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "onDark" })}
          >
            Seguir @{SITE.instagramHandle}
          </a>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-[1240px] px-6 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-card bg-brand p-8 text-white sm:p-12">
            <div>
              <h2 className="mb-1.5 text-white">¿Cuánto vale tu propiedad?</h2>
              <p className="m-0 text-[#D7DEE5]">Coordiná una tasación profesional con nuestro equipo, sin costo ni compromiso.</p>
            </div>
            <Link
              href="/vender/tasacion"
              className={buttonVariants({ variant: "outline", className: "border-white bg-white text-brand-dark" })}
            >
              Tasar mi propiedad
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
