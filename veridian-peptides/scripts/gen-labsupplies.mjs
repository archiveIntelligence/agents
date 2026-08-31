// House-style product photos for the Lab Supplies category (syringes, vials,
// pads, pen, kit). Same art direction as the vials (warm cream, soft botanical
// shadow, restrained emerald accent) so the catalogue stays coherent. 1:1 square
// to match the product cards. Output: public/products/<base>.png
//
//   node --env-file=.env scripts/gen-labsupplies.mjs            # all (skips existing)
//   node --env-file=.env scripts/gen-labsupplies.mjs insulin-syringes
//   FORCE=1 node --env-file=.env scripts/gen-labsupplies.mjs

import { writeFileSync, mkdirSync, existsSync } from "node:fs";

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) { console.error("GEMINI_API_KEY missing"); process.exit(1); }
const MODEL = process.env.IMG_MODEL || "gemini-3.1-flash-image";
const FORCE = !!process.env.FORCE;
const OUT = "public/products";
mkdirSync(OUT, { recursive: true });

const LOOK =
`Ultra-realistic professional pharmaceutical product photograph, studio quality, 1:1 square.
Art direction: seamless warm cream (#f6f5f1) surface and backdrop, a soft out-of-focus botanical leaf shadow falling gently across the scene, warm directional daylight with soft shadows, a single restrained emerald-green (#15623c) accent detail, brushed-aluminium and clear-glass highlights. Clean, airy, premium pharma e-commerce still life, sharp focus, fine detail, natural reflection beneath the objects.
Centered composition. Absolutely NO text, NO lettering, NO printed labels, NO logos, NO watermark, NO hands or people.`;

const ITEMS = {
  "insulin-syringes":
    "A few sterile single-use insulin syringes with very fine needles and clear barrels, neatly arranged, one slightly in front, plungers visible.",
  "luer-lock-syringes":
    "Two clear 3 ml luer-lock syringes with detachable needles lying neatly side by side, clean and clinical.",
  "empty-sterile-vials":
    "A small cluster of empty clear 10 ml borosilicate glass vials with grey rubber stoppers and brushed-aluminium crimp caps, standing upright, no powder inside.",
  "alcohol-prep-pads":
    "A small neat stack of individually wrapped square foil alcohol-prep sachets (plain unmarked silver foil), with one opened sachet showing the folded white pad.",
  "empty-peptide-pen":
    "A single sleek refillable dosing pen with a brushed-metal dial and clear cartridge window, lying at a slight angle, premium medical-device look.",
  "reconstitution-kit":
    "An elegant flat-lay reconstitution kit neatly arranged: one clear glass vial of clear liquid, two insulin syringes, two empty stoppered glass vials and a couple of plain silver foil prep sachets.",
};

async function gen(base, subject) {
  const out = `${OUT}/${base}.png`;
  if (existsSync(out) && !FORCE) { console.log(`skip ${out}`); return out; }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
  const prompt = `${LOOK}\nScene: ${subject}`;
  for (let attempt = 1; attempt <= 8; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "x-goog-api-key": KEY, "Content-Type": "application/json" },
        signal: AbortSignal.timeout(90000),
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "1:1" } },
        }),
      });
      if (res.status === 503 || res.status === 429) { console.log(`${base}: ${res.status}, retry ${attempt}`); await new Promise(r => setTimeout(r, 12000)); continue; }
      if (!res.ok) { console.error(`${base}: HTTP ${res.status}`, (await res.text()).slice(0, 160)); return null; }
      const json = await res.json();
      const img = (json?.candidates?.[0]?.content?.parts ?? []).find((p) => p.inlineData?.data);
      if (!img) { console.error(`${base}: no image, retry ${attempt}`); await new Promise(r => setTimeout(r, 5000)); continue; }
      writeFileSync(out, Buffer.from(img.inlineData.data, "base64"));
      console.log(`saved ${out}`);
      return out;
    } catch (e) {
      console.log(`${base}: ${e?.name || e} (timeout/network), retry ${attempt}`);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
  console.error(`${base}: gave up after retries`);
  return null;
}

const only = process.argv[2];
const targets = only ? [[only, ITEMS[only]]] : Object.entries(ITEMS);
console.log(`model=${MODEL} targets=${targets.length}`);
for (const [base, subject] of targets) {
  if (!subject) { console.error(`unknown base ${base}`); continue; }
  await gen(base, subject);
  await new Promise(r => setTimeout(r, 2500));
}
console.log("done");
