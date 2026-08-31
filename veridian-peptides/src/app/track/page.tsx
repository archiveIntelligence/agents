import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/session";
import { lookupOrder } from "@/lib/orders";
import { formatDate, formatPrice } from "@/lib/format";
import { OrderStatusBadge } from "@/components/account/order-status-badge";

export const metadata: Metadata = {
  title: "Track your order",
  description: "Look up the status of an order by reference.",
};

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; email?: string }>;
}) {
  const { ref, email } = await searchParams;
  const user = await getCurrentUser();

  const order = ref
    ? await lookupOrder({ reference: ref, email, userId: user?.id })
    : null;

  return (
    <div className="container-px py-12">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-semibold tracking-tight">Track your order</h1>
        <p className="mt-2 text-muted-foreground">
          Enter your order reference{user ? "" : " and the email used at checkout"}.
        </p>

        <form action="/track" method="get" className="mt-6 space-y-3">
          <input
            type="text"
            name="ref"
            defaultValue={ref ?? ""}
            placeholder="Order reference, e.g. VP-XXXXXX"
            className="h-11 w-full rounded-lg border border-border bg-surface px-3 font-mono text-sm focus-visible:outline-2 focus-visible:outline-ring"
          />
          {!user ? (
            <input
              type="email"
              name="email"
              defaultValue={email ?? ""}
              placeholder="Email used at checkout"
              className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring"
            />
          ) : null}
          <button className="h-11 w-full rounded-full bg-brand-700 px-6 text-sm font-medium text-white hover:bg-brand-700">
            Track order
          </button>
        </form>

        {ref ? (
          order ? (
            <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold">{order.reference}</span>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Placed {formatDate(order.createdAt)} · {formatPrice(order.totalCents)}
              </p>
              <ul className="mt-4 divide-y divide-border border-t border-border text-sm">
                {order.items.map((item, i) => (
                  <li key={i} className="flex justify-between py-2">
                    <span>
                      {item.productName} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatPrice(item.unitPriceCents * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
              No order found for those details.
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}
