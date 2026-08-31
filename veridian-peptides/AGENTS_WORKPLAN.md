# Veridian Peptides — Parallel Agent Workplan

Ready-to-paste prompts to split the next wave of work across multiple agents.
**Run Prompt 0 first** (overview), then launch Prompts 1–7 — ideally each in its
own git worktree/branch so they don't collide, then merge.

> ⚠️ Conflict avoidance: several tasks touch `src/lib/data.ts`. Either run those
> ones sequentially, or give each agent a worktree and merge `data.ts` by hand.
> File "ownership" is noted per task.

---

## Shared guardrails (apply to EVERY agent)

- **Honest conversion psychology only.** Anchoring, real scarcity (from the real
  `stock` status), goal-gradient meters, genuine social proof, authority (COA),
  loss-aversion framing — yes. **No deceptive dark patterns**: no fake countdowns,
  invented stock counts, fake "X people viewing", confirmshaming, hidden costs,
  pre-checked paid add-ons. These are illegal in the EU (DSA Art. 25 / UCPD) and
  break the trust-based premium brand.
- **Compliance copy:** every compound is "for laboratory and research use only,
  not for human consumption." Articles are "general research information, not
  medical advice." No human dosing instructions.
- **Stack conventions:** TypeScript + Next.js 16 (App Router, Turbopack), Tailwind
  v4 tokens in `src/app/globals.css`, Prisma/Postgres via the repository layer,
  i18n via `src/lib/i18n/locale.ts` (EN source + DE), display serif = Fraunces
  (`font-display`), eyebrow labels = `.eyebrow`, shadows = `shadow-soft`/`shadow-lift`.
- **Verify before commit:** `pnpm lint && pnpm build && pnpm test`. If you change
  `src/lib/data.ts` or `prisma/seed.ts`, run `pnpm db:seed` and smoke-test the
  affected pages on `http://localhost:3000`.
- **Commit** on the working branch with a clear message; do not push unless asked.
- **Research note (Reddit, 2026):** crypto-only payment is seen by some buyers as
  a trust red flag — keep COA transparency, public batch records and clear refund/
  contact info prominent to compensate. Don't add health claims.

---

## Prompt 0 — Overview & coordination (run this first)

```
You are onboarding to the Veridian Peptides storefront at
/Users/tahaberatkelbat/peptide/veridian-peptides (Next.js 16 App Router,
TypeScript, Tailwind v4, Prisma/Postgres, pnpm 10).

Goal of this session: get a complete mental model and produce a short written
map for the other agents. Do NOT change code.

Do this:
1. Read AGENTS.md, CLAUDE.md, README.md, DEPLOYMENT.md and AGENTS_WORKPLAN.md.
2. Read the design system in src/app/globals.css and note the tokens/utilities.
3. Read src/lib/data.ts (the catalogue is built from a compact `catalog` array
   that expands into one Product per size variant — understand `variantSlug`,
   `coas`, `bundles`, `blogPosts`).
4. Read src/lib/types.ts, src/lib/repository.ts, src/lib/cart/* and the key pages:
   src/app/page.tsx, src/app/products/page.tsx, src/app/products/[slug]/page.tsx,
   src/app/blog/[slug]/page.tsx, src/app/checkout/page.tsx, and the components in
   src/components/{product,cart,ui,layout,i18n}.
5. Confirm the local app runs: postgres is a docker container (`docker compose up
   -d db`), env is in .env, then `pnpm dev`. Verify a few routes return 200.
6. Output a 1-page "ARCHITECTURE_NOTES.md" summarising: data/variant model,
   how products/COAs/blog flow from data.ts → seed → DB → repository → pages,
   the design tokens, the i18n keys pattern, and where each upcoming task
   (Prompts 1–7) should make changes. Save it to the repo root.

Respect the Shared guardrails in AGENTS_WORKPLAN.md.
```

---

## Prompt 1 — Professionalise the research blog (scientific rigour + citations)

```
Repo: /Users/tahaberatkelbat/peptide/veridian-peptides. Read AGENTS_WORKPLAN.md
(shared guardrails) and ARCHITECTURE_NOTES.md first.

Task: Rewrite the blog article bodies in src/lib/data.ts (`blogPosts`) to read
like rigorous scientific review pieces, and upgrade the renderer if needed.

Requirements:
- Elevate the register: precise mechanistic language (receptor pharmacology,
  pharmacokinetics, assay terminology), but stay readable.
- Add a "## References" section to each article with 3–6 real, citable sources
  (peer-reviewed papers, clinical-trial registries, reviews). Use the markdown
  link list the renderer supports; if links aren't rendered, extend the renderer
  in src/app/blog/[slug]/page.tsx to support `[text](url)` inline links and a
  references list (keep it minimal, no new deps).
- Keep the strict "research use only / not medical advice / no human dosing"
  framing. No efficacy claims beyond what trials report; attribute everything.
- Keep all six existing slugs; you may add 1–2 new evidence-led articles
  (e.g., "Incretin pharmacology: GIP/GLP-1/glucagon receptor signalling",
  "Amylin agonists and combination metabolic research").
- After editing data.ts, run `pnpm db:seed` and verify /blog and a couple of
  /blog/<slug> pages render with references.

Files you own: src/lib/data.ts (blogPosts only), src/app/blog/[slug]/page.tsx.
Verify: pnpm lint && pnpm build && pnpm test. Commit.
```

---

## Prompt 2 — More research stacks

```
Repo: /Users/tahaberatkelbat/peptide/veridian-peptides. Read AGENTS_WORKPLAN.md
and ARCHITECTURE_NOTES.md first.

Task: Expand the "Research Stacks" offering.

Requirements:
- Add 6–10 well-reasoned stacks to `bundles` in src/lib/data.ts using REAL
  product slugs from the catalogue (e.g., tirzepatide-10mg, bpc-157-5mg,
  cjc-ipamorelin-10mg, ghk-cu-50mg, selank-10mg, semax-10mg, mots-c-10mg…).
  Group them by research theme: Metabolic, Recovery/Repair, Longevity/Cellular,
  Cognitive/Neuro, GH-axis. Each stack: slug, name (include "Research"),
  evidence-led description, productSlugs, realistic savingsPercent (8–15%).
- Upgrade src/app/stacks/page.tsx into a premium grid: each stack card shows the
  included products (use VialImage thumbnails), the combined "from" price, the
  honest savings %, and an "Add stack to cart" action that adds all items
  (reuse the cart context; add each productSlug). Keep design tokens consistent.
- Pricing must be truthful: savings reflect the configured savingsPercent.

Files you own: src/lib/data.ts (`bundles` only), src/app/stacks/page.tsx,
optionally a small src/components/stacks/* component.
Verify: pnpm lint && pnpm build && pnpm test; reseed; smoke-test /stacks. Commit.
```

---

## Prompt 3 — "Research" framing across all categories & nav

```
Repo: /Users/tahaberatkelbat/peptide/veridian-peptides. Read AGENTS_WORKPLAN.md
and ARCHITECTURE_NOTES.md first.

Task: Make the "research" positioning consistent everywhere.

Requirements:
- Audit category names/descriptions in src/lib/data.ts (`categories`) and ensure
  each reads as a research area (e.g., "Metabolic Research", "Recovery & Repair
  Research", "Cellular & Longevity Research", "Neuro & Cognitive Research",
  "Growth-Factor Research", "Lab Supplies").
- Audit nav + i18n labels in src/lib/i18n/locale.ts (EN + DE) and header/footer
  so "Research" framing is consistent and translated.
- Ensure category landing/listing copy uses the framing without becoming
  repetitive or spammy.
Files you own: src/lib/data.ts (`categories`), src/lib/i18n/locale.ts,
src/components/layout/{header,footer}.tsx.
Verify: pnpm lint && pnpm build && pnpm test; reseed; smoke-test. Commit.
```

---

## Prompt 4 — Amazon-style PDP: "frequently bought together" pack + reviews

```
Repo: /Users/tahaberatkelbat/peptide/veridian-peptides. Read AGENTS_WORKPLAN.md
and ARCHITECTURE_NOTES.md first.

Task: Add two Amazon-style modules to the product detail page
(src/app/products/[slug]/page.tsx): a "Frequently bought together" pack and a
ratings/reviews section.

Requirements:
- PACK: a "Complete the research pack" block suggesting 2–3 complementary
  products (use the bundles/category relationships; do NOT claim real basket
  data — title it "Frequently paired" / "Complete the pack"). Show combined
  price and a one-click "Add all" using the cart context.
- REVIEWS: add a first-party reviews model. Add a `Review` model to
  prisma/schema.prisma (productId, author, rating 1–5, title, body, verified,
  createdAt), create a migration (`pnpm db:migrate`), extend the repository and
  seed realistic-but-clearly-seeded reviews per product. Render: average star
  rating near the buy box (social proof close to CTA — per UX research), a
  reviews list with verified-purchase badges and relative dates ("3 weeks ago").
  Add aggregateRating JSON-LD. Reviews must be genuine first-party data, never
  fabricated testimonials presented as third-party.
- Respect honest-design guardrails (no fake counts).
Files you own: src/app/products/[slug]/page.tsx, prisma/schema.prisma + migration,
prisma/seed.ts, src/lib/repository.ts (+ db layer), new src/components/product/*.
Verify: migrate + seed; pnpm lint && pnpm build && pnpm test; smoke-test a PDP. Commit.
```

---

## Prompt 5 — Product descriptions: punchy short + expandable "pharma insert"

```
Repo: /Users/tahaberatkelbat/peptide/veridian-peptides. Read AGENTS_WORKPLAN.md
and ARCHITECTURE_NOTES.md first.

Task: Two-tier product descriptions optimised for skimmers who like smart
buzzwords, with an expandable monograph for depth.

Requirements:
- Data: extend the catalogue so each product group can carry a short
  "highlights" list (3–5 icon + buzzword bullets, e.g. "Triple-receptor agonist",
  "HPLC ≥99%", "Lyophilised, -20°C") and a long `monograph` body that reads like
  a pharmaceutical package insert (sections: Identity, Mechanism / pathway,
  Research context, Handling & reconstitution, Storage & stability, Specifications,
  Safety / research-use statement). Add fields to the GroupDef/Product types in
  src/lib/types.ts and src/lib/data.ts; persist via schema + seed (or a Json
  column) so the DB-backed PDP can read them.
- UI on the PDP: lead with the short highlights (icons/symbols, minimal text),
  then an accessible expandable accordion ("Full monograph") that reveals the
  detailed insert. Use the existing design tokens; keep icons lightweight
  (inline SVG, no icon-font dependency).
- Keep the strict research-use framing in the monograph; no human dosing.
Files you own: src/lib/types.ts, src/lib/data.ts, prisma/schema.prisma + migration,
prisma/seed.ts, src/lib/repository.ts (+ db layer), src/app/products/[slug]/page.tsx,
new src/components/product/* (highlights + accordion).
Verify: migrate + seed; pnpm lint && pnpm build && pnpm test; smoke-test. Commit.
```

---

## Prompt 6 — Buyer-psychology & UX optimisation pass (apply the research)

```
Repo: /Users/tahaberatkelbat/peptide/veridian-peptides. Read AGENTS_WORKPLAN.md
and ARCHITECTURE_NOTES.md first.

Task: Apply current ecommerce/UX behavioural-science findings across the funnel,
honestly. Ground decisions in the cited research below.

Apply:
- Social proof close to the CTA, with recency ("this week") — display rating +
  review snippets near the buy box and in cart (depends on Prompt 4's reviews).
- Anchoring: ensure compareAt and "Save %" are present and legible (research:
  anchor pricing lifts perceived value ~22–35%).
- Reduce decision fatigue (Hick's Law): tighten choices, sensible defaults, clear
  primary CTA hierarchy; don't overload the PDP.
- Trust cluster near actions: COA/HPLC, secure-checkout, tracked-shipping badges
  (you already have some — make them consistent and prominent).
- Benefit-led microcopy ("Independently verified purity" over "HPLC report").
- Micro-interactions/feedback on add-to-cart, sticky buy bar on mobile PDP.
Do NOT add deceptive patterns. Measure nothing fake.

Reference (for the write-up): Baymard 2025 price-comparison behaviour; J. of
Marketing Research 2025 on anchor pricing; IxDF cognition/Hick's-Law; 2026 UX
conversion guides (social proof recency, trust badges near CTA).

Files you own: cross-cutting but prefer src/components/* and page-level polish;
coordinate with Prompts 4/5 if run in parallel (reviews/descriptions).
Verify: pnpm lint && pnpm build && pnpm test; smoke-test funnel. Commit.
```

---

## Prompt 7 — Add newer same-level compounds to the catalogue

```
Repo: /Users/tahaberatkelbat/peptide/veridian-peptides. Read AGENTS_WORKPLAN.md
and ARCHITECTURE_NOTES.md first.

Task: Extend the catalogue with newer, high-interest research compounds at the
same tier as the current lineup, following the existing builder pattern.

Add (research-use framing, with sizes + Western-benchmarked EUR pricing + a COA
batch each) e.g.:
- Survodutide (GLP-1/glucagon dual; MASH research) — 5/10/15mg
- Mazdutide (GLP-1/glucagon dual) — 5/10mg
- AOD-9604 (metabolic fragment) — 5/10mg
- 5-Amino-1MQ (NNMT-inhibitor research) — 50mg
- Tesofensine (monoamine-reuptake research) — small mg
- SLU-PP-332 (ERRα-agonist research) — research sizes
- (optional) Adipotide, SS-31/Elamipretide, Ipamorelin solo, Sermorelin,
  PT-141, Melanotan-II — pick the strongest fits.
Pricing: benchmark against Western research vendors (per-mg declining with size);
add anchoring compareAt. Verify each compound's category placement.
Each new group: add a `catalog` entry in src/lib/data.ts (it auto-expands to
size variants + COA). Keep descriptions sciency but compliant.

Files you own: src/lib/data.ts (`catalog` additions only).
Verify: pnpm lint && pnpm build && pnpm test; reseed; smoke-test /products and a
new PDP. Commit.
```

---

## API keys / accounts you need to provide

| Purpose | Variable / account | When |
| --- | --- | --- |
| **Product images (chosen: Nano Banana hybrid)** | **Google Gemini API key** (`GEMINI_API_KEY`) | To generate the 2 photoreal vial base renders; labels stay programmatic |
| Image alt route (optional) | fal.ai API key | Only if you prefer FLUX over Gemini |
| Live crypto checkout | `NOWPAYMENTS_API_KEY` + `NOWPAYMENTS_IPN_SECRET` | To leave sandbox and accept real card→stablecoin payments |
| Production hosting (later) | Managed Postgres `DATABASE_URL` (Neon/Supabase) + `APP_URL` | At deploy time (Vercel/Fly/Railway) |

Nothing else is required. Reviews, descriptions, stacks, blog and UX work need
**no** API keys. The image MCP itself (nanobanana-mcp-server) is installed via
its package and reads the Gemini key from env.
```
