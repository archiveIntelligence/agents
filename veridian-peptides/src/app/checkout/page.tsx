"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { formatPrice } from "@/lib/format";
import { Button, ButtonLink } from "@/components/ui/button";
import { OrderSummary } from "@/components/cart/order-summary";
import { placeOrder, type PaymentMethod } from "@/lib/cart/actions";
import type { PaymentInitiation } from "@/lib/payments/types";

type Step = "details" | "payment" | "review" | "done";

const EU_COUNTRIES = ["Germany", "Austria", "Netherlands", "France", "Ireland", "Romania"];

function paymentLabel(method: PaymentMethod): string {
  if (method === "sepa") return "SEPA bank transfer";
  if (method === "paysera") return "Paysera";
  return "Card → crypto (USDC/USDT)";
}

export default function CheckoutPage() {
  const { lines, breakdown, clear, ready } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<Step>("details");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [initiation, setInitiation] = useState<PaymentInitiation | null>(null);

  const [contact, setContact] = useState({ email: "", firstName: "", lastName: "" });
  const [address, setAddress] = useState({ line1: "", city: "", postalCode: "", country: "Germany" });
  const [payment, setPayment] = useState<PaymentMethod>("sepa");

  if (ready && lines.length === 0 && step !== "done") {
    return (
      <div className="container-px py-20 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Nothing to check out</h1>
        <p className="mt-2 text-muted-foreground">Your cart is empty.</p>
        <div className="mt-6">
          <ButtonLink href="/products">Shop all peptides</ButtonLink>
        </div>
      </div>
    );
  }

  const detailsValid =
    contact.email.includes("@") &&
    contact.firstName &&
    contact.lastName &&
    address.line1 &&
    address.city &&
    address.postalCode;

  async function submit() {
    setSubmitting(true);
    setError(null);
    const result = await placeOrder({
      items: lines.map((l) => ({ slug: l.slug, quantity: l.quantity })),
      contact,
      address,
      paymentMethod: payment,
    });
    if (result.ok && result.orderId) {
      setOrderId(result.orderId);
      clear();

      // Redirect-based providers (Paysera, crypto): send the customer to the
      // hosted invoice/checkout. Internal sandbox URLs use client navigation;
      // external URLs use a full redirect.
      if (result.payment?.kind === "redirect") {
        const url = result.payment.url;
        if (url.startsWith("http")) {
          window.location.href = url;
          return;
        }
        router.push(url);
        return;
      }

      setInitiation(result.payment ?? null);
      setStep("done");
    } else {
      setError(result.error ?? "Something went wrong. Please try again.");
    }
    setSubmitting(false);
  }

  if (step === "done" && orderId) {
    return (
      <div className="container-px py-20">
        <div className="mx-auto max-w-lg rounded-2xl border border-brand-200 bg-brand-50 p-8 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-xl font-bold text-white">
            ✓
          </span>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-brand-900">
            Order placed
          </h1>
          <p className="mt-2 text-brand-800">
            Thank you. Your order reference is{" "}
            <span className="font-mono font-semibold">{orderId}</span>.
          </p>

          {initiation?.kind === "instructions" ? (
            <div className="mt-6 rounded-xl border border-brand-200 bg-background p-4 text-left">
              <div className="text-sm font-semibold">{initiation.title}</div>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {initiation.lines.map((l) => (
                  <li key={l} className="font-mono">{l}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-4 text-sm text-brand-700">
              Your order ships once payment is confirmed.
            </p>
          )}
          <div className="mt-6 flex justify-center gap-3">
            <ButtonLink href="/track">Track order</ButtonLink>
            <ButtonLink href="/products" variant="secondary">
              Continue shopping
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-px py-12">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Checkout</h1>
      <Steps current={step} />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem]">
        <div className="rounded-2xl border border-border bg-surface p-6">
          {step === "details" && (
            <div className="space-y-6">
              <Section title="Contact">
                <Field label="Email" value={contact.email} onChange={(v) => setContact({ ...contact, email: v })} type="email" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="First name" value={contact.firstName} onChange={(v) => setContact({ ...contact, firstName: v })} />
                  <Field label="Last name" value={contact.lastName} onChange={(v) => setContact({ ...contact, lastName: v })} />
                </div>
              </Section>
              <Section title="Shipping address">
                <Field label="Address" value={address.line1} onChange={(v) => setAddress({ ...address, line1: v })} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="City" value={address.city} onChange={(v) => setAddress({ ...address, city: v })} />
                  <Field label="Postal code" value={address.postalCode} onChange={(v) => setAddress({ ...address, postalCode: v })} />
                </div>
                <label className="block">
                  <span className="mb-1 block text-sm text-muted-foreground">Country</span>
                  <select
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm"
                  >
                    {EU_COUNTRIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </Section>
              <Button onClick={() => setStep("payment")} disabled={!detailsValid}>
                Continue to payment
              </Button>
            </div>
          )}

          {step === "payment" && (
            <div className="space-y-6">
              <Section title="Payment method">
                <PaymentOption
                  id="sepa"
                  selected={payment === "sepa"}
                  onSelect={() => setPayment("sepa")}
                  title="SEPA bank transfer"
                  desc="Pay by EU bank transfer. Instructions sent by email; ships once received."
                />
                <PaymentOption
                  id="paysera"
                  selected={payment === "paysera"}
                  onSelect={() => setPayment("paysera")}
                  title="Paysera"
                  desc="Pay instantly via the Paysera gateway (sandbox)."
                />
                <PaymentOption
                  id="crypto"
                  selected={payment === "crypto"}
                  onSelect={() => setPayment("crypto")}
                  title="Card → crypto (USDC/USDT)"
                  desc="Pay by card on the hosted invoice; we settle in stablecoin. Powered by NOWPayments (sandbox)."
                />
              </Section>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep("details")}>
                  Back
                </Button>
                <Button onClick={() => setStep("review")}>Review order</Button>
              </div>
            </div>
          )}

          {step === "review" && (
            <div className="space-y-6">
              <Section title="Review">
                <ReviewRow label="Contact" value={`${contact.firstName} ${contact.lastName} · ${contact.email}`} />
                <ReviewRow label="Ship to" value={`${address.line1}, ${address.postalCode} ${address.city}, ${address.country}`} />
                <ReviewRow label="Payment" value={paymentLabel(payment)} />
              </Section>
              <ul className="divide-y divide-border rounded-xl border border-border text-sm">
                {lines.map((l) => (
                  <li key={l.slug} className="flex justify-between px-4 py-2">
                    <span>
                      {l.product.name} × {l.quantity}
                    </span>
                    <span className="font-medium">{formatPrice(l.product.priceCents * l.quantity)}</span>
                  </li>
                ))}
              </ul>
              {error ? (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-error">{error}</p>
              ) : null}
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep("payment")}>
                  Back
                </Button>
                <Button onClick={submit} disabled={submitting}>
                  {submitting ? "Placing order…" : "Place order"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                By placing this order you confirm the products are for laboratory
                research use only and not for human consumption.
              </p>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-surface p-6">
          <OrderSummary breakdown={breakdown} />
          <Link href="/cart" className="mt-4 block text-center text-sm text-muted-foreground hover:text-foreground">
            Edit cart
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Steps({ current }: { current: Step }) {
  const order: Step[] = ["details", "payment", "review"];
  const labels: Record<string, string> = { details: "Details", payment: "Payment", review: "Review" };
  const idx = order.indexOf(current);
  return (
    <ol className="flex gap-2 text-sm">
      {order.map((s, i) => (
        <li key={s} className="flex items-center gap-2">
          <span
            className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
              i <= idx ? "bg-brand-600 text-white" : "bg-surface-muted text-muted-foreground"
            }`}
          >
            {i + 1}
          </span>
          <span className={i <= idx ? "font-medium" : "text-muted-foreground"}>{labels[s]}</span>
          {i < order.length - 1 ? <span className="text-muted-foreground">→</span> : null}
        </li>
      ))}
    </ol>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring"
      />
    </label>
  );
}

function PaymentOption({
  id,
  selected,
  onSelect,
  title,
  desc,
}: {
  id: string;
  selected: boolean;
  onSelect: () => void;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
        selected ? "border-brand-600 bg-brand-50" : "border-border hover:bg-surface-muted"
      }`}
    >
      <span
        className={`mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full border-2 ${
          selected ? "border-brand-600" : "border-ink-300"
        }`}
      >
        {selected ? <span className="h-2.5 w-2.5 rounded-full bg-brand-600" /> : null}
      </span>
      <span>
        <span className="block font-medium">{title}</span>
        <span className="block text-sm text-muted-foreground">{desc}</span>
      </span>
    </button>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}
