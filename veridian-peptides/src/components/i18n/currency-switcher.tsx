"use client";

import { CURRENCIES, type Currency } from "@/lib/i18n/currency";
import { useCurrency } from "./currency-provider";

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  return (
    <label className="inline-flex items-center">
      <span className="sr-only">Display currency</span>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as Currency)}
        className="h-9 rounded-full border border-border bg-surface px-2 text-sm text-muted-foreground"
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.label}
          </option>
        ))}
      </select>
    </label>
  );
}
