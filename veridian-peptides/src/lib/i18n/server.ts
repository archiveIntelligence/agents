import "server-only";
import { cookies } from "next/headers";
import { CURRENCY_COOKIE, DEFAULT_CURRENCY, isCurrency, type Currency } from "./currency";
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_COOKIE,
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

/** Read the active locale from the cookie (server components). */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Bound translate function for the current request's locale. */
export async function getServerT(): Promise<TranslateFn> {
  return translator(await getLocale());
}
