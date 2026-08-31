import type { Metadata } from "next";
import { PageShell } from "@/components/content/page-shell";

export const metadata: Metadata = {
  title: "Security & Official Domain",
  description: "How to confirm you are on our official store and pay safely.",
};

export default function SecurityPage() {
  return (
    <PageShell eyebrow="Company" title="Security & official domain">
      <h2>Our official domain</h2>
      <p>
        Our only official store is the domain shown in your browser&apos;s
        address bar for this site. We will never ask you to pay through a
        different domain, a private message, or a third-party app.
      </p>
      <h2>Paying safely</h2>
      <ul>
        <li>Payment instructions are only ever shown at checkout or emailed from our official address.</li>
        <li>Card-to-stablecoin payments happen on the gateway&apos;s own hosted page.</li>
        <li>We never ask for your full card details by email or chat.</li>
      </ul>
      <h2>Reporting</h2>
      <p>
        If you see a site or message impersonating us, email{" "}
        <a href="mailto:security@verum-biolabs.test">security@verum-biolabs.test</a>.
      </p>
    </PageShell>
  );
}
