# Session handoff — Veridian/VERUM storefront

Read this first, then `ARCHITECTURE_NOTES.md`. Everything below is committed on
branch `claude/certapeptides-clone-prompt-5rk9u6` (NOT pushed; PR #1 unchanged).

## How to run
```
cd /Users/tahaberatkelbat/peptide/veridian-peptides
docker compose up -d db      # postgres (if not running)
pnpm install                 # pnpm 10 via corepack
pnpm dev                     # http://localhost:3000
```
Verify: `pnpm lint && pnpm build && pnpm test` (currently green: tsc 0, 95 routes,
17 tests). After data/schema edits: `pnpm db:seed`.

## State (done)
- Local run, DE/EN i18n, deploy configs (vercel/fly/railway).
- Premium light design + honest conversion psychology (no dark patterns).
- Payment: **card→crypto (USDC/USDT) only** (UI + server enforced).
- Catalog: ~27 curated compounds (incl. neuro + newer: survodutide, mazdutide,
  AOD-9604, tesofensine, 5-amino-1MQ, SLU-PP-332, SS-31, adipotide, ipamorelin,
  sermorelin) authored compactly in `src/lib/data.ts` `catalog` → expands to one
  Product per size variant. Western EUR pricing + anchoring.
- Blog: 6 real articles + inline links/references (renderer in blog/[slug]).
- Research stacks (`bundles` + `src/app/stacks` + `components/stacks/stack-card`).
- "Research" framing across categories/nav/footer/i18n.
- Two-tier PDP descriptions: highlights + expandable monograph
  (`product-highlights.tsx`, `product-monograph.tsx`).
- Reviews + ratings + "Complete the pack" on PDP (`product-reviews.tsx`,
  `star-rating.tsx`, `complete-the-pack.tsx`, `repository.getProductReviews`).
  ⚠️ Reviews in `data.ts` `reviews` are PLACEHOLDER sample data — replace with
  real, order-verified reviews before launch (EU UCPD/DSA).
- Interactive WebGL hero shader (`components/hero/hero-shader.tsx`, marble variant).
- **29 coherent photoreal product vials** in `public/products/<base>.png`,
  brand on labels = **VERUM BIOSCIENCES** (pharma look, style B: warm cream +
  botanical shadow). Rendered via `components/product/product-image.tsx`
  (photo + size badge; SVG `vial-image.tsx` fallback). manifest.json lists them.

## Image generation (Gemini / Nano Banana)
- `GEMINI_API_KEY` is in `.env` (gitignored). Model that WORKS:
  **`gemini-3.1-flash-image`** (Nano Banana 2). `gemini-3-pro-image` (Pro)
  returns 404/timeout on this project — not accessible.
- Coherence approach (KEEP using this): image-to-image edit from a master.
  Master = `public/products/_options/tirzepatide-B.png`.
  - Batch all: `node --env-file=.env scripts/gen-coherent.mjs`
  - One: `node --env-file=.env scripts/gen-coherent.mjs <base>`
  - Style variants for choosing: `scripts/gen-variants.mjs`
  Scripts retry 503/timeout; flash model has occasional 503 under load.

## Next tasks (recommended order)
1. **Logo** for VERUM (generate ~3 concepts → user picks) → wire into
   `components/brand/logo.tsx` + favicon.
2. **Rebrand site-wide Veridian → VERUM** (header/footer/i18n EN+DE/metadata in
   `app/layout.tsx`/`app/page.tsx`/footer, COA `verifyUrl`/batch prefixes, emails)
   — currently labels say VERUM but the site chrome still says "Veridian Peptides".
3. **Aesthetic website images** (COA showcase, category banners, blog headers) —
   atmospheric, less sterile; generate with Nano Banana 2, store in `public/`.
4. Optimize images PNG→WebP (public/products ~15MB).
5. Replace placeholder reviews with real ones.
6. `git push` when ready (PR #1).

## Watch out
- Parallel agents on ONE working tree caused collisions earlier — if spawning
  agents again, give each its own git worktree (see AGENTS_WORKPLAN.md).
- Browser caches images by URL; if a regenerated image looks stale, hard-refresh
  (or add a cache-bust query to ProductImage).
