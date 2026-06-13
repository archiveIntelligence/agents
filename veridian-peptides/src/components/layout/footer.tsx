import Link from "next/link";
import { Logo } from "@/components/brand/logo";

const columns = [
  {
    title: "Products",
    links: [
      { href: "/products", label: "Browse Catalog" },
      { href: "/stacks", label: "Research Stacks" },
      { href: "/wholesale", label: "Wholesale" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
      { href: "/security", label: "Security & Official Domain" },
      { href: "/affiliate", label: "Affiliate Program" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/quality", label: "Quality & Testing" },
      { href: "/coa", label: "COA Vault" },
      { href: "/coa/verify", label: "Verify COA" },
      { href: "/faq", label: "FAQ" },
      { href: "/shipping", label: "Shipping & Returns" },
      { href: "/track", label: "Track Order" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/legal/privacy", label: "Privacy Policy" },
      { href: "/legal/terms", label: "Terms of Service" },
      { href: "/legal/cookies", label: "Cookie Settings" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="container-px grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Independently tested research peptides. Supplied strictly for
            laboratory research. Not for human consumption.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold">{col.title}</h4>
            <ul className="mt-4 space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="container-px flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Veridian Peptides. For research use only.</p>
          <p>support@veridian-peptides.test</p>
        </div>
      </div>
    </footer>
  );
}
