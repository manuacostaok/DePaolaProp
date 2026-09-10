import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FOOTER_COLUMNS, SITE } from "@/lib/nav";

export async function Footer() {
  const offices = await prisma.office.findMany({ orderBy: { name: "asc" } });

  return (
    <footer className="mt-16 bg-brand-dark pt-20 pb-24 text-[#CCD3D8] sm:pt-24 md:pb-10">
      <div className="mx-auto max-w-[1240px] px-6 sm:px-8">
        <div className="mb-16 border-b border-white/10 pb-16">
          <Image src={SITE.logoUrl} alt={SITE.name} width={120} height={40} className="mb-6 h-9 w-auto sm:h-10" />
          <p className="max-w-md text-[15px] leading-relaxed text-[#9FAAB0]">
            Inmobiliaria en Zona Norte, Buenos Aires — 20 años acompañando cada operación en Martínez, Florida,
            Vicente López y Villa Martelli.
          </p>
        </div>

        <div className="mb-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h2 className="mb-4 font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-white/60">
                {column.title}
              </h2>
              {column.links.map((link) => (
                <Link key={link.href} href={link.href} className="mb-3 block text-[14.5px] text-[#CCD3D8] hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          ))}

          <div>
            <h2 className="mb-4 font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-white/60">Contacto</h2>
            {offices.map((office) => (
              <Link key={office.id} href="/contacto" className="mb-3 block text-[14.5px] text-[#CCD3D8] hover:text-white">
                {office.name} — {office.address}
              </Link>
            ))}
            {offices[0]?.phone && (
              <a href={`tel:+54${offices[0].phone.replace(/\D/g, "")}`} className="mb-3 block text-[14.5px] text-[#CCD3D8] hover:text-white">
                {offices.map((o) => o.phone).join(" / ")}
              </a>
            )}
            {offices[0]?.email && (
              <a href={`mailto:${offices[0].email}`} className="mb-3 block text-[14.5px] text-[#CCD3D8] hover:text-white">
                {offices[0].email}
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2.5 text-[12.5px] text-[#8F98A0]">
          <span>
            © {SITE.name} · {SITE.legalId}
          </span>
          <a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
            Instagram
          </a>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-center text-[11.5px] text-[#6B747B]">
          Hecho por Aura Tech Solutions
        </div>
      </div>
    </footer>
  );
}
