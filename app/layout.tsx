import type { Metadata, Viewport } from "next";
import { Newsreader, Jost } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { OrganizationSchema } from "@/components/seo/organization-schema";
import { SITE_URL } from "@/lib/site-url";
import "./globals.css";

// Equivalentes gratuitos de Sainte Colombe / Euclid Circular A (de pago,
// ver reference/STYLE_GUIDE.md) para la estética tipo elliman.com.
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "De Paola Propiedades — Zona Norte, Buenos Aires",
    template: "%s | De Paola Propiedades",
  },
  description: "Inmobiliaria en Zona Norte, Buenos Aires — Martínez, Florida, Vicente López y Villa Martelli. 20 años de trayectoria.",
  // Fallback para Home (app/page.tsx no define metadata propio, hereda
  // todo este objeto) — el resto de las páginas define su propio
  // `alternates.canonical` y lo pisa.
  alternates: { canonical: "/" },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "De Paola",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "De Paola Propiedades",
  },
};

export const viewport: Viewport = {
  themeColor: "#00385C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${newsreader.variable} ${jost.variable}`}>
      <body>
        <OrganizationSchema />
        <Header />
        {children}
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
