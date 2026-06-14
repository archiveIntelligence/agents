import type { Metadata } from "next";
import Link from "next/link";
import { getAdminProducts } from "@/lib/admin/queries";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Admin · Products" };

const stockTone = { IN_STOCK: "ok", LOW_STOCK: "warn", PRE_ORDER: "warn", OUT_OF_STOCK: "off" } as const;
const stockLabel = { IN_STOCK: "In stock", LOW_STOCK: "Low", PRE_ORDER: "Pre-order", OUT_OF_STOCK: "Out" } as const;

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
      <p className="mt-1 text-sm text-muted-foreground">{products.length} products</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-muted text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Purity</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((p) => (
              <tr key={p.slug} className="hover:bg-surface-muted/50">
                <td className="px-4 py-3 font-medium">
                  {p.name}
                  {p.featured ? <span className="ml-2"><Badge tone="accent">Featured</Badge></span> : null}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.categoryName}</td>
                <td className="px-4 py-3">{formatPrice(p.priceCents)}</td>
                <td className="px-4 py-3">
                  <Badge tone={stockTone[p.stock as keyof typeof stockTone] ?? "off"}>
                    {stockLabel[p.stock as keyof typeof stockLabel] ?? p.stock}
                  </Badge>
                </td>
                <td className="px-4 py-3">{p.purity}%</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/products/${p.slug}`} className="font-medium text-brand-700 hover:text-brand-700">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
