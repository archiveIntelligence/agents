import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/repository";
import { updateProduct } from "@/lib/admin/actions";

export const metadata: Metadata = { title: "Admin · Edit product" };

const STOCKS = [
  { value: "IN_STOCK", label: "In stock" },
  { value: "LOW_STOCK", label: "Low stock" },
  { value: "PRE_ORDER", label: "Pre-order" },
  { value: "OUT_OF_STOCK", label: "Out of stock" },
];

const stockToEnum: Record<string, string> = {
  in_stock: "IN_STOCK",
  low_stock: "LOW_STOCK",
  pre_order: "PRE_ORDER",
  out_of_stock: "OUT_OF_STOCK",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <div className="max-w-2xl">
      <Link href="/admin/products" className="text-sm text-muted-foreground hover:text-foreground">
        ← Products
      </Link>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">{product.name}</h1>
      <p className="text-sm text-muted-foreground">{product.slug}</p>

      <form action={updateProduct} className="mt-6 space-y-5 rounded-2xl border border-border bg-surface p-6">
        <input type="hidden" name="slug" value={product.slug} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Price (EUR)">
            <input
              name="priceEuros"
              type="number"
              step="0.01"
              min="0"
              defaultValue={(product.priceCents / 100).toFixed(2)}
              className={inputCls}
            />
          </Field>
          <Field label="Purity (%)">
            <input
              name="purity"
              type="number"
              step="0.1"
              min="0"
              max="100"
              defaultValue={product.purity}
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="Stock status">
          <select name="stock" defaultValue={stockToEnum[product.stock]} className={inputCls}>
            {STOCKS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Tagline">
          <input name="tagline" defaultValue={product.tagline} className={inputCls} />
        </Field>

        <Field label="Description">
          <textarea name="description" defaultValue={product.description} rows={4} className={inputCls} />
        </Field>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={product.featured} className="h-4 w-4" />
          Featured on homepage
        </label>

        <button className="h-11 rounded-full bg-brand-700 px-6 text-sm font-medium text-white hover:bg-brand-700">
          Save changes
        </button>
      </form>
    </div>
  );
}

const inputCls =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
