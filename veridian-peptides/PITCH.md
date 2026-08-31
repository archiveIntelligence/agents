# VERUM Biolabs — Research-Peptide E-Commerce Platform

**A complete, production-ready storefront built for the research-peptide market —
where trust, compliance and payment resilience decide who survives.**

Independently engineered from scratch. Original branding, original code, no
third-party site copied. Framed strictly as *research use only*.

---

## Elevator pitch

Most peptide shops die for two reasons: customers don't trust the purity, and
payment processors ban the merchant. This platform is built to solve exactly
those two problems — a **public, searchable Certificate-of-Analysis vault with
per-batch verification** for trust, and a **card→stablecoin (USDC/USDT) payment
rail** plus SEPA for the high-risk reality of the category. Around that sits a
fast, multilingual, fully-featured commerce stack: catalog, cart, checkout,
accounts, order tracking, an admin back office, and 24-language support.

---

## What it is

A modern e-commerce web application (Next.js 16 / React 19 / TypeScript) for
selling research peptides, blends, stacks and lab supplies — with the trust and
compliance layer the category actually needs. It runs against PostgreSQL in
production and falls back to a seeded in-memory dataset for instant demos.

- **32 pages/routes**, **24 languages** (incl. right-to-left: Arabic, Farsi, Urdu)
- **3 currencies** (EUR / USD / GBP), live switch
- **52 optimised WebP images** (products, categories, blog) — ~95% smaller than PNG
- Fully responsive, dark-mode ready, accessible

---

## Feature catalogue

### Storefront
- Landing page: hero, announcement strip, trust bar, featured products,
  category browsing, COA showcase, blog highlights
- Product catalog with category & availability filters and sorting
- Product detail pages with image galleries, specs, purity, linked COA,
  related products, and Product JSON-LD for rich search results
- **Research Stacks / bundles** with automatic savings
- Persistent cart (survives reloads), live cart count

### Trust & compliance — the differentiator
- **COA Vault**: searchable archive of every batch's certificate of analysis
- **Batch verification**: confirm any vial's batch number instantly
- Average-purity metrics, per-product COA links, "research use only" framing,
  age/consumption disclaimers throughout

### Checkout & payments
- Multi-step checkout (details → payment → review → confirmation)
- Automatic **bulk discount**, VAT and shipping-threshold logic
- **Three payment rails**, behind a clean provider adapter:
  - **SEPA** bank transfer
  - **Paysera**
  - **Card → stablecoin (USDC/USDT)** via a crypto gateway (NOWPayments-style),
    with an **idempotent, HMAC-verified webhook** — the merchant settles in
    stablecoin, sidestepping the processor bans that kill peptide shops
- Sandbox mode so the entire flow is demoable without live keys

### Accounts & fulfilment
- Register / login / logout, **bcrypt** hashing, DB-backed sessions
- Account dashboard with order history; guest orders auto-linked on signup
- **Order tracking** (by reference, or signed-in)
- Role-based access control (customer / admin)

### Admin back office (RBAC-gated)
- KPI dashboard: revenue, orders, pending, products, customers
- Manage products (price, stock, purity, featured, copy)
- Manage orders (status transitions)
- Add certificates of analysis; publish blog posts (built-in CMS)

### Content & legal
- Quality & Testing, FAQ, About, Contact, Shipping, Security pages
- Wholesale & Affiliate enquiry pages
- Research blog (index + article pages with references)
- Privacy, Terms, Cookie policy templates + cookie-consent banner

### Internationalisation & reach
- **24 languages**, full content translation (including blog bodies)
- RTL support, locale + currency switchers, `<html lang>` correctness

### SEO & performance
- Dynamic `robots.txt` and `sitemap.xml`
- JSON-LD structured data (Organization + Product), OpenGraph
- WebP imagery, server components, edge middleware

### Engineering & operations
- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript**
- **Tailwind CSS v4** design system with tokens + custom SVG logo
- **Prisma 7 + PostgreSQL**; seed fallback for DB-free previews
- **Edge middleware**: security headers, geo hint, optional password gate
- **Automated tests** (Vitest) + **GitHub Actions CI** (lint → test → build)
- **Docker + docker-compose**; one-click configs for **Vercel, Fly.io, Railway**

---

## Why it fits a peptide business specifically

1. **Trust is productised.** The COA vault + batch verification turns "trust me"
   into "verify it yourself" — the single biggest conversion lever in this niche.
2. **Payments won't get shut down.** Card→stablecoin settlement + SEPA are chosen
   precisely because mainstream processors ban this MCC.
3. **Global from day one.** 24 languages and 3 currencies open EU, LATAM, MENA
   and Asia without a rebuild.
4. **Compliance-forward.** Research-use-only framing, disclaimers and consent are
   baked in, not bolted on.

---

## What's included

- Full source code, original branding & design system
- Seeded demo data (products, COAs, blog) for instant preview
- Admin panel, auth, payments, i18n — all wired end to end
- CI, Docker, and deploy configs for three hosts
- Documentation (`README.md`, `DEPLOYMENT.md`)

*Operational items a buyer supplies: real product photography, live FX rates,
production payment-provider keys, a managed database, and legally reviewed
policy copy.*

---

## Reddit / outreach opener (copy-paste)

> I build production e-commerce specifically for the research-peptide niche —
> the two things that actually matter here: a public **COA vault with per-batch
> verification** so customers can trust purity, and a **card→crypto (USDC/USDT)**
> payment rail (plus SEPA) so you don't get deplatformed. It's a full stack:
> catalog, cart, multi-step checkout, accounts, order tracking, an admin back
> office, 24 languages, 3 currencies, SEO, tests and one-click deploy. I can send
> a private, password-protected live demo. Want the link?

---

*Research use only. Not medical, legal, or compliance advice.*
