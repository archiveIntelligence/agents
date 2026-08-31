"use client";

import { createContext, useCallback, useContext, useState } from "react";
import {
  CURRENCY_COOKIE,
  DEFAULT_CURRENCY,
  formatMoney,
  type Currency,
} from "@/lib/i18n/currency";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (eurCents: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({
  initial,
  children,
}: {
  initial: Currency;
  children: React.ReactNode;
}) {
  const [currency, setCurrencyState] = useState<Currency>(initial);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    // Persist so the next SSR render uses the chosen currency. Client price
    // islands update immediately via context — no full refresh needed.
    document.cookie = `${CURRENCY_COOKIE}=${c}; path=/; max-age=31536000; samesite=lax`;
  }, []);

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, format: (cents) => formatMoney(cents, currency) }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    // Safe fallback if used outside a provider (e.g. isolated tests).
    return {
      currency: DEFAULT_CURRENCY,
      setCurrency: () => {},
      format: (cents) => formatMoney(cents, DEFAULT_CURRENCY),
    };
  }
  return ctx;
}
