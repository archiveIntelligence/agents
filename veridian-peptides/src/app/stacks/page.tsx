import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { getBundles, getProducts } from "@/lib/repository";
import { StackCard, type StackItem } from "@/components/stacks/stack-card";

export const metadata: Metadata = {
  title: "Research Stacks",
  description:
    "Curated, theme-grouped bundles of research peptides and supplies — at an honest saving versus buying each variant separately.",
};

// Research themes, mapped from a stack's primary compound category. The first
// non-lab-supply product in each stack decides which section it lands in.
const THEME_ORDER = ["metabolic", "recovery", "cellular", "neuro", "growth"] as const;
const THEME_LABELS: Record<string, string> = {
  metabolic: "Metabolic Research",
  recovery: "Recovery & Repair",
  cellular: "Longevity & Cellular",
  neuro: "Cognitive & Neuro",
  growth: "GH-Axis & Growth Factors",
};

export default async function StacksPage() {
  const [bundles, products] = await Promise.all([getBundles(), getProducts()]);
  const productBySlug = new Map(products.map((p) => [p.slug, p]));

  // Resolve each bundle to its real products and theme; drop unknown slugs.
  const stacks = bundles.map((bundle) => {
    const resolved = bundle.productSlugs
      .map((s) => productBySlug.get(s))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
    const lead = resolved.find((p) => p.categorySlug !== "lab-supplies") ?? resolved[0];
    const items: StackItem[] = resolved.map((p) => ({
      slug: p.slug,
      name: p.name,
      size: p.size,
      priceCents: p.priceCents,
    }));
    return { bundle, items, theme: lead?.categorySlug ?? "metabolic" };
  });

  const themes = THEME_ORDER.filter((t) => stacks.some((s) => s.theme === t));

  return (
    <div className="container-px py-14">
      <header className="mb-12 max-w-2xl">
        <Badge tone="accent">Research Stacks</Badge>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
          Curated research stacks
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Compounds and supplies bundled around a single research theme — each at a
          transparent saving versus buying every variant on its own. Add a whole
          stack to your cart in one click.
        </p>
      </header>

      <div className="space-y-14">
        {themes.map((theme) => {
          const themed = stacks.filter((s) => s.theme === theme);
          return (
            <section key={theme}>
              <h2 className="eyebrow mb-5 text-brand-700">{THEME_LABELS[theme]}</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {themed.map(({ bundle, items }) => (
                  <StackCard
                    key={bundle.slug}
                    slug={bundle.slug}
                    name={bundle.name}
                    description={bundle.description}
                    savingsPercent={bundle.savingsPercent}
                    items={items}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <p className="mt-12 max-w-2xl text-xs text-muted-foreground">
        All compounds are supplied for laboratory and research use only, not for
        human consumption. Stack savings are calculated against the listed variant
        prices.
      </p>
    </div>
  );
}
