import {
  AVERAGE_PURITY,
  blogPosts,
  bundles,
  categories,
  coas,
  products,
  reviews,
} from "./data";
import type { Bundle, BlogPost, Category, Coa, Product, Review } from "./types";
import {
  currentOverlay,
  localizeBlogPost,
  localizeCategory,
  localizeProduct,
} from "./i18n/localize";

// Data-access layer with two interchangeable backends:
//   - PostgreSQL via Prisma when DATABASE_URL is configured
//   - the in-memory seed dataset otherwise (keeps builds/tests green with no DB)
// The UI imports only from here and never sees which backend is active.

const useDb = Boolean(process.env.DATABASE_URL);

// Lazily load the Prisma backend so environments without a database never
// instantiate the client/driver adapter.
async function db() {
  return import("./db/prisma-repository");
}

export interface ProductQuery {
  category?: string;
  search?: string;
  inStockOnly?: boolean;
  sort?: "featured" | "price-asc" | "price-desc" | "purity-desc";
}

export async function getCategories(): Promise<Category[]> {
  const base = useDb ? await (await db()).getCategories() : categories;
  const o = await currentOverlay();
  return o ? base.map((c) => localizeCategory(c, o)) : base;
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  const base = useDb ? await (await db()).getCategory(slug) : categories.find((c) => c.slug === slug);
  const o = await currentOverlay();
  return base && o ? localizeCategory(base, o) : base;
}

export async function getProducts(query: ProductQuery = {}): Promise<Product[]> {
  const o = await currentOverlay();
  if (useDb) {
    const base = await (await db()).getProducts(query);
    return o ? base.map((p) => localizeProduct(p, o)) : base;
  }

  let result = [...products];
  if (query.category) result = result.filter((p) => p.categorySlug === query.category);
  if (query.search) {
    const q = query.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }
  if (query.inStockOnly) {
    result = result.filter((p) => p.stock === "in_stock" || p.stock === "low_stock");
  }
  switch (query.sort) {
    case "price-asc":
      result.sort((a, b) => a.priceCents - b.priceCents);
      break;
    case "price-desc":
      result.sort((a, b) => b.priceCents - a.priceCents);
      break;
    case "purity-desc":
      result.sort((a, b) => b.purity - a.purity);
      break;
    default:
      result.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
  }
  return o ? result.map((p) => localizeProduct(p, o)) : result;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const base = useDb ? await (await db()).getFeaturedProducts() : products.filter((p) => p.featured);
  const o = await currentOverlay();
  return o ? base.map((p) => localizeProduct(p, o)) : base;
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const base = useDb ? await (await db()).getProduct(slug) : products.find((p) => p.slug === slug);
  const o = await currentOverlay();
  return base && o ? localizeProduct(base, o) : base;
}

export async function getRelatedProducts(product: Product): Promise<Product[]> {
  const base = useDb
    ? await (await db()).getRelatedProducts(product)
    : products
        .filter((p) => p.categorySlug === product.categorySlug && p.slug !== product.slug)
        .slice(0, 3);
  const o = await currentOverlay();
  return o ? base.map((p) => localizeProduct(p, o)) : base;
}

export async function getBundles(): Promise<Bundle[]> {
  if (useDb) return (await db()).getBundles();
  return bundles;
}

export async function getCoas(search?: string): Promise<Coa[]> {
  if (useDb) return (await db()).getCoas(search);
  if (!search) return coas;
  const q = search.toLowerCase();
  return coas.filter(
    (c) => c.batch.toLowerCase().includes(q) || c.productName.toLowerCase().includes(q),
  );
}

export async function verifyCoa(batch: string): Promise<Coa | undefined> {
  if (useDb) return (await db()).verifyCoa(batch);
  return coas.find((c) => c.batch.toLowerCase() === batch.trim().toLowerCase());
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const base = useDb ? await (await db()).getBlogPosts() : blogPosts;
  const o = await currentOverlay();
  return o ? base.map((b) => localizeBlogPost(b, o)) : base;
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const base = useDb ? await (await db()).getBlogPost(slug) : blogPosts.find((p) => p.slug === slug);
  const o = await currentOverlay();
  return base && o ? localizeBlogPost(base, o) : base;
}

export function getAveragePurity(): number {
  return AVERAGE_PURITY;
}

export interface ReviewSummary {
  count: number;
  average: number; // 0 when no reviews
  reviews: Review[];
}

/**
 * Reviews for a product group (shared across size variants, keyed by name).
 * Reviews are first-party sample content served from the data layer in both
 * backends — there is no user-generated write path yet.
 */
export function getProductReviews(productName: string): ReviewSummary {
  const list = reviews
    .filter((r) => r.productName === productName)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const average =
    list.length === 0
      ? 0
      : Math.round((list.reduce((s, r) => s + r.rating, 0) / list.length) * 10) / 10;
  return { count: list.length, average, reviews: list };
}
