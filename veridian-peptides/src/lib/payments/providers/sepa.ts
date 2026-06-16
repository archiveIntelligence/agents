import type { PaymentOrder, PaymentInitiation, PaymentProvider } from "../types";
import { formatPrice } from "@/lib/format";

// SEPA bank transfer. No external API: the customer receives transfer
// instructions and the order ships once funds are reconciled (manually or
// via a bank-feed integration in a later milestone).
export const sepaProvider: PaymentProvider = {
  method: "sepa",
  async createCheckout(order: PaymentOrder): Promise<PaymentInitiation> {
    return {
      kind: "instructions",
      title: "SEPA bank transfer",
      lines: [
        `Amount: ${formatPrice(order.totalCents)}`,
        "Account holder: VERUM Biolabs",
        "IBAN: DE00 0000 0000 0000 0000 00 (sandbox)",
        "BIC: XXXXDEXXXXX",
        `Reference: ${order.reference}`,
        "Your order ships once payment is received.",
      ],
    };
  },
};
