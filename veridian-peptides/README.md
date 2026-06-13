# Veridian Peptides

A research-peptide e-commerce storefront. **Original branding** (name, logo,
copy, colours, imagery) built from scratch — a functional reference, not a copy
of any third-party site. Content is placeholder; compound identifiers are
generic. **For research-use-only framing; not for human consumption.**

Brand palette: **Emerald/Teal** (primary) · **Violet** (accent).

## Stack

- **Next.js 16** (App Router, Turbopack, React 19.2) + **TypeScript**
- **Tailwind CSS v4** (CSS-first design tokens in `globals.css`)
- **Prisma 7 + PostgreSQL** (node-postgres driver adapter)
- Edge **proxy** (`src/proxy.ts`) for security headers + geo hint
- **Repository layer** (`src/lib/`) — uses Postgres when `DATABASE_URL` is set,
  falls back to the in-memory seed dataset otherwise (keeps builds green)

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
cp .env.example .env       # set DATABASE_URL
pnpm db:migrate            # create schema
pnpm db:seed               # load placeholder data
pnpm dev                   # http://localhost:3000
pnpm build                 # production build
```

Without a `DATABASE_URL`, the app still runs against the in-memory seed dataset.

## Implemented (milestone 1 — foundation)

- Design system + tokens, dark-mode-ready, a11y focus states
- Original logo/branding, header nav, footer
- Homepage: hero, trust bar, featured grid, COA showcase, categories, blog teaser
- Product catalog with category/availability filters + sorting
- Product detail page (static params, metadata, COA link, related products)
- COA vault (searchable) + batch verification page
- Security-header proxy/middleware

## Implemented (milestone 2 — cart & checkout)

- Client cart store (Context + localStorage), live header count
- Shared pricing: bulk discount, VAT, shipping thresholds
- Multi-step checkout (details → payment → review → confirmation)
- SEPA + Paysera method selection
- `placeOrder` server action with server-side validation + price recompute

## Implemented (milestone 3 — persistence)

- Prisma 7 schema (products, categories, COAs, bundles, blog, orders)
- PostgreSQL via node-postgres driver adapter
- Initial migration + idempotent seed script
- Prisma-backed repository, auto-selected when `DATABASE_URL` is set
- Orders persisted on checkout

## Implemented (milestone 4 — payments)

- `PaymentProvider` adapter interface; checkout depends only on it
- Providers: SEPA (instructions), Paysera (redirect), **NOWPayments**
  (card → USDC/USDT stablecoin settlement — peptide-friendly, no rolling reserve)
- Provider registry: swap the crypto slot (e.g. Cryptomus) in one line
- Idempotent NOWPayments IPN webhook with HMAC-SHA512 verification
- Sandbox hosted-payment page when no provider keys are set
- Orders persisted with provider reference; status → PAID on confirmation

## Implemented (milestone 5 — auth & accounts)

- User + Session models, `Role` (CUSTOMER/ADMIN), orders linked to accounts
- DB-backed sessions via httpOnly cookie; bcrypt password hashing (cost 12)
- Register / login / logout server actions with validation + enumeration guard
- Account dashboard with order history; guest orders re-linked on signup
- Authorised order tracking (`/track`) — owner or matching email
- Header reflects auth state; `requireAdmin` helper for the backoffice

## Implemented (milestone 6 — admin panel)

- RBAC-gated `/admin` (ADMIN role only; CUSTOMER/guests redirected)
- Dashboard KPIs: paid revenue, orders, pending, products, customers
- Product management (price, stock, purity, featured, copy) with revalidation
- Order management with status transitions
- COA management (add certificates) and blog CMS (publish posts)
- Seeded admin account (`ADMIN_EMAIL` / `ADMIN_PASSWORD`)

## Implemented (milestone 7 — content & legal)

- Quality & Testing, FAQ, About, Contact, Shipping & Returns, Security
- Wholesale + Affiliate enquiry pages
- Research Stacks (bundles with computed savings)
- Blog index + post detail (CMS body, excerpt fallback)
- Legal: Privacy, Terms, Cookie settings (templates)
- Reusable content shell; every header/footer link now resolves

## Implemented (milestone 9 — testing & CI/CD)

- Vitest unit tests: pricing, payment webhook (HMAC), repository, formatting
- Cart store refactored to `useSyncExternalStore` (lint-clean, no setState-in-effect)
- GitHub Actions CI: install → lint → test → build (scoped to this app)
- Production Docker image (Next standalone) + `docker-compose` with Postgres

```bash
pnpm test            # run unit tests
docker compose up    # app + postgres
```

## Implemented (milestone 8 — i18n, SEO & consent)

- Multi-currency display (EUR/USD/GBP) via cookie + `<Price>` client islands
- Currency switcher in the header; EUR remains the authoritative base
- SEO: dynamic `robots.txt`, `sitemap.xml` (products, categories, blog, pages)
- JSON-LD structured data: Organization (site-wide) + Product (PDP)
- Cookie consent banner (essential / accept all), hydration-safe

## Internationalisation

- Locale cookie (EN/DE) with server `getServerT()` + client `useT()` helpers
- Language switcher in the header; `<html lang>` reflects the locale
- App chrome (nav, footer, cookie banner) and the homepage are fully translated;
  add keys in `src/lib/i18n/locale.ts` to extend coverage to deeper pages

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md). Ready-made configs:
`vercel.json`, `fly.toml`, `railway.json`, plus `Dockerfile` / `docker-compose.yml`.

## Status

All planned milestones (1–9) are complete. Remaining production tasks are
operational: real product photography, live FX rates, real provider keys,
and a managed Postgres instance.
5. **Auth & accounts** — Auth.js, RBAC, orders, tracking, addresses
6. **Admin** — products, orders, COA upload, blog CMS
7. **Content pages** — quality, FAQ, about, legal, shipping, blog detail
8. **i18n & multi-currency**, SEO (sitemap, JSON-LD), cookie consent
9. **Testing & CI/CD** — Vitest, Playwright, GitHub Actions, Docker
