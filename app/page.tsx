import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { PropertyCarousel } from "@/components/ui/property-carousel";
import { ZoneCard } from "@/components/ui/zone-card";
import { Callout } from "@/components/ui/callout";
import { Reveal } from "@/components/ui/reveal";
import { HeroVideo } from "@/components/ui/hero-video";
import { InstagramGrid } from "@/components/ui/instagram-grid";
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
      {/* min-h-svh (no dvh): el header (Header.tsx) sigue el borde inferior real
          de este hero durante el scroll — con dvh, la altura del viewport (y por
          lo tanto la del hero) se recalcula sola en mobile cuando la barra de
          direcciones se oculta/aparece al scrollear, haciendo que esa barra
          "salte" en medio de la transición. svh usa el viewport chico (con la
          barra siempre visible), que no cambia durante el scroll. */}
      <section id="home-hero" className="relative flex min-h-svh items-end overflow-hidden bg-brand">
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

      <div className="flex justify-center py-5">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-[13px] text-ink-soft">
          <svg viewBox="0 0 24 24" className="size-4 fill-[#1877F2]" aria-hidden="true">
            <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.16 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.78 8.44-4.94 8.44-9.94Z" />
          </svg>
          <strong className="text-ink">{SITE.facebookRecommendPercent}% recomendado</strong>
          en Facebook ({SITE.facebookReviewCount} reseñas)
        </span>
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

      <section className="bg-brand-dark py-16 text-white">
        <div className="mx-auto max-w-[1240px] px-6 sm:px-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" className="size-7 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4.2" />
                <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
              </svg>
              <div>
                <h2 className="text-white">Seguinos en Instagram</h2>
                <p className="m-0 text-[13.5px] text-[#CCD3D8]">@{SITE.instagramHandle}</p>
              </div>
            </div>
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "onDark", size: "sm" })}
            >
              Seguir en Instagram
            </a>
          </div>

          <Reveal>
            <InstagramGrid />
          </Reveal>
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
