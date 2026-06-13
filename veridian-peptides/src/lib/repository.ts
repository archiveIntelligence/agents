import {
  AVERAGE_PURITY,
  blogPosts,
  bundles,
  categories,
  coas,
  products,
} from "./data";
import type { Bundle, BlogPost, Category, Coa, Product } from "./types";

// Thin data-access layer. Today it serves the in-memory seed dataset;
// swapping these functions for Prisma/Postgres queries later requires
// no changes in the UI layer. Async signatures mirror a real DB.

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  return categories.find((c) => c.slug === slug);
}

export interface ProductQuery {
  category?: string;
  search?: string;
  inStockOnly?: boolean;
  sort?: "featured" | "price-asc" | "price-desc" | "purity-desc";
}

export async function getProducts(query: ProductQuery = {}): Promise<Product[]> {
  let result = [...products];

  if (query.category) {
    result = result.filter((p) => p.categorySlug === query.category);
  }
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

  return result;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return products.filter((p) => p.featured);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

export async function getRelatedProducts(product: Product): Promise<Product[]> {
  return products
    .filter((p) => p.categorySlug === product.categorySlug && p.slug !== product.slug)
    .slice(0, 3);
}

export async function getBundles(): Promise<Bundle[]> {
  return bundles;
}

export async function getCoas(search?: string): Promise<Coa[]> {
  if (!search) return coas;
  const q = search.toLowerCase();
  return coas.filter(
    (c) =>
      c.batch.toLowerCase().includes(q) ||
      c.productName.toLowerCase().includes(q),
  );
}

export async function verifyCoa(batch: string): Promise<Coa | undefined> {
  return coas.find((c) => c.batch.toLowerCase() === batch.trim().toLowerCase());
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return blogPosts;
}

export function getAveragePurity(): number {
  return AVERAGE_PURITY;
}
