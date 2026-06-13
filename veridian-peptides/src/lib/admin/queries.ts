import "server-only";

export interface AdminStats {
  products: number;
  orders: number;
  pendingOrders: number;
  paidRevenueCents: number;
  customers: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  if (!process.env.DATABASE_URL) {
    return { products: 0, orders: 0, pendingOrders: 0, paidRevenueCents: 0, customers: 0 };
  }
  const { prisma } = await import("@/lib/db/prisma");
  const [products, orders, pendingOrders, customers, paid] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING_PAYMENT" } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.aggregate({
      where: { status: { in: ["PAID", "FULFILLED"] } },
      _sum: { totalCents: true },
    }),
  ]);
  return {
    products,
    orders,
    pendingOrders,
    customers,
    paidRevenueCents: paid._sum.totalCents ?? 0,
  };
}

export interface AdminProductRow {
  slug: string;
  name: string;
  categoryName: string;
  priceCents: number;
  stock: string;
  purity: number;
  featured: boolean;
}

export async function getAdminProducts(): Promise<AdminProductRow[]> {
  if (!process.env.DATABASE_URL) return [];
  const { prisma } = await import("@/lib/db/prisma");
  const rows = await prisma.product.findMany({
    include: { category: true },
    orderBy: { name: "asc" },
  });
  return rows.map((p) => ({
    slug: p.slug,
    name: p.name,
    categoryName: p.category.name,
    priceCents: p.priceCents,
    stock: p.stock,
    purity: p.purity,
    featured: p.featured,
  }));
}

export interface AdminOrderRow {
  reference: string;
  email: string;
  status: string;
  totalCents: number;
  paymentMethod: string;
  createdAt: string;
  itemCount: number;
}

export async function getAdminOrders(): Promise<AdminOrderRow[]> {
  if (!process.env.DATABASE_URL) return [];
  const { prisma } = await import("@/lib/db/prisma");
  const rows = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return rows.map((o) => ({
    reference: o.reference,
    email: o.email,
    status: o.status,
    totalCents: o.totalCents,
    paymentMethod: o.paymentMethod,
    createdAt: o.createdAt.toISOString(),
    itemCount: o.items.reduce((n, i) => n + i.quantity, 0),
  }));
}
