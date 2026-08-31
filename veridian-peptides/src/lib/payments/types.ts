// Payment provider abstraction.
// The checkout flow depends only on this interface, so providers (SEPA,
// Paysera, crypto card-to-stablecoin, …) can be swapped via configuration
// without touching the storefront. This matters in a high-risk category
// where the active acquirer may change based on underwriting.

export type PaymentMethod = "sepa" | "paysera" | "crypto";

export interface PaymentOrder {
  reference: string;
  totalCents: number;
  currency: "EUR";
  email: string;
}

/** Result returned to the client after initiating payment. */
export type PaymentInitiation =
  | {
      kind: "instructions";
      /** Human-readable steps (e.g. SEPA bank-transfer details). */
      title: string;
      lines: string[];
    }
  | {
      kind: "redirect";
      /** Hosted invoice / checkout URL to send the customer to. */
      url: string;
      providerRef: string;
    };

/** Normalised webhook outcome, mapped from a provider-specific payload. */
export interface PaymentEvent {
  providerRef: string;
  /** Our order reference, when the provider echoes it back. */
  orderReference?: string;
  status: "paid" | "pending" | "failed";
  /** Settlement currency the merchant actually receives (e.g. USDT). */
  settlementCurrency?: string;
}

export interface PaymentProvider {
  readonly method: PaymentMethod;
  /** Begin payment for an order. */
  createCheckout(order: PaymentOrder): Promise<PaymentInitiation>;
  /**
   * Verify and parse an incoming webhook. Returns null when the signature is
   * invalid or the event is not relevant. Implementations must be safe to call
   * repeatedly with the same payload (idempotency is enforced by the caller).
   */
  parseWebhook?(rawBody: string, signature: string | null): Promise<PaymentEvent | null>;
}
