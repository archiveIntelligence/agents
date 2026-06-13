import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/content/page-shell";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description: "Delivery times, costs and our returns policy.",
};

export default function ShippingPage() {
  return (
    <PageShell eyebrow="Support" title="Shipping & returns">
      <h2>Shipping</h2>
      <ul>
        <li>Tracked shipping from €4.99</li>
        <li>Free shipping on net orders over €200</li>
        <li>Dispatch within 1–2 business days of cleared payment</li>
        <li>Delivery across the EU and selected nearby countries</li>
        <li>Temperature-aware handling for lyophilised products</li>
      </ul>

      <h2>Order tracking</h2>
      <p>
        A reference number is issued at checkout. Track your order on the{" "}
        <Link href="/track">order tracking</Link> page, or sign in to view all
        of your orders.
      </p>

      <h2>Returns</h2>
      <p>
        Because these are research materials, we can only accept returns of
        unopened items in their original packaging within 14 days, where the
        cold chain has not been broken. Damaged or incorrect items are replaced
        at no cost — contact <a href="mailto:support@veridian-peptides.test">support</a>.
      </p>
    </PageShell>
  );
}
