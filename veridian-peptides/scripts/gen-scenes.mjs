// Editorial / atmospheric website imagery (blog covers + category banners) via
// Nano Banana 2 (text-to-image). One coherent art direction across all scenes so
// the site feels like one brand: warm cream surface, soft botanical leaf shadow,
// restrained emerald accent, premium apothecary-biotech still life. NO text, NO
// logos, NO readable labels, NO human faces.
//
//   node --env-file=.env scripts/gen-scenes.mjs            # all (skips existing)
//   node --env-file=.env scripts/gen-scenes.mjs blog reading-a-coa
//   node --env-file=.env scripts/gen-scenes.mjs category recovery
//   FORCE=1 node --env-file=.env scripts/gen-scenes.mjs     # re-render everything

import { writeFileSync, mkdirSync, existsSync } from "node:fs";

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) { console.error("GEMINI_API_KEY missing"); process.exit(1); }
const MODEL = process.env.IMG_MODEL || "gemini-3.1-flash-image";
const FORCE = !!process.env.FORCE;

// Shared art direction — prepended to every subject so the whole set is coherent.
const LOOK = (ratio) =>
`Premium editorial product/still-life photograph for a scientific peptide brand, ${ratio} aspect ratio.
Art direction: warm cream (#f6f5f1) seamless surface and backdrop, soft out-of-focus botanical leaf shadow falling gently across the scene, warm directional daylight with soft shadows, a single restrained emerald-green (#15623c) accent, occasional brushed-aluminium / clear-glass detail. Clean, airy, calm, expensive — apothecary meets modern biotech lab. Shallow depth of field, sharp focus on the subject, fine detail, natural reflections.
Strictly NO text, NO lettering, NO printed labels, NO logos, NO watermark, NO human faces or hands. No clutter.`;

// 16:9 blog covers.
const BLOG = {
  "metabolic-peptide-landscape-2026":
    "A clear glass laboratory flask and a small abstract 3D ball-and-stick peptide molecule model resting on the cream surface, a single fresh green leaf nearby.",
  "bpc-157-tb-500-repair":
    "Two small clear unlabeled glass research vials beside fresh vivid green botanical leaves with a single dew droplet, a regeneration / tissue-repair mood.",
  "ghk-cu-copper-peptide":
    "A clear glass vial holding a luminous sky-blue copper-peptide solution, a few blue crystalline grains scattered on the cream surface, soft botanical shadow.",
  "reading-a-coa":
    "A sheet of cream paper showing an abstract printed HPLC chromatogram (smooth peaks, no readable text) under a glass magnifier, a clear vial out of focus behind.",
  "reconstitution-basics":
    "A clear glass syringe drawing clear liquid from a small unlabeled clear glass vial of white lyophilised powder, calm clinical still life, soft botanical shadow.",
  "choosing-a-supplier":
    "A neat row of identical small clear unlabeled glass research vials with white powder, one slightly forward in focus, a magnifier nearby, sense of careful quality.",
  "incretin-receptor-pharmacology":
    "An elegant abstract sculpture of a cell-membrane receptor: fine emerald and gold filaments / molecular threads weaving through a translucent surface, scientific and minimal.",
  "amylin-agonists-combination-research":
    "Two clear glass beakers of faintly tinted clear solution side by side with a delicate 3D molecular model between them, combination-research mood, botanical shadow.",
};

// 4:3 category banners.
const CATEGORY = {
  metabolic:
    "Clear laboratory glassware (a flask and a beaker) with a small abstract metabolic molecule model, warm and clean, a single green leaf.",
  recovery:
    "Fresh vivid green botanical leaves with glistening dew droplets beside a single clear unlabeled glass vial, a calm regeneration mood.",
  cellular:
    "An abstract microscopy-inspired pattern of soft translucent cells with delicate copper-blue accents, a single droplet catching light, longevity mood.",
  neuro:
    "An abstract minimal neural network of fine glowing emerald filaments and soft nodes floating above the cream surface, calm and cerebral.",
  growth:
    "A single fresh green seedling sprouting beside clear laboratory glass and a faint DNA-helix motif, growth-factor mood, warm light.",
  "lab-supplies":
    "Clean sterile laboratory consumables — clear glass water vials, a glass syringe and a brushed-aluminium cap — arranged minimally, very clean and clinical-but-warm.",
};

async function gen(out, ratio, subject) {
  if (existsSync(out) && !FORCE) { console.log(`skip ${out}`); return out; }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
  const prompt = `${LOOK(ratio)}\nScene: ${subject}`;
  for (let attempt = 1; attempt <= 8; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "x-goog-api-key": KEY, "Content-Type": "application/json" },
        signal: AbortSignal.timeout(90000),
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: ratio } },
        }),
      });
      if (res.status === 503 || res.status === 429) { console.log(`${out}: ${res.status}, retry ${attempt}`); await new Promise(r => setTimeout(r, 8000)); continue; }
      if (!res.ok) { console.error(`${out}: HTTP ${res.status}`, (await res.text()).slice(0, 160)); return null; }
      const json = await res.json();
      const img = (json?.candidates?.[0]?.content?.parts ?? []).find((p) => p.inlineData?.data);
      if (!img) { console.error(`${out}: no image, retry ${attempt}`); await new Promise(r => setTimeout(r, 4000)); continue; }
      writeFileSync(out, Buffer.from(img.inlineData.data, "base64"));
      console.log(`saved ${out}`);
      return out;
    } catch (e) {
      console.log(`${out}: ${e?.name || e} (timeout/network), retry ${attempt}`);
      await new Promise(r => setTimeout(r, 4000));
    }
  }
  console.error(`${out}: gave up after retries`);
  return null;
}

mkdirSync("public/blog", { recursive: true });
mkdirSync("public/categories", { recursive: true });

const [kind, key] = process.argv.slice(2);
const jobs = [];
if (!kind || kind === "blog") {
  for (const [slug, subj] of Object.entries(BLOG)) {
    if (key && slug !== key) continue;
    jobs.push(["public/blog/" + slug + ".png", "16:9", subj]);
  }
}
if (!kind || kind === "category") {
  for (const [slug, subj] of Object.entries(CATEGORY)) {
    if (key && slug !== key) continue;
    jobs.push(["public/categories/" + slug + ".png", "4:3", subj]);
  }
}

console.log(`model=${MODEL} jobs=${jobs.length}`);
for (const [out, ratio, subj] of jobs) { await gen(out, ratio, subj); await new Promise(r => setTimeout(r, 1500)); }
console.log("done");
