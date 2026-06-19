// Generate 3 style variants of one product vial for the user to choose from.
// Nano Banana 2 (flash). Output: public/products/_options/<base>-A|B|C.png
//   node --env-file=.env scripts/gen-variants.mjs

import { writeFileSync, mkdirSync } from "node:fs";

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) { console.error("GEMINI_API_KEY missing"); process.exit(1); }
const MODEL = process.env.IMG_MODEL || "gemini-3.1-flash-image";
const OUT = "public/products/_options";
mkdirSync(OUT, { recursive: true });

const BRAND = "VERUM BIOLABS";
const NAME = "Tirzepatide";

// Compact, clinical PHARMA label covering only the lower-middle third of the vial.
const BASE = `Ultra-realistic professional pharmaceutical product photograph, studio quality, 1:1 square.
A single small clear glass research vial with a brushed-aluminium crimp cap and a grey rubber stopper, standing upright and centered. It contains only a SMALL amount of fine white lyophilised peptide powder — a thin layer resting at the very bottom of the vial.
On the vial is a clean, slim clinical pharmaceutical label. IMPORTANT: the powder must stay ENTIRELY BELOW the label — the powder line sits beneath the bottom edge of the label, so NO powder shows above or behind the label. Above the label is empty, perfectly clear glass. The label itself is crisp and unobstructed (nothing overlapping it). The label is compact, wider than it is tall, with a thin printed border (boxed pharma layout).
Clinical label content, crisp clean sans-serif, perfectly legible, no spelling mistakes:
- top: small uppercase wordmark "${BRAND}" with a thin emerald-green rule under it
- the product name "${NAME}" in clear medical sans-serif, bold
- a tiny data row: "Lot TRZ-2601    HPLC >=99%    Store -20C"
- a small real barcode at the bottom corner
- tiny uppercase regulatory fine print "FOR RESEARCH USE ONLY - NOT FOR HUMAN CONSUMPTION"
Sterile clinical white label, black text, a single restrained emerald-green (#15623c) accent. Looks like a real prescription/pharmaceutical vial label. Premium pharma e-commerce product photography, sharp focus, high detail. No hands, no extra objects, no watermark, no text other than the label.`;

const STYLES = {
  A: `Background: seamless warm cream (#f6f5f1) studio sweep. Soft, even warm daylight, gentle natural reflection beneath the vial, airy and clean but warm — not clinical.`,
  B: `Background: warm cream (#f6f5f1) with a soft, out-of-focus botanical leaf shadow gently falling across the surface for an organic, living feel. Warm directional sunlight, soft shadows.`,
  C: `Background: refined warm taupe-to-cream gradient, moody editorial lighting with a soft side key light and elegant falloff, subtle premium reflection. Luxury apothecary mood.`,
};

async function gen(letter, style) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "x-goog-api-key": KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: `${BASE}\n${style}` }] }] }),
  });
  if (!res.ok) { console.error(`${letter}: HTTP ${res.status}`, (await res.text()).slice(0, 160)); return; }
  const json = await res.json();
  const img = (json?.candidates?.[0]?.content?.parts ?? []).find((p) => p.inlineData?.data);
  if (!img) { console.error(`${letter}: no image`); return; }
  const path = `${OUT}/tirzepatide-${letter}.png`;
  writeFileSync(path, Buffer.from(img.inlineData.data, "base64"));
  console.log(`saved ${path}`);
}

const only = process.argv[2]?.toUpperCase();
for (const [letter, style] of Object.entries(STYLES)) {
  if (only && letter !== only) continue;
  await gen(letter, style);
  await new Promise((r) => setTimeout(r, 1200));
}
console.log("done");
