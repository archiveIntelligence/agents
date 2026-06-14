"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/button";
import { confirmSandboxPayment } from "@/lib/cart/sandbox";

export function SandboxPay({ providerRef }: { providerRef: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "paying" | "paid">("idle");

  async function pay() {
    setStatus("paying");
    await confirmSandboxPayment(providerRef);
    setStatus("paid");
    router.refresh();
  }

  if (status === "paid") {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-8 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-700 text-xl font-bold text-white">
          ✓
        </span>
        <h1 className="mt-4 text-2xl font-semibold text-brand-900">Payment confirmed</h1>
        <p className="mt-2 text-sm text-brand-700">
          The merchant has been settled in stablecoin (sandbox). Your order is now paid.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <ButtonLink href="/track">Track order</ButtonLink>
          <ButtonLink href="/products" variant="secondary">
            Continue shopping
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-8 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Hosted payment (sandbox)</h1>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        This stands in for the provider&apos;s hosted invoice page. In production the
        customer pays by card here and the merchant receives USDC/USDT; a webhook
        then marks the order paid.
      </p>
      <p className="mt-4 font-mono text-xs text-muted-foreground">{providerRef}</p>
      <div className="mt-6 flex justify-center gap-3">
        <Button onClick={pay} disabled={status === "paying"}>
          {status === "paying" ? "Processing…" : "Simulate successful payment"}
        </Button>
        <ButtonLink href="/cart" variant="secondary">
          Cancel
        </ButtonLink>
      </div>
    </div>
  );
}
