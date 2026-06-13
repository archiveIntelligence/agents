import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { AddToCart } from "@/components/product/add-to-cart";
import { ProductCard } from "@/components/product/product-card";
import {
  getCategory,
  getCoas,
  getProduct,
  getRelatedProducts,
} from "@/lib/repository";
import { products } from "@/lib/data";
import { formatPrice, stockLabel } from "@/lib/format";

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.tagline,
  };
}

const toneMap = { ok: "ok", warn: "warn", off: "off" } as const;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [category, related, allCoas] = await Promise.all([
    getCategory(product.categorySlug),
    getRelatedProducts(product),
    getCoas(),
  ]);
  const stock = stockLabel(product.stock);
  const coa = allCoas.find((c) => product.coaBatches.includes(c.batch));

  return (
    <div className="container-px py-12">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/products" className="hover:text-foreground">
          All peptides
        </Link>
        {category ? (
          <>
            {" / "}
            <Link href={`/products?category=${category.slug}`} className="hover:text-foreground">
              {category.name}
            </Link>
          </>
        ) : null}
        {" / "}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Visual */}
        <div className="flex aspect-square items-center justify-center rounded-2xl border border-border bg-gradient-to-br from-brand-50 to-accent-50">
          <svg width="120" height="120" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <rect x="24" y="6" width="16" height="6" rx="2" fill="var(--color-brand-600)" />
            <path d="M26 12h12v36a6 6 0 0 1-12 0V12Z" fill="white" stroke="var(--color-brand-600)" strokeWidth="2" />
            <path d="M26 32h12v16a6 6 0 0 1-12 0V32Z" fill="var(--color-brand-300)" />
          </svg>
        </div>

        {/* Details */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand">{product.purity}% purity</Badge>
            <Badge tone={toneMap[stock.tone]}>{stock.text}</Badge>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{product.name}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{product.tagline}</p>

          <div className="mt-6 flex items-end gap-3">
            <span className="text-3xl font-semibold">{formatPrice(product.priceCents)}</span>
            {product.compareAtCents ? (
              <span className="pb-1 text-muted-foreground line-through">
                {formatPrice(product.compareAtCents)}
              </span>
            ) : null}
            <span className="pb-1 text-sm text-muted-foreground">/ {product.size}</span>
          </div>

          <div className="mt-6">
            <AddToCart
              slug={product.slug}
              label={product.stock === "pre_order" ? "Pre-order" : "Add to cart"}
              disabled={product.stock === "out_of_stock"}
            />
          </div>

          <p className="mt-4 rounded-lg bg-surface-muted p-3 text-xs text-muted-foreground">
            Bulk discount: buy 3 or more units and save 5% automatically at checkout.
          </p>

          <div className="mt-8">
            <h2 className="text-sm font-semibold">Description</h2>
            <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
          </div>

          <div className="mt-8">
            <h2 className="text-sm font-semibold">Specifications</h2>
            <dl className="mt-3 divide-y divide-border rounded-xl border border-border">
              {product.specs.map((s) => (
                <div key={s.label} className="flex justify-between px-4 py-2 text-sm">
                  <dt className="text-muted-foreground">{s.label}</dt>
                  <dd className="font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {coa ? (
            <div className="mt-8 rounded-xl border border-brand-200 bg-brand-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-brand-800">Certificate of Analysis</div>
                  <div className="font-mono text-xs text-brand-700">{coa.batch}</div>
                </div>
                <Link href={`/coa?q=${coa.batch}`} className="text-sm font-medium text-brand-700 hover:text-brand-800">
                  View COA →
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-20">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">Related products</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
