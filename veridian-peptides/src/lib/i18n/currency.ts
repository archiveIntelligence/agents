// Multi-currency display. Prices are stored in EUR cents (authoritative);
// other currencies are derived for display only, using static demo rates.
// Swap RATES for a live FX feed in production.

export type Currency = "EUR" | "USD" | "GBP";

export const CURRENCY_COOKIE = "vp.currency";
export const DEFAULT_CURRENCY: Currency = "EUR";

export const CURRENCIES: { code: Currency; label: string; locale: string }[] = [
  { code: "EUR", label: "€ EUR", locale: "en-IE" },
  { code: "USD", label: "$ USD", locale: "en-US" },
  { code: "GBP", label: "£ GBP", locale: "en-GB" },
];

// Units of target currency per 1 EUR.
const RATES: Record<Currency, number> = {
  EUR: 1,
  USD: 1.08,
  GBP: 0.84,
};

const localeFor: Record<Currency, string> = {
  EUR: "en-IE",
  USD: "en-US",
  GBP: "en-GB",
};

export function isCurrency(value: unknown): value is Currency {
  return value === "EUR" || value === "USD" || value === "GBP";
}

/** Format an EUR-denominated cent amount in the chosen display currency. */
export function formatMoney(eurCents: number, currency: Currency = DEFAULT_CURRENCY): string {
  const amount = (eurCents / 100) * RATES[currency];
  return new Intl.NumberFormat(localeFor[currency], {
    style: "currency",
    currency,
  }).format(amount);
}
