import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { CartButton } from "@/components/layout/cart-button";
import { CurrencySwitcher } from "@/components/i18n/currency-switcher";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { getCurrentUser } from "@/lib/auth/session";
import { getServerT } from "@/lib/i18n/server";

const nav = [
  { href: "/products", key: "nav.allPeptides" },
  { href: "/stacks", key: "nav.stacks" },
  { href: "/quality", key: "nav.quality" },
  { href: "/coa", key: "nav.coa" },
  { href: "/blog", key: "nav.blog" },
];

export async function Header() {
  const [user, t] = await Promise.all([getCurrentUser(), getServerT()]);
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
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">
            <LanguageSwitcher />
          </span>
          <span className="hidden sm:inline">
            <CurrencySwitcher />
          </span>
          <Link
            href={user ? "/account" : "/account/login"}
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            {user ? `Hi, ${user.firstName}` : t("header.signIn")}
          </Link>
          <CartButton label={t("header.cart")} />
        </div>
      </div>
    </header>
  );
}
