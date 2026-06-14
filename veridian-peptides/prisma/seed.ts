import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, StockStatus } from "../src/generated/prisma/client";
import {
  blogPosts,
  bundles,
  categories,
  coas,
  products,
} from "../src/lib/data";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const stockMap: Record<string, StockStatus> = {
  in_stock: "IN_STOCK",
  low_stock: "LOW_STOCK",
  out_of_stock: "OUT_OF_STOCK",
  pre_order: "PRE_ORDER",
};

async function main() {
  console.log("Seeding database…");

  // Clear existing rows (idempotent re-seed). Order matters for FKs.
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.bundleItem.deleteMany();
  await prisma.coa.deleteMany();
  await prisma.bundle.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.blogPost.deleteMany();

  const categoryIdBySlug = new Map<string, string>();
  for (const c of categories) {
    const row = await prisma.category.create({
      data: { slug: c.slug, name: c.name, description: c.description },
    });
    categoryIdBySlug.set(c.slug, row.id);
  }

  const productIdBySlug = new Map<string, string>();
  for (const p of products) {
    const row = await prisma.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        priceCents: p.priceCents,
        compareAtCents: p.compareAtCents ?? null,
        size: p.size,
        purity: p.purity,
        stock: stockMap[p.stock],
        featured: p.featured ?? false,
        specs: p.specs,
        categoryId: categoryIdBySlug.get(p.categorySlug)!,
      },
    });
    productIdBySlug.set(p.slug, row.id);
  }

  for (const c of coas) {
    await prisma.coa.create({
      data: {
        batch: c.batch,
        testedOn: new Date(c.testedOn),
        purity: c.purity,
        lab: c.lab,
        verifyUrl: c.verifyUrl,
        productId: productIdBySlug.get(c.productSlug)!,
      },
    });
  }

  for (const b of bundles) {
    await prisma.bundle.create({
      data: {
        slug: b.slug,
        name: b.name,
        description: b.description,
        savingsPercent: b.savingsPercent,
        items: {
          create: b.productSlugs.map((slug) => ({
            productId: productIdBySlug.get(slug)!,
          })),
        },
      },
    });
  }

  for (const post of blogPosts) {
    await prisma.blogPost.create({
      data: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        body: post.body ?? "",
        category: post.category,
        publishedOn: new Date(post.publishedOn),
        readingMinutes: post.readingMinutes,
      },
    });
  }

  // Seed an admin account (idempotent). Override the password via ADMIN_PASSWORD.
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@veridian-peptides.test";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin12345";
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN" },
    create: {
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      firstName: "Site",
      lastName: "Admin",
      role: "ADMIN",
    },
  });

  console.log(
    `Seeded ${categories.length} categories, ${products.length} products, ${coas.length} COAs, ${bundles.length} bundles, ${blogPosts.length} posts.`,
  );
  console.log(`Admin: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
