// Generate photoreal product vial images with a professionally designed
// VERUM Biolabs label via Gemini (Nano Banana Pro). One image per product
// group (size-independent); the mg is shown as a UI badge over the photo.
//
//   node --env-file=.env scripts/generate-product-photos.mjs            # all
//   node --env-file=.env scripts/generate-product-photos.mjs tirzepatide # one
//
// Writes public/products/<base>.png and public/products/manifest.json.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";

// The Pro image model can take ~1–2 min per render; raise undici's header/body
// timeouts so the request isn't killed early.
try {
  const { Agent, setGlobalDispatcher } = await import("undici");
  setGlobalDispatcher(new Agent({ headersTimeout: 600000, bodyTimeout: 600000 }));
} catch {
  // undici not importable — fall back to default fetch timeouts
}

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) { console.error("GEMINI_API_KEY missing"); process.exit(1); }

const MODEL = process.env.IMG_MODEL || "gemini-3-pro-image";
const OUT = "public/products";
mkdirSync(OUT, { recursive: true });

// ---- derive the product groups from the seed data (no TS needed) ----------
const data = readFileSync("src/lib/data.ts", "utf8");
// pull each catalog group: base, name, purity, coaBatch
const groups = [];
const re = /base:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?purity:\s*([\d.]+)[\s\S]*?(?:coaBatch:\s*"([^"]+)")?[\s\S]*?sizes:/g;
let m;
while ((m = re.exec(data)) !== null) {
  groups.push({ base: m[1], name: m[2], purity: m[3], batch: m[4] || "" });
}

const only = process.argv[2];
const targets = only ? groups.filter((g) => g.base === only) : groups;
if (targets.length === 0) { console.error("no matching groups", only); process.exit(1); }

const isBlue = (name) => /ghk/i.test(name);
const isSupply = (name) => /water/i.test(name);

function prompt(g) {
  const powder = isBlue(g.name)
    ? "fine pale sky-blue lyophilised copper-peptide powder"
    : "fine white lyophilised peptide powder";
  const fill = isSupply(g.name) ? "clear sterile liquid" : powder;
  const specLine = g.batch ? `HPLC ${g.purity}%   Lot ${g.batch}` : `Research grade`;
  return `Ultra-realistic professional pharmaceutical product photograph, studio quality, 1:1 square.
A single small clear glass research vial with a brushed-aluminium crimp cap, standing upright and centered, containing ${fill}.
On the vial is a beautifully designed, minimalist premium pharmaceutical label, perfectly straight and crisp:
- top: a small emerald-green uppercase wordmark "VERUM BIOLABS" with a tiny check-mark logo
- center: the product name "${g.name}" in an elegant dark serif, large and legible
- a thin emerald-green horizontal accent rule
- a small monospaced line: "${specLine}"
- bottom: small uppercase fine print "FOR RESEARCH USE ONLY"
The label is white with emerald-green (#15623c) accents, professionally typeset, clean kerning, fully legible, no spelling mistakes.
Soft, even studio lighting with a gentle reflection beneath the vial, shallow depth of field, seamless warm off-white (#f6f5f1) background.
High detail, sharp focus, photorealistic, premium e-commerce product photography. No hands, no extra objects, no watermark, no text other than the label described.`;
}

async function gen(g) {
  const out = `${OUT}/${g.base}.png`;
  if (existsSync(out) && !only) { console.log(`skip ${g.base} (exists)`); return g.base; }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "x-goog-api-key": KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt(g) }] }] }),
  });
  if (!res.ok) { console.error(`${g.base}: HTTP ${res.status}`, (await res.text()).slice(0, 200)); return null; }
  const json = await res.json();
  const parts = json?.candidates?.[0]?.content?.parts ?? [];
  const img = parts.find((p) => p.inlineData?.data);
  if (!img) { console.error(`${g.base}: no image`, JSON.stringify(json).slice(0, 200)); return null; }
  writeFileSync(out, Buffer.from(img.inlineData.data, "base64"));
  console.log(`saved ${out}`);
  return g.base;
}

console.log(`model=${MODEL} groups=${targets.length}`);
const done = [];
for (const g of targets) {
  const r = await gen(g);
  if (r) done.push(r);
  await new Promise((res) => setTimeout(res, 1200)); // gentle pacing
}

// merge into manifest
const manifestPath = `${OUT}/manifest.json`;
let manifest = [];
if (existsSync(manifestPath)) { try { manifest = JSON.parse(readFileSync(manifestPath, "utf8")); } catch {} }
manifest = [...new Set([...manifest, ...done])].sort();
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`manifest: ${manifest.length} images`);
