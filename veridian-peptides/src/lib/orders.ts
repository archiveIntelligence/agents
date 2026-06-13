import "server-only";

export interface OrderSummaryRow {
  reference: string;
  status: string;
  totalCents: number;
  paymentMethod: string;
  createdAt: string;
  items: { productName: string; quantity: number; unitPriceCents: number }[];
}

const orderInclude = { items: true } as const;

function mapOrder(o: {
  reference: string;
  status: string;
  totalCents: number;
  paymentMethod: string;
  createdAt: Date;
  items: { productName: string; quantity: number; unitPriceCents: number }[];
}): OrderSummaryRow {
  return {
    reference: o.reference,
    status: o.status,
    totalCents: o.totalCents,
    paymentMethod: o.paymentMethod,
    createdAt: o.createdAt.toISOString(),
    items: o.items.map((i) => ({
      productName: i.productName,
      quantity: i.quantity,
      unitPriceCents: i.unitPriceCents,
    })),
  };
}

export async function getOrdersForUser(userId: string): Promise<OrderSummaryRow[]> {
  if (!process.env.DATABASE_URL) return [];
  const { prisma } = await import("@/lib/db/prisma");
  const rows = await prisma.order.findMany({
    where: { userId },
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapOrder);
}

/**
 * Authorised order lookup. Access is granted when the requester either owns
 * the order (logged-in account) or supplies the matching email (guests).
 */
export async function lookupOrder(args: {
  reference: string;
  email?: string;
  userId?: string;
}): Promise<OrderSummaryRow | null> {
  if (!process.env.DATABASE_URL) return null;
  const { prisma } = await import("@/lib/db/prisma");
  const order = await prisma.order.findUnique({
    where: { reference: args.reference.trim() },
    include: orderInclude,
  });
  if (!order) return null;

  const ownsIt = args.userId && order.userId === args.userId;
  const emailMatches =
    args.email && order.email.toLowerCase() === args.email.trim().toLowerCase();

  if (!ownsIt && !emailMatches) return null;
  return mapOrder(order);
}
