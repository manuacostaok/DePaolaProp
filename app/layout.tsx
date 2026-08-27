import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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
    <html lang="es" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <Header />
        {children}
        <Footer />
        <BottomNav />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
