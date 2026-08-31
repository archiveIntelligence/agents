import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { TrustBadges } from "@/components/ui/trust-badges";
import { AddToCart } from "@/components/product/add-to-cart";
import { StickyBuyBar } from "@/components/product/sticky-buy-bar";
import { ProductCard } from "@/components/product/product-card";
import { ProductHighlights } from "@/components/product/product-highlights";
import { ProductMonograph } from "@/components/product/product-monograph";
import { ProductImage } from "@/components/product/product-image";
import { ProductReviews } from "@/components/product/product-reviews";
import { CompleteThePack, type PackItem } from "@/components/product/complete-the-pack";
import { StarRating } from "@/components/product/star-rating";
import {
  getCategory,
  getCoas,
  getProduct,
  getProducts,
  getProductReviews,
  getRelatedProducts,
} from "@/lib/repository";
import { products } from "@/lib/data";
import { stockLabel, discountPercent, pricePerMgCents, formatDate } from "@/lib/format";
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

  const [category, relatedRaw, allCoas, allProducts] = await Promise.all([
    getCategory(product.categorySlug),
    getRelatedProducts(product),
    getCoas(),
    getProducts({}),
  ]);

  // Size variants of this product share the same name; offer them as a selector.
  const siblings = allProducts
    .filter((p) => p.name === product.name)
    .sort((a, b) => a.priceCents - b.priceCents);

  // "You may also like": one card per other product group, excluding this one.
  const relatedByName = new Map<string, (typeof relatedRaw)[number]>();
  for (const p of relatedRaw) {
    if (p.name === product.name) continue;
    if (!relatedByName.has(p.name)) relatedByName.set(p.name, p);
  }
  const related = [...relatedByName.values()].slice(0, 3);

  const stock = stockLabel(product.stock);
  const coa = allCoas.find((c) => product.coaBatches.includes(c.batch));
  const savePct = discountPercent(product.priceCents, product.compareAtCents);
  const perMgCents = pricePerMgCents(product.priceCents, product.size);
  const bulkUnitPriceCents = Math.round(product.priceCents * (1 - BULK_DISCOUNT_RATE));

  const reviewSummary = getProductReviews(product.name);

  // Complete-the-pack: this item + a complementary research compound +
  // reconstitution water (genuinely complementary, not co-purchase stats).
  const bacWater =
    product.name === "Bacteriostatic Water"
      ? undefined
      : allProducts.find((p) => p.name === "Bacteriostatic Water");
  const packItems: PackItem[] = [
    { slug: product.slug, name: product.name, size: product.size, priceCents: product.priceCents },
    ...(related[0]
      ? [{ slug: related[0].slug, name: related[0].name, size: related[0].size, priceCents: related[0].priceCents }]
      : []),
    ...(bacWater
      ? [{ slug: bacWater.slug, name: bacWater.name, size: bacWater.size, priceCents: bacWater.priceCents }]
      : []),
  ];

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
    ...(reviewSummary.count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: reviewSummary.average,
            reviewCount: reviewSummary.count,
          },
        }
      : {}),
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
        <ProductImage
          name={product.name}
          size={product.size}
          slug={product.slug}
          className="aspect-square rounded-2xl border border-border shadow-soft"
        />

        {/* Details */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand">{product.purity}% purity</Badge>
            <Badge tone={toneMap[stock.tone]}>{stock.text}</Badge>
          </div>
          <h1 className="mt-4 text-4xl tracking-tight">{product.name}</h1>

          {reviewSummary.count > 0 ? (
            <a href="#reviews" className="mt-2 inline-flex items-center gap-2 text-sm">
              <StarRating value={reviewSummary.average} size={15} />
              <span className="font-medium text-foreground">{reviewSummary.average.toFixed(1)}</span>
              <span className="text-muted-foreground hover:text-foreground">
                ({reviewSummary.count} review{reviewSummary.count === 1 ? "" : "s"})
              </span>
            </a>
          ) : null}

          <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{product.tagline}</p>

          {/* Lead with skimmable buzzword highlights — minimal text, icons. */}
          <ProductHighlights highlights={product.highlights} />

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

          {/* Size variant selector */}
          {siblings.length > 1 ? (
            <div className="mt-6">
              <span className="eyebrow">Size</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {siblings.map((s) => {
                  const active = s.slug === product.slug;
                  return (
                    <Link
                      key={s.slug}
                      href={`/products/${s.slug}`}
                      aria-current={active ? "true" : undefined}
                      className={`rounded-xl border px-4 py-2 text-sm transition-all ${
                        active
                          ? "border-brand-700 bg-brand-50 font-semibold text-brand-800 shadow-soft"
                          : "border-border text-foreground hover:border-brand-300 hover:bg-surface-muted"
                      }`}
                    >
                      {s.size}
                    </Link>
                  );
                })}
              </div>
            </div>
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

          {/* Authority signal close to the CTA — recency from the real batch
              test date, not invented "X bought today" social proof. */}
          {coa ? (
            <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-brand-800">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <VerifiedSeal /> Independently verified — {product.purity}% purity
              </span>
              <span className="text-muted-foreground">
                batch {coa.batch}, last tested {formatDate(coa.testedOn)}
              </span>
            </p>
          ) : null}

          <div className="mt-4">
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

          {/* Authority / risk-reversal cluster — shared, benefit-led copy */}
          <TrustBadges variant="grid" className="mt-6" />

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

            {/* Depth for those who want it: the full package-insert monograph,
                collapsed by default behind an accessible accordion. */}
            {product.monograph && product.monograph.length > 0 ? (
              <ProductMonograph sections={product.monograph} />
            ) : null}
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

      <CompleteThePack items={packItems} />

      <ProductReviews
        average={reviewSummary.average}
        count={reviewSummary.count}
        reviews={reviewSummary.reviews}
      />

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

      {/* Spacer so the mobile sticky buy bar never overlaps page content. */}
      <div className="h-20 lg:hidden" aria-hidden="true" />
      <StickyBuyBar
        slug={product.slug}
        name={product.name}
        size={product.size}
        priceCents={product.priceCents}
        compareAtCents={product.compareAtCents}
        savePct={savePct}
        label={product.stock === "pre_order" ? "Pre-order" : "Add to cart"}
        disabled={product.stock === "out_of_stock"}
      />
    </div>
  );
}

function VerifiedSeal() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="flex-none">
      <path
        d="M8 1l1.8 1.1 2.1-.3.6 2 1.7 1.3-.9 1.9.9 1.9-1.7 1.3-.6 2-2.1-.3L8 15l-1.8-1.1-2.1.3-.6-2-1.7-1.3.9-1.9-.9-1.9 1.7-1.3.6-2 2.1.3L8 1z"
        fill="var(--color-brand-100)"
        stroke="var(--color-brand-700)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path d="M5.4 8.1l1.7 1.7 3.5-3.6" stroke="var(--color-brand-700)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
