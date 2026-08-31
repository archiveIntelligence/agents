import crypto from "node:crypto";
import type { PaymentOrder, PaymentInitiation, PaymentProvider, PaymentEvent } from "../types";

// Card-to-stablecoin via NOWPayments.
// The customer can pay by card on the hosted invoice page; the merchant
// settles in a stablecoin (USDT/USDC). No card volatility or rolling reserve
// on the merchant side. Configure via env:
//   NOWPAYMENTS_API_KEY      — REST API key
//   NOWPAYMENTS_IPN_SECRET   — webhook (IPN) signing secret
//   NOWPAYMENTS_PAY_CURRENCY — settlement coin, e.g. "usdttrc20" / "usdcmatic"
//   APP_URL                  — base URL for success/cancel redirects
// Without an API key the provider runs in sandbox mode and returns a mock
// invoice URL so the whole flow stays exercisable.

const API_BASE = "https://api.nowpayments.io/v1";

function settlementCurrency(): string {
  return process.env.NOWPAYMENTS_PAY_CURRENCY ?? "usdttrc20";
}

/** Sort object keys recursively — NOWPayments signs the sorted JSON. */
function sortObject(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(sortObject);
  if (obj && typeof obj === "object") {
    return Object.keys(obj as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortObject((obj as Record<string, unknown>)[key]);
        return acc;
      }, {});
  }
  return obj;
}

export const nowPaymentsProvider: PaymentProvider = {
  method: "crypto",

  async createCheckout(order: PaymentOrder): Promise<PaymentInitiation> {
    const apiKey = process.env.NOWPAYMENTS_API_KEY;
    const appUrl = process.env.APP_URL ?? "http://localhost:3000";

    // Sandbox: no API key -> mock hosted invoice.
    if (!apiKey) {
      const providerRef = `np_sandbox_${order.reference}`;
      return {
        kind: "redirect",
        url: `/checkout/sandbox/${providerRef}`,
        providerRef,
      };
    }

    const res = await fetch(`${API_BASE}/invoice`, {
      method: "POST",
      headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        price_amount: order.totalCents / 100,
        price_currency: "eur",
        pay_currency: settlementCurrency(),
        order_id: order.reference,
        order_description: `VERUM Biolabs order ${order.reference}`,
        success_url: `${appUrl}/checkout?paid=1`,
        cancel_url: `${appUrl}/cart`,
        is_fee_paid_by_user: true,
      }),
    });

    if (!res.ok) {
      throw new Error(`NOWPayments invoice failed: ${res.status}`);
    }

    const data = (await res.json()) as { id: string; invoice_url: string };
    return { kind: "redirect", url: data.invoice_url, providerRef: String(data.id) };
  },

  async parseWebhook(rawBody: string, signature: string | null): Promise<PaymentEvent | null> {
    const secret = process.env.NOWPAYMENTS_IPN_SECRET;
    if (!secret || !signature) return null;

    // Verify HMAC-SHA512 over the key-sorted JSON body.
    const parsed = JSON.parse(rawBody) as Record<string, unknown>;
    const expected = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(sortObject(parsed)))
      .digest("hex");

    const a = Buffer.from(expected);
    const b = Buffer.from(signature);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

    const paymentStatus = String(parsed.payment_status ?? "");
    const status: PaymentEvent["status"] =
      paymentStatus === "finished" || paymentStatus === "confirmed"
        ? "paid"
        : paymentStatus === "failed" || paymentStatus === "expired" || paymentStatus === "refunded"
          ? "failed"
          : "pending";

    return {
      providerRef: String(parsed.payment_id ?? parsed.invoice_id ?? ""),
      orderReference: parsed.order_id ? String(parsed.order_id) : undefined,
      status,
      settlementCurrency: parsed.pay_currency ? String(parsed.pay_currency) : settlementCurrency(),
    };
  },
};
