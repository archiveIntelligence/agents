import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { getCoas } from "@/lib/repository";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "COA Vault",
  description: "Searchable archive of independent certificate-of-analysis reports for every batch.",
};

export default async function CoaVaultPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const coas = await getCoas(q);

  return (
    <div className="container-px py-12">
      <header className="mb-8 max-w-2xl">
        <Badge tone="brand">Quality &amp; Testing</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">COA Vault</h1>
        <p className="mt-2 text-muted-foreground">
          Every batch we sell is tested by an independent laboratory. Search by
          batch number or product name, then verify the report independently.
        </p>
        <div className="mt-4">
          <ButtonLink href="/coa/verify" variant="secondary" size="sm">
            Verify a batch number
          </ButtonLink>
        </div>
      </header>

      {/* Search (GET form, server-rendered results) */}
      <form action="/coa" method="get" className="mb-8 flex max-w-md gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search batch or product…"
          className="h-11 flex-1 rounded-full border border-border bg-surface px-4 text-sm focus-visible:outline-2 focus-visible:outline-ring"
        />
        <button className="h-11 rounded-full bg-brand-600 px-5 text-sm font-medium text-white hover:bg-brand-700">
          Search
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-muted text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Batch</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Purity</th>
              <th className="px-4 py-3">Tested</th>
              <th className="px-4 py-3">Report</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {coas.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No certificates match “{q}”.
                </td>
              </tr>
            ) : (
              coas.map((c) => (
                <tr key={c.batch} className="hover:bg-surface-muted/50">
                  <td className="px-4 py-3 font-mono">{c.batch}</td>
                  <td className="px-4 py-3">
                    <Link href={`/products/${c.productSlug}`} className="hover:text-brand-600">
                      {c.productName}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone="ok">{c.purity}%</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(c.testedOn)}</td>
                  <td className="px-4 py-3">
                    <a
                      href={c.verifyUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="font-medium text-brand-600 hover:text-brand-700"
                    >
                      Verify ↗
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
