import type { Bundle, BlogPost, Category, Coa, Product, StockStatus } from "./types";

// Seed dataset — original placeholder content. Compound names are generic
// research-chemical identifiers (not brand-owned). Descriptions are written
// from scratch. Replace with a real database/CMS in a later milestone.

export const categories: Category[] = [
  {
    slug: "metabolic",
    name: "Metabolic Research",
    description: "Incretin and metabolic-pathway compounds — GLP-1, GIP, glucagon and amylin agonists for metabolic studies.",
  },
  {
    slug: "recovery",
    name: "Recovery & Repair Research",
    description: "Peptides studied in regeneration, tissue-repair and wound-healing models.",
  },
  {
    slug: "cellular",
    name: "Cellular & Longevity Research",
    description: "Mitochondrial, copper and longevity peptides for cellular-ageing research.",
  },
  {
    slug: "neuro",
    name: "Neuro & Cognitive Research",
    description: "Nootropic and neuroprotective peptides used in cognitive and behavioural studies.",
  },
  {
    slug: "growth",
    name: "Growth-Factor Research",
    description: "Growth-hormone secretagogues and growth-factor compounds for endocrine research.",
  },
  {
    slug: "lab-supplies",
    name: "Lab Supplies",
    description: "Bacteriostatic water, sterile water and reconstitution consumables for the lab bench.",
  },
];

// ---------------------------------------------------------------------------
// Curated catalogue. Each entry is a product "group" that expands into one
// purchasable Product per size variant. Prices are EUR cents, benchmarked to
// Western research-peptide retail. Compounds are supplied for laboratory
// research use only.
// ---------------------------------------------------------------------------

type SizeRow = [size: string, priceCents: number, compareAtCents: number | null, stock?: StockStatus];

interface GroupDef {
  base: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  purity: number;
  featured?: boolean;
  coaBatch?: string;
  testedOn?: string;
  specs?: { label: string; value: string }[];
  sizes: SizeRow[];
}

const PEPTIDE_SPECS = [
  { label: "Molecular form", value: "Lyophilised powder" },
  { label: "Storage", value: "-20 °C, desiccated" },
  { label: "Reconstitution", value: "Bacteriostatic water" },
];

const catalog: GroupDef[] = [
  // ---- Metabolic ----
  {
    base: "tirzepatide",
    name: "Tirzepatide",
    category: "metabolic",
    tagline: "Dual GIP/GLP-1 receptor agonist",
    description:
      "Dual-incretin (GIP and GLP-1) research peptide and the benchmark molecule for next-generation metabolic studies. Lyophilised; for laboratory research use only.",
    purity: 99.2,
    featured: true,
    coaBatch: "VP-TIRZ-2601",
    testedOn: "2026-05-18",
    sizes: [
      ["5mg", 8000, 9900],
      ["10mg", 13000, 15900],
      ["15mg", 17500, 21000],
      ["20mg", 21000, 25000],
      ["30mg", 28000, 33000],
      ["40mg", 34000, 40000],
      ["60mg", 45000, 53000],
    ],
  },
  {
    base: "retatrutide",
    name: "Retatrutide",
    category: "metabolic",
    tagline: "Triple GIP/GLP-1/glucagon agonist",
    description:
      "Triple-receptor agonist and the most closely watched molecule in the current metabolic pipeline. Lyophilised; for laboratory research use only.",
    purity: 99.0,
    featured: true,
    coaBatch: "VP-RETA-2602",
    testedOn: "2026-05-20",
    sizes: [
      ["5mg", 9000, 11000],
      ["10mg", 14000, 17000],
      ["15mg", 18500, 22000],
      ["20mg", 22000, 26000],
      ["30mg", 29000, 34000],
    ],
  },
  {
    base: "semaglutide",
    name: "Semaglutide",
    category: "metabolic",
    tagline: "GLP-1 receptor agonist (reference compound)",
    description:
      "The established single-receptor GLP-1 agonist, widely used as a comparator in metabolic research. Lyophilised; for laboratory research use only.",
    purity: 99.3,
    coaBatch: "VP-SEMA-2603",
    testedOn: "2026-05-10",
    sizes: [
      ["5mg", 7000, 8800],
      ["10mg", 11000, 13500],
    ],
  },
  {
    base: "cagrilintide",
    name: "Cagrilintide",
    category: "metabolic",
    tagline: "Long-acting amylin analogue",
    description:
      "Amylin-class research peptide, central to combination metabolic research. Lyophilised; for laboratory research use only.",
    purity: 98.8,
    coaBatch: "VP-CAGR-2604",
    testedOn: "2026-05-12",
    sizes: [
      ["5mg", 9500, 11500],
      ["10mg", 15000, 18000],
    ],
  },
  {
    base: "survodutide",
    name: "Survodutide",
    category: "metabolic",
    tagline: "Dual GLP-1/glucagon receptor agonist",
    description:
      "Dual GLP-1 and glucagon receptor agonist, prominent in 2026 metabolic and MASH (metabolic dysfunction-associated steatohepatitis) research models. Lyophilised; for laboratory research use only.",
    purity: 99.0,
    coaBatch: "VP-SURV-2618",
    testedOn: "2026-05-22",
    sizes: [
      ["5mg", 9500, 11500],
      ["10mg", 15000, 18500],
      ["15mg", 20000, 24000],
    ],
  },
  {
    base: "mazdutide",
    name: "Mazdutide",
    category: "metabolic",
    tagline: "Dual GLP-1/glucagon receptor agonist",
    description:
      "GLP-1 and glucagon receptor co-agonist studied alongside the incretin class in metabolic and energy-expenditure research models. Lyophilised; for laboratory research use only.",
    purity: 98.9,
    coaBatch: "VP-MAZD-2619",
    testedOn: "2026-05-22",
    sizes: [
      ["5mg", 9000, 11000],
      ["10mg", 14500, 17500],
    ],
  },
  {
    base: "aod-9604",
    name: "AOD-9604",
    category: "metabolic",
    tagline: "hGH(176-191) fragment, lipid-metabolism research",
    description:
      "Modified C-terminal fragment of human growth hormone (residues 176-191) studied in lipolysis and lipid-metabolism research models without the growth-promoting activity of the full hormone. Lyophilised; for laboratory research use only.",
    purity: 98.7,
    coaBatch: "VP-AOD-2620",
    testedOn: "2026-05-16",
    sizes: [
      ["5mg", 4000, 5000],
      ["10mg", 6500, 8000],
    ],
  },
  {
    base: "5-amino-1mq",
    name: "5-Amino-1MQ",
    category: "metabolic",
    tagline: "Small-molecule NNMT inhibitor",
    description:
      "Small-molecule inhibitor of nicotinamide N-methyltransferase (NNMT) studied in adipocyte-metabolism and NAD+ salvage research models. Supplied as powder for laboratory research use only.",
    purity: 98.5,
    coaBatch: "VP-5A1MQ-2621",
    testedOn: "2026-05-14",
    sizes: [["50mg", 5500, 6800]],
  },
  {
    base: "tesofensine",
    name: "Tesofensine",
    category: "metabolic",
    tagline: "Triple monoamine-reuptake inhibitor",
    description:
      "Small-molecule serotonin-, noradrenaline- and dopamine-reuptake inhibitor studied in CNS appetite-regulation and energy-balance research models. Supplied as powder for laboratory research use only.",
    purity: 98.6,
    coaBatch: "VP-TESO-2622",
    testedOn: "2026-05-14",
    sizes: [
      ["5mg", 6000, 7400],
      ["10mg", 9500, 11500],
    ],
  },
  {
    base: "adipotide",
    name: "Adipotide (FTPP)",
    category: "metabolic",
    tagline: "Pro-apoptotic adipose-vasculature peptide",
    description:
      "Pro-apoptotic peptidomimetic (FTPP) studied for its targeting of adipose-tissue vasculature in metabolic research models. Lyophilised; for laboratory research use only.",
    purity: 98.4,
    coaBatch: "VP-ADPT-2627",
    testedOn: "2026-05-08",
    sizes: [["10mg", 9000, 11000]],
  },

  // ---- Tissue & Recovery ----
  {
    base: "bpc-157",
    name: "BPC-157",
    category: "recovery",
    tagline: "Body-protection compound, repair research",
    description:
      "The most-discussed peptide in tissue-repair research, studied in angiogenesis and connective-tissue models. Lyophilised; for laboratory research use only.",
    purity: 99.5,
    featured: true,
    coaBatch: "VP-BPC-2605",
    testedOn: "2026-04-28",
    sizes: [
      ["5mg", 4500, 5500],
      ["10mg", 7000, 8500],
    ],
  },
  {
    base: "tb-500",
    name: "TB-500",
    category: "recovery",
    tagline: "Thymosin β4 fragment, cell-migration research",
    description:
      "Synthetic active fragment associated with thymosin beta-4, studied in cell-migration and wound-model research. Lyophilised; for laboratory research use only.",
    purity: 99.1,
    coaBatch: "VP-TB5-2606",
    testedOn: "2026-04-28",
    sizes: [
      ["5mg", 5500, 6800],
      ["10mg", 9000, 11000],
    ],
  },
  {
    base: "glow-blend",
    name: "GLOW Blend (BPC-157 / TB-500 / GHK-Cu)",
    category: "recovery",
    tagline: "Combination tissue-repair research blend",
    description:
      "A combination research blend pairing BPC-157 and TB-500 with the copper peptide GHK-Cu for repair-model studies. Lyophilised; for laboratory research use only.",
    purity: 98.6,
    featured: true,
    coaBatch: "VP-GLOW-2607",
    testedOn: "2026-04-15",
    sizes: [["70mg", 14000, 17000]],
  },
  {
    base: "klow-blend",
    name: "KLOW Blend (BPC-157 / TB-500 / GHK-Cu / KPV)",
    category: "recovery",
    tagline: "Four-component repair research blend",
    description:
      "An extended combination blend adding KPV to the GLOW formulation for tissue-repair and inflammation research models. Lyophilised; for laboratory research use only.",
    purity: 98.4,
    coaBatch: "VP-KLOW-2608",
    testedOn: "2026-04-15",
    sizes: [["80mg", 15000, 18000]],
  },

  // ---- Cellular & Longevity ----
  {
    base: "ghk-cu",
    name: "GHK-Cu (Copper Peptide)",
    category: "cellular",
    tagline: "Copper tripeptide, matrix & skin research",
    description:
      "The most-studied copper peptide, a glycyl-histidyl-lysine tripeptide complexed with copper(II) — hence its blue colour. Studied in extracellular-matrix research. For laboratory research use only.",
    purity: 99.3,
    featured: true,
    coaBatch: "VP-GHK-2609",
    testedOn: "2026-03-30",
    specs: [
      { label: "Molecular form", value: "Lyophilised powder (copper(II) complex)" },
      { label: "Appearance", value: "Blue (coordinated copper)" },
      { label: "Storage", value: "-20 °C, protect from light" },
      { label: "Reconstitution", value: "Bacteriostatic water" },
    ],
    sizes: [
      ["50mg", 7000, 8500],
      ["100mg", 12000, 14500],
    ],
  },
  {
    base: "mots-c",
    name: "MOTS-c",
    category: "cellular",
    tagline: "Mitochondrial-derived peptide",
    description:
      "Mitochondrial-derived research peptide studied in metabolic and cellular-energy models. Lyophilised; for laboratory research use only.",
    purity: 99.0,
    coaBatch: "VP-MOTS-2610",
    testedOn: "2026-03-22",
    sizes: [
      ["10mg", 6000, 7500],
      ["40mg", 19000, 23000],
    ],
  },
  {
    base: "nad-plus",
    name: "NAD+",
    category: "cellular",
    tagline: "Cellular-energy & longevity research",
    description:
      "Nicotinamide adenine dinucleotide for cellular-energy and longevity research models. Lyophilised; for laboratory research use only.",
    purity: 98.9,
    coaBatch: "VP-NAD-2611",
    testedOn: "2026-03-18",
    sizes: [
      ["100mg", 5500, 6800],
      ["500mg", 11000, 13500],
    ],
  },
  {
    base: "epithalon",
    name: "Epithalon",
    category: "cellular",
    tagline: "Telomerase & longevity research peptide",
    description:
      "Tetrapeptide studied in telomere and longevity research models. Lyophilised; for laboratory research use only.",
    purity: 99.1,
    coaBatch: "VP-EPI-2612",
    testedOn: "2026-03-10",
    sizes: [
      ["10mg", 5000, 6200],
      ["50mg", 12000, 14500],
    ],
  },
  {
    base: "slu-pp-332",
    name: "SLU-PP-332",
    category: "cellular",
    tagline: "ERRα agonist, exercise-mimetic research",
    description:
      "Small-molecule estrogen-related-receptor-alpha (ERRα) agonist studied as an exercise mimetic in mitochondrial-biogenesis and oxidative-metabolism research models. Supplied as powder for laboratory research use only.",
    purity: 98.5,
    coaBatch: "VP-SLU-2623",
    testedOn: "2026-05-06",
    sizes: [
      ["10mg", 8500, 10500],
      ["25mg", 17000, 20000],
    ],
  },
  {
    base: "ss-31",
    name: "SS-31 (Elamipretide)",
    category: "cellular",
    tagline: "Mitochondria-targeted cardiolipin peptide",
    description:
      "Mitochondria-targeted tetrapeptide (Elamipretide) that associates with cardiolipin on the inner mitochondrial membrane, studied in bioenergetics and oxidative-stress research models. Lyophilised; for laboratory research use only.",
    purity: 99.0,
    coaBatch: "VP-SS31-2624",
    testedOn: "2026-05-06",
    sizes: [
      ["10mg", 7500, 9200],
      ["50mg", 18000, 22000],
    ],
  },

  // ---- Growth Factors ----
  {
    base: "cjc-ipamorelin",
    name: "CJC-1295 + Ipamorelin",
    category: "growth",
    tagline: "GH-secretagogue research blend",
    description:
      "A popular research blend of CJC-1295 (no DAC) and Ipamorelin, studied together in growth-hormone-axis models. Lyophilised; for laboratory research use only.",
    purity: 99.2,
    featured: true,
    coaBatch: "VP-CJC-2613",
    testedOn: "2026-02-26",
    sizes: [["10mg", 6000, 7500]],
  },
  {
    base: "tesamorelin",
    name: "Tesamorelin",
    category: "growth",
    tagline: "GHRH analogue research peptide",
    description:
      "Growth-hormone-releasing-hormone analogue studied in metabolic and growth-axis research. Lyophilised; for laboratory research use only.",
    purity: 99.0,
    coaBatch: "VP-TESA-2614",
    testedOn: "2026-02-20",
    sizes: [
      ["5mg", 6000, 7400],
      ["10mg", 9500, 11500],
      ["20mg", 16000, 19000],
    ],
  },
  {
    base: "sermorelin",
    name: "Sermorelin",
    category: "growth",
    tagline: "GHRH(1-29) analogue research peptide",
    description:
      "Truncated growth-hormone-releasing-hormone analogue (GHRH 1-29) studied in growth-hormone-axis and pulsatile-secretion research models. Lyophilised; for laboratory research use only.",
    purity: 98.9,
    coaBatch: "VP-SERM-2625",
    testedOn: "2026-02-26",
    sizes: [
      ["5mg", 4500, 5500],
      ["10mg", 7000, 8500],
    ],
  },
  {
    base: "ipamorelin",
    name: "Ipamorelin",
    category: "growth",
    tagline: "Selective GH-secretagogue research peptide",
    description:
      "Selective ghrelin-receptor agonist and growth-hormone secretagogue studied on its own for its targeted GH-release profile in growth-axis research models. Lyophilised; for laboratory research use only.",
    purity: 99.1,
    coaBatch: "VP-IPAM-2626",
    testedOn: "2026-02-26",
    sizes: [
      ["5mg", 4000, 5000],
      ["10mg", 6500, 8000],
    ],
  },

  // ---- Neuro & Cognitive ----
  {
    base: "selank",
    name: "Selank",
    category: "neuro",
    tagline: "Anxiolytic nootropic research peptide",
    description:
      "Synthetic analogue of tuftsin, studied in anxiolytic and cognitive research models. Lyophilised; for laboratory research use only.",
    purity: 98.8,
    featured: true,
    coaBatch: "VP-SLK-2615",
    testedOn: "2026-02-12",
    sizes: [
      ["5mg", 4000, 5000],
      ["10mg", 6500, 8000],
    ],
  },
  {
    base: "semax",
    name: "Semax",
    category: "neuro",
    tagline: "Nootropic & neuroprotective research peptide",
    description:
      "ACTH(4-10) analogue studied in nootropic, neuroprotective and BDNF-related research models. Lyophilised; for laboratory research use only.",
    purity: 98.9,
    coaBatch: "VP-SMX-2616",
    testedOn: "2026-02-12",
    sizes: [
      ["5mg", 4500, 5500],
      ["10mg", 7000, 8600],
    ],
  },
  {
    base: "dsip",
    name: "DSIP",
    category: "neuro",
    tagline: "Delta sleep-inducing peptide",
    description:
      "Delta sleep-inducing peptide, studied in sleep-architecture and neuro-endocrine research models. Lyophilised; for laboratory research use only.",
    purity: 99.0,
    coaBatch: "VP-DSIP-2617",
    testedOn: "2026-02-05",
    sizes: [
      ["5mg", 4000, 5000],
      ["10mg", 6000, 7400],
    ],
  },

  // ---- Lab Supplies ----
  {
    base: "bacteriostatic-water",
    name: "Bacteriostatic Water",
    category: "lab-supplies",
    tagline: "0.9% benzyl alcohol — multi-draw reconstitution",
    description:
      "Bacteriostatic water for reconstituting lyophilised research peptides across repeated draws. For laboratory use.",
    purity: 100,
    specs: [{ label: "Volume", value: "30 ml" }, { label: "Preservative", value: "0.9% benzyl alcohol" }],
    sizes: [["30ml", 1200, null]],
  },
  {
    base: "sterile-water",
    name: "Sterile Water",
    category: "lab-supplies",
    tagline: "Preservative-free reconstitution water",
    description:
      "Preservative-free sterile water for single-use reconstitution. For laboratory use.",
    purity: 100,
    specs: [{ label: "Volume", value: "30 ml" }, { label: "Preservative", value: "None" }],
    sizes: [["30ml", 1000, null]],
  },
];

function variantSlug(base: string, size: string): string {
  return `${base}-${size.toLowerCase().replace(/\s+/g, "")}`;
}

export const products: Product[] = catalog.flatMap((g) =>
  g.sizes.map(([size, priceCents, compareAtCents, stock], i) => ({
    slug: variantSlug(g.base, size),
    name: g.name,
    tagline: g.tagline,
    description: g.description,
    categorySlug: g.category,
    priceCents,
    compareAtCents: compareAtCents ?? undefined,
    size,
    purity: g.purity,
    stock: stock ?? "in_stock",
    coaBatches: g.coaBatch ? [g.coaBatch] : [],
    featured: g.featured && i === 0 ? true : undefined,
    specs: g.specs ?? PEPTIDE_SPECS,
  })),
);

// Curated research stacks. Each groups real catalogue variant slugs around one
// research theme; `savingsPercent` is the honest discount versus buying the
// listed variants individually (the stacks page derives every figure from it).
// The page reads the theme heading from the first compound's category, so the
// order here is for readability only. All compounds are for laboratory use.
export const bundles: Bundle[] = [
  // ---- Metabolic ----
  {
    slug: "metabolic-starter",
    name: "Metabolic Research Starter",
    description:
      "A single dual-incretin compound plus bacteriostatic water — the minimum to begin a GIP/GLP-1 metabolic study without sourcing reconstitution supplies separately.",
    productSlugs: ["tirzepatide-5mg", "bacteriostatic-water-30ml"],
    savingsPercent: 12,
  },
  {
    slug: "dual-incretin-amylin",
    name: "Incretin + Amylin Research Stack",
    description:
      "Pairs the dual GIP/GLP-1 agonist tirzepatide with the long-acting amylin analogue cagrilintide — the incretin-plus-amylin combination that defines current metabolic research — with reconstitution water included.",
    productSlugs: ["tirzepatide-10mg", "cagrilintide-5mg", "bacteriostatic-water-30ml"],
    savingsPercent: 13,
  },
  {
    slug: "triple-agonist-comparator",
    name: "Triple-Agonist Comparator Research Stack",
    description:
      "The triple GIP/GLP-1/glucagon agonist retatrutide alongside semaglutide as a single-receptor GLP-1 reference, for comparator study designs across mechanisms. Includes bacteriostatic water.",
    productSlugs: ["retatrutide-10mg", "semaglutide-5mg", "bacteriostatic-water-30ml"],
    savingsPercent: 10,
  },

  // ---- Recovery & Repair ----
  {
    slug: "recovery-stack",
    name: "Recovery Research Stack",
    description:
      "BPC-157 and TB-500 paired for tissue-repair model studies — two compounds proposed to act through distinct angiogenesis and cell-migration pathways.",
    productSlugs: ["bpc-157-5mg", "tb-500-5mg"],
    savingsPercent: 10,
  },
  {
    slug: "tissue-repair-trio",
    name: "Tissue-Repair Research Trio",
    description:
      "The classic GLOW-style repair combination as discrete vials: BPC-157, TB-500 and the copper tripeptide GHK-Cu, so each component can be dosed and assayed independently in repair-model work.",
    productSlugs: ["bpc-157-10mg", "tb-500-10mg", "ghk-cu-50mg"],
    savingsPercent: 14,
  },
  {
    slug: "wound-matrix",
    name: "Wound & Matrix Research Stack",
    description:
      "TB-500 for cell-migration models with GHK-Cu for extracellular-matrix and connective-tissue studies, plus bacteriostatic water for reconstitution.",
    productSlugs: ["tb-500-5mg", "ghk-cu-50mg", "bacteriostatic-water-30ml"],
    savingsPercent: 9,
  },

  // ---- Cellular & Longevity ----
  {
    slug: "cellular-longevity",
    name: "Cellular Longevity Research Stack",
    description:
      "Three pillars of longevity research in one set: NAD+ for cellular energy metabolism, the telomere-associated tetrapeptide epithalon, and the mitochondrial-derived peptide MOTS-c.",
    productSlugs: ["nad-plus-100mg", "epithalon-10mg", "mots-c-10mg"],
    savingsPercent: 13,
  },
  {
    slug: "mitochondrial-energy",
    name: "Mitochondrial Energy Research Stack",
    description:
      "MOTS-c and NAD+ together for cellular-energy and mitochondrial-function models, with bacteriostatic water included for reconstitution.",
    productSlugs: ["mots-c-10mg", "nad-plus-100mg", "bacteriostatic-water-30ml"],
    savingsPercent: 9,
  },

  // ---- Neuro & Cognitive ----
  {
    slug: "neuro-nootropic",
    name: "Neuro Nootropic Research Stack",
    description:
      "The two most-referenced nootropic peptides — the ACTH(4-10) analogue Semax and the tuftsin analogue Selank — for cognitive and anxiolytic behavioural research models.",
    productSlugs: ["semax-10mg", "selank-10mg"],
    savingsPercent: 11,
  },
  {
    slug: "sleep-neuro",
    name: "Sleep & Neuro Research Stack",
    description:
      "Delta sleep-inducing peptide (DSIP) with Selank for sleep-architecture and neuro-endocrine study designs, plus bacteriostatic water for reconstitution.",
    productSlugs: ["dsip-5mg", "selank-5mg", "bacteriostatic-water-30ml"],
    savingsPercent: 10,
  },

  // ---- Growth-Factor / GH-Axis ----
  {
    slug: "gh-axis-secretagogue",
    name: "GH-Axis Secretagogue Research Stack",
    description:
      "Combines the CJC-1295 + Ipamorelin secretagogue blend with the GHRH analogue tesamorelin to study complementary points on the growth-hormone axis, with reconstitution water included.",
    productSlugs: ["cjc-ipamorelin-10mg", "tesamorelin-5mg", "bacteriostatic-water-30ml"],
    savingsPercent: 12,
  },
  {
    slug: "gh-recovery",
    name: "GH & Recovery Research Stack",
    description:
      "The CJC-1295 + Ipamorelin growth-hormone-secretagogue blend paired with BPC-157, for study designs that examine GH-axis signalling alongside tissue-repair models.",
    productSlugs: ["cjc-ipamorelin-10mg", "bpc-157-5mg"],
    savingsPercent: 10,
  },
];

export const coas: Coa[] = catalog
  .filter((g) => g.coaBatch)
  .map((g) => ({
    batch: g.coaBatch!,
    productSlug: variantSlug(g.base, g.sizes[0][0]),
    productName: g.name,
    testedOn: g.testedOn ?? "2026-05-01",
    purity: g.purity,
    lab: "Independent HPLC Lab",
    verifyUrl: `https://verify.example-lab.test/${g.coaBatch}`,
  }));

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
