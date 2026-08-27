import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Datos reales de De Paola Propiedades (brief, sección 5) — no son de ejemplo,
// por eso se siembran directo acá en vez de quedar hardcodeados en componentes.
async function main() {
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
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
