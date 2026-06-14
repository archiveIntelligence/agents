import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product/product-card";
import {
  getAveragePurity,
  getBlogPosts,
  getCategories,
  getFeaturedProducts,
} from "@/lib/repository";
import { formatDate } from "@/lib/format";
import { getServerT } from "@/lib/i18n/server";

export default async function HomePage() {
  const [featured, categories, posts, t] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getBlogPosts(),
    getServerT(),
  ]);
  const avgPurity = getAveragePurity();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 bg-background" />
        <div className="absolute -left-32 -top-32 -z-10 h-[28rem] w-[28rem] rounded-full bg-brand-100/60 blur-3xl" />
        <div className="absolute -right-24 top-20 -z-10 h-[24rem] w-[24rem] rounded-full bg-accent-100/40 blur-3xl" />
        <div className="container-px grid gap-12 py-24 lg:grid-cols-2 lg:items-center lg:py-32">
          <div>
            <Badge tone="accent">{t("home.hero.badge")}</Badge>
            <h1 className="mt-5 text-balance text-5xl leading-[1.05] tracking-tight sm:text-6xl">
              {t("home.hero.titleA")}{" "}
              <span className="italic text-brand-700">{t("home.hero.titleHighlight")}</span>.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              {t("home.hero.lead")}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/products" size="lg">
                {t("home.hero.shopAll")}
              </ButtonLink>
              <ButtonLink href="/coa" size="lg" variant="secondary">
                {t("home.hero.browseCoa")}
              </ButtonLink>
            </div>
            <p className="mt-7 max-w-md text-xs leading-relaxed text-muted-foreground">
              {t("home.hero.disclaimer")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard value={`${avgPurity}%`} label={t("home.stats.purity")} />
            <StatCard value="33" label={t("home.stats.countries")} />
            <StatCard value="100%" label={t("home.stats.coa")} />
            <StatCard value="€4.99" label={t("home.stats.shipping")} />
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-border bg-surface">
        <div className="container-px grid gap-6 py-8 text-sm sm:grid-cols-3">
          <TrustItem title="Independent lab testing" desc="Third-party HPLC reports for every batch." />
          <TrustItem title="Batch verification" desc="Confirm any COA by its batch number." />
          <TrustItem title="Cold-chain dispatch" desc="Temperature-aware handling and tracking." />
        </div>
      </section>

      {/* Featured products */}
      <section className="container-px py-16">
        <SectionHeading title={t("home.featured")} href="/products" linkLabel={t("home.viewAll")} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* COA showcase */}
      <section className="border-y border-border bg-surface">
        <div className="container-px grid gap-8 py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge tone="brand">Quality &amp; Testing</Badge>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Transparency, batch by batch
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              We publish the certificate of analysis for every batch we sell.
              Search the vault, read the HPLC purity figures, and verify the
              report independently — before you ever place an order.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/coa">Open the COA vault</ButtonLink>
              <ButtonLink href="/coa/verify" variant="secondary">
                Verify a batch
              </ButtonLink>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-lift">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm tracking-tight">VP24-GLP-7781</span>
              <Badge tone="ok">Verified</Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <Field label="Product" value="VP-GLP-001" />
              <Field label="Purity (HPLC)" value="99.4%" />
              <Field label="Tested" value="12 Apr 2026" />
              <Field label="Lab" value="Independent HPLC" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-px py-16">
        <SectionHeading title={t("home.categories")} href="/products" linkLabel={t("home.viewAll")} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group rounded-2xl border border-border bg-surface p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
            >
              <h3 className="text-lg transition-colors group-hover:text-brand-700">{cat.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Blog teaser */}
      <section className="container-px pb-16">
        <SectionHeading title={t("home.blog")} href="/blog" linkLabel={t("home.viewAll")} />
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
            >
              <Badge tone="neutral">{post.category}</Badge>
              <h3 className="mt-4 text-lg leading-snug transition-colors group-hover:text-brand-700">{post.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
              <span className="mt-4 text-xs text-muted-foreground">
                {formatDate(post.publishedOn)} · {post.readingMinutes} min read
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/80 p-6 shadow-soft backdrop-blur transition-transform duration-300 hover:-translate-y-1">
      <div className="font-display text-4xl text-brand-700">{value}</div>
      <div className="mt-2 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function TrustItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-700 text-[10px] font-bold text-white">
        ✓
      </span>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-muted-foreground">{desc}</div>
      </div>
    </div>
  );
}

function SectionHeading({
  title,
  href,
  linkLabel,
}: {
  title: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      <Link
        href={href}
        className="group inline-flex items-center gap-1 text-sm font-medium text-brand-700 transition-colors hover:text-brand-800"
      >
        {linkLabel}
        <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
      </Link>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
