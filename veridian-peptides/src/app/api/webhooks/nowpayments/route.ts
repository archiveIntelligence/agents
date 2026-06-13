import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments/registry";

// NOWPayments IPN endpoint. Verifies the signature, then reconciles the order.
// Idempotent: replaying the same "paid" event is a no-op once the order is PAID.
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-nowpayments-sig");

  const provider = getPaymentProvider("crypto");
  const event = provider.parseWebhook
    ? await provider.parseWebhook(rawBody, signature)
    : null;

  if (!event) {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    // Nothing to persist against; acknowledge so the provider stops retrying.
    return NextResponse.json({ received: true });
  }

  const { prisma } = await import("@/lib/db/prisma");

  const order = event.orderReference
    ? await prisma.order.findUnique({ where: { reference: event.orderReference } })
    : null;

  if (!order) {
    return NextResponse.json({ error: "order not found" }, { status: 404 });
  }

  // Map provider status -> order status, never downgrading a paid order.
  if (event.status === "paid" && order.status !== "PAID") {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "PAID", providerRef: event.providerRef },
    });
  } else if (event.status === "failed" && order.status === "PENDING_PAYMENT") {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "CANCELLED", providerRef: event.providerRef },
    });
  }

  return NextResponse.json({ received: true });
}
