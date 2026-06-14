import Link from "next/link";
import type { Product } from "@/lib/types";
import { stockLabel } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/i18n/price";

const toneMap = { ok: "ok", warn: "warn", off: "off" } as const;

export function ProductCard({ product }: { product: Product }) {
  const stock = stockLabel(product.stock);
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
    >
      {/* Placeholder product visual — SVG vial, no third-party imagery */}
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-brand-50 via-surface to-ink-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(13,111,80,0.10),transparent_60%)]" />
        <div className="transition-transform duration-500 group-hover:scale-110">
          <VialGlyph />
        </div>
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
            <Price cents={product.priceCents} className="text-lg font-semibold" />
            {product.compareAtCents ? (
              <Price cents={product.compareAtCents} strike className="ml-2 text-sm" />
            ) : null}
          </div>
          <span className="text-xs text-muted-foreground">{product.size}</span>
        </div>
      </div>
    </Link>
  );
}

function VialGlyph() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="24" y="6" width="16" height="6" rx="2" fill="var(--color-brand-600)" />
      <path
        d="M26 12h12v36a6 6 0 0 1-12 0V12Z"
        fill="white"
        stroke="var(--color-brand-600)"
        strokeWidth="2"
      />
      <path d="M26 34h12v14a6 6 0 0 1-12 0V34Z" fill="var(--color-brand-300)" />
    </svg>
  );
}
