import Image from "next/image";

// Posteos reales de @depaolapropiedades1 (capturas propias, tomadas de
// su perfil público de Instagram) — sirven de ejemplo hasta reemplazarlos
// por una integración en vivo con la API de Instagram.
const POSTS = [
  { image: "/instagram/post-1.jpg", href: "https://www.instagram.com/depaolapropiedades1/reel/DZx9LPXRk5V/", alt: "Recorrido de una propiedad en video" },
  { image: "/instagram/post-2.jpg", href: "https://www.instagram.com/depaolapropiedades1/reel/DcWIxlWx0SH/", alt: "Frente de una propiedad en venta" },
  { image: "/instagram/post-3.jpg", href: "https://www.instagram.com/depaolapropiedades1/reel/DcEuzqrO-h8/", alt: "Recorrido de una propiedad en Villa Urquiza" },
  { image: "/instagram/post-4.jpg", href: "https://www.instagram.com/depaolapropiedades1/reel/DcCNAJ8uFGe/", alt: "Propiedad en Olivos" },
  { image: "/instagram/post-5.jpg", href: "https://www.instagram.com/depaolapropiedades1/reel/DbYQXoYQYR_/", alt: "Equipo de De Paola Propiedades" },
  { image: "/instagram/post-6.jpg", href: "https://www.instagram.com/depaolapropiedades1/reel/DbOn8zKhf4M/", alt: "Recorrido de un galpón en venta" },
];

export function InstagramGrid() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
      {POSTS.map((post) => (
        <a
          key={post.href}
          href={post.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative aspect-[9/16] overflow-hidden rounded-[6px] bg-white/10"
        >
          <Image
            src={post.image}
            alt={post.alt}
            fill
            sizes="(min-width: 640px) 15vw, 30vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.05]"
          />
        </a>
      ))}
    </div>
  );
}
