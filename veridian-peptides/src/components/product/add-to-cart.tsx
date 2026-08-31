"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/cart-context";

export function AddToCart({
  slug,
  label,
  disabled,
}: {
  slug: string;
  label: string;
  disabled?: boolean;
}) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add(slug, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex h-12 items-center rounded-full border border-border">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="h-full w-11 rounded-l-full text-lg hover:bg-surface-muted"
        >
          −
        </button>
        <span className="w-8 text-center text-sm font-medium">{qty}</span>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => setQty((q) => q + 1)}
          className="h-full w-11 rounded-r-full text-lg hover:bg-surface-muted"
        >
          +
        </button>
      </div>

      {/* One unambiguous primary action (Hick's Law); "View cart" stays quiet
          until the buyer has acted. */}
      <Button
        size="lg"
        onClick={handleAdd}
        disabled={disabled}
        className={added ? "bg-brand-800" : undefined}
      >
        {added ? "Added ✓" : label}
      </Button>
      <Button size="lg" variant="ghost" onClick={() => router.push("/cart")}>
        View cart →
      </Button>

      {/* Polite live region so assistive tech announces the add. */}
      <p aria-live="polite" className="sr-only">
        {added ? `${qty} added to cart` : ""}
      </p>
    </div>
  );
}
