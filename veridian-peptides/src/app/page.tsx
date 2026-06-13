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
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-50 via-surface to-accent-50" />
        <div className="container-px grid gap-10 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <Badge tone="accent">{t("home.hero.badge")}</Badge>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              {t("home.hero.titleA")}{" "}
              <span className="text-brand-600">{t("home.hero.titleHighlight")}</span>.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              {t("home.hero.lead")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/products" size="lg">
                {t("home.hero.shopAll")}
              </ButtonLink>
              <ButtonLink href="/coa" size="lg" variant="secondary">
                {t("home.hero.browseCoa")}
              </ButtonLink>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
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
          <div className="rounded-2xl border border-border bg-background p-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">VP24-GLP-7781</span>
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
              className="group rounded-2xl border border-border bg-surface p-6 transition-shadow hover:shadow-md"
            >
              <h3 className="font-semibold group-hover:text-brand-600">{cat.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
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
              className="group flex flex-col rounded-2xl border border-border bg-surface p-6 transition-shadow hover:shadow-md"
            >
              <Badge tone="neutral">{post.category}</Badge>
              <h3 className="mt-3 font-semibold group-hover:text-brand-600">{post.title}</h3>
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
    <div className="rounded-2xl border border-border bg-surface/70 p-6 backdrop-blur">
      <div className="text-3xl font-semibold text-brand-600">{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function TrustItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
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
      <Link href={href} className="text-sm font-medium text-brand-600 hover:text-brand-700">
        {linkLabel} →
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
