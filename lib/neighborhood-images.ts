// Fotos reales de cada zona (mismas que usa la muestra aprobada).
export const NEIGHBORHOOD_IMAGES: Record<string, string> = {
  martinez: "https://static.wixstatic.com/media/c9cb98_2c608b2c29844a18aa9509201ab2c19b~mv2_d_2896_1848_s_2.jpg",
  "vicente-lopez": "https://static.wixstatic.com/media/c9cb98_d63461bb0c4e498fba692a68ed105b0f~mv2_d_2400_1350_s_2.jpg",
  "villa-martelli": "https://static.wixstatic.com/media/c9cb98_faadf4b7b7144845a7287837ea4715dd~mv2_d_8112_3759_s_4_2.jpg",
  florida: "https://static.wixstatic.com/media/c9cb98_93684e9ee93f48d0a0da1ff0dc8aca81f002.jpg",
};

export function neighborhoodImage(slug: string) {
  return NEIGHBORHOOD_IMAGES[slug] ?? "/placeholder-zone.svg";
}
