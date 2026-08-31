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

## Brand: VERUM Biolabs
- Official name is **VERUM Biolabs** (Latin *verum* = "true"). NOT "Biosciences"
  (that was an interim label name) and NOT "Peptides".
- **Logo (DONE):** Concept B "Molecular V" — a V built from a peptide-bond chain
  with atom nodes. Lives in `components/brand/logo.tsx` (`Logo`+`LogoGlyph`, brand
  tokens). Favicon = `src/app/icon.svg` (same glyph, concrete colours). The old
  `src/app/favicon.ico` (Veridian) is still present as legacy fallback.
- **Site-wide rebrand (DONE):** all "Veridian"/"Veridian Peptides"/"Veridian Labs"
  → "VERUM Biolabs"; domain/emails `veridian-peptides.test` → `verum-biolabs.test`
  (layout metadata, robots, sitemap, footer, header, about/contact/security/
  shipping/wholesale/affiliate/privacy, payments sepa+nowpayments, types.ts).
  COA `verifyUrl` (`verify.example-lab.test`) + batch prefixes are 3rd-party/
  compound-specific — left as-is. Verified green: tsc 0, build, 17 tests.
  NOT renamed: npm package name + the `veridian-peptides/` directory (path churn).

## Product vials re-rendered (DONE)
- All 29 vial PNGs regenerated with the **"VERUM BIOLABS"** wordmark (master
  `_options/tirzepatide-B.png` re-rendered first via `gen-variants.mjs B`, then
  `gen-coherent.mjs` image-to-image for the rest). Labels now match the brand.

## Hero shader tuning (DONE)
- `components/hero/hero-shader.tsx` `marble` variant: veining reduced (less
  "marble"), lilac accents added then **dialed back** per feedback to a restrained
  level (LILAC ~0.34, LILAC_DEEP ~0.22) — gentle violet note, detail kept.

## Many languages / i18n (DONE)
- **24 languages**: en de es fr it pt nl pl sv el uk ru tr ar fa ur hi bn zh ja
  ko vi th id. One file per language in `src/lib/i18n/messages/`, registered in
  `messages/index.ts`; `locale.ts` is now a registry (`Locale = keyof messages`,
  `LOCALES` with native names, `isRTL`, `matchLocale`). EN is canonical; missing
  keys fall back to EN per-key.
- **Auto-detection**: `getLocale()` (`i18n/server.ts`) uses the `vp.locale` cookie
  if set, else parses the **Accept-Language** header (`matchLocale`, q-weighted,
  `pt-BR`→`pt`). No middleware. Manual pick still writes the cookie.
- **RTL**: `layout.tsx` sets `dir` from `isRTL` (ar/fa/ur). Switcher
  (`language-switcher.tsx`) lists all 24 by native name.
- Translated surface = site chrome + the **full homepage** (hero, trust bar, COA
  showcase, section headings, footer, cookie banner). Page *bodies* and DB-driven
  product/blog/category copy are still EN — that's the next i18n milestone (needs
  string extraction + a translation pipeline, or per-locale CMS content).

## Full-content translation (IN PROGRESS)
- Goal: "all texts" translated, not just chrome. Built an **LLM content-overlay**
  pipeline (the UI message dicts in `messages/` stay hand-authored; this covers the
  data-driven content).
- **Overlay**: per-locale `src/lib/i18n/content/<locale>.json`, flat
  `{ "id:field": "translated" }` (ids: `cat:<slug>:name|description`,
  `prod:<name>:tagline|description`, `blog:<slug>:title|excerpt|body`). Compound
  NAMES are never translated. `content/index.ts` is AUTO-GENERATED (imports each
  json) — do not hand-edit.
- **Applied** in `repository.ts`: every content getter localizes via
  `i18n/localize.ts` (`currentOverlay()` resolves locale with a guarded dynamic
  `next/headers` import so it's safe in vitest/build; EN → no overlay). Pages are
  already `ƒ` dynamic (layout reads the locale), so per-request language works for
  product/category/blog content too.
- **Generator**: `scripts/i18n-translate-content.mjs` (run via tsx,
  `gemini-flash-latest`). `node_modules/.bin/tsx scripts/i18n-translate-content.mjs
  [locales…]`; `FORCE=1` re-translates, `NO_BODIES=1` skips long blog bodies.
  Loads `.env` itself.
- **Status**: short fields done for **14/24 locales** (ar de el es fa fr ja pl pt
  ru sv tr uk zh). 🚫 **BLOCKED** on the remaining **9** (it nl ur hi bn ko vi th
  id) + all blog bodies: the **Gemini API prepayment credits are depleted**
  (HTTP 429 `RESOURCE_EXHAUSTED` — "prepayment credits are depleted", manage at
  https://ai.studio/projects). Not a transient rate-limit; needs a top-up.
- **Provider switch** added: the script uses **OpenAI** when `OPENAI_API_KEY` is in
  `.env` (model via `OPENAI_MODEL`, default `gpt-4o-mini`), otherwise Gemini — so it
  can run without Gemini billing. Force with `TRANSLATE_PROVIDER=openai|gemini`.
- **To finish once credits are added OR an OpenAI key is set** (idempotent, skips existing keys):
  `NO_BODIES=1 node_modules/.bin/tsx scripts/i18n-translate-content.mjs it nl ur hi bn ko vi th id`
  then for the long blog bodies across all locales:
  `node_modules/.bin/tsx scripts/i18n-translate-content.mjs`
  (the script regenerates `content/index.ts`; rerun `pnpm build`). The 9 missing
  locales currently fall back to EN content (their chrome is still translated).
- Still EN-only (next milestones): static page prose (quality/faq/legal/contact/
  shipping/wholesale/affiliate/security), cart/checkout UI strings, reviews, COA
  fields. Extend by keying those into `messages/` (UI) or the overlay (content).

## About Us — storytelling (DONE)
- `app/about/page.tsx` rebuilt as a high-converting narrative page (origin story →
  belief → standards → from-source-to-vial process → research-use seriousness →
  CTA), pulling real stats (avg purity, COA count, compound count). Reuses
  `/blog/choosing-a-supplier.png` + `/blog/reading-a-coa.png` via `SceneImage`.

## Lab Supplies expanded (DONE)
- `data.ts` lab-supplies grew from 2 → **8**: + insulin-syringes,
  luer-lock-syringes, empty-sterile-vials, alcohol-prep-pads, empty-peptide-pen,
  reconstitution-kit. House-style square photos via `scripts/gen-labsupplies.mjs`
  → `public/products/<base>.png` (NOT vials — don't run gen-coherent on these).
  ⚠️ If DB-backed, `pnpm db:seed` to surface the new products.

## Editorial imagery (DONE)
- **8 blog covers** `public/blog/<slug>.png` (16:9) + **6 category banners**
  `public/categories/<slug>.png` (4:3), one coherent art direction matching the
  vials (warm cream, botanical leaf shadow, emerald accent, no text/logos/faces).
- A lilac pass (`scripts/gen-lilac.mjs`, image-to-image) was applied then reverted:
  per feedback the images were re-rendered **clean** (no violet hue wash) via
  `gen-scenes.mjs FORCE=1`. `gen-lilac.mjs` is kept but should NOT be re-run.
- Generators: `gen-scenes.mjs` (text-to-image, per-scene prompts, `aspectRatio`,
  retries 503/429/timeout). Wired via `components/media/scene-image.tsx`.

## Next tasks (recommended order)
1. Optimize images PNG→WebP (public/ is now ~30MB: products + blog + categories).
2. Translate page bodies + product/blog/category content (next i18n milestone).
3. Replace placeholder reviews with real ones.
4. `git push` when ready (PR #1).

## Watch out
- Parallel agents on ONE working tree caused collisions earlier — if spawning
  agents again, give each its own git worktree (see AGENTS_WORKPLAN.md).
- Browser caches images by URL; if a regenerated image looks stale, hard-refresh
  (or add a cache-bust query to ProductImage).
