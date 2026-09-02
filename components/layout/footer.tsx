import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FOOTER_COLUMNS, SITE } from "@/lib/nav";

export async function Footer() {
  const offices = await prisma.office.findMany({ orderBy: { name: "asc" } });

  return (
    <footer className="mt-16 bg-brand-dark pt-16 pb-24 text-[#CCD3D8] md:pb-8">
      <div className="mx-auto max-w-[1240px] px-6 sm:px-8">
        <div className="mb-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Image src={SITE.logoUrl} alt={SITE.name} width={100} height={34} className="mb-3.5 h-[34px] w-auto" />
            <p className="text-sm text-[#9FAAB0]">Inmobiliaria en Zona Norte, Buenos Aires. 20 años de trayectoria.</p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h2 className="mb-4 font-sans text-[13px] font-semibold uppercase tracking-wider text-white">
                {column.title}
              </h2>
              {column.links.map((link) => (
                <Link key={link.href} href={link.href} className="mb-2.5 block text-sm text-[#CCD3D8] hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          ))}

          <div>
            <h2 className="mb-4 font-sans text-[13px] font-semibold uppercase tracking-wider text-white">Contacto</h2>
            {offices.map((office) => (
              <Link
                key={office.id}
                href="/contacto"
                className="mb-2.5 block text-sm text-[#CCD3D8] hover:text-white"
              >
                {office.name} — {office.address}
              </Link>
            ))}
            {offices[0]?.phone && (
              <a href={`tel:+54${offices[0].phone.replace(/\D/g, "")}`} className="mb-2.5 block text-sm text-[#CCD3D8] hover:text-white">
                {offices.map((o) => o.phone).join(" / ")}
              </a>
            )}
            {offices[0]?.email && (
              <a href={`mailto:${offices[0].email}`} className="mb-2.5 block text-sm text-[#CCD3D8] hover:text-white">
                {offices[0].email}
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-white/10 pt-6 text-[12.5px] text-[#8F98A0]">
          <span>
            © {SITE.name} · {SITE.legalId}
          </span>
        </div>
      </div>
    </footer>
  );
}
