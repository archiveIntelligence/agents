"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  translator,
  type Locale,
  type TranslateFn,
} from "@/lib/i18n/locale";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: TranslateFn;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  initial,
  children,
}: {
  initial: Locale;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initial);

  const setLocale = useCallback(
    (l: Locale) => {
      setLocaleState(l);
      document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
      // Server components hold translated copy, so refresh to re-render them.
      router.refresh();
    },
    [router],
  );

  const t = useMemo(() => translator(locale), [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return { locale: DEFAULT_LOCALE, setLocale: () => {}, t: translator(DEFAULT_LOCALE) };
  }
  return ctx;
}

/** Convenience hook for components that only need translation. */
export function useT(): TranslateFn {
  return useLocale().t;
}
