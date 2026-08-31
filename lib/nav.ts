export const SITE = {
  name: "De Paola Propiedades",
  whatsapp: "+5491128755265",
  legalId: "CMCPSI 6308",
  logoUrl: "https://static.wixstatic.com/media/c9cb98_ae5c5052d1cb4dc7b029b9b84a144a1c~mv2.png",
  instagramHandle: "depaolapropiedades1",
  instagramUrl: "https://www.instagram.com/depaolapropiedades1/",
};

export interface NavLink {
  label: string;
  href: string;
}

export interface NavItem extends NavLink {
  children?: NavLink[];
}

export const MAIN_NAV: NavItem[] = [
  {
    label: "Propiedades",
    href: "/propiedades",
    children: [
      { label: "Comprar", href: "/propiedades/comprar" },
      { label: "Alquilar", href: "/propiedades/alquilar" },
      { label: "Destacadas", href: "/propiedades/destacadas" },
    ],
  },
  { label: "Zonas", href: "/zonas" },
  { label: "Emprendimientos", href: "/emprendimientos" },
  { label: "Vender", href: "/vender" },
  { label: "Invertir", href: "/invertir" },
  { label: "Insights", href: "/insights" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
];

export const MOBILE_NAV: NavLink[] = [
  { label: "Inicio", href: "/" },
  ...MAIN_NAV.flatMap((item) => [item, ...(item.children ?? [])]),
];

export const FOOTER_COLUMNS: { title: string; links: NavLink[] }[] = [
  {
    title: "Propiedades",
    links: [
      { label: "Comprar", href: "/propiedades/comprar" },
      { label: "Alquilar", href: "/propiedades/alquilar" },
      { label: "Zonas", href: "/zonas" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Nosotros", href: "/nosotros" },
      { label: "Equipo", href: "/equipo" },
      { label: "Sucursales", href: "/sucursales" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Insights", href: "/insights" },
      { label: "Mercado", href: "/mercado" },
      { label: "Tasá tu propiedad", href: "/vender/tasacion" },
    ],
  },
];
