import crypto from "node:crypto";
import { beforeAll, describe, expect, it } from "vitest";
import { nowPaymentsProvider } from "./nowpayments";

const SECRET = "test_ipn_secret";

function sign(body: object): string {
  const sort = (o: unknown): unknown => {
    if (Array.isArray(o)) return o.map(sort);
    if (o && typeof o === "object") {
      return Object.keys(o as Record<string, unknown>)
        .sort()
        .reduce<Record<string, unknown>>((a, k) => {
          a[k] = sort((o as Record<string, unknown>)[k]);
          return a;
        }, {});
    }
    return o;
  };
  return crypto.createHmac("sha512", SECRET).update(JSON.stringify(sort(body))).digest("hex");
}

describe("nowPaymentsProvider", () => {
  beforeAll(() => {
    process.env.NOWPAYMENTS_IPN_SECRET = SECRET;
  });

  it("returns a sandbox redirect when no API key is set", async () => {
    delete process.env.NOWPAYMENTS_API_KEY;
    const init = await nowPaymentsProvider.createCheckout({
      reference: "VP-TEST",
      totalCents: 9900,
      currency: "EUR",
      email: "r@lab.test",
    });
    expect(init.kind).toBe("redirect");
    if (init.kind === "redirect") {
      expect(init.url).toContain("/checkout/sandbox/");
      expect(init.providerRef).toContain("VP-TEST");
    }
  });

  it("accepts a correctly signed paid webhook", async () => {
    const payload = {
      payment_id: 42,
      order_id: "VP-TEST",
      payment_status: "finished",
      pay_currency: "usdttrc20",
    };
    const event = await nowPaymentsProvider.parseWebhook!(JSON.stringify(payload), sign(payload));
    expect(event).not.toBeNull();
    expect(event?.status).toBe("paid");
    expect(event?.orderReference).toBe("VP-TEST");
  });

  it("rejects a tampered signature", async () => {
    const payload = { payment_id: 42, payment_status: "finished" };
    const event = await nowPaymentsProvider.parseWebhook!(JSON.stringify(payload), "deadbeef");
    expect(event).toBeNull();
  });

  it("maps non-final statuses to pending", async () => {
    const payload = { payment_id: 7, order_id: "VP-X", payment_status: "waiting" };
    const event = await nowPaymentsProvider.parseWebhook!(JSON.stringify(payload), sign(payload));
    expect(event?.status).toBe("pending");
  });
});
