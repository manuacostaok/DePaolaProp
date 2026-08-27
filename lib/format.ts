export function formatPrice(price: number, currency: "ARS" | "USD") {
  const formatted = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(price);
  return currency === "USD" ? `USD ${formatted}` : `$ ${formatted}`;
}
