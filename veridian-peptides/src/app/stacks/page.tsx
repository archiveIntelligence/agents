import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { getBundles, getProducts } from "@/lib/repository";
import { Price } from "@/components/i18n/price";

export const metadata: Metadata = {
  title: "Research Stacks",
  description: "Curated bundles of research peptides and supplies at a saving.",
};

export default async function StacksPage() {
  const [bundles, products] = await Promise.all([getBundles(), getProducts()]);
  const priceBySlug = new Map(products.map((p) => [p.slug, p]));

  return (
    <div className="container-px py-14">
      <header className="mb-10 max-w-2xl">
        <Badge tone="accent">Research Stacks</Badge>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Curated research stacks</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Bundled compounds and supplies for common research setups — at a saving
          versus buying separately.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {bundles.map((bundle) => {
          const items = bundle.productSlugs
            .map((s) => priceBySlug.get(s))
            .filter((p): p is NonNullable<typeof p> => Boolean(p));
          const full = items.reduce((sum, p) => sum + p.priceCents, 0);
          const discounted = Math.round(full * (1 - bundle.savingsPercent / 100));

          return (
            <div key={bundle.slug} className="flex flex-col rounded-2xl border border-border bg-surface p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{bundle.name}</h2>
                <Badge tone="brand">Save {bundle.savingsPercent}%</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{bundle.description}</p>

              <ul className="mt-4 space-y-1 text-sm">
                {items.map((p) => (
                  <li key={p.slug} className="flex justify-between">
                    <Link href={`/products/${p.slug}`} className="hover:text-brand-600">
                      {p.name}
                    </Link>
                    <Price cents={p.priceCents} className="text-muted-foreground" />
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex items-end justify-between pt-5">
                <div>
                  <Price cents={discounted} className="text-2xl font-semibold" />
                  <Price cents={full} strike className="ml-2 text-sm" />
                </div>
                <ButtonLink href="/products" size="sm">
                  Shop items
                </ButtonLink>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
