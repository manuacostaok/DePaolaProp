import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
