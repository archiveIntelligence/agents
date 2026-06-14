"use client";

// Goal-gradient nudges — honest conversion psychology.
// Every figure here is derived from real cart state and the real pricing
// thresholds in lib/cart/pricing.ts. No invented scarcity or fake timers.

import {
  BULK_DISCOUNT_THRESHOLD,
  BULK_DISCOUNT_RATE,
  FREE_SHIPPING_THRESHOLD_CENTS,
  type PriceBreakdown,
} from "@/lib/cart/pricing";
import { useCurrency } from "@/components/i18n/currency-provider";

export function IncentiveMeter({ breakdown }: { breakdown: PriceBreakdown }) {
  const { format: formatPrice } = useCurrency();
  const { netCents, itemCount, freeShipping } = breakdown;

  if (itemCount === 0) return null;

  const shipPct = Math.min(100, Math.round((netCents / FREE_SHIPPING_THRESHOLD_CENTS) * 100));
  const remainingCents = Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - netCents);

  const bulkUnlocked = itemCount >= BULK_DISCOUNT_THRESHOLD;
  const unitsToBulk = Math.max(0, BULK_DISCOUNT_THRESHOLD - itemCount);

  return (
    <div className="space-y-3">
      {/* Free shipping goal gradient */}
      <div className="rounded-xl border border-border bg-surface p-3.5">
        {freeShipping ? (
          <p className="flex items-center gap-2 text-sm font-medium text-brand-700">
            <Check /> Free shipping unlocked
          </p>
        ) : (
          <p className="text-sm">
            Add <span className="font-semibold text-brand-700">{formatPrice(remainingCents)}</span>{" "}
            more for <span className="font-medium">free shipping</span>
          </p>
        )}
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700 transition-all duration-500"
            style={{ width: `${freeShipping ? 100 : shipPct}%` }}
          />
        </div>
      </div>

      {/* Bulk discount nudge */}
      {bulkUnlocked ? (
        <p className="flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 p-3 text-sm font-medium text-brand-800">
          <Check /> {Math.round(BULK_DISCOUNT_RATE * 100)}% bulk discount applied
        </p>
      ) : (
        <p className="rounded-xl border border-gold-200 bg-gold-100/60 p-3 text-sm text-ink-700">
          Add{" "}
          <span className="font-semibold">
            {unitsToBulk} more unit{unitsToBulk === 1 ? "" : "s"}
          </span>{" "}
          to unlock a {Math.round(BULK_DISCOUNT_RATE * 100)}% discount
        </p>
      )}
    </div>
  );
}

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="flex-none">
      <circle cx="8" cy="8" r="8" fill="var(--color-brand-600)" />
      <path d="M4.5 8.2l2.2 2.2 4.8-4.9" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
