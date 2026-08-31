import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/coa", label: "COAs" },
  { href: "/admin/blog", label: "Blog" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/account/login");
  if (user.role !== "ADMIN") redirect("/");

  return (
    <div className="container-px py-10">
      <div className="grid gap-8 lg:grid-cols-[14rem_1fr]">
        <aside className="h-fit rounded-2xl border border-border bg-surface p-4">
          <div className="px-2 pb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Admin
          </div>
          <nav className="space-y-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <section>{children}</section>
      </div>
    </div>
  );
}
