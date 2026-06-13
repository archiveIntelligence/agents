import type { Metadata } from "next";
import { PageShell } from "@/components/content/page-shell";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach our support team.",
};

export default function ContactPage() {
  return (
    <PageShell
      eyebrow="Company"
      title="Contact us"
      intro="We typically reply within one business day."
    >
      <ul>
        <li>
          Email: <a href="mailto:support@veridian-peptides.test">support@veridian-peptides.test</a>
        </li>
        <li>Wholesale: wholesale@veridian-peptides.test</li>
        <li>Support hours: Mon–Fri, 09:00–17:00 CET</li>
      </ul>

      <h2>Send a message</h2>
      <form
        action="mailto:support@veridian-peptides.test"
        method="post"
        encType="text/plain"
        className="space-y-4 rounded-2xl border border-border bg-surface p-6"
      >
        <input
          name="email"
          type="email"
          placeholder="Your email"
          className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm"
          required
        />
        <textarea
          name="message"
          placeholder="How can we help?"
          rows={5}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          required
        />
        <button className="h-11 rounded-full bg-brand-600 px-6 text-sm font-medium text-white hover:bg-brand-700">
          Send message
        </button>
      </form>
      <p className="text-xs">For research-use enquiries only.</p>
    </PageShell>
  );
}
