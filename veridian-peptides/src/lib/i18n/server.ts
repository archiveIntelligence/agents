import "server-only";
import { cookies, headers } from "next/headers";
import { CURRENCY_COOKIE, DEFAULT_CURRENCY, isCurrency, type Currency } from "./currency";
import {
  isLocale,
  LOCALE_COOKIE,
  matchLocale,
  translator,
  type Locale,
  type TranslateFn,
} from "./locale";

/** Read the display currency from the cookie (server components). */
export async function getCurrency(): Promise<Currency> {
  const store = await cookies();
  const value = store.get(CURRENCY_COOKIE)?.value;
  return isCurrency(value) ? value : DEFAULT_CURRENCY;
}

/**
 * Resolve the active locale (server components). An explicit `vp.locale` cookie
 * (set when the visitor picks a language) wins; otherwise we auto-detect from the
 * browser's Accept-Language header so first-time visitors see their own language.
 */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const cookieValue = store.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieValue)) return cookieValue;
  const accept = (await headers()).get("accept-language");
  return matchLocale(accept);
}

/** Bound translate function for the current request's locale. */
export async function getServerT(): Promise<TranslateFn> {
  return translator(await getLocale());
}
