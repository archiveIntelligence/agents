import type {
  Review,
  Bundle,
  BlogPost,
  Category,
  Coa,
  MonographSection,
  Product,
  ProductHighlight,
  StockStatus,
} from "./types";

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

/** Author-friendly partial of a package-insert monograph. The full
 *  `MonographSection[]` is composed by {@link buildMonograph}; Handling,
 *  Storage, Specifications and the Safety statement get sensible defaults. */
interface MonographInput {
  identity?: string;
  /** "Mechanism / pathway" section. */
  mechanism?: string;
  /** "Research context" section. */
  context?: string;
  /** "Handling & reconstitution" — defaults to the standard lyophilised flow. */
  handling?: string;
  /** "Storage & stability" — defaults to the standard -20 °C guidance. */
  storage?: string;
  /** "Specifications" override — defaults to a table built from specs/purity. */
  specifications?: string;
  /** "Safety / research-use statement" override — defaults to the standard text. */
  safety?: string;
}

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
  /** Punchy buzzword bullets for skimmers (3–5). */
  highlights?: ProductHighlight[];
  /** Long package-insert body, revealed in an accordion on the PDP. */
  monograph?: MonographInput;
  sizes: SizeRow[];
}

const PEPTIDE_SPECS = [
  { label: "Molecular form", value: "Lyophilised powder" },
  { label: "Storage", value: "-20 °C, desiccated" },
  { label: "Reconstitution", value: "Bacteriostatic water" },
];

// Standard package-insert boilerplate so each monograph only has to author the
// compound-specific sections (Identity / Mechanism / Research context).
const DEFAULT_HANDLING =
  "Centrifuge the sealed vial briefly so the lyophilised cake settles before the stopper is pierced. Reconstitute with bacteriostatic water for multi-draw work or sterile water for single use, directing the solvent slowly down the inner vial wall rather than onto the powder. Do not shake — swirl gently and allow a few minutes to yield a clear, particulate-free solution. Prepare working concentrations gravimetrically and record the lot, solvent and concentration for traceability.";

const DEFAULT_STORAGE =
  "Sealed lyophilised vials are stable for extended periods stored at -20 °C, desiccated and protected from light. Once reconstituted, refrigerate at 2–8 °C, minimise freeze–thaw cycles and stopper punctures, and consume within a short working window. Always confirm identity (mass spectrometry) and purity (HPLC) against the batch certificate of analysis before designing an experiment.";

const RESEARCH_USE_SAFETY =
  "Supplied strictly for laboratory and in-vitro research use only. This material is not a drug, food, cosmetic or dietary supplement and is not for human or veterinary use, ingestion or administration. No human dosing guidance is provided or implied. Handle under good laboratory practice with appropriate PPE, and keep out of reach of children and untrained personnel.";

function buildMonograph(g: GroupDef): MonographSection[] | undefined {
  const m = g.monograph;
  if (!m) return undefined;
  const specs = g.specs ?? PEPTIDE_SPECS;
  const specLines = [
    `- Catalogue identity: ${g.name}`,
    `- Nominal HPLC purity: ≥${g.purity}%`,
    ...specs.map((s) => `- ${s.label}: ${s.value}`),
    ...(g.coaBatch ? [`- Reference batch: ${g.coaBatch}`] : []),
  ].join("\n");

  const sections: MonographSection[] = [
    { heading: "Identity", body: m.identity ?? `${g.name} — ${g.tagline}. ${g.description}` },
  ];
  if (m.mechanism) sections.push({ heading: "Mechanism / pathway", body: m.mechanism });
  if (m.context) sections.push({ heading: "Research context", body: m.context });
  sections.push({ heading: "Handling & reconstitution", body: m.handling ?? DEFAULT_HANDLING });
  sections.push({ heading: "Storage & stability", body: m.storage ?? DEFAULT_STORAGE });
  sections.push({ heading: "Specifications", body: m.specifications ?? specLines });
  sections.push({
    heading: "Safety / research-use statement",
    body: m.safety ?? RESEARCH_USE_SAFETY,
  });
  return sections;
}

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
    highlights: [
      { icon: "receptor", label: "Dual GIP + GLP-1 agonist" },
      { icon: "molecule", label: "39-aa engineered peptide" },
      { icon: "purity", label: "HPLC ≥99.2%" },
      { icon: "vial", label: "Lyophilised powder" },
      { icon: "snowflake", label: "Store -20 °C, desiccated" },
    ],
    monograph: {
      identity:
        "Tirzepatide is a synthetic 39-amino-acid linear peptide carrying a C20 fatty-diacid moiety that promotes albumin binding and a long circulating half-life. It is engineered as a single chain that engages two distinct incretin receptors.",
      mechanism:
        "Balanced dual agonist of the glucose-dependent insulinotropic polypeptide (GIP) and glucagon-like peptide-1 (GLP-1) receptors. In research models, co-agonism of these G-protein-coupled receptors is studied for combined effects on insulin secretion, glucagon dynamics, gastric emptying and central appetite-signalling pathways that single GLP-1 agonism does not fully reproduce.",
      context:
        "Tirzepatide is the benchmark dual-incretin molecule and the comparator against which next-generation multi-agonists are evaluated. It remains one of the most-requested compounds for metabolic, receptor-pharmacology and signalling studies in 2026.",
    },
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
    highlights: [
      { icon: "receptor", label: "Triple GIP/GLP-1/glucagon agonist" },
      { icon: "pathway", label: "Adds glucagon-receptor arm" },
      { icon: "purity", label: "HPLC ≥99.0%" },
      { icon: "vial", label: "Lyophilised powder" },
      { icon: "snowflake", label: "Store -20 °C, desiccated" },
    ],
    monograph: {
      identity:
        "Retatrutide (research designation LY3437943) is a synthetic single-chain peptide agonist built on the incretin scaffold and extended to engage a third receptor target.",
      mechanism:
        "Triple agonist at the GIP, GLP-1 and glucagon receptors. The added glucagon-receptor activity is studied for its contribution to energy expenditure and hepatic lipid handling, on top of the insulinotropic and appetite-pathway effects associated with GIP/GLP-1 co-agonism.",
      context:
        "Retatrutide is the most closely watched molecule in the current metabolic pipeline; published Phase 2 trial reports described large body-weight reductions at the highest doses, making it a focal model system for studying simultaneous tri-receptor engagement. Cited here as reported trial findings only, not a claim of effect.",
    },
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
    highlights: [
      { icon: "receptor", label: "GLP-1 receptor agonist" },
      { icon: "molecule", label: "Reference incretin comparator" },
      { icon: "purity", label: "HPLC ≥99.3%" },
      { icon: "vial", label: "Lyophilised powder" },
      { icon: "snowflake", label: "Store -20 °C, desiccated" },
    ],
    monograph: {
      identity:
        "Semaglutide is a synthetic GLP-1 analogue structurally modified — including a C18 fatty-diacid chain — to resist DPP-4 degradation and extend its circulating half-life.",
      mechanism:
        "Selective agonist of the GLP-1 receptor. In research models it is studied for glucose-dependent insulin secretion, slowed gastric emptying and engagement of central appetite circuits through a single receptor pathway.",
      context:
        "As the established single-receptor incretin, semaglutide is the standard comparator in studies characterising newer dual and triple agonists, anchoring structure–activity and pharmacokinetic comparisons across the metabolic category.",
    },
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
    highlights: [
      { icon: "receptor", label: "Long-acting amylin analogue" },
      { icon: "pathway", label: "Amylin / calcitonin receptors" },
      { icon: "purity", label: "HPLC ≥98.8%" },
      { icon: "vial", label: "Lyophilised powder" },
      { icon: "snowflake", label: "Store -20 °C, desiccated" },
    ],
    monograph: {
      identity:
        "Cagrilintide is a synthetic, lipidated long-acting analogue of the pancreatic hormone amylin, designed for extended receptor residence.",
      mechanism:
        "Agonist at amylin and calcitonin receptor complexes. Research models examine amylin-pathway contributions to satiety signalling and gastric emptying, distinct from and complementary to incretin-receptor agonism.",
      context:
        "Amylin analogues moved into the spotlight through combination research pairing cagrilintide with a GLP-1 agonist (described in the literature as \"CagriSema\"). It is a defining compound in the 2026 combination-metabolic research conversation.",
    },
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
    highlights: [
      { icon: "receptor", label: "Dual GLP-1/glucagon agonist" },
      { icon: "pathway", label: "MASH research model" },
      { icon: "purity", label: "HPLC ≥99.0%" },
      { icon: "vial", label: "Lyophilised powder" },
      { icon: "snowflake", label: "Store -20 °C, desiccated" },
    ],
    monograph: {
      identity:
        "Survodutide (research designation BI 456906) is a synthetic dual receptor agonist peptide engineered for extended half-life.",
      mechanism:
        "Co-agonist at the GLP-1 and glucagon (GCGR) receptors. Research models study the glucagon arm for energy expenditure and hepatic lipid handling, combined with the insulinotropic and appetite effects of GLP-1 agonism.",
      context:
        "A prominent dual GLP-1/glucagon molecule in 2026, studied notably in metabolic-dysfunction-associated steatohepatitis (MASH) liver-research models alongside the incretin class.",
    },
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
    highlights: [
      { icon: "receptor", label: "Dual GLP-1/glucagon agonist" },
      { icon: "pathway", label: "Energy-expenditure research" },
      { icon: "purity", label: "HPLC ≥98.9%" },
      { icon: "vial", label: "Lyophilised powder" },
      { icon: "snowflake", label: "Store -20 °C, desiccated" },
    ],
    monograph: {
      identity:
        "Mazdutide (research designation IBI362 / LY3305677) is a synthetic GLP-1/glucagon co-agonist based on the oxyntomodulin scaffold.",
      mechanism:
        "Agonist at the GLP-1 and glucagon receptors. The oxyntomodulin-derived design is studied for combined appetite-pathway and energy-expenditure effects in metabolic research models.",
      context:
        "Studied alongside the incretin class as part of the 2026 wave of GLP-1/glucagon co-agonists in metabolic and energy-balance research.",
    },
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
    highlights: [
      { icon: "pathway", label: "hGH(176-191) fragment" },
      { icon: "molecule", label: "Lipid-metabolism research" },
      { icon: "purity", label: "HPLC ≥98.7%" },
      { icon: "vial", label: "Lyophilised powder" },
      { icon: "snowflake", label: "Store -20 °C, desiccated" },
    ],
    monograph: {
      identity:
        "AOD-9604 is a modified C-terminal fragment of human growth hormone, corresponding to residues 176-191 with a stabilising N-terminal modification.",
      mechanism:
        "Research models study a lipolytic/lipid-metabolism profile attributed to the C-terminal fragment, reportedly without the growth-promoting or insulin-antagonising activity of the full hormone.",
      context:
        "A long-standing metabolic-fragment research compound studied in lipolysis and adipocyte-metabolism models.",
    },
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
    highlights: [
      { icon: "molecule", label: "Small-molecule NNMT inhibitor" },
      { icon: "pathway", label: "NAD+ salvage research" },
      { icon: "purity", label: "HPLC ≥98.5%" },
      { icon: "flask", label: "Research-grade powder" },
      { icon: "snowflake", label: "Store -20 °C, desiccated" },
    ],
    monograph: {
      identity:
        "5-Amino-1MQ (5-amino-1-methylquinolinium) is a small-molecule, cell-permeable inhibitor supplied as a research-grade powder.",
      mechanism:
        "Inhibits nicotinamide N-methyltransferase (NNMT). Research models study the resulting effects on the methylation balance, NAD+ salvage pathway and adipocyte metabolism.",
      context:
        "A frequently referenced small molecule in NNMT-inhibition and metabolic-research models.",
      handling:
        "Supplied as a research-grade powder, not a lyophilised peptide. Dissolve in the vehicle specified by the source protocol (commonly DMSO or aqueous buffer), preparing working concentrations gravimetrically and recording lot, solvent and concentration. Do not assume peptide reconstitution conditions apply.",
      specifications:
        "- Catalogue identity: 5-Amino-1MQ\n- Nominal HPLC purity: ≥98.5%\n- Molecular form: Research-grade powder (small molecule)\n- Storage: -20 °C, desiccated\n- Reconstitution: Per source protocol (e.g. DMSO / aqueous buffer)\n- Reference batch: VP-5A1MQ-2621",
    },
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
    highlights: [
      { icon: "molecule", label: "Triple monoamine-reuptake inhibitor" },
      { icon: "brain", label: "CNS appetite-regulation research" },
      { icon: "purity", label: "HPLC ≥98.6%" },
      { icon: "flask", label: "Research-grade powder" },
      { icon: "snowflake", label: "Store -20 °C, desiccated" },
    ],
    monograph: {
      identity:
        "Tesofensine is a small-molecule monoamine-reuptake inhibitor supplied as a research-grade powder.",
      mechanism:
        "Inhibits the reuptake of serotonin, noradrenaline and dopamine. Research models study the resulting central effects on appetite regulation and energy balance.",
      context:
        "A reference monoamine-reuptake-inhibitor compound in CNS appetite and energy-balance research models.",
      handling:
        "Supplied as a research-grade powder, not a lyophilised peptide. Dissolve in the vehicle specified by the source protocol (commonly DMSO or aqueous buffer), preparing working concentrations gravimetrically and recording lot, solvent and concentration. Do not assume peptide reconstitution conditions apply.",
      specifications:
        "- Catalogue identity: Tesofensine\n- Nominal HPLC purity: ≥98.6%\n- Molecular form: Research-grade powder (small molecule)\n- Storage: -20 °C, desiccated\n- Reconstitution: Per source protocol (e.g. DMSO / aqueous buffer)\n- Reference batch: VP-TESO-2622",
    },
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
    highlights: [
      { icon: "pathway", label: "Body-protection compound" },
      { icon: "molecule", label: "15-aa gastric pentadecapeptide" },
      { icon: "purity", label: "HPLC ≥99.5%" },
      { icon: "vial", label: "Lyophilised, aqueous-stable" },
      { icon: "snowflake", label: "Store -20 °C, desiccated" },
    ],
    monograph: {
      identity:
        "BPC-157 is a synthetic stable pentadecapeptide (15 amino acids) derived from a partial sequence of a protein identified in gastric juice.",
      mechanism:
        "Preclinical studies associate it with angiogenic signalling (including VEGF-pathway involvement), nitric-oxide system modulation and effects on fibroblast behaviour relevant to connective-tissue and gut-tissue repair models. Its mechanism remains under active investigation.",
      context:
        "BPC-157 is the single most-referenced compound in tissue-repair research and a frequent partner in combination repair blends. It is valued in the lab partly for its relative stability in aqueous solution.",
    },
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
    highlights: [
      { icon: "pathway", label: "Thymosin β4 active fragment" },
      { icon: "molecule", label: "Cell-migration research" },
      { icon: "purity", label: "HPLC ≥99.1%" },
      { icon: "vial", label: "Lyophilised powder" },
      { icon: "snowflake", label: "Store -20 °C, desiccated" },
    ],
    monograph: {
      identity:
        "TB-500 is a synthetic peptide corresponding to the active actin-binding region of thymosin beta-4.",
      mechanism:
        "Studied as a regulator of actin polymerisation, promoting cell migration and motility in wound-model and angiogenesis research. Its proposed pathway is distinct from BPC-157, which underpins combination study designs.",
      context:
        "One of the two most-cited recovery peptides, frequently combined with BPC-157 in repair-model experiments and in the popular GLOW/KLOW research blends.",
    },
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
    highlights: [
      { icon: "blend", label: "BPC-157 + TB-500 + GHK-Cu" },
      { icon: "pathway", label: "Multi-pathway repair model" },
      { icon: "purity", label: "HPLC ≥98.6%" },
      { icon: "vial", label: "Co-lyophilised blend" },
      { icon: "snowflake", label: "Store -20 °C, dark" },
    ],
    monograph: {
      identity:
        "A combination research blend co-lyophilising BPC-157, TB-500 and the copper tripeptide GHK-Cu in a single vial.",
      mechanism:
        "Pairs the distinct proposed pathways of its components — angiogenesis/repair signalling (BPC-157), actin-regulated cell migration (TB-500) and copper-dependent matrix remodelling (GHK-Cu) — for combined tissue-repair model studies.",
      context:
        "Reflects the common experimental design of studying complementary repair mechanisms together. Component ratios are fixed at manufacture; verify each against the batch certificate of analysis.",
      storage:
        "Store the sealed vial at -20 °C, desiccated and protected from light, as the GHK-Cu component is light- and chelator-sensitive. After reconstitution refrigerate at 2–8 °C, minimise freeze–thaw cycles and stopper punctures, and use within a short working window. Confirm identity and purity against the batch COA before use.",
    },
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
    highlights: [
      { icon: "blend", label: "BPC-157 / TB-500 / GHK-Cu / KPV" },
      { icon: "pathway", label: "Four-component repair model" },
      { icon: "purity", label: "HPLC ≥98.4%" },
      { icon: "vial", label: "Co-lyophilised blend" },
      { icon: "snowflake", label: "Store -20 °C, dark" },
    ],
    monograph: {
      identity:
        "An extended combination blend adding the tripeptide KPV (a C-terminal α-MSH fragment) to the GLOW formulation.",
      mechanism:
        "Combines the repair-pathway components of GLOW with KPV, which is studied in inflammation-model research for anti-inflammatory signalling — allowing repair and inflammatory pathways to be examined together.",
      context:
        "Designed for repair-and-inflammation model studies. Component ratios are fixed at manufacture; confirm each against the batch certificate of analysis.",
      storage:
        "Store the sealed vial at -20 °C, desiccated and protected from light, as the GHK-Cu component is light- and chelator-sensitive. After reconstitution refrigerate at 2–8 °C, minimise freeze–thaw cycles and stopper punctures, and use within a short working window. Confirm identity and purity against the batch COA before use.",
    },
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
    highlights: [
      { icon: "copper", label: "Copper(II) tripeptide complex" },
      { icon: "molecule", label: "Gly-His-Lys + Cu²⁺" },
      { icon: "pathway", label: "Extracellular-matrix research" },
      { icon: "purity", label: "HPLC ≥99.3%" },
      { icon: "snowflake", label: "Store -20 °C, dark" },
    ],
    monograph: {
      identity:
        "GHK-Cu is the tripeptide glycyl-L-histidyl-L-lysine coordinated to a copper(II) ion, which gives it its characteristic blue colour.",
      mechanism:
        "Research models study copper-dependent roles in extracellular-matrix remodelling, fibroblast activity and the expression of genes associated with skin and connective-tissue maintenance. The coordinated copper is central to its proposed activity.",
      context:
        "The most-studied copper peptide and a frequent reference compound in matrix and copper-peptide research; it also appears as a component of repair blends.",
      handling:
        "Centrifuge briefly before opening. Reconstitute slowly down the vial wall with bacteriostatic or sterile water; swirl, do not shake. Avoid strong chelators and reducing agents that can strip the coordinated copper, and follow the pH constraints in the source protocol. The blue tint is a visual cue that copper remains complexed but is never a substitute for analytical confirmation.",
      storage:
        "Store the sealed vial at -20 °C, desiccated and protected from light. After reconstitution refrigerate at 2–8 °C, keep away from light and chelating agents, minimise freeze–thaw cycles, and use within a short working window. Confirm identity and purity against the batch COA before use.",
    },
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
    highlights: [
      { icon: "bolt", label: "Mitochondrial-derived peptide" },
      { icon: "molecule", label: "16-aa, 12S rRNA-encoded" },
      { icon: "pathway", label: "Cellular-energy research" },
      { icon: "purity", label: "HPLC ≥99.0%" },
      { icon: "snowflake", label: "Store -20 °C, desiccated" },
    ],
    monograph: {
      identity:
        "MOTS-c is a 16-amino-acid mitochondrial-derived peptide encoded within the 12S rRNA region of the mitochondrial genome.",
      mechanism:
        "Studied as a regulator of metabolic homeostasis, with research implicating AMPK-pathway activation and nuclear-signalling responses to metabolic stress in cellular-energy models.",
      context:
        "A leading molecule in mitochondrial-derived-peptide and cellular-energy research, frequently studied alongside longevity and metabolic compounds.",
    },
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
    highlights: [
      { icon: "bolt", label: "Cellular-energy coenzyme" },
      { icon: "molecule", label: "Redox dinucleotide cofactor" },
      { icon: "pathway", label: "Sirtuin / NAD+ research" },
      { icon: "purity", label: "HPLC ≥98.9%" },
      { icon: "snowflake", label: "Store -20 °C, desiccated" },
    ],
    monograph: {
      identity:
        "NAD+ (nicotinamide adenine dinucleotide) is a ubiquitous redox coenzyme central to cellular energy metabolism, supplied here as a lyophilised research reagent.",
      mechanism:
        "Acts as an electron carrier in redox reactions and as a substrate for NAD+-consuming enzymes such as sirtuins and PARPs. Longevity and cellular-energy research models examine NAD+ availability and its downstream signalling.",
      context:
        "A staple reagent in cellular-ageing, mitochondrial and metabolic research, often studied in the context of NAD+ precursor and sirtuin pathways.",
    },
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
    highlights: [
      { icon: "leaf", label: "Longevity tetrapeptide" },
      { icon: "molecule", label: "Ala-Glu-Asp-Gly" },
      { icon: "pathway", label: "Telomerase research" },
      { icon: "purity", label: "HPLC ≥99.1%" },
      { icon: "snowflake", label: "Store -20 °C, desiccated" },
    ],
    monograph: {
      identity:
        "Epithalon (epitalon) is a synthetic tetrapeptide, Ala-Glu-Asp-Gly, derived from the pineal peptide epithalamin.",
      mechanism:
        "Research models study proposed effects on telomerase activity and telomere maintenance, alongside circadian and neuro-endocrine regulation.",
      context:
        "A frequently referenced compound in telomere-biology and longevity research models.",
    },
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
    highlights: [
      { icon: "pathway", label: "GH-axis secretagogue blend" },
      { icon: "molecule", label: "GHRH analogue + ghrelin mimetic" },
      { icon: "purity", label: "HPLC ≥99.2%" },
      { icon: "vial", label: "Co-lyophilised blend" },
      { icon: "snowflake", label: "Store -20 °C, desiccated" },
    ],
    monograph: {
      identity:
        "A combination blend of CJC-1295 (no DAC), a modified GHRH(1-29) analogue, and Ipamorelin, a selective pentapeptide growth-hormone secretagogue.",
      mechanism:
        "Studied together for complementary action on the growth-hormone axis: CJC-1295 engages the GHRH receptor while Ipamorelin acts as a selective ghrelin/GHS-receptor agonist — a pairing used to model pulsatile GH-axis signalling in research.",
      context:
        "One of the most-requested growth-factor research blends; the two components are routinely studied together rather than alone.",
    },
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
    highlights: [
      { icon: "pathway", label: "Stabilised GHRH analogue" },
      { icon: "molecule", label: "GRF(1-44) analogue" },
      { icon: "purity", label: "HPLC ≥99.0%" },
      { icon: "vial", label: "Lyophilised powder" },
      { icon: "snowflake", label: "Store -20 °C, desiccated" },
    ],
    monograph: {
      identity:
        "Tesamorelin is a synthetic analogue of human growth-hormone-releasing hormone (GRF 1-44), stabilised against enzymatic degradation.",
      mechanism:
        "Agonist at the GHRH receptor, studied for stimulation of endogenous growth-hormone secretion and downstream metabolic signalling in growth-axis research models.",
      context:
        "A reference GHRH-analogue in endocrine and metabolic research, often compared with secretagogue blends.",
    },
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
    highlights: [
      { icon: "brain", label: "Anxiolytic nootropic peptide" },
      { icon: "molecule", label: "Tuftsin heptapeptide analogue" },
      { icon: "pathway", label: "GABA / BDNF research" },
      { icon: "purity", label: "HPLC ≥98.8%" },
      { icon: "snowflake", label: "Store -20 °C, desiccated" },
    ],
    monograph: {
      identity:
        "Selank is a synthetic heptapeptide analogue of the immunomodulatory tetrapeptide tuftsin, stabilised for research use.",
      mechanism:
        "Studied in anxiolytic and cognitive models, with research implicating GABAergic signalling, BDNF expression and modulation of enkephalin metabolism.",
      context:
        "A widely referenced nootropic/anxiolytic research peptide, frequently studied alongside Semax.",
    },
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
    highlights: [
      { icon: "brain", label: "Nootropic / neuroprotective peptide" },
      { icon: "molecule", label: "ACTH(4-10) analogue" },
      { icon: "pathway", label: "BDNF / neurotrophic research" },
      { icon: "purity", label: "HPLC ≥98.9%" },
      { icon: "snowflake", label: "Store -20 °C, desiccated" },
    ],
    monograph: {
      identity:
        "Semax is a synthetic heptapeptide analogue of the ACTH(4-10) fragment, modified for metabolic stability.",
      mechanism:
        "Research models study neuroprotective and nootropic effects, with reported involvement of BDNF/neurotrophic signalling and modulation of monoaminergic systems.",
      context:
        "A core compound in nootropic and neuroprotection research, often paired with Selank in study designs.",
    },
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
    highlights: [
      { icon: "sleep", label: "Delta sleep-inducing peptide" },
      { icon: "molecule", label: "9-aa neuropeptide" },
      { icon: "pathway", label: "Sleep-architecture research" },
      { icon: "purity", label: "HPLC ≥99.0%" },
      { icon: "snowflake", label: "Store -20 °C, desiccated" },
    ],
    monograph: {
      identity:
        "DSIP (delta sleep-inducing peptide) is a nine-amino-acid neuropeptide first isolated from cerebral venous blood.",
      mechanism:
        "Studied in sleep-architecture and neuro-endocrine models for proposed effects on delta-wave sleep and on the regulation of several hormonal axes; its mechanism remains incompletely defined.",
      context:
        "A long-standing reference compound in sleep and neuro-endocrine research models.",
    },
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
    highlights: [
      { icon: "droplet", label: "0.9% benzyl alcohol" },
      { icon: "water", label: "Multi-draw reconstitution" },
      { icon: "vial", label: "30 ml vial" },
      { icon: "shield", label: "Bacteriostatic preservative" },
    ],
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
    highlights: [
      { icon: "droplet", label: "Preservative-free" },
      { icon: "water", label: "Single-use reconstitution" },
      { icon: "vial", label: "30 ml vial" },
    ],
    sizes: [["30ml", 1000, null]],
  },
  {
    base: "insulin-syringes",
    name: "Insulin Syringes",
    category: "lab-supplies",
    tagline: "U-100 · 31G · 0.5 ml — precise low-volume draws",
    description:
      "Sterile single-use U-100 insulin syringes with a fine 31G needle for accurate low-volume measurement and transfer of reconstituted research solutions. For laboratory use.",
    purity: 100,
    specs: [
      { label: "Gauge", value: "31G" },
      { label: "Volume", value: "0.5 ml" },
      { label: "Graduation", value: "U-100" },
      { label: "Quantity", value: "100 per box" },
    ],
    highlights: [
      { icon: "droplet", label: "Fine 31G needle" },
      { icon: "purity", label: "Sterile, single-use" },
      { icon: "vial", label: "0.5 ml U-100" },
      { icon: "shield", label: "Box of 100" },
    ],
    sizes: [["100pack", 2200, null]],
  },
  {
    base: "luer-lock-syringes",
    name: "Luer-Lock Syringes",
    category: "lab-supplies",
    tagline: "3 ml · secure luer-lock — transfer & measuring",
    description:
      "Sterile 3 ml luer-lock syringes with detachable needle for measuring, mixing and transferring reconstitution fluids without leakage. For laboratory use.",
    purity: 100,
    specs: [
      { label: "Volume", value: "3 ml" },
      { label: "Fitting", value: "Luer-lock" },
      { label: "Needle", value: "21G detachable" },
      { label: "Quantity", value: "10 per pack" },
    ],
    highlights: [
      { icon: "purity", label: "Sterile, single-use" },
      { icon: "shield", label: "Secure luer-lock" },
      { icon: "droplet", label: "Detachable needle" },
      { icon: "vial", label: "3 ml barrel" },
    ],
    sizes: [["10pack", 1400, null]],
  },
  {
    base: "empty-sterile-vials",
    name: "Empty Sterile Vials",
    category: "lab-supplies",
    tagline: "10 ml clear glass — crimp-top, stoppered",
    description:
      "Empty sterile 10 ml borosilicate vials with grey rubber stoppers and aluminium crimp caps for storing reconstituted or aliquoted research solutions. For laboratory use.",
    purity: 100,
    specs: [
      { label: "Volume", value: "10 ml" },
      { label: "Glass", value: "Type I borosilicate" },
      { label: "Closure", value: "Stopper + crimp cap" },
      { label: "Quantity", value: "10 per pack" },
    ],
    highlights: [
      { icon: "vial", label: "10 ml borosilicate" },
      { icon: "shield", label: "Crimp-top sealed" },
      { icon: "purity", label: "Sterile" },
      { icon: "snowflake", label: "Freezer-safe storage" },
    ],
    sizes: [["10pack", 1600, null]],
  },
  {
    base: "alcohol-prep-pads",
    name: "Alcohol Prep Pads",
    category: "lab-supplies",
    tagline: "70% isopropyl — sterile surface & septum wipes",
    description:
      "Individually wrapped 70% isopropyl alcohol pads for disinfecting vial septa and work surfaces during reconstitution. For laboratory use.",
    purity: 100,
    specs: [
      { label: "Agent", value: "70% isopropyl alcohol" },
      { label: "Format", value: "Individually wrapped" },
      { label: "Quantity", value: "100 per box" },
    ],
    highlights: [
      { icon: "droplet", label: "70% isopropyl" },
      { icon: "shield", label: "Individually sealed" },
      { icon: "purity", label: "Sterile wipes" },
    ],
    sizes: [["100pack", 700, null]],
  },
  {
    base: "empty-peptide-pen",
    name: "Empty Peptide Pen",
    category: "lab-supplies",
    tagline: "Refillable dosing pen — fine micro-adjust dial",
    description:
      "Refillable, reusable dosing pen for accurate micro-volume dispensing of reconstituted research solutions in the lab. Supplied empty. For laboratory use.",
    purity: 100,
    specs: [
      { label: "Type", value: "Refillable / reusable" },
      { label: "Adjustment", value: "Fine micro-dial" },
      { label: "Cartridge", value: "Standard 3 ml" },
    ],
    highlights: [
      { icon: "purity", label: "Precise micro-dosing" },
      { icon: "vial", label: "Refillable cartridge" },
      { icon: "shield", label: "Reusable build" },
    ],
    sizes: [["each", 3400, null]],
  },
  {
    base: "reconstitution-kit",
    name: "Reconstitution Kit",
    category: "lab-supplies",
    tagline: "Everything for one clean reconstitution session",
    description:
      "A complete bench kit: bacteriostatic water, insulin syringes, empty sterile vials and alcohol prep pads — everything needed to reconstitute and aliquot a research peptide cleanly. For laboratory use.",
    purity: 100,
    specs: [
      { label: "Includes", value: "Bac water, syringes, vials, pads" },
      { label: "Sessions", value: "Multi-draw ready" },
    ],
    highlights: [
      { icon: "blend", label: "All-in-one bench kit" },
      { icon: "water", label: "Bacteriostatic water" },
      { icon: "droplet", label: "Syringes & pads" },
      { icon: "vial", label: "Storage vials" },
    ],
    sizes: [["kit", 2900, null]],
  },
];

function variantSlug(base: string, size: string): string {
  return `${base}-${size.toLowerCase().replace(/\s+/g, "")}`;
}

export const products: Product[] = catalog.flatMap((g) => {
  // Highlights and the composed monograph are group-level: every size variant
  // of the same compound shares them.
  const monograph = buildMonograph(g);
  return g.sizes.map(([size, priceCents, compareAtCents, stock], i) => ({
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
    highlights: g.highlights ?? [],
    monograph,
  }));
});

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
    body: `Few areas of peptide pharmacology have moved as quickly as the incretin field. Within a single decade the discovery programme has progressed from mono-agonists targeting one class-B G-protein-coupled receptor (GPCR) to unimolecular peptides that engage three receptors simultaneously. This review maps the current landscape for readers following the primary literature. It is background for laboratory research only and is not guidance for human use; efficacy figures cited below are taken from the published trial reports and attributed accordingly.

## The incretin axis

Incretins are nutrient-stimulated enteroendocrine hormones that potentiate glucose-dependent insulin secretion. The two principal effectors are glucagon-like peptide-1 (GLP-1), secreted by intestinal L-cells, and glucose-dependent insulinotropic polypeptide (GIP), secreted by K-cells. Both act on class-B GPCRs coupled predominantly to Gs, raising intracellular cAMP and amplifying β-cell exocytosis in a glucose-dependent manner; GLP-1 additionally slows gastric emptying and engages central circuits governing satiety [Campbell & Drucker, 2013](https://doi.org/10.1016/j.cmet.2013.04.008). Glucagon, signalling through the glucagon receptor (GCGR), is catabolic — promoting hepatic glucose output and energy expenditure. Native GLP-1 is rapidly inactivated by dipeptidyl peptidase-4 (DPP-4), giving a plasma half-life of only minutes; the therapeutic peptides below are engineered to resist this cleavage [Müller et al., 2019](https://doi.org/10.1016/j.molmet.2019.09.010).

## Mono-agonists: semaglutide

Semaglutide is a GLP-1 receptor agonist whose extended half-life (~165 h) derives from a C18 fatty-diacid moiety that drives reversible albumin binding, an Aib substitution at position 8 that blocks DPP-4 cleavage, and additional backbone modifications. In the STEP 1 trial it served as the reference single-receptor agonist, with the report describing a mean body-weight change of −14.9% versus −2.4% for placebo over 68 weeks [Wilding et al., 2021](https://doi.org/10.1056/NEJMoa2032183). As the best-characterised molecule in the class, it is the standard comparator in studies of newer multi-agonists.

## Dual agonists: tirzepatide

Tirzepatide is a 39-residue unimolecular GIP/GLP-1 co-agonist with a C20 fatty-diacid for albumin binding; its sequence is GIP-based and biased toward GIP-receptor signalling [Coskun et al., 2018](https://doi.org/10.1016/j.molmet.2018.09.009). In the head-to-head SURPASS-2 trial the report described greater HbA1c and weight reduction than semaglutide [Frías et al., 2021](https://doi.org/10.1056/NEJMoa2107519), and SURMOUNT-1 reported up to −20.9% body weight at the 15 mg dose in participants without diabetes [Jastreboff et al., 2022](https://doi.org/10.1056/NEJMoa2206038). This dual mechanism made it the benchmark for "next-generation" incretin research.

## Triple agonists: retatrutide

Retatrutide (LY3437943) adds GCGR agonism to the GIP/GLP-1 pharmacology, a design rationale traceable to the first monomeric GIP/GLP-1/glucagon triagonists [Finan et al., 2015](https://doi.org/10.1038/nm.3761). Its Phase 2 obesity trial reported a least-squares mean body-weight reduction of approximately 24.2% at the 12 mg dose at 48 weeks [Jastreboff et al., 2023](https://doi.org/10.1056/NEJMoa2301972), with Phase 3 programmes registered and ongoing [ClinicalTrials.gov NCT05929066](https://clinicaltrials.gov/study/NCT05929066). For researchers the molecule is a tractable model for studying how balanced versus biased tri-receptor engagement reshapes downstream signalling.

## The amylin axis: cagrilintide

Running parallel to the incretins is the long-acting amylin analogue cagrilintide, which signals through the calcitonin and amylin receptor family to suppress food intake by a mechanism complementary to GLP-1 [Lau et al., 2021](https://doi.org/10.1016/S0140-6736(21)01751-7). Combination of cagrilintide with semaglutide ("CagriSema") has moved amylin-class compounds to the centre of metabolic research, and multi-pathway combination work is a defining 2026 theme.

## Implications for sourcing

Because these molecules are large and structurally complex, batch-to-batch purity is decisive for reproducible work. Orthogonal characterisation — mass-spectrometric confirmation of identity against the theoretical monoisotopic mass and reversed-phase HPLC purity — is the minimum that separates a usable research lot from an unusable one. Every batch we list publishes both; see the COA vault.

These compounds are supplied for laboratory and research use only. Nothing here is medical advice or a recommendation for human use.

## References

1. [Campbell JE, Drucker DJ. Pharmacology, physiology, and mechanisms of incretin hormone action. Cell Metab. 2013;17(6):819–837.](https://doi.org/10.1016/j.cmet.2013.04.008)
2. [Müller TD, et al. Glucagon-like peptide 1 (GLP-1). Mol Metab. 2019;30:72–130.](https://doi.org/10.1016/j.molmet.2019.09.010)
3. [Wilding JPH, et al. Once-weekly semaglutide in adults with overweight or obesity (STEP 1). N Engl J Med. 2021;384:989–1002.](https://doi.org/10.1056/NEJMoa2032183)
4. [Frías JP, et al. Tirzepatide versus semaglutide once weekly in type 2 diabetes (SURPASS-2). N Engl J Med. 2021;385:503–515.](https://doi.org/10.1056/NEJMoa2107519)
5. [Jastreboff AM, et al. Tirzepatide once weekly for the treatment of obesity (SURMOUNT-1). N Engl J Med. 2022;387:205–216.](https://doi.org/10.1056/NEJMoa2206038)
6. [Jastreboff AM, et al. Triple-hormone-receptor agonist retatrutide for obesity — a phase 2 trial. N Engl J Med. 2023;389:514–526.](https://doi.org/10.1056/NEJMoa2301972)`,
  },
  {
    slug: "bpc-157-tb-500-repair",
    title: "BPC-157 and TB-500 in Tissue-Repair Research",
    excerpt:
      "Two of the most discussed recovery peptides, the rationale behind combining them, and what the preclinical literature actually examines.",
    category: "Research",
    publishedOn: "2026-06-02",
    readingMinutes: 7,
    body: `BPC-157 and TB-500 are the two peptides most frequently referenced in preclinical tissue-repair research, and they are often studied in combination. This article summarises the proposed mechanisms and the experimental rationale — as background for laboratory work only. One caveat frames everything that follows: the evidence base is overwhelmingly preclinical (rodent models and in-vitro systems), neither compound is an approved therapeutic, and no efficacy in humans is established.

## BPC-157

BPC-157 ("body-protection compound-157") is a stable synthetic pentadecapeptide whose sequence corresponds to a partial fragment identified in human gastric juice. The preclinical literature reports cytoprotective and angiomodulatory effects across tendon, ligament, muscle and gut-injury models; proposed mechanisms centre on upregulation of the VEGFR2–Akt–eNOS axis and modulation of nitric-oxide signalling and growth-factor expression [Seiwerth et al., 2021](https://doi.org/10.3389/fphar.2021.627533). In a frequently cited tendon-fibroblast study the peptide promoted outgrowth, survival and migration in vitro [Chang et al., 2011](https://doi.org/10.1152/japplphysiol.00945.2010). It is favoured at the bench partly for its relative stability in aqueous solution.

## TB-500

TB-500 is a synthetic peptide corresponding to an active region of thymosin β4 (Tβ4), a 43-residue G-actin-sequestering protein central to cytoskeletal dynamics. Through actin regulation Tβ4 modulates directed cell migration, and reviews describe roles in angiogenesis and wound-related remodelling [Goldstein et al., 2005](https://doi.org/10.1016/j.molmed.2005.07.004). Its proposed mechanism — actin sequestration and promotion of cell motility — is mechanistically distinct from the VEGFR2-linked angiogenic signalling emphasised for BPC-157, which is the basis for the combination interest.

## Rationale for combination protocols

Because the two compounds are proposed to act through partly non-overlapping pathways — angiogenic signalling versus actin-dependent migration — co-administration is a common experimental design intended to probe complementary repair processes. This is the rationale behind the popular "GLOW"-style research blends that pair BPC-157 and TB-500, sometimes with the copper tripeptide GHK-Cu. As a matter of methodology, combination designs should include single-agent and vehicle arms so any interaction can actually be attributed.

## Handling notes

- Both ship as lyophilised powders requiring reconstitution with bacteriostatic water before solution-phase work.
- Store lyophilised vials cold and protected from light; reconstituted solution has a far shorter usable window.
- Confirm identity (mass spectrometry) and purity (HPLC) against the batch COA before designing any experiment.

These peptides are for laboratory and research use only. This is general research information, not medical advice or a protocol for human administration.

## References

1. [Seiwerth S, et al. Stable gastric pentadecapeptide BPC 157 and wound healing. Front Pharmacol. 2021;12:627533.](https://doi.org/10.3389/fphar.2021.627533)
2. [Chang CH, et al. The promoting effect of pentadecapeptide BPC 157 on tendon healing involves tendon outgrowth, cell survival, and cell migration. J Appl Physiol. 2011;110(3):774–780.](https://doi.org/10.1152/japplphysiol.00945.2010)
3. [Goldstein AL, Hannappel E, Kleinman HK. Thymosin β4: actin-sequestering protein moonlights to repair injured tissues. Trends Mol Med. 2005;11(9):421–429.](https://doi.org/10.1016/j.molmed.2005.07.004)
4. [Xing Y, et al. Roles of thymosin β4 in tissue repair and regeneration. Int J Mol Sci. 2021;22(20):11125.](https://doi.org/10.3390/ijms222011125)`,
  },
  {
    slug: "ghk-cu-copper-peptide",
    title: "GHK-Cu: The Copper Peptide in Skin and Matrix Research",
    excerpt:
      "Why the GHK-Cu vial is blue, what the copper complex does at the molecular level, and where it sits in extracellular-matrix research.",
    category: "Research",
    publishedOn: "2026-05-28",
    readingMinutes: 6,
    body: `GHK-Cu is easy to spot on the bench: unlike the white lyophilised powders of most peptides, it carries a distinct blue tint. That colour is coordination chemistry made visible.

## Why it is blue

GHK is an endogenous tripeptide, glycyl-L-histidyl-L-lysine, first isolated from human plasma. The "-Cu" denotes a chelated copper(II) ion; the imidazole nitrogen of histidine, the N-terminal amine and the backbone together form a high-affinity square-planar coordination sphere. Copper(II) d–d electronic transitions absorb in the red/orange region of the visible spectrum, so the complex transmits and appears blue. The colour is thus a qualitative cue that copper is coordinated — but it is never a substitute for analytical confirmation of stoichiometry and purity [Pickart & Margolina, 2018](https://doi.org/10.3390/ijms19071987).

## What the literature examines

GHK-Cu is among the most studied copper peptides. In-vitro and animal models report modulation of extracellular-matrix turnover — including expression of collagens, metalloproteinases and their inhibitors (TIMPs) — alongside effects on fibroblast proliferation and angiogenic signalling [Pickart et al., 2015](https://doi.org/10.1155/2015/648108). Transcriptomic surveys describe GHK-associated changes across a broad set of genes linked to tissue remodelling and antioxidant response, which is why it recurs as a reference compound in matrix-biology and skin-research designs [Pickart, 2008](https://doi.org/10.1163/156856208784909435).

## Practical lab notes

- The copper complex is sensitive to pH and to reducing agents; follow the conditions specified in the source protocol.
- Keep it away from strong chelators (e.g. EDTA) that can strip the copper and abolish the complex.
- Store cold and protected from light; document the lot number against its COA.

## Where it fits

GHK-Cu frequently appears in combination research blends with tissue-repair peptides, where copper-peptide and repair mechanisms are studied in parallel. That combination interest is one reason it remains consistently requested.

Supplied for laboratory and research use only. This article is background information and not medical advice.

## References

1. [Pickart L, Margolina A. Regenerative and protective actions of the GHK-Cu peptide in the light of the new gene data. Int J Mol Sci. 2018;19(7):1987.](https://doi.org/10.3390/ijms19071987)
2. [Pickart L, Vasquez-Soltero JM, Margolina A. GHK peptide as a natural modulator of multiple cellular pathways in skin regeneration. Biomed Res Int. 2015;2015:648108.](https://doi.org/10.1155/2015/648108)
3. [Pickart L. The human tri-peptide GHK and tissue remodeling. J Biomater Sci Polym Ed. 2008;19(8):969–988.](https://doi.org/10.1163/156856208784909435)`,
  },
  {
    slug: "reading-a-coa",
    title: "How to Read a Certificate of Analysis",
    excerpt:
      "Understand HPLC purity figures, mass-spec confirmation and what each section of a COA tells you.",
    category: "Quality",
    publishedOn: "2026-05-20",
    readingMinutes: 6,
    body: `A certificate of analysis (COA) is the single most important document attached to a research peptide. It is the difference between an assertion of purity and an independent, instrumented measurement of it. Reagent identity and purity are also a documented contributor to irreproducible results, which is why reading a COA critically matters [Baker, 2016](https://doi.org/10.1038/533452a). Here is how to read one.

## Identity: mass spectrometry

The first question a COA answers is whether the vial actually contains the molecule on the label. Mass spectrometry (typically ESI-MS or MALDI-TOF) measures the molecular mass of the compound and compares it against the theoretical monoisotopic or average mass of the target sequence. Agreement within the method's mass-accuracy tolerance confirms identity; for multiply charged ESI envelopes, deconvolution should resolve to the expected neutral mass. If the measured mass does not match, nothing else on the document is meaningful.

## Purity: reversed-phase HPLC

Reversed-phase high-performance liquid chromatography (RP-HPLC) resolves the sample on a hydrophobic stationary phase and reports the target peak as a percentage of total integrated peak area, usually by UV detection at 214–220 nm (the peptide-bond absorbance). A figure such as 99.1% means 99.1% of the detected area corresponds to the main peak, the remainder being sequence-related impurities (deletion, truncation, oxidation or deamidation products) or process residues such as residual trifluoroacetate [D'Hondt et al., 2014](https://doi.org/10.1016/j.jpba.2014.06.012). Specification-setting for such acceptance criteria is described in regulatory guidance [ICH Q6A](https://www.ich.org/page/quality-guidelines).

## Reading the chromatogram

- A single dominant, symmetric, well-resolved peak is the goal.
- Several smaller peaks indicate related impurities; their integrated area is what depresses the purity figure.
- A drifting or noisy baseline, or co-elution under a broad peak, can make a headline purity number unreliable — assess the trace, not just the percentage.

## Batch traceability

A trustworthy COA names a specific batch or lot number that matches the vial in hand. That identifier is what ties a physical unit back to its test data and underpins reproducibility. A single generic COA covering "the product" rather than the specific lot should be treated with caution.

## Independence

Finally, note who performed the analysis. An in-house figure is better than none, but an accredited third-party laboratory removes the obvious conflict of interest. Every batch in our vault links to its report so the figures can be checked directly.

This article is general quality-assurance information. Products are for laboratory research use only.

## References

1. [D'Hondt M, et al. Related impurities in peptide medicines. J Pharm Biomed Anal. 2014;101:2–30.](https://doi.org/10.1016/j.jpba.2014.06.012)
2. [International Council for Harmonisation. ICH Q6A: Specifications — test procedures and acceptance criteria for new drug substances and products (chemical substances).](https://www.ich.org/page/quality-guidelines)
3. [Baker M. 1,500 scientists lift the lid on reproducibility. Nature. 2016;533(7604):452–454.](https://doi.org/10.1038/533452a)`,
  },
  {
    slug: "reconstitution-basics",
    title: "Reconstitution Basics for Research Peptides",
    excerpt:
      "A laboratory guide to solvents, ratios and sterile handling when preparing lyophilised peptides.",
    category: "Guides",
    publishedOn: "2026-05-04",
    readingMinutes: 8,
    body: `Most research peptides ship as a lyophilised (freeze-dried) powder — a solid form chosen because removing water suppresses the hydrolytic and conformational degradation pathways that limit peptide shelf life [Wang, 2000](https://doi.org/10.1016/S0378-5173(00)00423-3). Before solution-phase work the cake must be reconstituted, and reconstitution done carelessly is where purity and activity are lost. This is a general laboratory guide, not a protocol for human use.

## Choosing a solvent

- Bacteriostatic water (water with ~0.9% benzyl alcohol) is the common choice for multi-draw research vials because the preservative limits microbial growth across repeated stopper access.
- Sterile water is used where a single-use, preservative-free vehicle is required.
- Poorly soluble or hydrophobic sequences may need a small proportion of dilute acetic acid or an alternative vehicle to dissolve fully — defer to the compound's source documentation, since solvent and pH influence both solubility and conformational stability [Manning et al., 2010](https://doi.org/10.1007/s11095-009-0045-6).

## Working out the ratio

Reconstitution is a gravimetric dilution. Choose a target concentration and divide the vial's stated mass by it to obtain the solvent volume: a 10 mg vial brought up in 2 mL gives 5 mg/mL. Holding concentration constant across a study simplifies downstream quantitation and reduces transcription error.

## Technique

- Wipe the stopper with an alcohol swab and allow it to dry.
- Add solvent slowly down the inner vial wall rather than jetting it onto the cake; shear and foaming can drive aggregation.
- Do not shake. Swirl gently and allow time; most peptides dissolve within minutes to a clear, particulate-free solution.
- Inspect visually before use.

## Storage after reconstitution

In solution, hydrolysis, deamidation, oxidation and aggregation resume, so a reconstituted peptide has a far shorter usable life than the dry cake [Lai & Topp, 1999](https://doi.org/10.1021/js980374e). Refrigerate at 2–8 °C, protect from light, minimise freeze–thaw cycles and stopper punctures, and label with date and concentration. Prefer smaller working aliquots over one large stock.

## Common mistakes

- Shaking or foaming the vial, promoting denaturation and aggregation.
- Estimating rather than recording the concentration.
- Using a vial well past its reconstituted window.

For laboratory and research use only. This guide is general technique information and not medical advice.

## References

1. [Wang W. Lyophilization and development of solid protein pharmaceuticals. Int J Pharm. 2000;203(1–2):1–60.](https://doi.org/10.1016/S0378-5173(00)00423-3)
2. [Manning MC, et al. Stability of protein pharmaceuticals: an update. Pharm Res. 2010;27(4):544–575.](https://doi.org/10.1007/s11095-009-0045-6)
3. [Lai MC, Topp EM. Solid-state chemical stability of proteins and peptides. J Pharm Sci. 1999;88(5):489–500.](https://doi.org/10.1021/js980374e)`,
  },
  {
    slug: "choosing-a-supplier",
    title: "Choosing a Research Peptide Supplier",
    excerpt:
      "What independent testing, batch traceability and cold-chain handling should look like.",
    category: "Quality",
    publishedOn: "2026-04-22",
    readingMinutes: 5,
    body: `The 2026 market has matured, and the gap between high-quality research peptide suppliers and lower-tier sellers has widened. Because reagent identity and purity are a documented driver of irreproducible results, supplier diligence is part of experimental method, not an afterthought [Baker, 2016](https://doi.org/10.1038/533452a). A few checks separate the two tiers.

## Per-batch, independent testing

The single best signal is a per-batch certificate of analysis from an independent laboratory, published openly rather than supplied on request. It should report mass-spectrometric identity and a reversed-phase HPLC purity figure, with the batch number matching the vial received. Specification-setting and acceptance criteria for such testing follow established regulatory frameworks [ICH Q6A](https://www.ich.org/page/quality-guidelines), and characterising sequence-related impurities is a recognised analytical discipline in its own right [D'Hondt et al., 2014](https://doi.org/10.1016/j.jpba.2014.06.012).

## Traceability

Every vial should carry a lot number that ties back to a specific COA. Traceability is what makes a result reproducible: if the physical product cannot be linked to its test data, the data cannot be stood behind.

## Handling and shipping

Peptides are temperature- and light-sensitive, and degradation in solution and the solid state is well characterised [Manning et al., 2010](https://doi.org/10.1007/s11095-009-0045-6). Look for suppliers who handle stock with cold-chain awareness and ship with tracking. Discreet, well-padded packaging protects both the product and privacy.

## Transparency over marketing

Be wary of vendors who lean on urgency tactics, invented scarcity or purity claims with no document behind them. A serious supplier lets the data do the talking — public COAs, clear batch records and honest stock status.

## Payment and logistics

Finally, consider the practical side: transparent pricing, sensible shipping options, and a payment method that works for the region. None of this matters, though, without the testing and traceability above.

This article is general guidance for evaluating suppliers. All products referenced are for laboratory research use only.

## References

1. [Baker M. 1,500 scientists lift the lid on reproducibility. Nature. 2016;533(7604):452–454.](https://doi.org/10.1038/533452a)
2. [International Council for Harmonisation. ICH Q6A: Specifications — test procedures and acceptance criteria for new drug substances and products (chemical substances).](https://www.ich.org/page/quality-guidelines)
3. [D'Hondt M, et al. Related impurities in peptide medicines. J Pharm Biomed Anal. 2014;101:2–30.](https://doi.org/10.1016/j.jpba.2014.06.012)
4. [Manning MC, et al. Stability of protein pharmaceuticals: an update. Pharm Res. 2010;27(4):544–575.](https://doi.org/10.1007/s11095-009-0045-6)`,
  },
  {
    slug: "incretin-receptor-pharmacology",
    title: "Incretin Pharmacology: GIP, GLP-1 and Glucagon Receptor Signalling",
    excerpt:
      "A mechanistic primer on the class-B GPCRs behind the metabolic peptides — receptor coupling, cAMP signalling, biased agonism and what unimolecular multi-agonism actually changes.",
    category: "Research",
    publishedOn: "2026-06-13",
    readingMinutes: 10,
    body: `The metabolic peptides dominating current research all converge on a small set of receptors. Understanding their pharmacology — how the receptors couple, signal and desensitise — is what separates a mechanistic reading of the multi-agonist literature from a list of trial headlines. This is background for laboratory research only and not guidance for human use.

## Three class-B GPCRs

The GIP receptor (GIPR), GLP-1 receptor (GLP-1R) and glucagon receptor (GCGR) are secretin-family (class-B1) G-protein-coupled receptors. They share a large extracellular domain that captures the C-terminus of their peptide ligand, while the peptide N-terminus inserts into the seven-transmembrane core to drive activation — the canonical "two-domain" binding model for this family [Müller et al., 2019](https://doi.org/10.1016/j.molmet.2019.09.010). All three couple predominantly to Gαs, so the proximal readout of agonism is adenylate-cyclase activation and a rise in intracellular cAMP.

## From cAMP to physiology

In the pancreatic β-cell, cAMP generated by GLP-1R or GIPR activation potentiates glucose-stimulated insulin secretion through both protein kinase A and the cAMP sensor Epac2, but only when glucose is already elevated — the basis of the glucose-dependent ("incretin") effect [Campbell & Drucker, 2013](https://doi.org/10.1016/j.cmet.2013.04.008). GLP-1R signalling additionally slows gastric emptying and acts on hypothalamic and hindbrain circuits regulating satiety [Drucker, 2018](https://doi.org/10.1016/j.cmet.2018.03.001). GCGR activation in hepatocytes is catabolic, raising glucose output and energy expenditure — at first glance the opposite of an anti-diabetic action, which is why glucagon agonism is balanced carefully against the incretin components in multi-agonist design.

## Desensitisation and trafficking

Like other GPCRs, these receptors are subject to agonist-induced phosphorylation, β-arrestin recruitment, internalisation and either recycling or degradation. The balance between sustained surface signalling and receptor downregulation is ligand-dependent, and differences in trafficking are one proposed reason that engineered agonists can outperform the native hormones beyond half-life alone [Müller et al., 2019](https://doi.org/10.1016/j.molmet.2019.09.010).

## Biased and balanced agonism

A single receptor can route signal through Gαs-cAMP and through β-arrestin pathways to different degrees; a ligand that favours one is termed "biased." Across the GIP/GLP-1/glucagon receptors, multi-agonist peptides are also tuned for relative potency at each receptor — the design space that distinguishes a balanced tri-agonist from one weighted toward, say, GIP. The first rationally designed monomeric GIP/GLP-1/glucagon triagonist established that a single sequence could integrate all three activities, and reported greater metabolic effects than mono-agonists in preclinical models [Finan et al., 2015](https://doi.org/10.1038/nm.3761).

## Why unimolecular multi-agonism

Combining receptor activities in one molecule — rather than co-dosing separate agonists — fixes the ratio of activities, simplifies pharmacokinetics, and lets a single albumin-binding modification confer a long half-life on the whole pharmacology. Tirzepatide is the proof of concept for the dual case, engineered from a GIP backbone and biased toward GIPR signalling [Coskun et al., 2018](https://doi.org/10.1016/j.molmet.2018.09.009). For researchers, these molecules are precise tools for dissecting how simultaneous, ratio-controlled receptor engagement reshapes downstream signalling.

These compounds are supplied for laboratory and research use only. Nothing here is medical advice or a recommendation for human use.

## References

1. [Campbell JE, Drucker DJ. Pharmacology, physiology, and mechanisms of incretin hormone action. Cell Metab. 2013;17(6):819–837.](https://doi.org/10.1016/j.cmet.2013.04.008)
2. [Müller TD, et al. Glucagon-like peptide 1 (GLP-1). Mol Metab. 2019;30:72–130.](https://doi.org/10.1016/j.molmet.2019.09.010)
3. [Drucker DJ. Mechanisms of action and therapeutic application of glucagon-like peptide-1. Cell Metab. 2018;27(4):740–756.](https://doi.org/10.1016/j.cmet.2018.03.001)
4. [Finan B, et al. A rationally designed monomeric peptide triagonist corrects obesity and diabetes in rodents. Nat Med. 2015;21(1):27–36.](https://doi.org/10.1038/nm.3761)
5. [Coskun T, et al. LY3298176, a novel dual GIP and GLP-1 receptor agonist for the treatment of type 2 diabetes mellitus. Mol Metab. 2018;18:3–14.](https://doi.org/10.1016/j.molmet.2018.09.009)`,
  },
  {
    slug: "amylin-agonists-combination-research",
    title: "Amylin Agonists and Combination Metabolic Research",
    excerpt:
      "Amylin receptor pharmacology, the long-acting analogue cagrilintide, and why amylin–incretin combinations are a defining theme of 2026 metabolic studies.",
    category: "Research",
    publishedOn: "2026-06-12",
    readingMinutes: 8,
    body: `Most of the metabolic-peptide conversation focuses on the incretins, but a parallel axis — amylin — has moved to the centre of combination research. This primer covers amylin receptor pharmacology and the rationale for pairing amylin agonists with GLP-1 agonists, strictly as background for laboratory research and not as guidance for human use.

## Amylin and its receptors

Amylin (islet amyloid polypeptide, IAPP) is a 37-residue peptide co-secreted with insulin from β-cells. Its physiological actions — slowing gastric emptying, suppressing glucagon secretion and promoting satiety via the area postrema — complement those of insulin. Pharmacologically, the amylin receptors are not standalone GPCRs but heterodimers: the calcitonin receptor (CTR) in complex with receptor-activity-modifying proteins (RAMP1/2/3) yields the AMY1–3 receptor subtypes, with signalling routed largely through Gαs and cAMP [Hay et al., 2015](https://doi.org/10.1124/pr.115.010629). This receptor architecture is why amylin pharmacology is studied alongside, but distinctly from, the incretin receptors.

## Why native amylin is hard to work with

Human amylin is aggregation-prone and forms amyloid fibrils, which historically limited its use and motivated stabilised analogues. Pramlintide, an early non-aggregating analogue, established proof of concept; the current research focus is on long-acting molecules engineered for once-weekly pharmacokinetics [Hay et al., 2015](https://doi.org/10.1124/pr.115.010629).

## Cagrilintide

Cagrilintide is a long-acting amylin analogue engineered for extended half-life. In a dose-finding obesity trial the report described dose-dependent body-weight reductions as monotherapy over 26 weeks, with a tolerability profile dominated by gastrointestinal effects [Lau et al., 2021](https://doi.org/10.1016/S0140-6736(21)01751-7). As a single-axis comparator it underpins the combination work that follows.

## Combination with incretins

The mechanistic logic for combining an amylin agonist with a GLP-1 agonist is complementary appetite regulation through partly independent pathways. In an early-phase study the combination of cagrilintide with semaglutide ("CagriSema") produced greater weight reduction than either component, motivating a large Phase 3 programme [Enebo et al., 2021](https://doi.org/10.1016/S0140-6736(21)00845-X); those confirmatory trials are registered and ongoing [ClinicalTrials.gov NCT05567796](https://clinicaltrials.gov/study/NCT05567796). For researchers, amylin–incretin pairs are a model system for studying additivity versus synergy across distinct satiety pathways.

## Handling and characterisation

Amylin-class peptides share the general handling profile of other research peptides — lyophilised, stored cold and desiccated, reconstituted gently. Given the aggregation propensity of the native sequence, identity and purity confirmation (mass spectrometry plus RP-HPLC) against the batch COA is especially worth confirming before use.

These compounds are supplied for laboratory and research use only. Nothing here is medical advice or a recommendation for human use.

## References

1. [Hay DL, et al. Amylin: pharmacology, physiology, and clinical potential. Pharmacol Rev. 2015;67(3):564–600.](https://doi.org/10.1124/pr.115.010629)
2. [Lau DCW, et al. Once-weekly cagrilintide for weight management in people with overweight and obesity: a multicentre, randomised, double-blind, placebo-controlled, dose-finding phase 2 trial. Lancet. 2021;398(10317):2160–2172.](https://doi.org/10.1016/S0140-6736(21)01751-7)
3. [Enebo LB, et al. Safety, tolerability, pharmacokinetics, and pharmacodynamics of concomitant administration of multiple doses of cagrilintide with semaglutide 2.4 mg for weight management: a randomised, controlled, phase 1b trial. Lancet. 2021;397(10286):1736–1748.](https://doi.org/10.1016/S0140-6736(21)00845-X)
4. [CagriSema REDEFINE phase 3 programme. ClinicalTrials.gov NCT05567796.](https://clinicaltrials.gov/study/NCT05567796)`,
  },
];

// ---------------------------------------------------------------------------
// PLACEHOLDER sample reviews. These are seed/demo content so the reviews UI is
// populated in development. They are first-party sample data — NOT real
// customer testimonials. Replace with genuine, order-verified reviews before
// going live; publishing fabricated reviews is unlawful in the EU (UCPD/DSA)
// and under the FTC. Reviews are deliberately scoped to research-relevant
// aspects (purity vs. COA, reconstitution, packaging, shipping) and make no
// human-use claims.
// ---------------------------------------------------------------------------
export const reviews: Review[] = [
  { productName: "Tirzepatide", author: "M. Hoffmann", rating: 5, verified: true, date: "2026-05-28", title: "Matched the COA", body: "Re-ran HPLC in-house and measured 99.0% — consistent with the published batch report. Lyophilised cake intact, vial well sealed." },
  { productName: "Tirzepatide", author: "Lab procurement", rating: 5, verified: true, date: "2026-05-12", title: "Clean reconstitution", body: "Dissolved clear in bacteriostatic water, no cloudiness or residue. Cold-packed and the batch number matched the COA vault." },
  { productName: "Tirzepatide", author: "R. Novak", rating: 4, verified: true, date: "2026-04-30", title: "Solid, fast shipping", body: "Tracked EU delivery in three days, discreet packaging. Mass-spec identity confirmed in our lab." },
  { productName: "Retatrutide", author: "Dr. A. Berger", rating: 5, verified: true, date: "2026-06-02", title: "Excellent purity", body: "Independent HPLC came back 99.2%. Documentation and batch traceability were exactly what we need for reproducible work." },
  { productName: "Retatrutide", author: "K. Fischer", rating: 5, verified: true, date: "2026-05-18", title: "Well handled", body: "Arrived cold, lyophilised powder intact. COA was already public before I ordered — appreciated the transparency." },
  { productName: "Retatrutide", author: "S. Marsh", rating: 4, verified: false, date: "2026-05-05", title: "Good experience", body: "Reconstituted cleanly. Slightly slow to restock the 30mg but quality is consistent." },
  { productName: "BPC-157", author: "T. Lang", rating: 5, verified: true, date: "2026-05-22", title: "Consistent batches", body: "Third order, purity matched the COA each time (99.4–99.6%). Stable in solution as expected." },
  { productName: "BPC-157", author: "Uni lab, Vienna", rating: 5, verified: true, date: "2026-04-19", title: "Reliable supplier", body: "Batch number tied straight back to the COA. Sealed vials, good cold-chain packaging." },
  { productName: "BPC-157", author: "J. Weber", rating: 4, verified: true, date: "2026-04-02", title: "As described", body: "Dissolved fully, no particulates. Shipping was quick within the EU." },
  { productName: "TB-500", author: "P. Andersson", rating: 5, verified: true, date: "2026-05-09", title: "Identity confirmed", body: "Mass-spec matched the target mass within tolerance. Clean lyophilised cake." },
  { productName: "TB-500", author: "R. Costa", rating: 4, verified: false, date: "2026-03-28", title: "Good purity", body: "HPLC trace was a single sharp peak. Packaging could use more padding but product was fine." },
  { productName: "GHK-Cu (Copper Peptide)", author: "Dr. L. Moreau", rating: 5, verified: true, date: "2026-05-30", title: "True blue complex", body: "Distinct blue powder, dissolved cleanly. Purity matched the published COA — using it as a matrix-research reference." },
  { productName: "GHK-Cu (Copper Peptide)", author: "C. Bauer", rating: 5, verified: true, date: "2026-04-25", title: "Great handling", body: "Protected from light in the packaging, copper complex stable. Batch traceability was clear." },
  { productName: "Semaglutide", author: "N. Ito", rating: 5, verified: true, date: "2026-05-15", title: "Good comparator stock", body: "Use it as a GLP-1 reference; purity consistent with the COA at 99.3%. Fast dispatch." },
  { productName: "Semaglutide", author: "H. Dubois", rating: 4, verified: true, date: "2026-04-11", title: "Reliable", body: "Reconstituted clear, no issues. COA available before purchase." },
  { productName: "MOTS-c", author: "G. Romano", rating: 5, verified: true, date: "2026-05-03", title: "Clean material", body: "Single dominant HPLC peak, dissolved without residue. Good for mitochondrial-pathway work." },
  { productName: "CJC-1295 + Ipamorelin", author: "D. Klein", rating: 5, verified: true, date: "2026-05-20", title: "Consistent blend", body: "Blend ratio as stated, purity matched the COA. Cold-packed and quick." },
  { productName: "CJC-1295 + Ipamorelin", author: "F. Santos", rating: 4, verified: false, date: "2026-04-08", title: "Solid", body: "Reconstituted cleanly. Would like a larger size option." },
  { productName: "Cagrilintide", author: "Dr. E. Wagner", rating: 5, verified: true, date: "2026-05-26", title: "High purity amylin", body: "98.9% on our HPLC, matched the batch COA. Good for combination metabolic research." },
  { productName: "Selank", author: "V. Petrov", rating: 5, verified: true, date: "2026-05-07", title: "Clean nootropic peptide", body: "Identity confirmed, dissolved fully. Fast, discreet EU shipping." },
  { productName: "Semax", author: "A. Lindgren", rating: 4, verified: true, date: "2026-04-21", title: "Good quality", body: "Single sharp HPLC peak, matched COA. Packaging well sealed." },
  { productName: "GLOW Blend (BPC-157 / TB-500 / GHK-Cu)", author: "Recovery research lab", rating: 5, verified: true, date: "2026-05-24", title: "Convenient combination", body: "Three-component blend saved us prep time. Components dissolved cleanly; COA covered the blend." },
];

export const AVERAGE_PURITY =
  Math.round(
    (coas.reduce((sum, c) => sum + c.purity, 0) / coas.length) * 10,
  ) / 10;
