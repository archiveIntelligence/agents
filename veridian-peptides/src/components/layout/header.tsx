import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { CartButton } from "@/components/layout/cart-button";
import { CurrencySwitcher } from "@/components/i18n/currency-switcher";
import { getCurrentUser } from "@/lib/auth/session";

const nav = [
  { href: "/products", label: "All Peptides" },
  { href: "/stacks", label: "Research Stacks" },
  { href: "/quality", label: "Quality & Testing" },
  { href: "/coa", label: "COA Vault" },
  { href: "/blog", label: "Research Blog" },
];

export async function Header() {
  const user = await getCurrentUser();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur">
      <div className="container-px flex h-16 items-center justify-between gap-6">
        <Link href="/" aria-label="Veridian Peptides home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">
            <CurrencySwitcher />
          </span>
          <Link
            href={user ? "/account" : "/account/login"}
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            {user ? `Hi, ${user.firstName}` : "Sign in"}
          </Link>
          <CartButton />
        </div>
      </div>
    </header>
  );
}
