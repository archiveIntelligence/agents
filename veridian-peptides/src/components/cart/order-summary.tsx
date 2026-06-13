import { formatPrice } from "@/lib/format";
import {
  BULK_DISCOUNT_THRESHOLD,
  FREE_SHIPPING_THRESHOLD_CENTS,
  type PriceBreakdown,
} from "@/lib/cart/pricing";

export function OrderSummary({ breakdown }: { breakdown: PriceBreakdown }) {
  const {
    itemCount,
    subtotalCents,
    bulkDiscountCents,
    vatCents,
    shippingCents,
    totalCents,
    freeShipping,
  } = breakdown;

  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Order summary
      </h2>
      <dl className="mt-4 space-y-2 text-sm">
        <Row label={`Subtotal (${itemCount} item${itemCount === 1 ? "" : "s"})`} value={formatPrice(subtotalCents)} />
        {bulkDiscountCents > 0 ? (
          <Row label={`Bulk discount (${BULK_DISCOUNT_THRESHOLD}+ units)`} value={`−${formatPrice(bulkDiscountCents)}`} accent />
        ) : null}
        <Row label="VAT (19%)" value={formatPrice(vatCents)} />
        <Row
          label="Shipping"
          value={freeShipping ? "Free" : formatPrice(shippingCents)}
        />
      </dl>

      {!freeShipping && itemCount > 0 ? (
        <p className="mt-3 rounded-lg bg-surface-muted p-2 text-xs text-muted-foreground">
          Free shipping on net orders over {formatPrice(FREE_SHIPPING_THRESHOLD_CENTS)}.
        </p>
      ) : null}

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-base font-semibold">
        <span>Total</span>
        <span>{formatPrice(totalCents)}</span>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={accent ? "font-medium text-brand-600" : "font-medium"}>{value}</dd>
    </div>
  );
}
