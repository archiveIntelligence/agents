import type {
  Bundle,
  BlogPost,
  Category,
  Coa,
  MonographSection,
  Product,
  ProductHighlight,
  StockStatus,
} from "@/lib/types";
import type { ProductQuery } from "@/lib/repository";
import { prisma } from "./prisma";

// Maps Prisma rows -> domain types so the UI keeps a single, stable shape
// regardless of whether data comes from Postgres or the seed dataset.

const stockToDomain: Record<string, StockStatus> = {
  IN_STOCK: "in_stock",
  LOW_STOCK: "low_stock",
  OUT_OF_STOCK: "out_of_stock",
  PRE_ORDER: "pre_order",
};

type ProductRow = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  priceCents: number;
  compareAtCents: number | null;
  size: string;
  purity: number;
  stock: string;
  featured: boolean;
  specs: unknown;
  highlights: unknown;
  monograph: unknown;
  category: { slug: string };
  coas: { batch: string }[];
};

function toProduct(row: ProductRow): Product {
  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    categorySlug: row.category.slug,
    priceCents: row.priceCents,
    compareAtCents: row.compareAtCents ?? undefined,
    size: row.size,
    purity: row.purity,
    stock: stockToDomain[row.stock] ?? "out_of_stock",
    coaBatches: row.coas.map((c) => c.batch),
    featured: row.featured,
    specs: (row.specs as { label: string; value: string }[]) ?? [],
    highlights: (row.highlights as ProductHighlight[]) ?? [],
    monograph: (row.monograph as MonographSection[] | null) ?? undefined,
  };
}

const productInclude = { category: true, coas: true } as const;

export async function getCategories(): Promise<Category[]> {
  const rows = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return rows.map((c) => ({ slug: c.slug, name: c.name, description: c.description }));
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  const c = await prisma.category.findUnique({ where: { slug } });
  return c ? { slug: c.slug, name: c.name, description: c.description } : undefined;
}

export async function getProducts(query: ProductQuery = {}): Promise<Product[]> {
  const orderBy =
    query.sort === "price-asc"
      ? { priceCents: "asc" as const }
      : query.sort === "price-desc"
        ? { priceCents: "desc" as const }
        : query.sort === "purity-desc"
          ? { purity: "desc" as const }
          : { featured: "desc" as const };

  const rows = await prisma.product.findMany({
    where: {
      category: query.category ? { slug: query.category } : undefined,
      stock: query.inStockOnly ? { in: ["IN_STOCK", "LOW_STOCK"] } : undefined,
      OR: query.search
        ? [
            { name: { contains: query.search, mode: "insensitive" } },
            { tagline: { contains: query.search, mode: "insensitive" } },
            { description: { contains: query.search, mode: "insensitive" } },
          ]
        : undefined,
    },
    include: productInclude,
    orderBy,
  });
  return rows.map(toProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { featured: true },
    include: productInclude,
  });
  return rows.map(toProduct);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const row = await prisma.product.findUnique({ where: { slug }, include: productInclude });
  return row ? toProduct(row) : undefined;
}

export async function getRelatedProducts(product: Product): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { category: { slug: product.categorySlug }, slug: { not: product.slug } },
    include: productInclude,
    take: 3,
  });
  return rows.map(toProduct);
}

export async function getBundles(): Promise<Bundle[]> {
  const rows = await prisma.bundle.findMany({ include: { items: { include: { product: true } } } });
  return rows.map((b) => ({
    slug: b.slug,
    name: b.name,
    description: b.description,
    savingsPercent: b.savingsPercent,
    productSlugs: b.items.map((i) => i.product.slug),
  }));
}

export async function getCoas(search?: string): Promise<Coa[]> {
  const rows = await prisma.coa.findMany({
    where: search
      ? {
          OR: [
            { batch: { contains: search, mode: "insensitive" } },
            { product: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : undefined,
    include: { product: true },
    orderBy: { testedOn: "desc" },
  });
  return rows.map((c) => ({
    batch: c.batch,
    productSlug: c.product.slug,
    productName: c.product.name,
    testedOn: c.testedOn.toISOString(),
    purity: c.purity,
    lab: c.lab,
    verifyUrl: c.verifyUrl,
  }));
}

export async function verifyCoa(batch: string): Promise<Coa | undefined> {
  const c = await prisma.coa.findUnique({
    where: { batch: batch.trim() },
    include: { product: true },
  });
  return c
    ? {
        batch: c.batch,
        productSlug: c.product.slug,
        productName: c.product.name,
        testedOn: c.testedOn.toISOString(),
        purity: c.purity,
        lab: c.lab,
        verifyUrl: c.verifyUrl,
      }
    : undefined;
}

function toBlogPost(p: {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  publishedOn: Date;
  readingMinutes: number;
}): BlogPost {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    body: p.body,
    category: p.category,
    publishedOn: p.publishedOn.toISOString(),
    readingMinutes: p.readingMinutes,
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const rows = await prisma.blogPost.findMany({ orderBy: { publishedOn: "desc" } });
  return rows.map(toBlogPost);
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const p = await prisma.blogPost.findUnique({ where: { slug } });
  return p ? toBlogPost(p) : undefined;
}
