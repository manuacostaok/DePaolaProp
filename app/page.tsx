import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/cn";
import { buttonVariants } from "@/components/ui/button";
import { PropertyCard } from "@/components/ui/property-card";
import { FeaturedProperty } from "@/components/ui/featured-property";
import { ZoneCard } from "@/components/ui/zone-card";
import { AgentCard } from "@/components/ui/agent-card";
import { ArticleCard } from "@/components/ui/article-card";
import { ArchitectureMark } from "@/components/ui/architecture-mark";
import { DriftBand } from "@/components/ui/section-motifs";
import { Callout } from "@/components/ui/callout";
import { Reveal } from "@/components/ui/reveal";
import { HeroIntro } from "@/components/ui/hero-intro";
import { HeroVideo } from "@/components/ui/hero-video";
import { InstagramGrid } from "@/components/ui/instagram-grid";
import { ChapterHeading } from "@/components/ui/chapter-heading";
import { TextLink } from "@/components/ui/text-link";
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
    // 5 = 1 destacada + 4 secundarias, para llenar exacto una fila de
    // lg:grid-cols-4 sin dejar huecos (con 6 sobraba 1 en la segunda fila).
    take: 5,
    include: {
      location: { include: { neighborhood: true } },
      images: { orderBy: { order: "asc" }, take: 1 },
      agent: { select: { name: true, slug: true, photoUrl: true, isPlaceholderPhoto: true } },
    },
  });
}

async function getNeighborhoods() {
  return prisma.neighborhood.findMany({ orderBy: { name: "asc" } });
}

async function getNeighborhoodPropertyCounts() {
  const counts = await prisma.propertyLocation.groupBy({
    by: ["neighborhoodId"],
    where: { property: { status: "ACTIVA" } },
    _count: { _all: true },
  });
  return new Map(counts.map((c) => [c.neighborhoodId, c._count._all]));
}

async function getFeaturedAgents() {
  return prisma.agent.findMany({ where: { isActive: true }, orderBy: { createdAt: "asc" }, take: 3 });
}

async function getLatestArticles() {
  return prisma.article.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
    take: 3,
    include: { category: true },
  });
}

export default async function Home() {
  const [properties, neighborhoods, neighborhoodCounts, agents, articles] = await Promise.all([
    getFeaturedProperties(),
    getNeighborhoods(),
    getNeighborhoodPropertyCounts(),
    getFeaturedAgents(),
    getLatestArticles(),
  ]);

  const [featuredProperty, ...secondaryProperties] = properties;

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
        {/* Composición asimétrica: el titular lidera a la izquierda con
            aire negativo real; la cifra "20" de la derecha (desktop only)
            es el único lugar del Hero donde aparece ese dato — el
            contenido principal no lo repite, ver DESIGN.md Etapa 2. */}
        <div className="relative mx-auto grid w-full max-w-[1240px] gap-x-10 gap-y-12 px-6 pt-16 pb-16 sm:px-8 md:pb-32 lg:grid-cols-[1fr_auto] lg:items-end">
          <HeroIntro className="max-w-3xl">
            <span className="mb-5 block text-[12.5px] font-medium uppercase tracking-[0.14em] text-brand-tint">
              Zona Norte · Buenos Aires
            </span>
            <h1 className="mb-7 text-balance text-[clamp(36px,6vw,72px)] leading-[1.05] text-white">
              Cada casa tiene un barrio detrás. Nosotros lo conocemos primero.
            </h1>
            <p className="mb-9 max-w-lg text-lg text-white/85">
              Liderazgo en Zona Norte — comprá, alquilá o vendé con una mirada que va más allá del metro cuadrado.
            </p>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
              <Link href="/propiedades" className={buttonVariants({ variant: "onDark" })}>
                Ver propiedades
              </Link>
              <Link
                href="/vender/tasacion"
                className="text-[14.5px] font-medium text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
              >
                Tasá tu propiedad
              </Link>
            </div>
          </HeroIntro>
          <div
            className="animate-fade-up hidden shrink-0 self-center border-l border-white/25 py-1 pl-8 motion-reduce:animate-none lg:block"
            style={{ animationDelay: "420ms" }}
          >
            <p className="font-display text-[56px] leading-none text-white">20</p>
            <p className="mt-2 max-w-[9rem] text-[12.5px] uppercase leading-snug tracking-[0.1em] text-white/70">
              Años en Zona Norte
            </p>
          </div>
        </div>
      </section>

      {/* Pausa editorial entre el Hero y el contenido inmobiliario — a
          propósito sin numerar: no es un capítulo temático más (no tiene
          eyebrow/acción como el resto), es un respiro con intención antes
          de arrancar el recorrido. La arquitectura vive como textura muy
          tenue al pie de la sección, nunca como panel de color propio —
          ver ArchitectureMark. Reemplaza la sección "Identidad" anterior
          (texto + panel navy), que el usuario pidió eliminar por completo
          en vez de retocar. */}
      <section className="relative overflow-hidden bg-bg py-28 sm:py-36 lg:py-44">
        <ArchitectureMark
          className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-[220px] w-full max-w-[1600px] text-ink/[0.06] sm:h-[300px] lg:h-[380px]"
        />
        <div className="relative mx-auto max-w-2xl px-6 text-center sm:px-8">
          <Reveal>
            <span className="mx-auto mb-8 block h-px w-12 bg-brand/50" />
            <h2 className="mb-6 text-balance font-display text-[clamp(28px,4.2vw,48px)] leading-[1.2] text-ink">
              Elegimos cada propiedad como quien va a vivir ahí.
            </h2>
            <p className="mx-auto max-w-md text-[15px] text-ink-soft">
              Ninguna publicación es automática — cada una pasa por la misma mirada de barrio.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 01 — Propiedades: una protagonista (foto grande, texto superpuesto)
          + secundarias en grilla chica — no seis cards idénticas. */}
      <section className="bg-bg-alt py-20 sm:py-28">
        <div className="mx-auto max-w-[1240px] px-6 sm:px-8">
          <Reveal>
            <ChapterHeading
              index="01"
              eyebrow="Inventario actual"
              title="Recién publicadas"
              action={
                <Link href="/propiedades" className={buttonVariants({ variant: "outline", size: "sm" })}>
                  Ver todas
                </Link>
              }
            />
          </Reveal>

          <Callout>
            Las dos primeras son propiedades reales de De Paola. Las marcadas &quot;Ejemplo&quot; muestran cómo se
            va a ver la grilla completa una vez cargado el resto del inventario real.
          </Callout>

          {featuredProperty && (
            <Reveal className="mb-10 block">
              <FeaturedProperty
                href={`/propiedades/${featuredProperty.slug}`}
                title={featuredProperty.title}
                neighborhoodName={featuredProperty.location.neighborhood.name}
                price={featuredProperty.price ? Number(featuredProperty.price) : null}
                currency={featuredProperty.currency}
                operationType={featuredProperty.operationType}
                imageUrl={featuredProperty.images[0]?.url ?? "/placeholder-property.svg"}
                imageAlt={featuredProperty.images[0]?.alt ?? featuredProperty.title}
                rooms={featuredProperty.rooms}
                bathrooms={featuredProperty.bathrooms}
                coveredArea={featuredProperty.coveredArea}
              />
            </Reveal>
          )}

          {/* Con el inventario real completo (take: 5 arriba) esto siempre
              llena exacto una fila de 4 — pero si el stock de ACTIVA baja
              de 4 en algún momento, se centra en fila en vez de dejar
              huecos a la derecha, mismo criterio que Agentes/Editorial. */}
          {secondaryProperties.length >= 4 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {secondaryProperties.map((property, i) => (
                <Reveal key={property.id} delayMs={i * 60}>
                  <PropertyCard
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
                    agent={property.agent}
                  />
                </Reveal>
              ))}
            </div>
          ) : (
            secondaryProperties.length > 0 && (
              <div className="flex flex-wrap justify-center gap-6">
                {secondaryProperties.map((property, i) => (
                  <Reveal key={property.id} delayMs={i * 60} className="w-full max-w-[280px]">
                    <PropertyCard
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
                      agent={property.agent}
                    />
                  </Reveal>
                ))}
              </div>
            )
          )}
        </div>
        <DriftBand variant="houses" className="mt-16 text-ink/[0.5]" durationS={44} />
      </section>

      {/* 02 — Zonas: un banner protagonista a todo el ancho + el resto en
          una fila pareja abajo. La versión anterior mezclaba un tile de 2
          columnas con chicos de 1 en una grilla de 3 — con 4 barrios eso
          dejaba un hueco vacío en la segunda fila (2 tiles de 1 col en
          una grilla de 3). Separar el destacado de la fila pareja evita
          el hueco sin importar cuántos barrios haya. La cantidad de
          propiedades reemplaza el tagline genérico ("guía del barrio" ya
          está a un click en la página de cada zona). */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1240px] px-6 sm:px-8">
          <Reveal>
            <ChapterHeading
              index="02"
              eyebrow="Zona Norte"
              title="Explorá el barrio, no solo el listado"
              description="No solo mostramos lo que está en venta: te contamos cómo se vive en cada zona, para que elijas con información real."
            />
          </Reveal>
          {(() => {
            const [featuredZone, ...otherZones] = neighborhoods;
            const zoneTagline = (id: string) => {
              const count = neighborhoodCounts.get(id) ?? 0;
              return count > 0 ? `${count} ${count === 1 ? "propiedad disponible" : "propiedades disponibles"}` : "Ver guía del barrio";
            };
            return (
              <>
                {featuredZone && (
                  <Reveal className="mb-6 block">
                    <ZoneCard
                      href={`/zonas/${featuredZone.slug}`}
                      name={featuredZone.name}
                      tagline={zoneTagline(featuredZone.id)}
                      imageUrl={neighborhoodImage(featuredZone.slug)}
                      imageAlt={featuredZone.name}
                      size="large"
                    />
                  </Reveal>
                )}
                {otherZones.length > 0 && (
                  <div className="grid gap-6 sm:grid-cols-3">
                    {otherZones.map((neighborhood, i) => (
                      <Reveal key={neighborhood.id} delayMs={i * 60}>
                        <ZoneCard
                          href={`/zonas/${neighborhood.slug}`}
                          name={neighborhood.name}
                          tagline={zoneTagline(neighborhood.id)}
                          imageUrl={neighborhoodImage(neighborhood.slug)}
                          imageAlt={neighborhood.name}
                        />
                      </Reveal>
                    ))}
                  </div>
                )}
              </>
            );
          })()}
        </div>
        <DriftBand reverse durationS={60} className="mt-16">
          {(cls) => <ArchitectureMark preserveAspectRatio="xMidYMax slice" className={cn(cls, "text-ink/[0.5]")} />}
        </DriftBand>
      </section>

      {/* 03 — Diferencial */}
      <section className="bg-brand-dark py-20 text-white sm:py-28">
        <div className="mx-auto max-w-[1240px] px-6 sm:px-8">
          <Reveal>
            <ChapterHeading
              index="03"
              eyebrow="Por qué De Paola"
              title="Un solo agente, del primer contacto al cierre"
              description="Nada de pasar de mano en mano dentro del mismo estudio. Quien te atiende conoce la propiedad, el barrio y a vos — y sigue el proceso completo, de la primera visita a la escritura."
              light
            />
          </Reveal>
          <Reveal>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
              <Link href="/vender/tasacion" className={buttonVariants({ variant: "onDark" })}>
                Tasá tu propiedad
              </Link>
              <Link
                href="/nosotros"
                className="text-[14.5px] font-medium text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
              >
                Conocé nuestra historia
              </Link>
            </div>
          </Reveal>
        </div>
        {/* Mismo motivo de skyline que la pausa editorial de arriba, acá
            sí con deriva lenta — la sección de "por qué De Paola"
            (permanencia, un solo agente hasta el cierre) es la única del
            recorrido sin imagen concreta asociada (no es "casas" ni
            "personas"), así que reutiliza la firma visual de la marca en
            vez de inventar una imagen decorativa sin motivo. */}
        <DriftBand durationS={64} heightClassName="h-[150px] sm:h-[190px]" className="mt-16">
          {(cls) => <ArchitectureMark preserveAspectRatio="xMidYMax slice" className={cn(cls, "text-white/[0.4]")} />}
        </DriftBand>
      </section>

      {/* 04 — Agentes */}
      {agents.length > 0 && (
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-[1240px] px-6 sm:px-8">
            <Reveal>
              <ChapterHeading
                index="04"
                eyebrow="Nuestro equipo"
                title="Un especialista por barrio, no un call center"
                action={<TextLink href="/equipo">Ver todo el equipo</TextLink>}
              />
            </Reveal>
            {/* El equipo real hoy tiene un solo agente cargado — un grid de
                3 columnas con 1 item deja dos huecos vacíos. Con menos de
                3, se centra en fila (flex) en vez de "colgar" a la
                izquierda; con 3 o más queda la grilla pareja de siempre. */}
            {agents.length >= 3 ? (
              <div className="grid gap-8 sm:grid-cols-3">
                {agents.map((agent, i) => (
                  <Reveal key={agent.id} delayMs={i * 60}>
                    <AgentCard
                      href={`/equipo/${agent.slug}`}
                      name={agent.name}
                      title={agent.title}
                      photoUrl={agent.photoUrl}
                      isPlaceholderPhoto={agent.isPlaceholderPhoto}
                    />
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-8">
                {agents.map((agent, i) => (
                  <Reveal key={agent.id} delayMs={i * 60} className="w-full max-w-[260px]">
                    <AgentCard
                      href={`/equipo/${agent.slug}`}
                      name={agent.name}
                      title={agent.title}
                      photoUrl={agent.photoUrl}
                      isPlaceholderPhoto={agent.isPlaceholderPhoto}
                    />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
          <DriftBand variant="people" className="mt-16 text-ink/[0.5]" durationS={48} />
        </section>
      )}

      {/* 05 — Editorial */}
      {articles.length > 0 && (
        <section className="bg-bg-alt py-20 sm:py-28">
          <div className="mx-auto max-w-[1240px] px-6 sm:px-8">
            <Reveal>
              <ChapterHeading
                index="05"
                eyebrow="Editorial"
                title="Criterio de zona, no contenido genérico"
                action={<TextLink href="/insights">Ver todos los artículos</TextLink>}
              />
            </Reveal>
            {/* Mismo criterio que Agentes: con 3+ artículos la grilla pareja
                de siempre, con menos se centra en fila para no dejar
                huecos. */}
            {articles.length >= 3 ? (
              <div className="grid gap-8 sm:grid-cols-3">
                {articles.map((article, i) => (
                  <Reveal key={article.id} delayMs={i * 60}>
                    <ArticleCard
                      href={`/insights/${article.slug}`}
                      title={article.title}
                      categoryName={article.category.name}
                      imageUrl={article.coverImageUrl ?? "/placeholder-property.svg"}
                      imageAlt={article.title}
                      publishedAt={article.publishedAt?.toLocaleDateString("es-AR")}
                    />
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-8">
                {articles.map((article, i) => (
                  <Reveal key={article.id} delayMs={i * 60} className="w-full max-w-[320px]">
                    <ArticleCard
                      href={`/insights/${article.slug}`}
                      title={article.title}
                      categoryName={article.category.name}
                      imageUrl={article.coverImageUrl ?? "/placeholder-property.svg"}
                      imageAlt={article.title}
                      publishedAt={article.publishedAt?.toLocaleDateString("es-AR")}
                    />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
          <DriftBand variant="documents" reverse className="mt-16 text-ink/[0.5]" durationS={50} />
        </section>
      )}

      {/* 06 — Contacto */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1240px] px-6 sm:px-8">
          <Reveal>
            <ChapterHeading index="06" eyebrow="Contacto" title="¿Cuánto vale tu propiedad?" />
          </Reveal>
          <Reveal>
            <div className="mb-16 flex flex-wrap items-center justify-between gap-6 rounded-card bg-brand p-8 text-white sm:p-12">
              <p className="max-w-md text-[#D7DEE5]">Coordiná una tasación profesional con nuestro equipo, sin costo ni compromiso.</p>
              <Link
                href="/vender/tasacion"
                className={buttonVariants({ variant: "outline", className: "border-white bg-white text-brand-dark" })}
              >
                Tasar mi propiedad
              </Link>
            </div>
          </Reveal>

          <Reveal>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <p className="text-[13px] uppercase tracking-[0.1em] text-ink-soft">
                Seguinos en Instagram · @{SITE.instagramHandle}
              </p>
              <a
                href={SITE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14.5px] font-medium text-brand-dark underline decoration-brand-dark/30 underline-offset-4 hover:decoration-brand-dark"
              >
                Ver perfil
              </a>
            </div>
            <InstagramGrid />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
