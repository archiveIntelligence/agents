"use client";

import { LOCALES, type Locale } from "@/lib/i18n/locale";
import { useLocale } from "./locale-provider";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  return (
    <label className="inline-flex items-center">
      <span className="sr-only">Language</span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        aria-label="Language"
        title="Language"
        className="h-9 max-w-[9rem] rounded-full border border-border bg-surface px-2 text-sm text-muted-foreground"
      >
        {LOCALES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.native}
          </option>
        ))}
      </select>
    </label>
  );
}
