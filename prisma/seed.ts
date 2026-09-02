import crypto from "node:crypto";
import { PrismaClient, OperationType, PropertyType, PropertyCondition } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../lib/password";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Datos reales de De Paola Propiedades (brief, sección 5) — no son de ejemplo,
// por eso se siembran directo acá en vez de quedar hardcodeados en componentes.
async function seedOfficesAndAgent() {
  // Fuente: Argenprop. Mismo horario cargado para ambas sucursales por
  // ahora — a confirmar si difiere entre Florida y Villa Martelli. Se
  // actualiza explícitamente en el "update" (no "{}") porque estas oficinas
  // ya existen en la base y necesitan el horario aplicado retroactivamente.
  const officeHours = "Lunes a viernes de 9:30 a 19:00 hs. Sábados de 9:30 a 13:00 hs.";

  await prisma.office.upsert({
    where: { id: "office-villa-martelli" },
    update: { hours: officeHours },
    create: {
      id: "office-villa-martelli",
      name: "Villa Martelli",
      address: "Av. Laprida 3731, Villa Martelli",
      phone: "4709-1179",
      whatsapp: "+5491128755265",
      email: "contacto@depaolapropiedades.com",
      hours: officeHours,
    },
  });

  await prisma.office.upsert({
    where: { id: "office-florida" },
    update: { hours: officeHours },
    create: {
      id: "office-florida",
      name: "Florida",
      address: "Av. San Martín 2890 esq. Beiro, Vicente López",
      phone: "4709-6164",
      whatsapp: "+5491128755265",
      email: "contacto@depaolapropiedades.com",
      hours: officeHours,
    },
  });

  // Contraseña solo para el alta INICIAL de este agente (si la cuenta ya
  // existe, el seed no la pisa — ver "update: {}" abajo). Nunca hardcodeada:
  // sin SEED_ADMIN_PASSWORD en el entorno, se genera una al azar y se
  // imprime una sola vez para que quede en un gestor de contraseñas, no en
  // el código fuente.
  const seedAdminPassword = process.env.SEED_ADMIN_PASSWORD ?? crypto.randomBytes(18).toString("base64url");
  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.warn(
      `\n⚠️  SEED_ADMIN_PASSWORD no está seteada — se generó una contraseña al azar para el alta inicial:\n   ${seedAdminPassword}\n   Guardala ahora en un gestor de contraseñas; no queda registrada en ningún otro lugar.\n`,
    );
  }
  const testPasswordHash = await hashPassword(seedAdminPassword);

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
      role: "ADMINISTRADOR",
      passwordHash: testPasswordHash,
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
      "Martínez combina calles arboladas y casonas de principios de siglo con edificios más nuevos cerca de la estación. Administrativamente es parte del Partido de San Isidro, y es una de las zonas más buscadas de Zona Norte por familias que priorizan colegios, clubes y buen acceso a la Panamericana y la General Paz.",
    transportContent: "Estación Martínez (línea Mitre), fácil acceso a Av. del Libertador y Panamericana.",
    schoolsContent:
      "Zona con alta concentración de colegios privados: Instituto Fátima (fundado en 1930), Instituto Mallinckrodt (1934), Colegio San José y Colegio República Argentina, entre otros — más de medio centenar de establecimientos entre gestión pública y privada según el relevamiento del distrito.",
  },
  {
    slug: "florida",
    name: "Florida",
    imageUrl: "https://static.wixstatic.com/media/c9cb98_93684e9ee93f48d0a0da1ff0dc8aca81f002.jpg",
    description:
      "Florida es una zona residencial de Vicente López con buena mezcla de casas y edificios bajos. Se consolidó entre las décadas de 1920 y 1950 con la llegada de inmigrantes europeos, y conserva hitos de esa época como la estación Parada Bosch (1912), el Florida Tennis Club (1915) y el Hospital Dr. Bernardo Houssay (1931).",
    transportContent: "Estación Florida (línea Mitre) y colectivos con acceso directo a CABA por Av. Maipú y Av. del Libertador.",
    schoolsContent:
      "Oferta educativa amplia: Instituto La Salle Florida (con presencia desde 1925), Florida Day School (bilingüe, 1925), Instituto Adventista Florida (1913), Colegio Santa Teresita del Niño Jesús (1932) y Colegio Armenio, entre otros colegios públicos y privados de la zona.",
  },
  {
    slug: "vicente-lopez",
    name: "Vicente López",
    imageUrl: "https://static.wixstatic.com/media/c9cb98_d63461bb0c4e498fba692a68ed105b0f~mv2_d_2400_1350_s_2.jpg",
    description:
      "Partido de referencia en Zona Norte, limita con Florida al oeste, Olivos al norte, el Río de la Plata al este y la Ciudad de Buenos Aires al sur. Tiene vida de barrio, buena conexión con CABA por las avenidas Maipú, Libertador y General Paz, y una franja costera muy valorada.",
    transportContent: "Estación Vicente López (línea Mitre) y acceso directo a Av. Libertador.",
    schoolsContent:
      "Varios colegios de referencia de Zona Norte tienen sede acá: St. Andrew's Scots School, St. Luke's College, St. Gregory's College, Colegio San Mateo y el Michael Ham Memorial College, que funciona hace un siglo en un castillo neogótico obra de Francisco Salamone.",
  },
  {
    slug: "villa-martelli",
    name: "Villa Martelli",
    imageUrl: "https://static.wixstatic.com/media/c9cb98_faadf4b7b7144845a7287837ea4715dd~mv2_d_8112_3759_s_4_2.jpg",
    description:
      "Barrio con casas de perfil familiar, cercano a Av. Laprida, sede histórica de De Paola Propiedades. Nació el 6 de mayo de 1910 con la subdivisión de tierras que hasta entonces se dedicaban a la quinta, y tomó su nombre de Cesar Martelli; se reconoció formalmente como barrio el 27 de julio de 1964.",
    transportContent: "Colectivos con acceso a Av. Laprida y Panamericana.",
    schoolsContent:
      "Instituto Fátima (sede en Villa Martelli desde 1964) y el Jardín San Pablo de la Cruz (Hermanas Pasionistas) entre los privados; en gestión pública, la Escuela Primaria N°20 \"Martina Céspedes\" y la Escuela Secundaria N°2 \"Patricias Argentinas\".",
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
      isFeatured: true,
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
      isFeatured: true,
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

// Campus Norte: emprendimiento activo que De Paola comercializa (no es
// contenido editorial) — ver de-paola-00-pendientes-y-que-pedir.md, punto 5.
// Contenido tomado del sitio actual (depaolapropiedades.com/campusnorte).
async function seedCampusNorte() {
  const villaMartelli = await prisma.neighborhood.findUniqueOrThrow({ where: { slug: "villa-martelli" } });
  const coords = NEIGHBORHOOD_COORDS["villa-martelli"];

  // El desarrollo ya existe en la base — se actualizan explícitamente estos
  // campos (en vez de "update: {}") porque son datos nuevos que deben
  // aplicarse a la fila existente: superficie de terreno, puntos de
  // referencia cercanos, y la corrección que quita "Parque Sarmiento" de la
  // dirección (ese parque está asociado a otra publicación de De Paola cerca
  // de Munro/Florida, no a Campus Norte — no queremos publicar un dato de
  // ubicación que no podamos respaldar).
  const development = await prisma.development.upsert({
    where: { slug: "campus-norte" },
    update: {
      landArea: 8500,
      address: "Cerca del cruce de Av. General Paz y Panamericana, Villa Martelli, Vicente López — a metros del Dot Baires Shopping.",
      nearbyLandmarks:
        "A 700 m del cruce Av. General Paz / Autopista Panamericana. Cerca de Dot Baires Shopping y de empresas como Philips Argentina, Mercado Libre, Georgalos y Pizzini.",
    },
    create: {
      slug: "campus-norte",
      name: "Campus Norte",
      tagline: "Viví y trabajá cerca de todo",
      description:
        "Campus Norte fue concebido como un hito que cambia la fisonomía del barrio de Villa Martelli, en Vicente López. Con el objetivo de mejorar la calidad de vida de sus residentes, suma grandes espacios verdes, amenities de lujo y unidades amplias y luminosas. Es un programa residencial de 140 unidades de 1, 2 y 3 ambientes (36 a 90 m²), con cocheras opcionales simples, dobles, cubiertas y descubiertas, y un concepto modular: las unidades pueden unificarse con cambios estructurales mínimos para lograr departamentos de mayor superficie a medida del interesado.",
      totalUnits: 140,
      unitTypes: "1, 2 y 3 ambientes, de 36 a 90 m²",
      amenitiesArea: 1200,
      landArea: 8500,
      address: "Cerca del cruce de Av. General Paz y Panamericana, Villa Martelli, Vicente López — a metros del Dot Baires Shopping.",
      nearbyLandmarks:
        "A 700 m del cruce Av. General Paz / Autopista Panamericana. Cerca de Dot Baires Shopping y de empresas como Philips Argentina, Mercado Libre, Georgalos y Pizzini.",
      lat: coords.lat,
      lng: coords.lng,
      financing: "Campus Norte cuenta con financiación propia del desarrollador — consultá condiciones y planes de pago con un asesor de De Paola.",
      externalUrl: "https://www.campusnorte.com.ar",
      isSample: false,
      neighborhood: { connect: { id: villaMartelli.id } },
      office: { connect: { id: "office-villa-martelli" } },
      images: {
        create: [
          {
            url: "https://static.wixstatic.com/media/c9cb98_efcfe475715a4a5bab90e14bc56e5618f003.jpg",
            alt: "Vista aérea del proyecto Campus Norte en Villa Martelli",
            order: 0,
            isCover: true,
          },
        ],
      },
      amenities: {
        create: [
          { key: "pileta", label: "2 piletas" },
          { key: "gimnasio", label: "Gimnasio" },
          { key: "salon", label: "2 salones de fiestas" },
          { key: "vinoteca", label: "Vinoteca" },
          { key: "coffee", label: "Coffee / bar" },
          { key: "parrilla", label: "Sector de parrillas" },
          { key: "chillout", label: "Zonas chill out" },
          { key: "conferencias", label: "Sala de conferencias" },
          { key: "cochera", label: "Cocheras de cortesía" },
        ],
      },
    },
  });

  return development;
}

const CATEGORIES = [
  { slug: "mercado", name: "Mercado" },
  { slug: "inversion", name: "Inversión" },
  { slug: "guias", name: "Guías" },
  { slug: "arquitectura", name: "Arquitectura" },
  { slug: "zona-norte", name: "Zona Norte" },
  { slug: "lifestyle", name: "Lifestyle" },
  { slug: "consejos", name: "Consejos" },
  { slug: "noticias", name: "Noticias" },
];

async function seedCategories() {
  for (const category of CATEGORIES) {
    await prisma.category.upsert({ where: { slug: category.slug }, update: {}, create: category });
  }
}

const SAMPLE_ARTICLES: Array<{
  slug: string;
  title: string;
  categorySlug: string;
  neighborhoodSlug?: string;
  body: string;
}> = [
  {
    slug: "como-evoluciono-el-precio-del-m2-en-vicente-lopez",
    title: "Cómo evolucionó el precio del m² en Vicente López",
    categorySlug: "mercado",
    neighborhoodSlug: "vicente-lopez",
    body: "Artículo de ejemplo (isSample) — a reemplazar por contenido real de mercado una vez que existan datos verificados de De Paola (Fase 8). Acá se mostraría la evolución real del precio por metro cuadrado en la zona, sin inventar cifras.",
  },
  {
    slug: "que-zonas-tienen-mejor-relacion-renta-precio",
    title: "Qué zonas de Zona Norte tienen mejor relación renta/precio",
    categorySlug: "inversion",
    body: "Artículo de ejemplo (isSample). Contenido pensado para nutrir el flujo de Invertir con criterio experto, a completar con el análisis real del equipo de De Paola.",
  },
  {
    slug: "guia-para-comprar-tu-primera-propiedad-en-argentina",
    title: "Guía para comprar tu primera propiedad en Argentina",
    categorySlug: "guias",
    body: "Artículo de ejemplo (isSample). Guía paso a paso pensada para SEO long-tail y captación hacia el buscador de propiedades.",
  },
  {
    slug: "estilos-de-construccion-tipicos-de-martinez",
    title: "Estilos de construcción típicos de Martínez",
    categorySlug: "arquitectura",
    neighborhoodSlug: "martinez",
    body: "Artículo de ejemplo (isSample). Contenido editorial sobre el patrimonio arquitectónico de la zona, a enriquecer con el criterio real del equipo.",
  },
  {
    slug: "los-barrios-con-mas-crecimiento-de-zona-norte",
    title: "Los barrios con más crecimiento de Zona Norte en el último año",
    categorySlug: "zona-norte",
    body: "Artículo de ejemplo (isSample). Contenido hiperlocal a conectar con datos de mercado reales cuando estén disponibles (Fase 8) — por ahora sin cifras inventadas.",
  },
  {
    slug: "mejores-planes-de-fin-de-semana-en-vicente-lopez",
    title: "Los mejores planes de fin de semana en Vicente López",
    categorySlug: "lifestyle",
    neighborhoodSlug: "vicente-lopez",
    body: "Artículo de ejemplo (isSample). Contenido de marca/engagement, no transaccional — a completar con recomendaciones reales del equipo local.",
  },
  {
    slug: "5-cosas-para-preparar-tu-propiedad-antes-de-tasarla",
    title: "5 cosas para preparar tu propiedad antes de tasarla",
    categorySlug: "consejos",
    body: "Artículo de ejemplo (isSample). Pensado para nutrir el flujo de Vender/Tasación con consejos prácticos y accionables.",
  },
  {
    slug: "de-paola-propiedades-2-0-ya-esta-en-linea",
    title: "De Paola Propiedades 2.0 ya está en línea",
    categorySlug: "noticias",
    body: "Artículo de ejemplo (isSample). Noticia institucional de lanzamiento del sitio propio, en reemplazo de la derivación total a portales externos.",
  },
];

async function seedArticles() {
  for (const article of SAMPLE_ARTICLES) {
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: article.categorySlug } });
    const neighborhood = article.neighborhoodSlug
      ? await prisma.neighborhood.findUnique({ where: { slug: article.neighborhoodSlug } })
      : null;

    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        slug: article.slug,
        title: article.title,
        body: article.body,
        coverImageUrl: "/placeholder-property.svg",
        authorName: "Equipo De Paola",
        isSample: true,
        publishedAt: new Date(),
        category: { connect: { id: category.id } },
        neighborhood: neighborhood ? { connect: { id: neighborhood.id } } : undefined,
      },
    });
  }
}

async function main() {
  await seedOfficesAndAgent();
  await seedNeighborhoods();
  await seedRealProperties();
  await seedSampleProperties();
  await seedCampusNorte();
  await seedCategories();
  await seedArticles();
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
