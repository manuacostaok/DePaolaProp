import { PrismaClient, OperationType, PropertyType, PropertyCondition } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Datos reales de De Paola Propiedades (brief, sección 5) — no son de ejemplo,
// por eso se siembran directo acá en vez de quedar hardcodeados en componentes.
async function seedOfficesAndAgent() {
  await prisma.office.upsert({
    where: { id: "office-villa-martelli" },
    update: {},
    create: {
      id: "office-villa-martelli",
      name: "Villa Martelli",
      address: "Av. Laprida 3731, Villa Martelli",
      phone: "4709-1179",
      whatsapp: "+5491128755265",
      email: "contacto@depaolapropiedades.com",
    },
  });

  await prisma.office.upsert({
    where: { id: "office-florida" },
    update: {},
    create: {
      id: "office-florida",
      name: "Florida",
      address: "Av. San Martín 2890 esq. Beiro, Vicente López",
      phone: "4709-6164",
      whatsapp: "+5491128755265",
      email: "contacto@depaolapropiedades.com",
    },
  });

  await prisma.agent.upsert({
    where: { slug: "tatiana-de-paola" },
    update: {},
    create: {
      slug: "tatiana-de-paola",
      name: "Tatiana De Paola",
      title: "Fundadora",
      photoUrl: "https://static.wixstatic.com/media/c9cb98_ea6951b2401e4b199e3e7b8eca0d94d0~mv2.jpg",
      isPlaceholderPhoto: false,
      bio: "Soy una empresaria joven que trabaja hace veinte años haciendo lo que más me gusta. Me apasiona lo que hago y eso se refleja en todas las negociaciones. Deseo que en cada operación inmobiliaria encuentren en mí una asesora de confianza con la que puedan contar, alguien que estará acompañándolos desde el principio hasta el final, porque entiendo que detrás de cada trato que se cierra hay un sueño por cumplir, un hogar por habitar.",
      whatsapp: "+5491128755265",
      email: "contacto@depaolapropiedades.com",
      office: { connect: { id: "office-villa-martelli" } },
      isSample: false,
    },
  });
}

// Coordenadas aproximadas a nivel de centro de zona (conocimiento general,
// no geocoding real) — placeholder honesto hasta tener un proveedor de mapas
// configurado. TODO: reemplazar por geocoding real cuando haya API key.
export const NEIGHBORHOOD_COORDS: Record<string, { lat: number; lng: number }> = {
  martinez: { lat: -34.4913, lng: -58.5001 },
  florida: { lat: -34.527, lng: -58.4919 },
  "vicente-lopez": { lat: -34.5266, lng: -58.4779 },
  "villa-martelli": { lat: -34.5375, lng: -58.5064 },
};

function jitter(base: { lat: number; lng: number }, seedIndex: number) {
  const offset = ((seedIndex % 7) - 3) * 0.0025;
  return { lat: base.lat + offset, lng: base.lng - offset };
}

const NEIGHBORHOODS = [
  {
    slug: "martinez",
    name: "Martínez",
    imageUrl: "https://static.wixstatic.com/media/c9cb98_2c608b2c29844a18aa9509201ab2c19b~mv2_d_2896_1848_s_2.jpg",
    description:
      "Martínez combina calles arboladas y casonas de principios de siglo con edificios más nuevos cerca de la estación. Es una de las zonas más buscadas de Zona Norte por familias que priorizan colegios, clubes y buen acceso a la Panamericana y la General Paz.",
    transportContent: "Estación Martínez (línea Mitre), fácil acceso a Av. del Libertador y Panamericana.",
    schoolsContent: "Zona con alta concentración de colegios bilingües y clubes deportivos — detalle a completar con listado real.",
  },
  {
    slug: "florida",
    name: "Florida",
    imageUrl: "https://static.wixstatic.com/media/c9cb98_93684e9ee93f48d0a0da1ff0dc8aca81f002.jpg",
    description:
      "Borrador de ejemplo — a reemplazar por el criterio real de Tatiana De Paola y su equipo (Fase 6). Florida es una zona residencial de Vicente López con buena mezcla de casas y edificios bajos, cercana a la costa y con fácil acceso al centro de Vicente López.",
    transportContent: "Estación Florida (línea Mitre) y colectivos con acceso directo a CABA — detalle a completar.",
    schoolsContent: "Oferta de colegios de zona norte a confirmar con el equipo de De Paola.",
  },
  {
    slug: "vicente-lopez",
    name: "Vicente López",
    imageUrl: "https://static.wixstatic.com/media/c9cb98_d63461bb0c4e498fba692a68ed105b0f~mv2_d_2400_1350_s_2.jpg",
    description:
      "Borrador de ejemplo — a reemplazar por el criterio real de Tatiana De Paola y su equipo (Fase 6). Partido de referencia en Zona Norte, con vida de barrio, buena conexión con CABA y una franja costera muy valorada.",
    transportContent: "Estación Vicente López (línea Mitre) y acceso directo a Av. Libertador — detalle a completar.",
    schoolsContent: "Oferta de colegios de zona norte a confirmar con el equipo de De Paola.",
  },
  {
    slug: "villa-martelli",
    name: "Villa Martelli",
    imageUrl: "https://static.wixstatic.com/media/c9cb98_faadf4b7b7144845a7287837ea4715dd~mv2_d_8112_3759_s_4_2.jpg",
    description:
      "Borrador de ejemplo — a reemplazar por el criterio real de Tatiana De Paola y su equipo (Fase 6). Barrio con casas de perfil familiar, cercano a Av. Laprida, sede histórica de De Paola Propiedades.",
    transportContent: "Colectivos con acceso a Av. Laprida y Panamericana — detalle a completar.",
    schoolsContent: "Oferta de colegios de zona norte a confirmar con el equipo de De Paola.",
  },
];

async function seedNeighborhoods() {
  for (const zone of NEIGHBORHOODS) {
    await prisma.neighborhood.upsert({
      where: { slug: zone.slug },
      update: {},
      create: {
        slug: zone.slug,
        name: zone.name,
        description: zone.description,
        transportContent: zone.transportContent,
        schoolsContent: zone.schoolsContent,
        needsReview: true,
        hasMarketData: false,
      },
    });
  }
}

async function seedRealProperties() {
  const agent = await prisma.agent.findUniqueOrThrow({ where: { slug: "tatiana-de-paola" } });

  const villaMartelli = await prisma.neighborhood.findUniqueOrThrow({ where: { slug: "villa-martelli" } });
  const martinez = await prisma.neighborhood.findUniqueOrThrow({ where: { slug: "martinez" } });

  await prisma.property.upsert({
    where: { slug: "casa-5-ambientes-barrio-parque-villa-martelli" },
    update: {
      location: { update: jitter(NEIGHBORHOOD_COORDS["villa-martelli"], 0) },
    },
    create: {
      slug: "casa-5-ambientes-barrio-parque-villa-martelli",
      title: "Casa con 5 ambientes — Barrio Parque",
      description:
        "Casa de 5 ambientes en Barrio Parque, Villa Martelli, con quincho, jardín y garage. Publicada actualmente por De Paola Propiedades en Zonaprop y Argenprop.",
      operationType: OperationType.VENTA,
      propertyType: PropertyType.CASA,
      price: null,
      currency: null,
      rooms: 5,
      hasGarage: true,
      status: "ACTIVA",
      isSample: false,
      publishedAt: new Date(),
      agent: { connect: { id: agent.id } },
      office: { connect: { id: "office-villa-martelli" } },
      location: {
        create: {
          address: "Méjico al 3100, Villa Martelli",
          isApproximate: false,
          neighborhoodId: villaMartelli.id,
          ...jitter(NEIGHBORHOOD_COORDS["villa-martelli"], 0),
        },
      },
      images: {
        create: [
          { url: "https://static.wixstatic.com/media/c9cb98_5ec56de5f90541ce85109538669a2cb5~mv2.jpg", alt: "Fachada", order: 0, isCover: true },
          { url: "https://static.wixstatic.com/media/c9cb98_aa4578ab0f0c4842b92237169466e681~mv2.jpg", alt: "Interior", order: 1 },
          { url: "https://static.wixstatic.com/media/c9cb98_3a9ff6e898414906a0c3044e64b53a34~mv2.jpg", alt: "Interior", order: 2 },
        ],
      },
      features: {
        create: [
          { key: "quincho", label: "Quincho" },
          { key: "jardin", label: "Jardín" },
          { key: "garage", label: "Garage" },
        ],
      },
    },
  });

  await prisma.property.upsert({
    where: { slug: "chalet-6-ambientes-martinez" },
    update: {
      location: { update: jitter(NEIGHBORHOOD_COORDS["martinez"], 1) },
    },
    create: {
      slug: "chalet-6-ambientes-martinez",
      title: "Chalet 6 ambientes",
      description:
        "Chalet de 6 ambientes en Martínez, con jardín y garage. Publicado actualmente por De Paola Propiedades en Zonaprop y Argenprop.",
      operationType: OperationType.VENTA,
      propertyType: PropertyType.CASA,
      price: null,
      currency: null,
      rooms: 6,
      hasGarage: true,
      status: "ACTIVA",
      isSample: false,
      publishedAt: new Date(),
      agent: { connect: { id: agent.id } },
      office: { connect: { id: "office-villa-martelli" } },
      location: {
        create: {
          address: "Yapeyú al 400, Martínez",
          isApproximate: false,
          neighborhoodId: martinez.id,
          ...jitter(NEIGHBORHOOD_COORDS["martinez"], 1),
        },
      },
      images: {
        create: [{ url: "https://static.wixstatic.com/media/c9cb98_3e01d1892099477eb7ec2df49fcfc858~mv2.jpg", alt: "Chalet en Martínez", order: 0, isCover: true }],
      },
      features: {
        create: [
          { key: "jardin", label: "Jardín" },
          { key: "garage", label: "Garage" },
        ],
      },
    },
  });
}

const SAMPLE_PROPERTIES: Array<{
  slug: string;
  title: string;
  neighborhoodSlug: string;
  operationType: OperationType;
  propertyType: PropertyType;
  price: number;
  currency: "ARS" | "USD";
  coveredArea: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  hasGarage: boolean;
  condition: PropertyCondition;
  address: string;
  features: string[];
}> = [
  {
    slug: "departamento-3-ambientes-vicente-lopez",
    title: "Departamento 3 ambientes con balcón",
    neighborhoodSlug: "vicente-lopez",
    operationType: OperationType.VENTA,
    propertyType: PropertyType.DEPARTAMENTO,
    price: 320000,
    currency: "USD",
    coveredArea: 78,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    hasGarage: true,
    condition: PropertyCondition.MUY_BUENO,
    address: "Av. Maipú al 1500, Vicente López",
    features: ["Balcón", "Cochera"],
  },
  {
    slug: "casa-4-ambientes-pileta-martinez",
    title: "Casa 4 ambientes con pileta",
    neighborhoodSlug: "martinez",
    operationType: OperationType.VENTA,
    propertyType: PropertyType.CASA,
    price: 410000,
    currency: "USD",
    coveredArea: 190,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    hasGarage: true,
    condition: PropertyCondition.MUY_BUENO,
    address: "Zona Martínez",
    features: ["Pileta", "Jardín", "Garage"],
  },
  {
    slug: "ph-2-ambientes-florida",
    title: "PH 2 ambientes a estrenar",
    neighborhoodSlug: "florida",
    operationType: OperationType.VENTA,
    propertyType: PropertyType.PH,
    price: 145000,
    currency: "USD",
    coveredArea: 52,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    hasGarage: false,
    condition: PropertyCondition.A_ESTRENAR,
    address: "Zona Florida",
    features: ["Patio"],
  },
  {
    slug: "departamento-2-ambientes-alquiler-martinez",
    title: "Departamento 2 ambientes con balcón",
    neighborhoodSlug: "martinez",
    operationType: OperationType.ALQUILER,
    propertyType: PropertyType.DEPARTAMENTO,
    price: 950,
    currency: "USD",
    coveredArea: 58,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    hasGarage: false,
    condition: PropertyCondition.BUENO,
    address: "Zona Martínez",
    features: ["Balcón"],
  },
  {
    slug: "casa-5-ambientes-villa-martelli-ejemplo",
    title: "Casa 5 ambientes con quincho",
    neighborhoodSlug: "villa-martelli",
    operationType: OperationType.VENTA,
    propertyType: PropertyType.CASA,
    price: 380000,
    currency: "USD",
    coveredArea: 210,
    rooms: 5,
    bedrooms: 3,
    bathrooms: 2,
    hasGarage: true,
    condition: PropertyCondition.BUENO,
    address: "Zona Villa Martelli",
    features: ["Quincho", "Garage"],
  },
  {
    slug: "departamento-1-ambiente-alquiler-vicente-lopez",
    title: "Monoambiente a estrenar",
    neighborhoodSlug: "vicente-lopez",
    operationType: OperationType.ALQUILER,
    propertyType: PropertyType.DEPARTAMENTO,
    price: 480,
    currency: "USD",
    coveredArea: 32,
    rooms: 1,
    bedrooms: 1,
    bathrooms: 1,
    hasGarage: false,
    condition: PropertyCondition.A_ESTRENAR,
    address: "Zona Vicente López",
    features: ["Amenities"],
  },
  {
    slug: "local-comercial-florida",
    title: "Local comercial sobre avenida",
    neighborhoodSlug: "florida",
    operationType: OperationType.ALQUILER,
    propertyType: PropertyType.LOCAL,
    price: 700000,
    currency: "ARS",
    coveredArea: 45,
    rooms: 1,
    bedrooms: 0,
    bathrooms: 1,
    hasGarage: false,
    condition: PropertyCondition.BUENO,
    address: "Av. San Martín, Florida",
    features: ["Vidriera"],
  },
  {
    slug: "casa-6-ambientes-jardin-martinez",
    title: "Casa 6 ambientes con jardín",
    neighborhoodSlug: "martinez",
    operationType: OperationType.VENTA,
    propertyType: PropertyType.CASA,
    price: 520000,
    currency: "USD",
    coveredArea: 260,
    rooms: 6,
    bedrooms: 4,
    bathrooms: 3,
    hasGarage: true,
    condition: PropertyCondition.MUY_BUENO,
    address: "Zona Martínez",
    features: ["Jardín", "Pileta", "Garage"],
  },
  {
    slug: "departamento-3-ambientes-villa-martelli",
    title: "Departamento 3 ambientes con cochera",
    neighborhoodSlug: "villa-martelli",
    operationType: OperationType.ALQUILER,
    propertyType: PropertyType.DEPARTAMENTO,
    price: 1100,
    currency: "USD",
    coveredArea: 70,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    hasGarage: true,
    condition: PropertyCondition.BUENO,
    address: "Zona Villa Martelli",
    features: ["Cochera", "Balcón"],
  },
];

async function seedSampleProperties() {
  const agent = await prisma.agent.findUniqueOrThrow({ where: { slug: "tatiana-de-paola" } });

  for (const [index, sample] of SAMPLE_PROPERTIES.entries()) {
    const neighborhood = await prisma.neighborhood.findUniqueOrThrow({ where: { slug: sample.neighborhoodSlug } });
    const coords = jitter(NEIGHBORHOOD_COORDS[sample.neighborhoodSlug], index + 2);

    await prisma.property.upsert({
      where: { slug: sample.slug },
      update: {
        location: { update: coords },
      },
      create: {
        slug: sample.slug,
        title: sample.title,
        description: `Propiedad de ejemplo (isSample) usada para completar la grilla mientras se carga el inventario real de De Paola — ${sample.title.toLowerCase()}.`,
        operationType: sample.operationType,
        propertyType: sample.propertyType,
        price: sample.price,
        currency: sample.currency,
        coveredArea: sample.coveredArea,
        rooms: sample.rooms,
        bedrooms: sample.bedrooms,
        bathrooms: sample.bathrooms,
        hasGarage: sample.hasGarage,
        condition: sample.condition,
        status: "ACTIVA",
        isSample: true,
        publishedAt: new Date(),
        agent: { connect: { id: agent.id } },
        location: {
          create: {
            address: sample.address,
            isApproximate: true,
            neighborhoodId: neighborhood.id,
            ...coords,
          },
        },
        images: {
          create: [{ url: "/placeholder-property.svg", alt: sample.title, order: 0, isCover: true }],
        },
        features: {
          create: sample.features.map((label) => ({ key: label.toLowerCase(), label })),
        },
      },
    });
  }
}

async function main() {
  await seedOfficesAndAgent();
  await seedNeighborhoods();
  await seedRealProperties();
  await seedSampleProperties();
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
