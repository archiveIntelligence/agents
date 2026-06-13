"use server";

import { products } from "@/lib/data";
import { priceCart } from "./pricing";
import { getPaymentProvider } from "@/lib/payments/registry";
import type { PaymentInitiation, PaymentMethod } from "@/lib/payments/types";

export type { PaymentMethod };

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
  payment?: PaymentInitiation;
  error?: string;
}

const methodToEnum: Record<PaymentMethod, "SEPA" | "PAYSERA" | "CRYPTO"> = {
  sepa: "SEPA",
  paysera: "PAYSERA",
  crypto: "CRYPTO",
};

// Server-side validation, order persistence and payment initiation.
// The price is recomputed on the server from authoritative product data —
// client totals are never trusted.
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
  if (!["sepa", "paysera", "crypto"].includes(input.paymentMethod)) {
    return { ok: false, error: "Unsupported payment method." };
  }

  const validItems = input.items
    .map((i) => {
      const product = products.find((p) => p.slug === i.slug);
      return product ? { product, quantity: i.quantity } : null;
    })
    .filter((x): x is { product: (typeof products)[number]; quantity: number } => x !== null);

  if (validItems.length === 0) {
    return { ok: false, error: "No valid items in cart." };
  }

  const breakdown = priceCart(
    validItems.map((i) => ({ priceCents: i.product.priceCents, quantity: i.quantity })),
  );
  const reference = `VP-${Date.now().toString(36).toUpperCase()}`;

  let orderId: string | null = null;

  // Persist to Postgres when configured.
  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import("@/lib/db/prisma");
      const dbProducts = await prisma.product.findMany({
        where: { slug: { in: validItems.map((i) => i.product.slug) } },
        select: { id: true, slug: true },
      });
      const idBySlug = new Map(dbProducts.map((p) => [p.slug, p.id]));

      const order = await prisma.order.create({
        data: {
          reference,
          email: input.contact.email,
          firstName: input.contact.firstName,
          lastName: input.contact.lastName,
          addressLine1: input.address.line1,
          city: input.address.city,
          postalCode: input.address.postalCode,
          country: input.address.country,
          paymentMethod: methodToEnum[input.paymentMethod],
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
      orderId = order.id;
    } catch (err) {
      console.error("Order persistence failed", err);
      return { ok: false, error: "We couldn't process your order. Please try again." };
    }
  }

  // Initiate payment through the configured provider.
  let payment: PaymentInitiation;
  try {
    payment = await getPaymentProvider(input.paymentMethod).createCheckout({
      reference,
      totalCents: breakdown.totalCents,
      currency: "EUR",
      email: input.contact.email,
    });
  } catch (err) {
    console.error("Payment initiation failed", err);
    return { ok: false, error: "Payment could not be started. Please try again." };
  }

  // Record the provider invoice reference for webhook reconciliation.
  if (orderId && payment.kind === "redirect") {
    try {
      const { prisma } = await import("@/lib/db/prisma");
      await prisma.order.update({
        where: { id: orderId },
        data: { providerRef: payment.providerRef },
      });
    } catch (err) {
      console.error("Failed to store provider reference", err);
    }
  }

  return {
    ok: true,
    orderId: reference,
    totalCents: breakdown.totalCents,
    paymentMethod: input.paymentMethod,
    payment,
  };
}
