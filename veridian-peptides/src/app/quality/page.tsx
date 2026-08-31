import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/content/page-shell";
import { getAveragePurity } from "@/lib/repository";

export const metadata: Metadata = {
  title: "Quality & Testing",
  description: "How every batch is independently HPLC tested and published.",
};

export default function QualityPage() {
  const avg = getAveragePurity();
  return (
    <PageShell
      eyebrow="Quality & Testing"
      title="Independently tested, batch by batch"
      intro={`Every batch is verified by a third-party laboratory. Published reports average ${avg}% purity.`}
    >
      <h2>Our testing process</h2>
      <p>
        Each production batch is sampled and sent to an independent analytical
        laboratory for high-performance liquid chromatography (HPLC) purity
        analysis. We do not run these tests in-house, so the result is not ours
        to influence.
      </p>
      <ul>
        <li>HPLC purity quantification for every batch</li>
        <li>Mass-spectrometry identity confirmation where applicable</li>
        <li>Batch numbers printed on each vial label</li>
        <li>Reports published before stock goes on sale</li>
      </ul>

      <h2>Verify what you receive</h2>
      <p>
        Open the <Link href="/coa">COA vault</Link> to browse every published
        certificate, or <Link href="/coa/verify">verify a batch number</Link>{" "}
        from your vial directly. Each report links back to the issuing
        laboratory so you can confirm it independently.
      </p>

      <h2>Storage & handling</h2>
      <p>
        Lyophilised peptides are shipped with temperature-aware handling and
        should be stored desiccated at −20 °C. See our{" "}
        <Link href="/shipping">shipping &amp; returns</Link> page for details.
      </p>

      <p className="text-xs">
        All products are supplied strictly for laboratory research use and are
        not for human consumption.
      </p>
    </PageShell>
  );
}
