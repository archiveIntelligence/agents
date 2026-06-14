import type { Bundle, BlogPost, Category, Coa, Product } from "./types";

// Seed dataset — original placeholder content. Compound names are generic
// research-chemical identifiers (not brand-owned). Descriptions are written
// from scratch. Replace with a real database/CMS in a later milestone.

export const categories: Category[] = [
  {
    slug: "metabolic",
    name: "Metabolic Research",
    description: "Incretin and metabolic-pathway research compounds.",
  },
  {
    slug: "recovery",
    name: "Tissue & Recovery",
    description: "Compounds studied for regeneration and repair models.",
  },
  {
    slug: "cellular",
    name: "Cellular & Longevity",
    description: "Mitochondrial, copper and longevity research peptides.",
  },
  {
    slug: "neuro",
    name: "Neuro Research",
    description: "Neuropeptides used in cognitive and behavioural studies.",
  },
  {
    slug: "growth",
    name: "Growth Factors",
    description: "Growth-hormone secretagogue research compounds.",
  },
  {
    slug: "lab-supplies",
    name: "Lab Supplies",
    description: "Bacteriostatic water, syringes and reconstitution kits.",
  },
];

export const products: Product[] = [
  {
    slug: "vp-glp-001",
    name: "VP-GLP-001",
    tagline: "Incretin pathway research peptide",
    description:
      "A lyophilised research peptide studied in metabolic and incretin-signalling models. Supplied for in-vitro and laboratory research use only.",
    categorySlug: "metabolic",
    priceCents: 8900,
    compareAtCents: 10900,
    size: "5mg",
    purity: 99.4,
    stock: "in_stock",
    coaBatches: ["VP24-GLP-7781"],
    featured: true,
    specs: [
      { label: "Molecular form", value: "Lyophilised powder" },
      { label: "Storage", value: "-20 °C, desiccated" },
      { label: "Reconstitution", value: "Bacteriostatic water" },
    ],
  },
  {
    slug: "vp-glp-002",
    name: "VP-GLP-002",
    tagline: "Dual-agonist metabolic research compound",
    description:
      "Dual-receptor research peptide investigated in metabolic-regulation assays. For laboratory research purposes only.",
    categorySlug: "metabolic",
    priceCents: 12900,
    size: "10mg",
    purity: 99.1,
    stock: "in_stock",
    coaBatches: ["VP24-GLP-7782"],
    featured: true,
    specs: [
      { label: "Molecular form", value: "Lyophilised powder" },
      { label: "Storage", value: "-20 °C, desiccated" },
      { label: "Reconstitution", value: "Bacteriostatic water" },
    ],
  },
  {
    slug: "vp-rec-157",
    name: "VP-REC-157",
    tagline: "Cytoprotective recovery research peptide",
    description:
      "Pentadecapeptide studied in tissue-repair and gut-barrier research models. Supplied for research use only.",
    categorySlug: "recovery",
    priceCents: 5900,
    size: "10mg",
    purity: 99.6,
    stock: "in_stock",
    coaBatches: ["VP24-REC-3310"],
    featured: true,
    specs: [
      { label: "Molecular form", value: "Lyophilised powder" },
      { label: "Storage", value: "-20 °C, desiccated" },
      { label: "Reconstitution", value: "Bacteriostatic water" },
    ],
  },
  {
    slug: "vp-rec-500",
    name: "VP-REC-500",
    tagline: "Actin-binding recovery research peptide",
    description:
      "Synthetic fragment investigated in angiogenesis and recovery research. For laboratory use only.",
    categorySlug: "recovery",
    priceCents: 6900,
    size: "5mg",
    purity: 98.9,
    stock: "low_stock",
    coaBatches: ["VP24-REC-3311"],
    specs: [
      { label: "Molecular form", value: "Lyophilised powder" },
      { label: "Storage", value: "-20 °C, desiccated" },
      { label: "Reconstitution", value: "Bacteriostatic water" },
    ],
  },
  {
    slug: "vp-cell-ghk",
    name: "VP-CELL-GHK",
    tagline: "Copper-complex cellular research peptide",
    description:
      "Copper tripeptide complex studied in skin-model and cellular-signalling research. Research use only.",
    categorySlug: "cellular",
    priceCents: 4900,
    size: "50mg",
    purity: 99.3,
    stock: "in_stock",
    coaBatches: ["VP24-CEL-2204"],
    featured: true,
    specs: [
      { label: "Molecular form", value: "Lyophilised powder" },
      { label: "Storage", value: "-20 °C, desiccated" },
      { label: "Reconstitution", value: "Bacteriostatic water" },
    ],
  },
  {
    slug: "vp-cell-epi",
    name: "VP-CELL-EPI",
    tagline: "Telomere & longevity research peptide",
    description:
      "Tetrapeptide investigated in longevity and circadian-regulation research models. Research use only.",
    categorySlug: "cellular",
    priceCents: 5400,
    size: "20mg",
    purity: 99.0,
    stock: "in_stock",
    coaBatches: ["VP24-CEL-2205"],
    specs: [
      { label: "Molecular form", value: "Lyophilised powder" },
      { label: "Storage", value: "-20 °C, desiccated" },
      { label: "Reconstitution", value: "Bacteriostatic water" },
    ],
  },
  {
    slug: "vp-neuro-slk",
    name: "VP-NEURO-SLK",
    tagline: "Anxiolytic neuropeptide (research)",
    description:
      "Heptapeptide studied in anxiolytic and cognitive research assays. For laboratory research only.",
    categorySlug: "neuro",
    priceCents: 4400,
    size: "10mg",
    purity: 98.7,
    stock: "in_stock",
    coaBatches: ["VP24-NEU-1190"],
    specs: [
      { label: "Molecular form", value: "Lyophilised powder" },
      { label: "Storage", value: "-20 °C, desiccated" },
      { label: "Reconstitution", value: "Bacteriostatic water" },
    ],
  },
  {
    slug: "vp-growth-ipa",
    name: "VP-GROWTH-IPA",
    tagline: "Selective secretagogue research peptide",
    description:
      "Selective growth-hormone secretagogue studied in endocrine research models. Research use only.",
    categorySlug: "growth",
    priceCents: 4700,
    size: "5mg",
    purity: 99.2,
    stock: "pre_order",
    coaBatches: ["VP24-GRW-8821"],
    specs: [
      { label: "Molecular form", value: "Lyophilised powder" },
      { label: "Storage", value: "-20 °C, desiccated" },
      { label: "Reconstitution", value: "Bacteriostatic water" },
    ],
  },
  {
    slug: "vp-supply-bacwater",
    name: "Bacteriostatic Water",
    tagline: "0.9% benzyl-alcohol reconstitution solvent",
    description:
      "Sterile bacteriostatic water for reconstitution of lyophilised research peptides. 30 ml vial.",
    categorySlug: "lab-supplies",
    priceCents: 1200,
    size: "30ml",
    purity: 100,
    stock: "in_stock",
    coaBatches: [],
    specs: [
      { label: "Volume", value: "30 ml" },
      { label: "Composition", value: "0.9% benzyl alcohol" },
    ],
  },
  {
    slug: "vp-supply-kit",
    name: "Reconstitution Kit",
    tagline: "Syringes, alcohol pads & mixing vials",
    description:
      "Complete reconstitution kit including insulin syringes, alcohol prep pads and sterile mixing vials.",
    categorySlug: "lab-supplies",
    priceCents: 1900,
    size: "1 kit",
    purity: 100,
    stock: "in_stock",
    coaBatches: [],
    specs: [
      { label: "Contents", value: "10× syringes, 20× pads, 2× vials" },
    ],
  },
];

export const bundles: Bundle[] = [
  {
    slug: "metabolic-starter",
    name: "Metabolic Research Starter",
    description: "Core metabolic compounds plus reconstitution supplies.",
    productSlugs: ["vp-glp-001", "vp-supply-bacwater", "vp-supply-kit"],
    savingsPercent: 12,
  },
  {
    slug: "recovery-stack",
    name: "Recovery Research Stack",
    description: "Paired recovery peptides for repair-model studies.",
    productSlugs: ["vp-rec-157", "vp-rec-500"],
    savingsPercent: 10,
  },
];

export const coas: Coa[] = [
  { batch: "VP24-GLP-7781", productSlug: "vp-glp-001", productName: "VP-GLP-001", testedOn: "2026-04-12", purity: 99.4, lab: "Independent HPLC Lab", verifyUrl: "https://verify.example-lab.test/VP24-GLP-7781" },
  { batch: "VP24-GLP-7782", productSlug: "vp-glp-002", productName: "VP-GLP-002", testedOn: "2026-04-12", purity: 99.1, lab: "Independent HPLC Lab", verifyUrl: "https://verify.example-lab.test/VP24-GLP-7782" },
  { batch: "VP24-REC-3310", productSlug: "vp-rec-157", productName: "VP-REC-157", testedOn: "2026-03-29", purity: 99.6, lab: "Independent HPLC Lab", verifyUrl: "https://verify.example-lab.test/VP24-REC-3310" },
  { batch: "VP24-REC-3311", productSlug: "vp-rec-500", productName: "VP-REC-500", testedOn: "2026-03-29", purity: 98.9, lab: "Independent HPLC Lab", verifyUrl: "https://verify.example-lab.test/VP24-REC-3311" },
  { batch: "VP24-CEL-2204", productSlug: "vp-cell-ghk", productName: "VP-CELL-GHK", testedOn: "2026-02-18", purity: 99.3, lab: "Independent HPLC Lab", verifyUrl: "https://verify.example-lab.test/VP24-CEL-2204" },
  { batch: "VP24-CEL-2205", productSlug: "vp-cell-epi", productName: "VP-CELL-EPI", testedOn: "2026-02-18", purity: 99.0, lab: "Independent HPLC Lab", verifyUrl: "https://verify.example-lab.test/VP24-CEL-2205" },
  { batch: "VP24-NEU-1190", productSlug: "vp-neuro-slk", productName: "VP-NEURO-SLK", testedOn: "2026-01-30", purity: 98.7, lab: "Independent HPLC Lab", verifyUrl: "https://verify.example-lab.test/VP24-NEU-1190" },
  { batch: "VP24-GRW-8821", productSlug: "vp-growth-ipa", productName: "VP-GROWTH-IPA", testedOn: "2026-01-15", purity: 99.2, lab: "Independent HPLC Lab", verifyUrl: "https://verify.example-lab.test/VP24-GRW-8821" },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "metabolic-peptide-landscape-2026",
    title: "The 2026 Metabolic Peptide Landscape: GLP-1, GIP and Triple Agonists",
    excerpt:
      "How single, dual and triple incretin agonists differ — and why retatrutide and the amylin class dominate the 2026 research conversation.",
    category: "Research",
    publishedOn: "2026-06-10",
    readingMinutes: 9,
    body: `Few areas of peptide science have moved as fast as the incretin field. In the space of a few years the research conversation has gone from a single hormone receptor to molecules that engage three at once. This overview maps the current landscape for anyone following the literature — strictly as background for laboratory research, not as guidance for human use.

## The incretin system in one paragraph

Incretins are gut-derived hormones released after nutrient intake. The two most studied are GLP-1 (glucagon-like peptide-1) and GIP (glucose-dependent insulinotropic polypeptide). In research models they modulate insulin secretion, gastric emptying and signalling pathways linked to appetite. Glucagon, by contrast, mobilises stored energy. Modern metabolic peptides are interesting precisely because they combine agonism across these receptors in a single sequence.

## Single agonists: semaglutide

Semaglutide is a GLP-1 receptor agonist and the most established molecule in the category. Its long half-life in published pharmacokinetic work comes from structural modifications that resist enzymatic degradation. As a single-receptor reference compound it is frequently used as a comparator in studies of newer multi-agonists.

## Dual agonists: tirzepatide

Tirzepatide engages both GIP and GLP-1 receptors. In the clinical literature this dual mechanism produced markedly larger metabolic effects than single agonism, which is why it became the benchmark for "next generation" incretin research and remains one of the most requested research compounds in 2026.

## Triple agonists: retatrutide

Retatrutide adds glucagon-receptor activity to the GIP/GLP-1 combination. It is arguably the most closely watched molecule in the current pipeline: Phase 2 data reported body-weight reductions on the order of 24% at the highest dose, and Phase 3 programmes are ongoing. For researchers, the triple-agonist mechanism is a rich model system for studying how simultaneous receptor engagement changes downstream signalling.

## The amylin class: cagrilintide

Running alongside the incretins is the amylin analogue cagrilintide. The combination of cagrilintide with semaglutide ("CagriSema" in the literature) has pushed amylin-class compounds into the spotlight, and combination research with other metabolic peptides is a defining 2026 trend.

## What this means for sourcing

Because these molecules are structurally complex, batch-to-batch purity matters enormously for reproducible research. Mass-spectrometry confirmation of identity and HPLC purity figures are the two data points that separate a usable research lot from an unusable one. Every batch we list publishes both — see the COA vault.

These compounds are supplied for laboratory and research use only. Nothing here is medical advice or a recommendation for human use.`,
  },
  {
    slug: "bpc-157-tb-500-repair",
    title: "BPC-157 and TB-500 in Tissue-Repair Research",
    excerpt:
      "Two of the most discussed recovery peptides, the rationale behind combining them, and what the preclinical literature actually examines.",
    category: "Research",
    publishedOn: "2026-06-02",
    readingMinutes: 7,
    body: `BPC-157 and TB-500 (a fragment associated with thymosin beta-4) are the two compounds most often referenced in tissue-repair research, and they are frequently studied together. This article summarises why — as background for laboratory work only.

## BPC-157

BPC-157 ("body protection compound-157") is a synthetic peptide derived from a sequence identified in gastric juice. It remains the single most-discussed peptide in the recovery and repair literature in 2026. Preclinical studies have explored its effects on angiogenesis, tendon and ligament fibroblast behaviour, and gut-tissue models. It is valued in the lab partly for its stability in aqueous solution relative to many peptides.

## TB-500

TB-500 is studied as a synthetic version of an active region of thymosin beta-4, a protein involved in actin regulation and cell migration. Research models examine its role in cell motility and wound-related processes. Its mechanism is distinct from BPC-157, which is the basis for the combination interest.

## Why researchers combine them

Because the two compounds act through different proposed pathways — one more associated with angiogenesis and local repair signalling, the other with cell migration and actin dynamics — combination protocols are a common experimental design. This is the rationale behind the popular "GLOW"-style research blends that pair BPC-157 and TB-500, sometimes with a copper peptide such as GHK-Cu.

## Handling notes

- Both are lyophilised powders that require reconstitution with bacteriostatic water before use in solution-phase work.
- Store lyophilised vials cold and protect from light; reconstituted solution has a far shorter usable window.
- As always, verify identity and purity against the batch COA before designing any experiment.

These peptides are for laboratory and research use only. This is general research information, not medical advice or a protocol for human administration.`,
  },
  {
    slug: "ghk-cu-copper-peptide",
    title: "GHK-Cu: The Copper Peptide in Skin and Matrix Research",
    excerpt:
      "Why the GHK-Cu vial is blue, what the copper complex does at the molecular level, and where it sits in extracellular-matrix research.",
    category: "Research",
    publishedOn: "2026-05-28",
    readingMinutes: 6,
    body: `GHK-Cu is easy to spot on the bench: unlike the white lyophilised powders of most peptides, it carries a distinct blue tint. That colour is the chemistry talking.

## Why it is blue

GHK is a naturally occurring tripeptide (glycyl-L-histidyl-L-lysine). The "-Cu" denotes a copper(II) ion bound to the peptide. Copper(II) complexes absorb light in the red part of the spectrum, which is why coordinated-copper solutions and powders appear blue. The colour is therefore a rough visual cue that the copper is complexed — though it is never a substitute for analytical confirmation.

## What the literature studies

GHK-Cu is one of the most studied copper peptides. Research models examine its role in extracellular-matrix remodelling, fibroblast activity, and the expression of genes associated with skin and connective-tissue maintenance. It is a frequent reference compound in copper-peptide and anti-aging research, and in 2026 it remains a staple alongside metabolic and repair peptides.

## Practical lab notes

- The copper complex is sensitive to pH and to reducing agents; follow the conditions in the source protocol.
- Keep it away from strong chelators that could strip the copper.
- Store cold and protect from light; document the lot number against its COA.

## Where it fits

GHK-Cu often appears in combination research blends with tissue-repair peptides, where the copper-peptide and repair mechanisms are studied together. That combination interest is one reason it is consistently among the most requested research peptides.

Supplied for laboratory and research use only. This article is background information and not medical advice.`,
  },
  {
    slug: "reading-a-coa",
    title: "How to Read a Certificate of Analysis",
    excerpt:
      "Understand HPLC purity figures, mass-spec confirmation and what each section of a COA tells you.",
    category: "Quality",
    publishedOn: "2026-05-20",
    readingMinutes: 6,
    body: `A certificate of analysis (COA) is the single most important document attached to a research peptide. It is the difference between "we say it is pure" and "an independent instrument measured it." Here is how to read one.

## Identity: mass spectrometry

The first question a COA answers is "is this actually the molecule on the label?" Mass spectrometry measures the molecular weight of the compound and compares it to the theoretical mass of the target sequence. A match within the expected tolerance confirms identity. If the measured mass does not match, nothing else on the document matters.

## Purity: HPLC

High-performance liquid chromatography (HPLC) separates the sample into its components and reports the target peak as a percentage of the total. A figure such as 99.1% means that 99.1% of the detected material corresponds to the target peptide, with the remainder being related impurities or process residues. For most research applications, look for purity in the high-90s.

## Reading the chromatogram

- A single dominant, sharp peak is what you want to see.
- Several smaller peaks indicate related impurities; their size is reflected in the purity percentage.
- A noisy or poorly resolved baseline can make a purity figure unreliable — the trace itself matters, not just the headline number.

## Batch traceability

A trustworthy COA names a specific batch or lot number that matches the vial in your hand. That number is what lets you tie a physical product back to its test. If a vendor publishes one generic COA for "the product" rather than per batch, treat the figure with caution.

## Independence

Finally, note who ran the test. An in-house number is better than nothing, but an independent third-party laboratory removes the obvious conflict of interest. Every batch in our vault links to its report so the figures can be checked directly.

This article is general quality-assurance information. Products are for laboratory research use only.`,
  },
  {
    slug: "reconstitution-basics",
    title: "Reconstitution Basics for Research Peptides",
    excerpt:
      "A laboratory guide to solvents, ratios and sterile handling when preparing lyophilised peptides.",
    category: "Guides",
    publishedOn: "2026-05-04",
    readingMinutes: 8,
    body: `Most research peptides ship as a lyophilised (freeze-dried) powder. Before they can be used in solution-phase work they must be reconstituted. Done carelessly, reconstitution is where purity and activity are lost. This is a general laboratory guide, not a protocol for human use.

## Choosing a solvent

- Bacteriostatic water (water with a small amount of benzyl alcohol) is the common choice for multi-draw research vials because it limits microbial growth across repeated access.
- Sterile water is used when a single-use, preservative-free solution is required.
- Some sequences need a small amount of acetic acid or a different vehicle to dissolve fully — always defer to the compound's source documentation.

## Working out the ratio

Reconstitution is just dilution. Decide the concentration you want and divide the vial's mass by it to get the solvent volume. For example, a 10 mg vial brought up in 2 mL of solvent gives 5 mg/mL. Keeping a consistent concentration across a study makes downstream measurement far easier.

## Technique

- Wipe the vial stopper with an alcohol swab and let it dry.
- Draw the solvent and let it run slowly down the inside wall of the vial — do not jet it directly onto the powder.
- Do not shake. Swirl gently and give it time; most peptides dissolve within a few minutes.
- Inspect the solution: it should be clear and free of particulates.

## Storage after reconstitution

A reconstituted peptide has a much shorter usable life than the dry powder. Keep it refrigerated, protect it from light, minimise the number of times you pierce the stopper, and label it with the date and concentration. When in doubt, prepare smaller working volumes more often rather than one large stock.

## Common mistakes

- Shaking the vial and denaturing the peptide.
- Guessing the concentration instead of recording it.
- Reusing a vial long past its reconstituted window.

For laboratory and research use only. This guide is general technique information and not medical advice.`,
  },
  {
    slug: "choosing-a-supplier",
    title: "Choosing a Research Peptide Supplier",
    excerpt:
      "What independent testing, batch traceability and cold-chain handling should look like.",
    category: "Quality",
    publishedOn: "2026-04-22",
    readingMinutes: 5,
    body: `The 2026 market has matured, and the gap between high-quality research peptide suppliers and lower-tier sellers has widened. A few checks separate the two.

## Per-batch, independent testing

The single best signal is a per-batch certificate of analysis from an independent laboratory, published openly rather than sent on request. It should show mass-spec identity and an HPLC purity figure, and the batch number should match the vial you receive.

## Traceability

Every vial should carry a lot number that you can tie back to a specific COA. Traceability is what makes a result reproducible: if you cannot link the physical product to its test, you cannot stand behind your data.

## Handling and shipping

Peptides are temperature- and light-sensitive. Look for suppliers who handle stock with cold-chain awareness and ship with tracking. Discreet, well-padded packaging protects both the product and your privacy.

## Transparency over marketing

Be wary of vendors who lean on urgency tactics, invented scarcity or purity claims with no document behind them. A serious supplier lets the data do the talking — public COAs, clear batch records and honest stock status.

## Payment and logistics

Finally, consider the practical side: clear pricing, sensible shipping options, and a payment method that works for your region. None of this matters, though, without the testing and traceability above.

This article is general guidance for evaluating suppliers. All products referenced are for laboratory research use only.`,
  },
];

export const AVERAGE_PURITY =
  Math.round(
    (coas.reduce((sum, c) => sum + c.purity, 0) / coas.length) * 10,
  ) / 10;
