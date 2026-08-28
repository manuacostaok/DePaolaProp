import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { PropertyCard } from "@/components/ui/property-card";
import { ZoneCard } from "@/components/ui/zone-card";
import { Callout } from "@/components/ui/callout";

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
      <section
        className="relative flex min-h-[560px] items-end bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://static.wixstatic.com/media/c9cb98_3e01d1892099477eb7ec2df49fcfc858~mv2.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(23,30,26,0.72)] via-[rgba(23,30,26,0.28)] to-[rgba(23,30,26,0.12)]" />
        <div className="relative mx-auto w-full max-w-[1240px] px-6 py-16 sm:px-8">
          <span className="mb-4 block text-[12.5px] font-semibold uppercase tracking-[0.12em] text-[#DCE7DE]">
            Zona Norte · Buenos Aires
          </span>
          <h1 className="mb-6 max-w-3xl text-[clamp(34px,5vw,64px)] text-white">
            20 años acompañando cada operación inmobiliaria de Zona Norte.
          </h1>
          <p className="mb-8 max-w-xl text-lg text-[#EDEAE0]">
            Martínez, Florida, Vicente López y Villa Martelli. Comprá, alquilá o vendé con la inmobiliaria que
            conoce el barrio casa por casa.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/propiedades" className={buttonVariants()}>
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

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                href={`/propiedades/${property.slug}`}
                title={property.title}
                neighborhoodName={property.location.neighborhood.name}
                price={property.price ? Number(property.price) : null}
                currency={property.currency}
                operationType={property.operationType}
                imageUrl={property.images[0]?.url ?? "/placeholder-property.svg"}
                imageAlt={property.images[0]?.alt ?? property.title}
                rooms={property.rooms}
                bathrooms={property.bathrooms}
                coveredArea={property.coveredArea}
                isSample={property.isSample}
              />
            ))}
          </div>
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
            {neighborhoods.map((neighborhood) => (
              <ZoneCard
                key={neighborhood.id}
                href={`/zonas/${neighborhood.slug}`}
                name={neighborhood.name}
                tagline="Ver propiedades y guía del barrio"
                imageUrl={
                  neighborhood.slug === "martinez"
                    ? "https://static.wixstatic.com/media/c9cb98_2c608b2c29844a18aa9509201ab2c19b~mv2_d_2896_1848_s_2.jpg"
                    : neighborhood.slug === "vicente-lopez"
                      ? "https://static.wixstatic.com/media/c9cb98_d63461bb0c4e498fba692a68ed105b0f~mv2_d_2400_1350_s_2.jpg"
                      : neighborhood.slug === "villa-martelli"
                        ? "https://static.wixstatic.com/media/c9cb98_faadf4b7b7144845a7287837ea4715dd~mv2_d_8112_3759_s_4_2.jpg"
                        : "https://static.wixstatic.com/media/c9cb98_93684e9ee93f48d0a0da1ff0dc8aca81f002.jpg"
                }
                imageAlt={neighborhood.name}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-[1240px] px-6 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-card bg-brand p-8 text-white sm:p-12">
            <div>
              <h2 className="mb-1.5 text-white">¿Cuánto vale tu propiedad?</h2>
              <p className="m-0 text-[#D7E3DC]">Coordiná una tasación profesional con nuestro equipo, sin costo ni compromiso.</p>
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
