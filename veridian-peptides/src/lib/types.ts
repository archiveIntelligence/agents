// Domain types for the Veridian Peptides storefront.
// These mirror the eventual database schema so the seed-backed
// repository can later be swapped for Prisma/Postgres without
// touching the presentation layer.

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock" | "pre_order";

export interface Category {
  slug: string;
  name: string;
  description: string;
}

export interface Product {
  slug: string;
  name: string;
  /** Short marketing tagline. */
  tagline: string;
  description: string;
  categorySlug: string;
  /** Price in EUR cents. */
  priceCents: number;
  /** Optional list price for showing a discount. */
  compareAtCents?: number;
  /** e.g. "10mg" */
  size: string;
  /** Average HPLC purity, percent. */
  purity: number;
  stock: StockStatus;
  /** Linked certificate of analysis batch numbers. */
  coaBatches: string[];
  /** Highlighted on the homepage grid. */
  featured?: boolean;
  /** Research-use specs shown on the PDP. */
  specs: { label: string; value: string }[];
}

export interface Bundle {
  slug: string;
  name: string;
  description: string;
  productSlugs: string[];
  /** Percentage saved versus buying items individually. */
  savingsPercent: number;
}

export interface Coa {
  batch: string;
  productSlug: string;
  productName: string;
  /** ISO date string. */
  testedOn: string;
  purity: number;
  lab: string;
  /** External verification URL (mocked). */
  verifyUrl: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedOn: string;
  readingMinutes: number;
}
