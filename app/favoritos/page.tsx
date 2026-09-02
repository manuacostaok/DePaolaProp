import type { Metadata } from "next";
import { FavoritesGrid } from "@/components/favoritos/favorites-grid";

export const metadata: Metadata = {
  title: "Favoritos",
  description: "Las propiedades que guardaste para revisar más tarde.",
};

export default function FavoritosPage() {
  return (
    <main className="mx-auto max-w-[1240px] px-6 py-10 sm:px-8">
      <h1 className="mb-6 text-[clamp(26px,3vw,36px)]">Favoritos</h1>
      <FavoritesGrid />
    </main>
  );
}
