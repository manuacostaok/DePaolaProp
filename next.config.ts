import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fase 6.2: redirects 301 desde las URLs del sitio Wix actual
  // (www.depaolapropiedades.com) a sus equivalentes acá. Esta lista NO es
  // completa — son solo las 3 rutas confirmadas en vivo contra el sitio Wix
  // real el 2026-09-02 (ver de-paola-fase1-benchmark-auditoria.md, sección
  // 1.2/1.5, y verificación directa con curl). El listado completo de URLs
  // que Google tiene indexadas requiere acceso a Search Console del dominio
  // viejo (bloqueado, ver sección D del plan) — sin eso cualquier URL
  // adicional acá sería una suposición. Estos 3 redirects no rompen nada
  // hoy (esas rutas no existen en esta app) y quedan listos para el día
  // que el dominio apunte para acá.
  async redirects() {
    return [
      { source: "/campusnorte", destination: "/emprendimientos/campus-norte", permanent: true },
      // El propio Wix ya redirige este a home — se manda al contenido real
      // (video de Campus Norte) en vez de perder esa intención de búsqueda.
      { source: "/videocampusnorte", destination: "/emprendimientos/campus-norte", permanent: true },
      // El nombre del path sugiere un proyecto residencial, pero el
      // contenido real de esa URL en Wix es la "Revista Digital"
      // (confirmado con el <title> real de la página) — mapea a Insights,
      // no a Emprendimientos.
      { source: "/proyectoresidencial", destination: "/insights", permanent: true },
    ];
  },
  images: {
    // TODO: confirmar proveedor definitivo de CDN de imágenes (Fase 17 lo deja abierto).
    // Por ahora se usa Vercel Image Optimization por defecto (sin configuración extra).
    // dangerouslyAllowSVG habilitado solo para los placeholders propios en /public
    // (no para imágenes externas/subidas por usuarios).
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
      },
    ],
  },
};

export default nextConfig;
