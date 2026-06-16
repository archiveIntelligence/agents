import type { Metadata } from "next";
import { PageShell } from "@/components/content/page-shell";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Privacy policy"
      intro="How we collect and handle your personal data."
    >
      <p>
        This is a template privacy policy for a demonstration store and is not
        legal advice. Replace it with a reviewed policy before going live.
      </p>
      <h2>Data we collect</h2>
      <ul>
        <li>Account details: name, email and a hashed password.</li>
        <li>Order details: shipping address and order history.</li>
        <li>Technical data: minimal logs and security headers.</li>
      </ul>
      <h2>How we use it</h2>
      <p>
        We use your data to process orders, provide support, and meet legal
        obligations. We do not sell your personal data.
      </p>
      <h2>Payments</h2>
      <p>
        Card and crypto payments are handled by third-party providers on their
        own infrastructure. We store only an order reference, never full card
        details.
      </p>
      <h2>Your rights</h2>
      <p>
        You may request access to, correction of, or deletion of your data by
        contacting support@verum-biolabs.test.
      </p>
    </PageShell>
  );
}
