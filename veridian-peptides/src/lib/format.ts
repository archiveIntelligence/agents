// Locale-aware formatting helpers.

export function formatPrice(cents: number, locale = "en-IE"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function formatDate(iso: string, locale = "en-IE"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function stockLabel(stock: string): { text: string; tone: "ok" | "warn" | "off" } {
  switch (stock) {
    case "in_stock":
      return { text: "In stock", tone: "ok" };
    case "low_stock":
      return { text: "Low stock", tone: "warn" };
    case "pre_order":
      return { text: "Pre-order", tone: "warn" };
    default:
      return { text: "Out of stock", tone: "off" };
  }
}
