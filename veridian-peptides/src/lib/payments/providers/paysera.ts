import type { PaymentOrder, PaymentInitiation, PaymentProvider } from "../types";

// Paysera redirect checkout. In production this builds a signed request to
// Paysera's gateway; in sandbox (no PAYSERA_PROJECT_ID) we return a mock
// hosted-checkout URL so the flow is exercisable end to end.
export const payseraProvider: PaymentProvider = {
  method: "paysera",
  async createCheckout(order: PaymentOrder): Promise<PaymentInitiation> {
    const projectId = process.env.PAYSERA_PROJECT_ID;
    const providerRef = `paysera_${order.reference}`;

    const url = projectId
      ? `https://www.paysera.com/pay/?projectid=${projectId}&orderid=${order.reference}&amount=${order.totalCents}&currency=EUR`
      : `/checkout/sandbox/${providerRef}`;

    return { kind: "redirect", url, providerRef };
  },
};
