// Coherent product vials via image-to-image editing: one chosen master image
// is reused for every product, changing ONLY the printed name/lot (and powder
// colour for GHK-Cu) so all labels stay visually identical (style B).
//
//   node --env-file=.env scripts/gen-coherent.mjs retatrutide   # one
//   node --env-file=.env scripts/gen-coherent.mjs               # all (skips existing)

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) { console.error("GEMINI_API_KEY missing"); process.exit(1); }
const MODEL = process.env.IMG_MODEL || "gemini-3.1-flash-image";
const OUT = "public/products";
const MASTER = "public/products/_options/tirzepatide-B.png";
mkdirSync(OUT, { recursive: true });

const masterB64 = readFileSync(MASTER).toString("base64");

// ---- product groups from the seed data ----
const data = readFileSync("src/lib/data.ts", "utf8");
const groups = [];
const re = /base:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?purity:\s*([\d.]+)[\s\S]*?sizes:/g;
let m;
while ((m = re.exec(data)) !== null) {
  const block = data.slice(m.index, m.index + 600);
  const batch = (block.match(/coaBatch:\s*"([^"]+)"/) || [])[1] || "";
  groups.push({ base: m[1], name: m[2], purity: m[3], batch });
}

const only = process.argv[2];
const targets = only ? groups.filter((g) => g.base === only) : groups;

const isBlue = (name) => /ghk/i.test(name);
const isWater = (name) => /water/i.test(name);

function editPrompt(g) {
  const lot = g.batch || `${g.base.slice(0, 3).toUpperCase()}-0001`;
  if (isWater(g.name)) {
    const note = /bacteriostatic/i.test(g.name) ? "30 ml    0.9% Benzyl Alcohol" : "30 ml    Preservative-free";
    return `Reproduce this product photograph EXACTLY — identical clear glass vial, identical slim clinical label design, layout, fonts, the "VERUM BIOLABS" wordmark, the green accent rule, the barcode, identical cream background with the soft botanical leaf shadow, identical lighting, reflection and composition.
Change the contents to CLEAR STERILE LIQUID filling most of the vial (no powder). Change ONLY the printed label text:
- product name: "${g.name}"
- data row: "${note}"
Change the bottom fine print to "FOR LABORATORY USE ONLY". Keep everything else identical. Photorealistic, 1:1 square, no spelling mistakes, no extra text.`;
  }
  const colour = isBlue(g.name)
    ? "Change the lyophilised powder inside the vial to a pale sky-blue colour (copper-peptide). "
    : "Keep the lyophilised powder inside white. ";
  return `Reproduce this product photograph EXACTLY — identical clear glass vial, identical slim clinical label design, layout, fonts, the "VERUM BIOLABS" wordmark, the green accent rule, the barcode, identical cream background with the soft botanical leaf shadow, identical lighting, reflection and composition.
${colour}Change ONLY the printed label text:
- product name: "${g.name}"
- data row: "Lot ${lot}    HPLC >=${Math.floor(Number(g.purity))}%    Store -20C"
Keep "FOR RESEARCH USE ONLY - NOT FOR HUMAN CONSUMPTION" and everything else identical. Photorealistic, 1:1 square, no spelling mistakes, no extra text.`;
}

async function gen(g) {
  const out = `${OUT}/${g.base}.png`;
  if (existsSync(out) && !only) { console.log(`skip ${g.base}`); return g.base; }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
  for (let attempt = 1; attempt <= 8; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "x-goog-api-key": KEY, "Content-Type": "application/json" },
        signal: AbortSignal.timeout(90000), // abort a stalled request fast, then retry
        body: JSON.stringify({
          contents: [{
            parts: [
              { inlineData: { mimeType: "image/png", data: masterB64 } },
              { text: editPrompt(g) },
            ],
          }],
        }),
      });
      if (res.status === 503 || res.status === 429) { console.log(`${g.base}: ${res.status}, retry ${attempt}`); await new Promise(r => setTimeout(r, 8000)); continue; }
      if (!res.ok) { console.error(`${g.base}: HTTP ${res.status}`, (await res.text()).slice(0, 140)); return null; }
      const json = await res.json();
      const img = (json?.candidates?.[0]?.content?.parts ?? []).find((p) => p.inlineData?.data);
      if (!img) { console.error(`${g.base}: no image, retry ${attempt}`); await new Promise(r => setTimeout(r, 4000)); continue; }
      writeFileSync(out, Buffer.from(img.inlineData.data, "base64"));
      console.log(`saved ${out}`);
      return g.base;
    } catch (e) {
      console.log(`${g.base}: ${e?.name || e} (timeout/network), retry ${attempt}`);
      await new Promise(r => setTimeout(r, 4000));
    }
  }
  console.error(`${g.base}: gave up after retries`);
  return null;
}

console.log(`model=${MODEL} master=${MASTER} targets=${targets.length}`);
const done = [];
for (const g of targets) { const r = await gen(g); if (r) done.push(r); await new Promise(r => setTimeout(r, 1500)); }

// tirzepatide is the master itself
if (!only || only === "tirzepatide") { writeFileSync(`${OUT}/tirzepatide.png`, readFileSync(MASTER)); done.push("tirzepatide"); console.log("saved (copy) tirzepatide.png"); }

const manifestPath = `${OUT}/manifest.json`;
let manifest = [];
if (existsSync(manifestPath)) { try { manifest = JSON.parse(readFileSync(manifestPath, "utf8")); } catch {} }
manifest = [...new Set([...manifest, ...done])].sort();
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`manifest: ${manifest.length} images`);
