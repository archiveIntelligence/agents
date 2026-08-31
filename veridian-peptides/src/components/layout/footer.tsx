import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { getServerT } from "@/lib/i18n/server";

type FooterLink = { href: string; label: string; labelKey?: string };

const columns: { title: string; titleKey: string; links: FooterLink[] }[] = [
  {
    title: "Products",
    titleKey: "footer.products",
    links: [
      { href: "/products", label: "Browse Catalog", labelKey: "nav.allPeptides" },
      { href: "/stacks", label: "Research Stacks", labelKey: "nav.stacks" },
      { href: "/wholesale", label: "Wholesale" },
    ],
  },
  {
    title: "Company",
    titleKey: "footer.company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
      { href: "/security", label: "Security & Official Domain" },
      { href: "/affiliate", label: "Affiliate Program" },
    ],
  },
  {
    title: "Support",
    titleKey: "footer.support",
    links: [
      { href: "/quality", label: "Quality & Testing", labelKey: "nav.quality" },
      { href: "/coa", label: "COA Vault", labelKey: "nav.coa" },
      { href: "/coa/verify", label: "Verify COA" },
      { href: "/faq", label: "FAQ" },
      { href: "/shipping", label: "Shipping & Returns" },
      { href: "/track", label: "Track Order" },
    ],
  },
  {
    title: "Legal",
    titleKey: "footer.legal",
    links: [
      { href: "/legal/privacy", label: "Privacy Policy" },
      { href: "/legal/terms", label: "Terms of Service" },
      { href: "/legal/cookies", label: "Cookie Settings" },
    ],
  },
];

export async function Footer() {
  const t = await getServerT();
  return (
    <footer className="mt-28 border-t border-border bg-surface">
      <div className="container-px grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {t("footer.tagline")}
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="eyebrow">{t(col.titleKey)}</h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.labelKey ? t(link.labelKey) : link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="container-px flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} VERUM Biolabs. {t("footer.rights")}</p>
          <p>support@verum-biolabs.test</p>
        </div>
      </div>
    </footer>
  );
}
