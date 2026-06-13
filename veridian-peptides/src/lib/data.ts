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
  { slug: "reading-a-coa", title: "How to Read a Certificate of Analysis", excerpt: "Understand HPLC purity figures, mass-spec confirmation and what each section of a COA tells you.", category: "Quality", publishedOn: "2026-05-20", readingMinutes: 6 },
  { slug: "reconstitution-basics", title: "Reconstitution Basics for Research Peptides", excerpt: "A laboratory guide to solvents, ratios and sterile handling when preparing lyophilised peptides.", category: "Guides", publishedOn: "2026-05-04", readingMinutes: 8 },
  { slug: "choosing-a-supplier", title: "Choosing a Research Peptide Supplier", excerpt: "What independent testing, batch traceability and cold-chain handling should look like.", category: "Quality", publishedOn: "2026-04-22", readingMinutes: 5 },
];

export const AVERAGE_PURITY =
  Math.round(
    (coas.reduce((sum, c) => sum + c.purity, 0) / coas.length) * 10,
  ) / 10;
