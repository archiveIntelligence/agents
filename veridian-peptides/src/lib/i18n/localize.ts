// Locale overlay for data-driven content (categories, products, blog). The base
// dataset is English; per-locale translations live in ./content/<locale>.json as
// a flat { "id:field": "translated" } map and are layered on at read time by the
// repository. Anything not translated falls back to English per field.

import type { Category, Product, BlogPost } from "../types";
import { isLocale, matchLocale, LOCALE_COOKIE, type Locale } from "./locale";
import { overlays } from "./content";

export type Overlay = Record<string, string>;

/**
 * Resolve the active locale without importing the `server-only` helper, so this
 * module stays safe to pull into the repository (and its unit tests). Uses a
 * guarded dynamic import of next/headers; outside a request (build, tests) it
 * falls back to English.
 */
export async function getLocaleSafe(): Promise<Locale> {
  try {
    const { cookies, headers } = await import("next/headers");
    const cookieValue = (await cookies()).get(LOCALE_COOKIE)?.value;
    if (isLocale(cookieValue)) return cookieValue;
    return matchLocale((await headers()).get("accept-language"));
  } catch {
    return "en";
  }
}

/** The overlay for the current request, or null when English / not translated. */
export async function currentOverlay(): Promise<Overlay | null> {
  const locale = await getLocaleSafe();
  if (locale === "en") return null;
  return overlays[locale] ?? null;
}

const pick = (o: Overlay, key: string, fallback: string) => o[key] ?? fallback;

export function localizeCategory(c: Category, o: Overlay): Category {
  return {
    ...c,
    name: pick(o, `cat:${c.slug}:name`, c.name),
    description: pick(o, `cat:${c.slug}:description`, c.description),
  };
}

export function localizeProduct(p: Product, o: Overlay): Product {
  // Compound names are scientific identifiers — never translated. Only the
  // marketing tagline/description are localized (keyed by the shared group name).
  return {
    ...p,
    tagline: pick(o, `prod:${p.name}:tagline`, p.tagline),
    description: pick(o, `prod:${p.name}:description`, p.description),
  };
}

export function localizeBlogPost(b: BlogPost, o: Overlay): BlogPost {
  return {
    ...b,
    title: pick(o, `blog:${b.slug}:title`, b.title),
    excerpt: pick(o, `blog:${b.slug}:excerpt`, b.excerpt),
    body: o[`blog:${b.slug}:body`] ?? b.body,
  };
}
