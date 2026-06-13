import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";

const nav = [
  { href: "/products", label: "All Peptides" },
  { href: "/stacks", label: "Research Stacks" },
  { href: "/quality", label: "Quality & Testing" },
  { href: "/coa", label: "COA Vault" },
  { href: "/blog", label: "Research Blog" },
];

export function Header() {
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
          <Link
            href="/account"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            Sign in
          </Link>
          <ButtonLink href="/cart" size="sm">
            Cart
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
