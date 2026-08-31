// Locale-aware formatting helpers.

/** Discount percentage vs. a list price, or null when there is no real saving. */
export function discountPercent(priceCents: number, compareAtCents?: number): number | null {
  if (!compareAtCents || compareAtCents <= priceCents) return null;
  return Math.round((1 - priceCents / compareAtCents) * 100);
}

/** Parse a milligram size like "10mg" → 10. Returns null for non-mg sizes. */
export function parseMg(size: string): number | null {
  const m = /^([\d.]+)\s*mg$/i.exec(size.trim());
  return m ? parseFloat(m[1]) : null;
}

/** Unit price per milligram in cents, for honest price-per-mg framing. */
export function pricePerMgCents(priceCents: number, size: string): number | null {
  const mg = parseMg(size);
  if (!mg || mg <= 0) return null;
  return priceCents / mg;
}

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

/** Coarse "x days/weeks/months ago" label — surfaces review recency. */
export function relativeDate(iso: string, now: Date = new Date()): string {
  const days = Math.max(0, Math.floor((now.getTime() - new Date(iso).getTime()) / 86400000));
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) {
    const w = Math.floor(days / 7);
    return `${w} week${w === 1 ? "" : "s"} ago`;
  }
  if (days < 365) {
    const m = Math.floor(days / 30);
    return `${m} month${m === 1 ? "" : "s"} ago`;
  }
  const y = Math.floor(days / 365);
  return `${y} year${y === 1 ? "" : "s"} ago`;
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
