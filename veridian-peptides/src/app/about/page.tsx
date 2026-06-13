import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/content/page-shell";

export const metadata: Metadata = {
  title: "About Us",
  description: "Who we are and why independent testing sits at the centre of what we do.",
};

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="Company"
      title="About Veridian Peptides"
      intro="A research-supply company built around verifiable transparency."
    >
      <p>
        Veridian Peptides supplies lyophilised research peptides and laboratory
        consumables to researchers and institutions. We started from a simple
        frustration: in this field it is hard to know what you are actually
        buying.
      </p>
      <h2>Transparency by default</h2>
      <p>
        Our answer is to publish independent laboratory results for every batch
        we sell, before it goes on sale. No selective reporting, no in-house
        numbers — just third-party data you can{" "}
        <Link href="/coa">read</Link> and <Link href="/coa/verify">verify</Link>.
      </p>
      <h2>Research use only</h2>
      <p>
        Everything we sell is intended strictly for laboratory research and is
        not for human consumption. We expect our customers to handle these
        materials in an appropriate professional setting.
      </p>
      <p>
        Questions? <Link href="/contact">Get in touch</Link>.
      </p>
    </PageShell>
  );
}
