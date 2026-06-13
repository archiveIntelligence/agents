"use server";

import { products } from "@/lib/data";
import { priceCart } from "./pricing";

export type PaymentMethod = "sepa" | "paysera";

export interface PlaceOrderInput {
  items: { slug: string; quantity: number }[];
  contact: { email: string; firstName: string; lastName: string };
  address: { line1: string; city: string; postalCode: string; country: string };
  paymentMethod: PaymentMethod;
}

export interface PlaceOrderResult {
  ok: boolean;
  orderId?: string;
  totalCents?: number;
  paymentMethod?: PaymentMethod;
  error?: string;
}

// Server-side validation + (mock) order creation. The price is recomputed on
// the server from authoritative product data — never trust client totals.
// A later milestone replaces the mock with a DB write + payment intent.
export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  if (!input.items?.length) {
    return { ok: false, error: "Your cart is empty." };
  }
  if (!input.contact?.email?.includes("@")) {
    return { ok: false, error: "A valid email address is required." };
  }
  if (!input.address?.line1 || !input.address?.city || !input.address?.postalCode) {
    return { ok: false, error: "A complete shipping address is required." };
  }
  if (input.paymentMethod !== "sepa" && input.paymentMethod !== "paysera") {
    return { ok: false, error: "Unsupported payment method." };
  }

  const lines = input.items
    .map((i) => {
      const product = products.find((p) => p.slug === i.slug);
      return product ? { priceCents: product.priceCents, quantity: i.quantity } : null;
    })
    .filter((l): l is { priceCents: number; quantity: number } => l !== null);

  if (lines.length === 0) {
    return { ok: false, error: "No valid items in cart." };
  }

  const breakdown = priceCart(lines);

  // Mock persistence — generate a human-friendly order reference.
  const orderId = `VP-${Date.now().toString(36).toUpperCase()}`;

  return {
    ok: true,
    orderId,
    totalCents: breakdown.totalCents,
    paymentMethod: input.paymentMethod,
  };
}
