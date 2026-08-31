// Domain types for the VERUM Biolabs storefront.
// These mirror the eventual database schema so the seed-backed
// repository can later be swapped for Prisma/Postgres without
// touching the presentation layer.

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock" | "pre_order";

export interface Category {
  slug: string;
  name: string;
  description: string;
}

// Authored as object-literal `type` aliases (not interfaces) so they carry an
// implicit index signature and stay assignable to Prisma's JSON input type when
// persisted to the `highlights`/`monograph` Json columns.

/** Short, skimmable buzzword bullet shown at the top of the PDP. */
export type ProductHighlight = {
  /** Icon key resolved to an inline SVG glyph in the UI (no icon-font dep). */
  icon: string;
  /** Punchy label, e.g. "Triple-receptor agonist" or "HPLC ≥99%". */
  label: string;
};

/** One section of the long "package insert" monograph. */
export type MonographSection = {
  heading: string;
  /** Plain text; supports blank-line paragraphs and "- " bullet lines. */
  body: string;
};

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
  /** Punchy buzzword bullets shown first on the PDP (3–5 items). */
  highlights: ProductHighlight[];
  /** Long "package insert"-style monograph, revealed in an accordion. */
  monograph?: MonographSection[];
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

export interface Review {
  /** Product group name this review is about (shared across size variants). */
  productName: string;
  author: string;
  /** 1–5 stars. */
  rating: number;
  title: string;
  body: string;
  /** True when tied to a confirmed order. */
  verified: boolean;
  /** ISO date string. */
  date: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  /** Long-form body (CMS-managed). Optional in the seed dataset. */
  body?: string;
  category: string;
  publishedOn: string;
  readingMinutes: number;
}
