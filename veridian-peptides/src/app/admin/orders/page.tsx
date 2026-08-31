import type { Metadata } from "next";
import { getAdminOrders } from "@/lib/admin/queries";
import { updateOrderStatus } from "@/lib/admin/actions";
import { formatDate, formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Admin · Orders" };

const STATUSES = ["PENDING_PAYMENT", "PAID", "FULFILLED", "CANCELLED", "REFUNDED"];

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
      <p className="mt-1 text-sm text-muted-foreground">{orders.length} most recent</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-muted text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.reference} className="hover:bg-surface-muted/50">
                  <td className="px-4 py-3 font-mono">{o.reference}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(o.createdAt)}</td>
                  <td className="px-4 py-3">{o.email}</td>
                  <td className="px-4 py-3">{o.itemCount}</td>
                  <td className="px-4 py-3 font-medium">{formatPrice(o.totalCents)}</td>
                  <td className="px-4 py-3">
                    <form action={updateOrderStatus} className="flex items-center gap-2">
                      <input type="hidden" name="reference" value={o.reference} />
                      <select
                        name="status"
                        defaultValue={o.status}
                        className="h-9 rounded-lg border border-border bg-background px-2 text-xs"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s.replace("_", " ").toLowerCase()}
                          </option>
                        ))}
                      </select>
                      <button className="h-9 rounded-lg bg-brand-700 px-3 text-xs font-medium text-white hover:bg-brand-700">
                        Save
                      </button>
                    </form>
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
