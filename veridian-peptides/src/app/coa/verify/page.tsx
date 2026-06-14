import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { verifyCoa } from "@/lib/repository";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Verify a COA",
  description: "Confirm a certificate of analysis by entering its batch number.",
};

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ batch?: string }>;
}) {
  const { batch } = await searchParams;
  const result = batch ? await verifyCoa(batch) : undefined;

  return (
    <div className="container-px py-12">
      <div className="mx-auto max-w-xl">
        <Badge tone="brand">Quality &amp; Testing</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Verify a batch</h1>
        <p className="mt-2 text-muted-foreground">
          Enter the batch number printed on your vial label to confirm its
          certificate of analysis.
        </p>

        <form action="/coa/verify" method="get" className="mt-6 flex gap-2">
          <input
            type="text"
            name="batch"
            defaultValue={batch ?? ""}
            placeholder="e.g. VP24-GLP-7781"
            className="h-11 flex-1 rounded-full border border-border bg-surface px-4 font-mono text-sm focus-visible:outline-2 focus-visible:outline-ring"
          />
          <button className="h-11 rounded-full bg-brand-700 px-6 text-sm font-medium text-white hover:bg-brand-700">
            Verify
          </button>
        </form>

        {batch ? (
          result ? (
            <div className="mt-8 rounded-2xl border border-brand-200 bg-brand-50 p-6">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white">
                  ✓
                </span>
                <span className="font-semibold text-brand-800">Batch verified</span>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <Row label="Batch" value={result.batch} mono />
                <Row label="Product" value={result.productName} />
                <Row label="Purity (HPLC)" value={`${result.purity}%`} />
                <Row label="Tested on" value={formatDate(result.testedOn)} />
                <Row label="Laboratory" value={result.lab} />
              </dl>
              <a
                href={result.verifyUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-4 inline-block text-sm font-medium text-brand-700 hover:text-brand-800"
              >
                Open independent lab report ↗
              </a>
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
              No certificate found for batch “{batch}”. Double-check the number
              on your label, or contact support if the problem persists.
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={`font-medium ${mono ? "font-mono" : ""}`}>{value}</dd>
    </div>
  );
}
