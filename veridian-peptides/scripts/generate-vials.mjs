// One-off: generate photoreal base vial images via Gemini (Nano Banana).
// Labels are added programmatically on top, so these renders carry a BLANK
// label. Reads GEMINI_API_KEY from the environment.
//
// Usage: node --env-file=.env scripts/generate-vials.mjs

import { writeFileSync, mkdirSync } from "node:fs";

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) {
  console.error("GEMINI_API_KEY missing");
  process.exit(1);
}

const MODEL = "gemini-2.5-flash-image";
const OUT_DIR = "public/vials";
mkdirSync(OUT_DIR, { recursive: true });

const targets = [
  {
    file: "base-white.png",
    prompt:
      "Professional studio product photograph of a single small clear glass laboratory vial containing white lyophilized peptide powder, sealed with a silver aluminium crimp cap. A blank, plain white rectangular label on the front with NO text. The vial is centered and vertical in the frame. Soft, even studio lighting with a subtle soft reflection beneath it. Clean minimal seamless warm off-white background (hex #faf9f5). Photorealistic, high detail, sharp focus, pharmaceutical product photography. No text, no logos, no watermark.",
  },
  {
    file: "base-blue.png",
    prompt:
      "Professional studio product photograph of a single small clear glass laboratory vial containing pale blue lyophilized copper-peptide powder (GHK-Cu), sealed with a silver aluminium crimp cap. A blank, plain white rectangular label on the front with NO text. The vial is centered and vertical in the frame. Soft, even studio lighting with a subtle soft reflection beneath it. Clean minimal seamless warm off-white background (hex #faf9f5). Photorealistic, high detail, sharp focus, pharmaceutical product photography. No text, no logos, no watermark.",
  },
];

async function gen({ file, prompt }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "x-goog-api-key": KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });
  if (!res.ok) {
    console.error(`${file}: HTTP ${res.status}`, (await res.text()).slice(0, 300));
    return false;
  }
  const json = await res.json();
  const parts = json?.candidates?.[0]?.content?.parts ?? [];
  const img = parts.find((p) => p.inlineData?.data);
  if (!img) {
    console.error(`${file}: no image in response`, JSON.stringify(json).slice(0, 300));
    return false;
  }
  writeFileSync(`${OUT_DIR}/${file}`, Buffer.from(img.inlineData.data, "base64"));
  console.log(`saved ${OUT_DIR}/${file} (${img.inlineData.mimeType})`);
  return true;
}

let ok = true;
for (const t of targets) ok = (await gen(t)) && ok;
process.exit(ok ? 0 : 1);
