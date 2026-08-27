import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "De Paola Propiedades",
  description: "De Paola Propiedades — Zona Norte (Martínez, Florida, Vicente López, Villa Martelli)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
