"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/i18n/price";
import { ProductImage } from "@/components/product/product-image";
import { useCart } from "@/lib/cart/cart-context";

export interface StackItem {
  slug: string;
  name: string;
  size: string;
  priceCents: number;
}

export interface StackCardProps {
  slug: string;
  name: string;
  description: string;
  savingsPercent: number;
  items: StackItem[];
}

export function StackCard({ name, description, savingsPercent, items }: StackCardProps) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  // Combined list price and the honest discounted stack price. Both derive
  // purely from the configured savingsPercent, so nothing shown is invented.
  const full = items.reduce((sum, p) => sum + p.priceCents, 0);
  const discounted = Math.round(full * (1 - savingsPercent / 100));

  function addStack() {
    for (const item of items) add(item.slug);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-soft transition-shadow hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight text-balance">{name}</h3>
        <Badge tone="brand">Save {savingsPercent}%</Badge>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>

      {/* Included products as vial thumbnails */}
      <div className="mt-5 flex gap-3 overflow-x-auto pb-1">
        {items.map((p) => (
          <Link
            key={p.slug}
            href={`/products/${p.slug}`}
            className="group/item shrink-0"
            title={`${p.name} ${p.size}`}
          >
            <ProductImage
              name={p.name}
              size={p.size}
              slug={p.slug}
              showSize={false}
              className="h-24 w-20 rounded-xl border border-border transition-transform group-hover/item:-translate-y-0.5"
            />
          </Link>
        ))}
      </div>

      <ul className="mt-4 space-y-1 text-sm">
        {items.map((p) => (
          <li key={p.slug} className="flex justify-between gap-3">
            <Link href={`/products/${p.slug}`} className="hover:text-brand-700">
              {p.name} <span className="text-muted-foreground">· {p.size}</span>
            </Link>
            <Price cents={p.priceCents} className="shrink-0 text-muted-foreground" />
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-end justify-between gap-3 pt-5">
        <div>
          <p className="eyebrow text-muted-foreground">Stack price</p>
          <Price cents={discounted} className="text-2xl font-semibold" />
          <Price cents={full} strike className="ml-2 text-sm" />
        </div>
        <Button size="sm" onClick={addStack} disabled={items.length === 0}>
          {added ? "Added ✓" : "Add stack to cart"}
        </Button>
      </div>
    </div>
  );
}
