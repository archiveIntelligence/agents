import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { logout } from "@/lib/auth/actions";
import { getOrdersForUser } from "@/lib/orders";
import { formatDate, formatPrice } from "@/lib/format";
import { OrderStatusBadge } from "@/components/account/order-status-badge";

export const metadata: Metadata = { title: "Your account" };

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/account/login");

  const orders = await getOrdersForUser(user.id);

  return (
    <div className="container-px py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Hi, {user.firstName}
          </h1>
          <p className="mt-1 text-muted-foreground">{user.email}</p>
        </div>
        <form action={logout}>
          <button className="h-10 rounded-full border border-border px-5 text-sm hover:bg-surface-muted">
            Sign out
          </button>
        </form>
      </div>

      <h2 className="mt-10 mb-4 text-xl font-semibold tracking-tight">Order history</h2>

      {orders.length === 0 ? (
        <p className="rounded-2xl border border-border bg-surface p-8 text-center text-muted-foreground">
          You have no orders yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.reference} className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-mono font-semibold">{order.reference}</span>
                  <span className="ml-3 text-sm text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <OrderStatusBadge status={order.status} />
                  <span className="font-semibold">{formatPrice(order.totalCents)}</span>
                </div>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.productName} × {item.quantity}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
