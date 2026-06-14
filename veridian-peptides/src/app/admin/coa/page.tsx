import type { Metadata } from "next";
import { getCoas, getProducts } from "@/lib/repository";
import { createCoa } from "@/lib/admin/actions";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Admin · COAs" };

const inputCls =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring";

export default async function AdminCoaPage() {
  const [coas, products] = await Promise.all([getCoas(), getProducts()]);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Certificates of Analysis</h1>

      <form action={createCoa} className="mt-6 grid gap-4 rounded-2xl border border-border bg-surface p-6 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm text-muted-foreground">Product</span>
          <select name="productSlug" className={inputCls} required>
            {products.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <Field label="Batch number">
          <input name="batch" className={inputCls} placeholder="VP24-XXX-0000" required />
        </Field>
        <Field label="Tested on">
          <input name="testedOn" type="date" className={inputCls} required />
        </Field>
        <Field label="Purity (%)">
          <input name="purity" type="number" step="0.1" min="0" max="100" className={inputCls} required />
        </Field>
        <Field label="Lab">
          <input name="lab" defaultValue="Independent HPLC Lab" className={inputCls} />
        </Field>
        <Field label="Verification URL">
          <input name="verifyUrl" type="url" className={inputCls} placeholder="https://…" />
        </Field>
        <div className="sm:col-span-2">
          <button className="h-11 rounded-full bg-brand-700 px-6 text-sm font-medium text-white hover:bg-brand-700">
            Add certificate
          </button>
        </div>
      </form>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-muted text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Batch</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Purity</th>
              <th className="px-4 py-3">Tested</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {coas.map((c) => (
              <tr key={c.batch}>
                <td className="px-4 py-3 font-mono">{c.batch}</td>
                <td className="px-4 py-3">{c.productName}</td>
                <td className="px-4 py-3">{c.purity}%</td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(c.testedOn)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
