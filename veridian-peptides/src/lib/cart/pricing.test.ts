import { describe, expect, it } from "vitest";
import {
  FLAT_SHIPPING_CENTS,
  FREE_SHIPPING_THRESHOLD_CENTS,
  priceCart,
} from "./pricing";

describe("priceCart", () => {
  it("returns zeros for an empty cart", () => {
    const b = priceCart([]);
    expect(b.itemCount).toBe(0);
    expect(b.totalCents).toBe(0);
    expect(b.shippingCents).toBe(0);
  });

  it("charges flat shipping below the free threshold", () => {
    const b = priceCart([{ priceCents: 5000, quantity: 1 }]);
    expect(b.shippingCents).toBe(FLAT_SHIPPING_CENTS);
    expect(b.freeShipping).toBe(false);
  });

  it("applies the bulk discount at 3+ units", () => {
    const two = priceCart([{ priceCents: 1000, quantity: 2 }]);
    expect(two.bulkDiscountCents).toBe(0);

    const three = priceCart([{ priceCents: 1000, quantity: 3 }]);
    expect(three.bulkDiscountCents).toBe(150); // 5% of 3000
    expect(three.netCents).toBe(2850);
  });

  it("gives free shipping once net is over the threshold", () => {
    const b = priceCart([{ priceCents: FREE_SHIPPING_THRESHOLD_CENTS, quantity: 1 }]);
    expect(b.freeShipping).toBe(true);
    expect(b.shippingCents).toBe(0);
  });

  it("computes VAT on the discounted net and a consistent total", () => {
    const b = priceCart([{ priceCents: 10000, quantity: 3 }]);
    // subtotal 30000, -5% = 1500 discount, net 28500, VAT 19% = 5415
    expect(b.subtotalCents).toBe(30000);
    expect(b.bulkDiscountCents).toBe(1500);
    expect(b.vatCents).toBe(5415);
    expect(b.totalCents).toBe(b.netCents + b.vatCents + b.shippingCents);
  });
});
