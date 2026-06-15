"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart/cart-context";
import { Price } from "@/components/i18n/price";
import { Button } from "@/components/ui/button";

// Sticky buy bar for the mobile PDP: keeps the price anchor and the single
// primary CTA in reach while the buyer scrolls the description/specs.
// Hidden on lg+ where the buy box is always visible. No fake urgency.
export function StickyBuyBar({
  slug,
  name,
  size,
  priceCents,
  compareAtCents,
  savePct,
  label,
  disabled,
}: {
  slug: string;
  name: string;
  size: string;
  priceCents: number;
  compareAtCents?: number;
  savePct?: number | null;
  label: string;
  disabled?: boolean;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add(slug, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-4 py-3 shadow-lift backdrop-blur lg:hidden">
      <div className="container-px flex items-center gap-3 px-0">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-muted-foreground">
            {name} · {size}
          </p>
          <div className="flex items-baseline gap-2">
            <Price cents={priceCents} className="font-display text-lg text-foreground" />
            {compareAtCents ? <Price cents={compareAtCents} strike className="text-xs" /> : null}
            {savePct ? (
              <span className="rounded-full bg-brand-700 px-1.5 py-0.5 text-[0.65rem] font-semibold text-white">
                −{savePct}%
              </span>
            ) : null}
          </div>
        </div>
        <Button size="md" onClick={handleAdd} disabled={disabled} className="flex-none">
          {added ? "Added ✓" : label}
        </Button>
      </div>
      <p aria-live="polite" className="sr-only">
        {added ? `${name} added to cart` : ""}
      </p>
    </div>
  );
}
