import type { Metadata } from "next";
import { PageShell } from "@/components/content/page-shell";

export const metadata: Metadata = {
  title: "Affiliate Program",
  description: "Earn commission referring research customers.",
};

export default function AffiliatePage() {
  return (
    <PageShell
      eyebrow="Company"
      title="Affiliate program"
      intro="Refer research customers and earn commission on their orders."
    >
      <h2>How it works</h2>
      <ol>
        <li>Apply with your audience or platform details.</li>
        <li>Receive a unique referral link and dashboard.</li>
        <li>Earn commission on each paid order from your referrals.</li>
      </ol>
      <h2>Apply</h2>
      <form
        action="mailto:affiliates@veridian-peptides.test"
        method="post"
        encType="text/plain"
        className="space-y-4 rounded-2xl border border-border bg-surface p-6"
      >
        <input name="email" type="email" placeholder="Email" className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm" required />
        <input name="platform" placeholder="Website / channel" className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm" />
        <button className="h-11 rounded-full bg-brand-700 px-6 text-sm font-medium text-white hover:bg-brand-700">
          Apply to join
        </button>
      </form>
      <p className="text-xs">
        Affiliates must promote products as research-use-only and follow our
        content guidelines.
      </p>
    </PageShell>
  );
}
