"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";

type StockEnum = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "PRE_ORDER";
type OrderStatusEnum = "PENDING_PAYMENT" | "PAID" | "FULFILLED" | "CANCELLED" | "REFUNDED";

const STOCKS: StockEnum[] = ["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK", "PRE_ORDER"];
const ORDER_STATUSES: OrderStatusEnum[] = [
  "PENDING_PAYMENT",
  "PAID",
  "FULFILLED",
  "CANCELLED",
  "REFUNDED",
];

export async function updateProduct(formData: FormData): Promise<void> {
  await requireAdmin();
  const { prisma } = await import("@/lib/db/prisma");

  const slug = String(formData.get("slug"));
  const priceCents = Math.max(0, Math.round(Number(formData.get("priceEuros")) * 100));
  const purity = Math.min(100, Math.max(0, Number(formData.get("purity"))));
  const stockRaw = String(formData.get("stock")) as StockEnum;
  const stock = STOCKS.includes(stockRaw) ? stockRaw : "IN_STOCK";
  const featured = formData.get("featured") === "on";
  const tagline = String(formData.get("tagline") ?? "");
  const description = String(formData.get("description") ?? "");

  await prisma.product.update({
    where: { slug },
    data: { priceCents, purity, stock, featured, tagline, description },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/products/${slug}`);
  revalidatePath("/products");
}

export async function updateOrderStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const { prisma } = await import("@/lib/db/prisma");

  const reference = String(formData.get("reference"));
  const statusRaw = String(formData.get("status")) as OrderStatusEnum;
  const status = ORDER_STATUSES.includes(statusRaw) ? statusRaw : "PENDING_PAYMENT";

  await prisma.order.update({ where: { reference }, data: { status } });
  revalidatePath("/admin/orders");
}

export async function createCoa(formData: FormData): Promise<void> {
  await requireAdmin();
  const { prisma } = await import("@/lib/db/prisma");

  const productSlug = String(formData.get("productSlug"));
  const product = await prisma.product.findUnique({ where: { slug: productSlug } });
  if (!product) return;

  await prisma.coa.create({
    data: {
      batch: String(formData.get("batch")).trim(),
      testedOn: new Date(String(formData.get("testedOn"))),
      purity: Number(formData.get("purity")),
      lab: String(formData.get("lab") ?? "Independent HPLC Lab"),
      verifyUrl: String(formData.get("verifyUrl") ?? ""),
      productId: product.id,
    },
  });

  revalidatePath("/admin/coa");
  revalidatePath("/coa");
}

export async function createBlogPost(formData: FormData): Promise<void> {
  await requireAdmin();
  const { prisma } = await import("@/lib/db/prisma");

  const title = String(formData.get("title")).trim();
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  await prisma.blogPost.create({
    data: {
      slug,
      title,
      excerpt: String(formData.get("excerpt") ?? ""),
      body: String(formData.get("body") ?? ""),
      category: String(formData.get("category") ?? "Guides"),
      publishedOn: new Date(),
      readingMinutes: Math.max(1, Number(formData.get("readingMinutes")) || 5),
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
