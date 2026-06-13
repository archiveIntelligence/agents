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

  const validItems = input.items
    .map((i) => {
      const product = products.find((p) => p.slug === i.slug);
      return product ? { product, quantity: i.quantity } : null;
    })
    .filter((x): x is { product: (typeof products)[number]; quantity: number } => x !== null);

  const breakdown = priceCart(lines);
  const reference = `VP-${Date.now().toString(36).toUpperCase()}`;

  // Persist to Postgres when configured; otherwise return a mock reference.
  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import("@/lib/db/prisma");
      const dbProducts = await prisma.product.findMany({
        where: { slug: { in: validItems.map((i) => i.product.slug) } },
        select: { id: true, slug: true },
      });
      const idBySlug = new Map(dbProducts.map((p) => [p.slug, p.id]));

      await prisma.order.create({
        data: {
          reference,
          email: input.contact.email,
          firstName: input.contact.firstName,
          lastName: input.contact.lastName,
          addressLine1: input.address.line1,
          city: input.address.city,
          postalCode: input.address.postalCode,
          country: input.address.country,
          paymentMethod: input.paymentMethod === "sepa" ? "SEPA" : "PAYSERA",
          subtotalCents: breakdown.subtotalCents,
          bulkDiscountCents: breakdown.bulkDiscountCents,
          vatCents: breakdown.vatCents,
          shippingCents: breakdown.shippingCents,
          totalCents: breakdown.totalCents,
          items: {
            create: validItems
              .filter((i) => idBySlug.has(i.product.slug))
              .map((i) => ({
                productId: idBySlug.get(i.product.slug)!,
                productName: i.product.name,
                unitPriceCents: i.product.priceCents,
                quantity: i.quantity,
              })),
          },
        },
      });
    } catch (err) {
      console.error("Order persistence failed", err);
      return { ok: false, error: "We couldn't process your order. Please try again." };
    }
  }

  return {
    ok: true,
    orderId: reference,
    totalCents: breakdown.totalCents,
    paymentMethod: input.paymentMethod,
  };
}
