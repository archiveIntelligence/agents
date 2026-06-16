// Upgrade existing editorial imagery (blog covers + category banners) in place
// via image-to-image: keep each scene EXACTLY as-is, but thread in subtle lilac /
// soft-violet accents so the imagery matches the more-lilac hero. Only writes on
// success, so a failed generation leaves the original untouched.
//
//   node --env-file=.env scripts/gen-lilac.mjs            # all blog + categories
//   node --env-file=.env scripts/gen-lilac.mjs blog/reading-a-coa.png

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) { console.error("GEMINI_API_KEY missing"); process.exit(1); }
const MODEL = process.env.IMG_MODEL || "gemini-3.1-flash-image";

const PROMPT = `Keep this photograph's composition, subject, framing, lighting, depth of field and warm cream (#f6f5f1) background EXACTLY the same — do not move or change the existing objects.
Thread in subtle, elegant LILAC / soft-violet accents so the image has a gentle violet note: e.g. a faint lavender tint in the soft light and shadows, a few small out-of-focus lilac/lavender flower petals or sprigs in the background, and a soft violet gradient glow in one corner. Keep it tasteful and restrained, complementing (not replacing) the existing emerald-green accent.
Photorealistic, identical aspect ratio. Absolutely NO text, NO lettering, NO logos, NO watermark, NO human faces or hands.`;

async function edit(path) {
  if (!existsSync(path)) { console.error(`missing ${path}`); return null; }
  const b64 = readFileSync(path).toString("base64");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
  for (let attempt = 1; attempt <= 8; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "x-goog-api-key": KEY, "Content-Type": "application/json" },
        signal: AbortSignal.timeout(90000),
        body: JSON.stringify({
          contents: [{ parts: [{ inlineData: { mimeType: "image/png", data: b64 } }, { text: PROMPT }] }],
          generationConfig: { responseModalities: ["IMAGE"] },
        }),
      });
      if (res.status === 503 || res.status === 429) { console.log(`${path}: ${res.status}, retry ${attempt}`); await new Promise(r => setTimeout(r, 8000)); continue; }
      if (!res.ok) { console.error(`${path}: HTTP ${res.status}`, (await res.text()).slice(0, 160)); return null; }
      const json = await res.json();
      const img = (json?.candidates?.[0]?.content?.parts ?? []).find((p) => p.inlineData?.data);
      if (!img) { console.error(`${path}: no image, retry ${attempt}`); await new Promise(r => setTimeout(r, 4000)); continue; }
      writeFileSync(path, Buffer.from(img.inlineData.data, "base64"));
      console.log(`upgraded ${path}`);
      return path;
    } catch (e) {
      console.log(`${path}: ${e?.name || e} (timeout/network), retry ${attempt}`);
      await new Promise(r => setTimeout(r, 4000));
    }
  }
  console.error(`${path}: gave up after retries`);
  return null;
}

const one = process.argv[2];
let targets;
if (one) {
  targets = [one.startsWith("public/") ? one : `public/${one}`];
} else {
  targets = [];
  for (const dir of ["public/blog", "public/categories"]) {
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir)) if (f.endsWith(".png")) targets.push(`${dir}/${f}`);
  }
}

console.log(`model=${MODEL} targets=${targets.length}`);
for (const t of targets) { await edit(t); await new Promise(r => setTimeout(r, 1500)); }
console.log("done");
