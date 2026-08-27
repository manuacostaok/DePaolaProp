import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // TODO: confirmar proveedor definitivo de CDN de imágenes (Fase 17 lo deja abierto).
    // Por ahora se usa Vercel Image Optimization por defecto (sin configuración extra).
  },
};

export default nextConfig;
