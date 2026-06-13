// Pure pricing logic — shared by client cart UI and server order handling.
// All money values are integer EUR cents.

export const BULK_DISCOUNT_THRESHOLD = 3; // total units
export const BULK_DISCOUNT_RATE = 0.05; // 5%
export const FREE_SHIPPING_THRESHOLD_CENTS = 20000; // €200
export const FLAT_SHIPPING_CENTS = 499; // €4.99
export const VAT_RATE = 0.19; // applied to net subtotal at checkout

export interface PricingLine {
  priceCents: number;
  quantity: number;
}

export interface PriceBreakdown {
  itemCount: number;
  subtotalCents: number;
  bulkDiscountCents: number;
  netCents: number;
  vatCents: number;
  shippingCents: number;
  totalCents: number;
  freeShipping: boolean;
}

export function priceCart(lines: PricingLine[]): PriceBreakdown {
  const itemCount = lines.reduce((n, l) => n + l.quantity, 0);
  const subtotalCents = lines.reduce((sum, l) => sum + l.priceCents * l.quantity, 0);

  const bulkDiscountCents =
    itemCount >= BULK_DISCOUNT_THRESHOLD
      ? Math.round(subtotalCents * BULK_DISCOUNT_RATE)
      : 0;

  const netCents = subtotalCents - bulkDiscountCents;
  const vatCents = Math.round(netCents * VAT_RATE);

  const freeShipping = netCents >= FREE_SHIPPING_THRESHOLD_CENTS;
  const shippingCents = itemCount === 0 || freeShipping ? 0 : FLAT_SHIPPING_CENTS;

  const totalCents = netCents + vatCents + shippingCents;

  return {
    itemCount,
    subtotalCents,
    bulkDiscountCents,
    netCents,
    vatCents,
    shippingCents,
    totalCents,
    freeShipping,
  };
}
