import type { Metadata } from "next";
import { getAdminStats } from "@/lib/admin/queries";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Admin · Dashboard" };

export default async function AdminDashboard() {
  const stats = await getAdminStats();
  const cards = [
    { label: "Paid revenue", value: formatPrice(stats.paidRevenueCents) },
    { label: "Orders", value: String(stats.orders) },
    { label: "Awaiting payment", value: String(stats.pendingOrders) },
    { label: "Products", value: String(stats.products) },
    { label: "Customers", value: String(stats.customers) },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-surface p-6">
            <div className="text-sm text-muted-foreground">{c.label}</div>
            <div className="mt-2 text-3xl font-semibold text-brand-700">{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
