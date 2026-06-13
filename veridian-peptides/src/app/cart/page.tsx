"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";
import { useCurrency } from "@/components/i18n/currency-provider";
import { ButtonLink } from "@/components/ui/button";
import { OrderSummary } from "@/components/cart/order-summary";

export default function CartPage() {
  const { lines, breakdown, setQuantity, remove, ready } = useCart();
  const { format: formatPrice } = useCurrency();

  if (ready && lines.length === 0) {
    return (
      <div className="container-px py-20 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">
          Browse our independently tested research peptides to get started.
        </p>
        <div className="mt-6">
          <ButtonLink href="/products">Shop all peptides</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="container-px py-12">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">Your cart</h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
        <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
          {lines.map((line) => (
            <li key={line.slug} className="flex gap-4 p-4">
              <div className="flex h-20 w-20 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-accent-50">
                <svg width="36" height="36" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                  <rect x="24" y="6" width="16" height="6" rx="2" fill="var(--color-brand-600)" />
                  <path d="M26 12h12v36a6 6 0 0 1-12 0V12Z" fill="white" stroke="var(--color-brand-600)" strokeWidth="2" />
                  <path d="M26 34h12v14a6 6 0 0 1-12 0V34Z" fill="var(--color-brand-300)" />
                </svg>
              </div>

              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link href={`/products/${line.slug}`} className="font-semibold hover:text-brand-600">
                      {line.product.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{line.product.size}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {formatPrice(line.product.priceCents * line.quantity)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatPrice(line.product.priceCents)} each
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex h-9 items-center rounded-full border border-border">
                    <button
                      aria-label="Decrease quantity"
                      onClick={() => setQuantity(line.slug, line.quantity - 1)}
                      className="h-full w-9 rounded-l-full hover:bg-surface-muted"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">{line.quantity}</span>
                    <button
                      aria-label="Increase quantity"
                      onClick={() => setQuantity(line.slug, line.quantity + 1)}
                      className="h-full w-9 rounded-r-full hover:bg-surface-muted"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => remove(line.slug)}
                    className="text-sm text-muted-foreground hover:text-error"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-border bg-surface p-6">
          <OrderSummary breakdown={breakdown} />
          <ButtonLink href="/checkout" className="mt-6 w-full">
            Proceed to checkout
          </ButtonLink>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            For research use only. Not for human consumption.
          </p>
        </aside>
      </div>
    </div>
  );
}
