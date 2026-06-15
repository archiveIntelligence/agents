import Link from "next/link";
import type { Product } from "@/lib/types";
import { stockLabel, discountPercent } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/i18n/price";
import { VialImage } from "@/components/product/vial-image";

const toneMap = { ok: "ok", warn: "warn", off: "off" } as const;

export function ProductCard({
  product,
  sizeCount = 1,
}: {
  product: Product;
  /** When > 1, the card represents a product group and shows a "from" price. */
  sizeCount?: number;
}) {
  const stock = stockLabel(product.stock);
  const isGroup = sizeCount > 1;
  const savePct = discountPercent(product.priceCents, product.compareAtCents);
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3]">
        <VialImage
          name={product.name}
          size={product.size}
          className="h-full w-full transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3">
          <Badge tone="brand">{product.purity}% purity</Badge>
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-lg tracking-tight transition-colors group-hover:text-brand-700">
            {product.name}
          </h3>
          <Badge tone={toneMap[stock.tone]}>{stock.text}</Badge>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.tagline}</p>
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            {isGroup ? <span className="mr-1 text-xs text-muted-foreground">from</span> : null}
            <Price cents={product.priceCents} className="text-lg font-semibold" />
            {product.compareAtCents ? (
              <span className="ml-2 inline-flex items-baseline gap-1">
                <Price cents={product.compareAtCents} strike className="text-sm" />
                {savePct ? (
                  <span className="text-xs font-semibold text-brand-700">−{savePct}%</span>
                ) : null}
              </span>
            ) : null}
          </div>
          <span className="text-xs text-muted-foreground">
            {isGroup ? `${sizeCount} sizes` : product.size}
          </span>
        </div>
      </div>
    </Link>
  );
}
