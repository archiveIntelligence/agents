import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/content/page-shell";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about ordering, testing and shipping.",
};

const faqs = [
  {
    q: "What are these products for?",
    a: "All items are supplied strictly for laboratory and research use. They are not for human consumption and are not medicines.",
  },
  {
    q: "How do I know the purity is real?",
    a: "Every batch is tested by an independent laboratory and the report is published in our COA vault. You can verify any batch number from your vial label.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "SEPA bank transfer, Paysera, and card payment that settles to us in stablecoin (USDC/USDT) via our crypto gateway.",
  },
  {
    q: "How is my order shipped?",
    a: "Orders are dispatched with tracking and temperature-aware handling across the EU and selected nearby countries. Shipping starts at €4.99 and is free on net orders over €200.",
  },
  {
    q: "Can I track my order?",
    a: "Yes — use the order tracking page with your reference number, or sign in to see all your orders.",
  },
  {
    q: "Do you offer bulk pricing?",
    a: "Buying 3 or more units applies a 5% discount automatically at checkout. For larger volumes, see our wholesale page.",
  },
];

export default function FaqPage() {
  return (
    <PageShell eyebrow="Support" title="Frequently asked questions">
      {faqs.map((f) => (
        <div key={f.q} className="rounded-xl border border-border bg-surface p-5">
          <h2 className="!mt-0 text-base">{f.q}</h2>
          <p className="mt-1">{f.a}</p>
        </div>
      ))}
      <p>
        Still need help? <Link href="/contact">Contact our team</Link>.
      </p>
    </PageShell>
  );
}
