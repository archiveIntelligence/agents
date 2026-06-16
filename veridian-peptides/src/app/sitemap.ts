import type { MetadataRoute } from "next";
import { getBlogPosts, getCategories, getProducts } from "@/lib/repository";

const SITE_URL = "https://verum-biolabs.test";

const STATIC_PATHS = [
  "",
  "/products",
  "/stacks",
  "/quality",
  "/coa",
  "/coa/verify",
  "/blog",
  "/about",
  "/contact",
  "/faq",
  "/shipping",
  "/security",
  "/wholesale",
  "/affiliate",
  "/legal/privacy",
  "/legal/terms",
  "/legal/cookies",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, posts] = await Promise.all([
    getProducts(),
    getCategories(),
    getBlogPosts(),
  ]);

  const now = new Date();
  const entry = (path: string): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
  });

  return [
    ...STATIC_PATHS.map(entry),
    ...categories.map((c) => entry(`/products?category=${c.slug}`)),
    ...products.map((p) => entry(`/products/${p.slug}`)),
    ...posts.map((p) => entry(`/blog/${p.slug}`)),
  ];
}
