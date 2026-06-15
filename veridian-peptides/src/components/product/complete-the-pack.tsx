"use client";

// "Complete the pack" — an Amazon-style complementary-products module.
// Honest framing: it suggests genuinely complementary items (reconstitution
// water + a related research compound), NOT real co-purchase statistics, so it
// is titled "Complete the pack" rather than "frequently bought together".

import { useState } from "react";
import { useCart } from "@/lib/cart/cart-context";
import { useCurrency } from "@/components/i18n/currency-provider";
import { VialImage } from "@/components/product/vial-image";

export interface PackItem {
  slug: string;
  name: string;
  size: string;
  priceCents: number;
}

export function CompleteThePack({ items }: { items: PackItem[] }) {
  const { add } = useCart();
  const { format } = useCurrency();
  const [added, setAdded] = useState(false);
  if (items.length < 2) return null;

  const total = items.reduce((s, it) => s + it.priceCents, 0);

  function addAll() {
    for (const it of items) add(it.slug, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <section className="mt-24">
      <h2 className="mb-2 text-3xl tracking-tight">Complete the pack</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Reconstitution water and a complementary research compound — added in one click.
      </p>

      <div className="flex flex-col gap-6 rounded-2xl border border-border bg-surface p-6 shadow-soft lg:flex-row lg:items-center">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {items.map((it, i) => (
            <div key={it.slug} className="flex items-center gap-3">
              {i > 0 ? <span className="text-2xl font-light text-muted-foreground">+</span> : null}
              <div className="flex items-center gap-3">
                <VialImage
                  name={it.name}
                  size={it.size}
                  className="h-16 w-16 flex-none rounded-xl border border-border"
                />
                <div className="text-sm">
                  <div className="font-medium leading-tight">{it.name}</div>
                  <div className="text-muted-foreground">
                    {it.size} · {format(it.priceCents)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-none items-center gap-4 lg:flex-col lg:items-end">
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Pack total</div>
            <div className="font-display text-2xl text-foreground">{format(total)}</div>
          </div>
          <button
            type="button"
            onClick={addAll}
            className="h-12 rounded-full bg-brand-700 px-6 text-sm font-medium text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-brand-800 hover:shadow-lift"
          >
            {added ? "Added ✓" : `Add all ${items.length} to cart`}
          </button>
        </div>
      </div>
    </section>
  );
}
