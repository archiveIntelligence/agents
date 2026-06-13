# Veridian Peptides

A research-peptide e-commerce storefront. **Original branding** (name, logo,
copy, colours, imagery) built from scratch — a functional reference, not a copy
of any third-party site. Content is placeholder; compound identifiers are
generic. **For research-use-only framing; not for human consumption.**

Brand palette: **Emerald/Teal** (primary) · **Violet** (accent).

## Stack

- **Next.js 16** (App Router, Turbopack, React 19.2) + **TypeScript**
- **Tailwind CSS v4** (CSS-first design tokens in `globals.css`)
- Edge **proxy** (`src/proxy.ts`) for security headers + geo hint
- Seed-backed **repository layer** (`src/lib/`) — swap for Prisma/Postgres later

## Project layout

```
src/
  app/                 # routes (App Router)
    page.tsx           # homepage
    products/          # catalog + [slug] PDP
    coa/               # COA vault + verify
  components/
    brand/             # SVG logo (original artwork)
    layout/            # header, footer
    product/           # product card
    ui/                # button, badge primitives
  lib/                 # types, seed data, repository, formatting
  proxy.ts             # edge middleware (security headers, geo)
```

## Develop

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # production build
```

## Implemented (milestone 1 — foundation)

- Design system + tokens, dark-mode-ready, a11y focus states
- Original logo/branding, header nav, footer
- Homepage: hero, trust bar, featured grid, COA showcase, categories, blog teaser
- Product catalog with category/availability filters + sorting
- Product detail page (static params, metadata, COA link, related products)
- COA vault (searchable) + batch verification page
- Security-header proxy/middleware

## Roadmap (next milestones)

2. **Persistence** — Prisma + PostgreSQL, migrations, seed script
3. **Cart & checkout** — client cart store, multi-step checkout, tax/shipping
4. **Payments** — Stripe + SEPA + Paysera adapters (sandbox), idempotent webhooks
5. **Auth & accounts** — Auth.js, RBAC, orders, tracking, addresses
6. **Admin** — products, orders, COA upload, blog CMS
7. **Content pages** — quality, FAQ, about, legal, shipping, blog detail
8. **i18n & multi-currency**, SEO (sitemap, JSON-LD), cookie consent
9. **Testing & CI/CD** — Vitest, Playwright, GitHub Actions, Docker
