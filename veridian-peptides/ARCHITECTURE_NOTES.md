# Veridian Peptides — Architecture Notes (for parallel agents)

Map of the storefront so Prompts 1–7 can work without colliding. Next.js 16 (App
Router, Turbopack, React 19), TypeScript, Tailwind v4 (CSS-first tokens), Prisma 7
+ Postgres, pnpm 10. Read `AGENTS_WORKPLAN.md` for the shared honest-design
guardrails (no fake scarcity/timers; research-use-only copy; verify with
`pnpm lint && pnpm build && pnpm test`; reseed after editing `data.ts`/`seed.ts`).

## Data / variant model and the data → seed → DB → repository → page flow

The catalogue is authored compactly and expands programmatically.

- `src/lib/data.ts` holds a private `catalog: GroupDef[]`. Each **group** = one
  compound (`base`, `name`, `category`, `tagline`, `description`, `purity`,
  optional `featured`, `coaBatch`, `testedOn`, `specs`) plus a `sizes` array of
  `[size, priceCents, compareAtCents, stock?]` rows (EUR cents).
- `variantSlug(base, size)` → `"tirzepatide-10mg"`. `products: Product[]` is
  `catalog.flatMap(...)` — **one purchasable Product per size variant**, sharing
  the same `name`. `featured` is set only on the first/cheapest variant of a
  featured group. `specs` defaults to `PEPTIDE_SPECS`.
- `coas` is derived from groups that have a `coaBatch` (one COA per group, linked
  to the first-size variant slug). `bundles` and `blogPosts` are hand-authored.
  `AVERAGE_PURITY` is computed from `coas`.
- **Flow:** `data.ts` is both the runtime fallback dataset *and* the seed source.
  `prisma/seed.ts` imports `categories/products/coas/bundles/blogPosts` and writes
  them to Postgres (mapping lowercase `stock` → `StockStatus` enum; idempotent
  delete-then-create). `src/lib/repository.ts` is the **only** module the UI
  imports: if `DATABASE_URL` is set it lazily delegates to
  `src/lib/db/prisma-repository.ts` (maps Prisma rows back to the same domain
  types in `src/lib/types.ts`); otherwise it serves the in-memory `data.ts`
  arrays. **Net effect:** edits to `data.ts` show up immediately with no DB, but
  need `pnpm db:seed` to appear in a DB-backed run.
- Pages: `products/page.tsx` dedupes variants to one card per `name` (cheapest as
  representative, `sizeCount` shown as "N sizes"/"from"). `products/[slug]/page.tsx`
  rebuilds the size selector from same-name siblings, renders `VialImage`, COA
  link, specs, honest bulk/stock nudges; `generateStaticParams` uses `products`.
  Schema fields not yet surfaced: none of note — `specs` is a `Json` column.

## Design tokens & key reusable components

Tokens live in `src/app/globals.css` (`@theme`): brand = jewel **emerald**
(`brand-50..950`), accent = **violet** (`accent-*`), champagne **gold-*** for
premium detailing, warm **ink-*** neutrals, semantic surface vars
(`--background`, `--surface`, `--surface-muted`, `--foreground`,
`--muted-foreground`, `--border-color`, dark-mode overrides). Fonts: `font-sans`
(Geist), `font-mono` (Geist Mono), `font-display` (Fraunces serif, auto-applied
to h1–h3). Utilities: `.container-px` (max-w-80rem wrapper), `.eyebrow`
(uppercase mono label), `.font-display`, `.shadow-soft`, `.shadow-lift`,
`.text-balance`, `.hairline`.

- `VialImage` (`components/product/vial-image.tsx`) — programmatic SVG vial; label
  text (name + size) drawn via `foreignObject`; **blue powder when `/ghk/i` matches
  the name**, white otherwise. Used on cards and PDP. (Hybrid: a photoreal base
  render could replace the glass; label stays programmatic.)
- `ProductCard` — card with `VialImage`, purity badge, stock badge, "from" price
  + `sizeCount` when it represents a group.
- `Badge` (`ui/badge.tsx`) — tones `brand|accent|ok|warn|off|neutral`.
- `Button`/`ButtonLink` (`ui/button.tsx`) — variants `primary|secondary|ghost|accent`, sizes `sm|md|lg`.
- `IncentiveMeter` + `OrderSummary` (`components/cart/`) — goal-gradient free-shipping
  bar + bulk-discount nudge, and the price breakdown. **All figures derive from
  real pricing** in `lib/cart/pricing.ts` (bulk 5% at ≥3 units, free shipping over
  €200 net, 19% VAT, €4.99 flat). Cart state: `lib/cart/cart-context.tsx`
  (module-level store via `useSyncExternalStore` + localStorage; `useCart()` API).
  Checkout (`app/checkout/page.tsx`) is details→payment→review→done, **card→crypto
  is the only method**.

## i18n key pattern

`src/lib/i18n/locale.ts`: flat dot-namespaced message dicts, **EN is source, DE is
a full translation** (`nav.*`, `header.*`, `announce.*`, `footer.*`, `home.*`,
`common.cookie.*`). `translator(locale)` falls back DE→EN→key. Server:
`getServerT()` (`i18n/server.ts`); client: `useT()` via `i18n/locale-provider`.
Add a key to **both** `en` and `de`. Locale cookie `vp.locale`. Currency display
(EUR/USD/GBP) is separate: `i18n/currency.ts` + `<Price>` client island.

## Blog renderer capabilities

`app/blog/[slug]/page.tsx` `renderBlocks()` is a minimal markdown-ish renderer:
splits on blank lines; supports `## ` h2, `### ` h3, `- ` bullet lists, and
paragraphs. **No inline links, bold/italic, or numbered lists.** Bodies are plain
text in `data.ts` (`blogPosts[].body`, optional — falls back to `excerpt`). A
fixed research-use disclaimer is appended. Prompt 1 must extend this renderer to
add `[text](url)` links + a References list.

## Where each workplan task changes things

| Prompt | Goal | Primary files | Notes / shared hot-spots |
| --- | --- | --- | --- |
| 1 | Scientific blog + citations | `data.ts` (`blogPosts` only), `blog/[slug]/page.tsx` | Renderer needs link support; **data.ts** |
| 2 | More research stacks | `data.ts` (`bundles` only), `stacks/page.tsx`, opt. `components/stacks/*` | Use real variant slugs; **data.ts** |
| 3 | "Research" framing | `data.ts` (`categories`), `i18n/locale.ts` (EN+DE), `layout/{header,footer}.tsx` | **data.ts**; keep DE in sync |
| 4 | PDP pack + reviews | **`products/[slug]/page.tsx`**, **`schema.prisma`** (+migration), `seed.ts`, `repository.ts` + `db/prisma-repository.ts`, new `components/product/*` | **Schema + PDP shared**; new `Review` model |
| 5 | 2-tier descriptions / monograph | `types.ts`, `data.ts` (GroupDef/Product), **`schema.prisma`** (+migration), `seed.ts`, `repository.ts`(+db), **`products/[slug]/page.tsx`**, new `components/product/*` | **types + data.ts + schema + PDP shared** |
| 6 | Buyer-psychology/UX pass | cross-cutting `components/*` + page polish; **`products/[slug]/page.tsx`** | Depends on Prompt 4 reviews; **PDP shared** |
| 7 | New compounds | `data.ts` (`catalog` additions only) | Auto-expands to variants + COA; **data.ts** |

**Shared hot-spots needing care / sequencing:** `src/lib/data.ts` is touched by
Prompts 1,2,3,5,7 — coordinate by section (`blogPosts`/`bundles`/`categories`/
`catalog`/GroupDef) or use worktrees and merge by hand. `prisma/schema.prisma`
(+ migration, `seed.ts`, both repository files) is touched by Prompts 4 and 5 —
**migrations and seed will conflict**; run them sequentially or rebase migrations.
`src/app/products/[slug]/page.tsx` (the PDP) is touched by Prompts 4, 5, 6 —
serialize PDP edits last. If a Prompt adds new `Product`/`GroupDef` fields,
update `types.ts`, the `data.ts` expander, the Prisma schema, `seed.ts`, **and**
`prisma-repository.ts`'s `toProduct` mapping together, or the DB-backed path drops
the field.
