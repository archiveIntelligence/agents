import type { Metadata } from "next";
import { PageShell } from "@/components/content/page-shell";

export const metadata: Metadata = {
  title: "Wholesale",
  description: "Volume pricing for labs, clinics and resellers.",
};

export default function WholesalePage() {
  return (
    <PageShell
      eyebrow="Products"
      title="Wholesale & volume pricing"
      intro="For laboratories, institutions and qualified resellers."
    >
      <p>
        We offer tiered pricing for larger volumes, with batch-consistent
        supply and the same independent testing on every lot. Tell us what you
        need and we will prepare a quote.
      </p>
      <h2>Request a quote</h2>
      <form
        action="mailto:wholesale@verum-biolabs.test"
        method="post"
        encType="text/plain"
        className="space-y-4 rounded-2xl border border-border bg-surface p-6"
      >
        <input name="organisation" placeholder="Organisation" className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm" required />
        <input name="email" type="email" placeholder="Work email" className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm" required />
        <textarea name="requirements" placeholder="Products and estimated monthly volume" rows={4} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" required />
        <button className="h-11 rounded-full bg-brand-700 px-6 text-sm font-medium text-white hover:bg-brand-700">
          Request quote
        </button>
      </form>
      <p className="text-xs">Wholesale supply is for research-use customers only.</p>
    </PageShell>
  );
}
