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
import { stockLabel, discountPercent, pricePerMgCents } from "@/lib/format";
import { Price } from "@/components/i18n/price";
import { BULK_DISCOUNT_THRESHOLD, BULK_DISCOUNT_RATE } from "@/lib/cart/pricing";

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
  const savePct = discountPercent(product.priceCents, product.compareAtCents);
  const perMgCents = pricePerMgCents(product.priceCents, product.size);
  const bulkUnitPriceCents = Math.round(product.priceCents * (1 - BULK_DISCOUNT_RATE));

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.tagline,
    category: category?.name,
    sku: product.slug,
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: (product.priceCents / 100).toFixed(2),
      availability:
        product.stock === "out_of_stock"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
    },
  };

  return (
    <div className="container-px py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
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
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-brand-50 via-surface to-ink-100 shadow-soft">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(13,111,80,0.10),transparent_60%)]" />
          <svg width="120" height="120" viewBox="0 0 64 64" fill="none" aria-hidden="true" className="relative drop-shadow-sm">
            <rect x="24" y="6" width="16" height="6" rx="2" fill="var(--color-brand-700)" />
            <path d="M26 12h12v36a6 6 0 0 1-12 0V12Z" fill="white" stroke="var(--color-brand-700)" strokeWidth="2" />
            <path d="M26 32h12v16a6 6 0 0 1-12 0V32Z" fill="var(--color-brand-300)" />
          </svg>
        </div>

        {/* Details */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand">{product.purity}% purity</Badge>
            <Badge tone={toneMap[stock.tone]}>{stock.text}</Badge>
          </div>
          <h1 className="mt-4 text-4xl tracking-tight">{product.name}</h1>
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{product.tagline}</p>

          <div className="mt-6 flex flex-wrap items-end gap-3">
            <Price cents={product.priceCents} className="font-display text-4xl text-foreground" />
            {product.compareAtCents ? (
              <Price cents={product.compareAtCents} strike className="pb-1.5" />
            ) : null}
            <span className="pb-1.5 text-sm text-muted-foreground">/ {product.size}</span>
            {savePct ? (
              <span className="mb-1 inline-flex items-center rounded-full bg-brand-700 px-2.5 py-0.5 text-xs font-semibold text-white">
                Save {savePct}%
              </span>
            ) : null}
          </div>

          {perMgCents ? (
            <p className="mt-1.5 text-sm text-muted-foreground">
              <Price cents={perMgCents} className="font-medium text-foreground" /> per mg
            </p>
          ) : null}

          {/* Honest urgency — driven by the real stock status, no invented counts */}
          {product.stock === "low_stock" ? (
            <p className="mt-4 flex items-center gap-2 text-sm font-medium text-gold-600">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-gold-500" />
              Low stock — this batch is selling quickly
            </p>
          ) : product.stock === "pre_order" ? (
            <p className="mt-4 text-sm font-medium text-gold-600">
              Pre-order now — reserve your unit from the next tested batch
            </p>
          ) : null}

          <div className="mt-6">
            <AddToCart
              slug={product.slug}
              label={product.stock === "pre_order" ? "Pre-order" : "Add to cart"}
              disabled={product.stock === "out_of_stock"}
            />
          </div>

          {/* Bulk anchoring — the per-unit price drops at the real 3-unit threshold */}
          <div className="mt-4 flex items-center justify-between rounded-xl border border-gold-200 bg-gold-100/50 p-3.5 text-sm">
            <span className="text-ink-700">
              Buy {BULK_DISCOUNT_THRESHOLD}+ units —{" "}
              <span className="font-semibold">save {Math.round(BULK_DISCOUNT_RATE * 100)}%</span>
            </span>
            <span className="text-muted-foreground">
              <Price cents={bulkUnitPriceCents} className="font-semibold text-brand-700" /> / unit
            </span>
          </div>

          {/* Authority / risk-reversal row */}
          <ul className="mt-6 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            {[
              "Independent HPLC purity report",
              "Public certificate of analysis",
              "Tracked EU shipping",
              "Discreet, temperature-aware dispatch",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-muted-foreground">
                <CheckMark /> {item}
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <h2 className="eyebrow">Description</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{product.description}</p>
          </div>

          <div className="mt-10">
            <h2 className="eyebrow">Specifications</h2>
            <dl className="mt-3 divide-y divide-border rounded-xl border border-border bg-surface shadow-soft">
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
        <section className="mt-24">
          <h2 className="mb-6 text-3xl tracking-tight">You may also like</h2>
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

function CheckMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="flex-none">
      <circle cx="8" cy="8" r="8" fill="var(--color-brand-100)" />
      <path d="M4.5 8.2l2.2 2.2 4.8-4.9" stroke="var(--color-brand-700)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
