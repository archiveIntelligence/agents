import Link from "next/link";
import type { Metadata } from "next";
import { ProductCard } from "@/components/product/product-card";
import { getCategories, getProducts, type ProductQuery } from "@/lib/repository";

export const metadata: Metadata = {
  title: "All Research Peptides",
  description: "Browse independently tested research peptides, blends and lab supplies.",
};

const sortOptions: { value: NonNullable<ProductQuery["sort"]>; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "purity-desc", label: "Purity" },
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; sort?: string; stock?: string }>;
}) {
  const sp = await searchParams;
  const sort = (sortOptions.find((o) => o.value === sp.sort)?.value ?? "featured") as ProductQuery["sort"];

  const [categories, results] = await Promise.all([
    getCategories(),
    getProducts({
      category: sp.category,
      search: sp.q,
      inStockOnly: sp.stock === "1",
      sort,
    }),
  ]);

  const buildHref = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { category: sp.category, q: sp.q, sort: sp.sort, stock: sp.stock, ...overrides };
    for (const [k, v] of Object.entries(merged)) if (v) params.set(k, v);
    const qs = params.toString();
    return qs ? `/products?${qs}` : "/products";
  };

  return (
    <div className="container-px py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">All research peptides</h1>
        <p className="mt-2 text-muted-foreground">
          {results.length} product{results.length === 1 ? "" : "s"} · for research use only
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
        {/* Filters */}
        <aside className="space-y-8">
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Category
            </h2>
            <ul className="space-y-1 text-sm">
              <li>
                <Link
                  href={buildHref({ category: undefined })}
                  className={!sp.category ? "font-medium text-brand-600" : "text-muted-foreground hover:text-foreground"}
                >
                  All categories
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={buildHref({ category: c.slug })}
                    className={sp.category === c.slug ? "font-medium text-brand-600" : "text-muted-foreground hover:text-foreground"}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Availability
            </h2>
            <Link
              href={buildHref({ stock: sp.stock === "1" ? undefined : "1" })}
              className={`text-sm ${sp.stock === "1" ? "font-medium text-brand-600" : "text-muted-foreground hover:text-foreground"}`}
            >
              {sp.stock === "1" ? "☑" : "☐"} In stock only
            </Link>
          </div>
        </aside>

        {/* Results */}
        <section>
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {sortOptions.map((o) => (
              <Link
                key={o.value}
                href={buildHref({ sort: o.value })}
                className={`rounded-full border px-3 py-1 text-sm ${
                  sort === o.value
                    ? "border-brand-600 bg-brand-50 text-brand-700"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {o.label}
              </Link>
            ))}
          </div>

          {results.length === 0 ? (
            <p className="rounded-2xl border border-border bg-surface p-8 text-center text-muted-foreground">
              No products match these filters.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
