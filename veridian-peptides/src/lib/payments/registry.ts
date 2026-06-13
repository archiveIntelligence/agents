import type { PaymentMethod, PaymentProvider } from "./types";
import { sepaProvider } from "./providers/sepa";
import { payseraProvider } from "./providers/paysera";
import { nowPaymentsProvider } from "./providers/nowpayments";

// Single place to register payment providers. The crypto slot points at
// NOWPayments today; swapping it for Cryptomus (or another card-to-stablecoin
// gateway) is a one-line change here.
const providers: Record<PaymentMethod, PaymentProvider> = {
  sepa: sepaProvider,
  paysera: payseraProvider,
  crypto: nowPaymentsProvider,
};

export function getPaymentProvider(method: PaymentMethod): PaymentProvider {
  return providers[method];
}

export function allProviders(): PaymentProvider[] {
  return Object.values(providers);
}
