// Lightweight i18n: a locale cookie + flat message dictionaries, one per
// language under ./messages. English is the source locale; every other language
// falls back to English per-key. The active locale comes from the `vp.locale`
// cookie, or — on first visit — from the browser's Accept-Language header.

import { messages } from "./messages";

export type Locale = keyof typeof messages;

export const LOCALE_COOKIE = "vp.locale";
export const DEFAULT_LOCALE: Locale = "en";

/** Right-to-left scripts — used to set `dir="rtl"` on <html>. */
const RTL = new Set<Locale>(["ar", "fa", "ur"]);
export function isRTL(locale: Locale): boolean {
  return RTL.has(locale);
}

/** Display metadata for the language switcher (native names). */
export const LOCALES: { code: Locale; label: string; native: string }[] = [
  { code: "en", label: "EN", native: "English" },
  { code: "zh", label: "ZH", native: "中文" },
  { code: "hi", label: "HI", native: "हिन्दी" },
  { code: "es", label: "ES", native: "Español" },
  { code: "fr", label: "FR", native: "Français" },
  { code: "ar", label: "AR", native: "العربية" },
  { code: "bn", label: "BN", native: "বাংলা" },
  { code: "pt", label: "PT", native: "Português" },
  { code: "ru", label: "RU", native: "Русский" },
  { code: "ur", label: "UR", native: "اردو" },
  { code: "id", label: "ID", native: "Bahasa Indonesia" },
  { code: "de", label: "DE", native: "Deutsch" },
  { code: "ja", label: "JA", native: "日本語" },
  { code: "tr", label: "TR", native: "Türkçe" },
  { code: "ko", label: "KO", native: "한국어" },
  { code: "vi", label: "VI", native: "Tiếng Việt" },
  { code: "it", label: "IT", native: "Italiano" },
  { code: "fa", label: "FA", native: "فارسی" },
  { code: "pl", label: "PL", native: "Polski" },
  { code: "uk", label: "UK", native: "Українська" },
  { code: "nl", label: "NL", native: "Nederlands" },
  { code: "th", label: "TH", native: "ไทย" },
  { code: "sv", label: "SV", native: "Svenska" },
  { code: "el", label: "EL", native: "Ελληνικά" },
];

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && value in messages;
}

/**
 * Pick the best supported locale from an Accept-Language header, e.g.
 * "fr-CH,fr;q=0.9,en;q=0.8". Matches the primary language subtag (so `pt-BR`
 * → `pt`), honours q-weights, and falls back to the default locale.
 */
export function matchLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      const weight = q ? parseFloat(q.split("=")[1]) : 1;
      return { tag: tag.trim().toLowerCase(), weight: isNaN(weight) ? 0 : weight };
    })
    .filter((r) => r.tag)
    .sort((a, b) => b.weight - a.weight);

  for (const { tag } of ranked) {
    if (isLocale(tag)) return tag;
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return DEFAULT_LOCALE;
}

export type TranslateFn = (key: string) => string;

export function translator(locale: Locale): TranslateFn {
  const dict = messages[locale] ?? messages.en;
  return (key: string) => dict[key] ?? messages.en[key] ?? key;
}
