export function formatPrice(price: number | null, currency: "ARS" | "USD" | null) {
  if (price == null || currency == null) return "Consultar precio";
  const formatted = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(price);
  return currency === "USD" ? `USD ${formatted}` : `$ ${formatted}`;
}
