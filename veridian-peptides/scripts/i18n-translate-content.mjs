// Auto-translate data-driven content (categories, products, blog) into every
// supported locale via the Gemini text model, producing per-locale overlays in
// src/lib/i18n/content/<locale>.json (consumed by src/lib/i18n/localize.ts).
//
// Run with tsx so it can import the TS dataset directly:
//   node_modules/.bin/tsx scripts/i18n-translate-content.mjs            # all locales, missing keys
//   FORCE=1 node_modules/.bin/tsx scripts/i18n-translate-content.mjs    # re-translate everything
//   node_modules/.bin/tsx scripts/i18n-translate-content.mjs es fr      # only these locales
//   NO_BODIES=1 ...                                                     # skip long blog bodies
//
// English is the source; product compound NAMES are never translated.

import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from "node:fs";
import { categories, products, blogPosts } from "../src/lib/data.ts";

try { process.loadEnvFile(".env"); } catch { /* env may already be set */ }
// Provider switch: prefer OpenAI when OPENAI_API_KEY is present, else Gemini.
// Lets translation run even when one provider's billing is exhausted.
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!GEMINI_KEY && !OPENAI_KEY) { console.error("Set GEMINI_API_KEY or OPENAI_API_KEY"); process.exit(1); }
const PROVIDER = process.env.TRANSLATE_PROVIDER || (OPENAI_KEY ? "openai" : "gemini");
const MODEL = PROVIDER === "openai"
  ? (process.env.OPENAI_MODEL || "gpt-4o-mini")
  : (process.env.TEXT_MODEL || "gemini-flash-latest");
const FORCE = !!process.env.FORCE;
const NO_BODIES = !!process.env.NO_BODIES;
const DIR = "src/lib/i18n/content";
mkdirSync(DIR, { recursive: true });

const LANGS = {
  de: "German", es: "Spanish", fr: "French", it: "Italian", pt: "Portuguese",
  nl: "Dutch", pl: "Polish", sv: "Swedish", el: "Greek", uk: "Ukrainian",
  ru: "Russian", tr: "Turkish", ar: "Arabic", fa: "Persian (Farsi)", ur: "Urdu",
  hi: "Hindi", bn: "Bengali", zh: "Simplified Chinese", ja: "Japanese",
  ko: "Korean", vi: "Vietnamese", th: "Thai", id: "Indonesian",
};

// ---- build the English source maps ----------------------------------------
const shortSrc = {}; // id:field -> en text (short strings, one batch per locale)
for (const c of categories) {
  shortSrc[`cat:${c.slug}:name`] = c.name;
  shortSrc[`cat:${c.slug}:description`] = c.description;
}
const seen = new Set();
for (const p of products) {
  if (seen.has(p.name)) continue;
  seen.add(p.name);
  shortSrc[`prod:${p.name}:tagline`] = p.tagline;
  shortSrc[`prod:${p.name}:description`] = p.description;
}
for (const b of blogPosts) {
  shortSrc[`blog:${b.slug}:title`] = b.title;
  shortSrc[`blog:${b.slug}:excerpt`] = b.excerpt;
}
// Long blog bodies translated one-by-one (separate calls, larger output).
const bodySrc = {};
for (const b of blogPosts) if (b.body) bodySrc[`blog:${b.slug}:body`] = b.body;

const RULES = (lang) =>
`You are a professional localizer for "VERUM Biolabs", a premium European research-peptide brand (scientific, trustworthy, compliant). Translate the VALUES of the given JSON into ${lang}.
Rules:
- Return ONLY a JSON object with the SAME keys, values translated. No code fences, no commentary.
- Keep it natural, professional and concise.
- NEVER translate the brand "VERUM Biolabs" or scientific compound names / acronyms (e.g. Tirzepatide, BPC-157, GLP-1, GIP, HPLC, COA, mg, ml).
- Preserve any markdown, links [text](url), numbers, units and symbols (€, %, °C).
- Keep the strict "research use only / not for human consumption" meaning intact.`;

async function callGemini(lang, obj) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "x-goog-api-key": GEMINI_KEY, "Content-Type": "application/json" },
    signal: AbortSignal.timeout(120000),
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${RULES(lang)}\n\nJSON:\n${JSON.stringify(obj)}` }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 65536, responseMimeType: "application/json" },
    }),
  });
  return res;
}

async function callOpenAI(lang, obj) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${OPENAI_KEY}`, "Content-Type": "application/json" },
    signal: AbortSignal.timeout(120000),
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: RULES(lang) },
        { role: "user", content: `JSON:\n${JSON.stringify(obj)}` },
      ],
    }),
  });
  return res;
}

function extract(json) {
  let text = PROVIDER === "openai"
    ? (json?.choices?.[0]?.message?.content || "")
    : (json?.candidates?.[0]?.content?.parts ?? []).map((p) => p.text || "").join("");
  text = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  return JSON.parse(text);
}

async function translate(lang, obj) {
  for (let attempt = 1; attempt <= 6; attempt++) {
    try {
      const res = PROVIDER === "openai" ? await callOpenAI(lang, obj) : await callGemini(lang, obj);
      if (res.status === 429 || res.status === 503) { console.log(`  ${res.status}, retry ${attempt}`); await new Promise(r => setTimeout(r, 10000)); continue; }
      if (!res.ok) { console.error(`  HTTP ${res.status}`, (await res.text()).slice(0, 180)); return null; }
      return extract(await res.json());
    } catch (e) {
      console.log(`  ${e?.name || e}, retry ${attempt}`);
      await new Promise(r => setTimeout(r, 6000));
    }
  }
  return null;
}

const onlyLocales = process.argv.slice(2).filter((a) => LANGS[a]);
const targets = onlyLocales.length ? onlyLocales : Object.keys(LANGS);
console.log(`provider=${PROVIDER} model=${MODEL} locales=${targets.length} short=${Object.keys(shortSrc).length} bodies=${Object.keys(bodySrc).length}`);

for (const code of targets) {
  const lang = LANGS[code];
  const path = `${DIR}/${code}.json`;
  const existing = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : {};
  const out = { ...existing };

  // Phase 1 — short fields (single batch)
  const missingShort = Object.fromEntries(
    Object.entries(shortSrc).filter(([k]) => FORCE || !(k in out)),
  );
  if (Object.keys(missingShort).length) {
    console.log(`[${code}] short: translating ${Object.keys(missingShort).length}`);
    const t = await translate(lang, missingShort);
    if (t) { Object.assign(out, t); writeFileSync(path, JSON.stringify(out, null, 2)); }
    else console.error(`[${code}] short failed`);
    await new Promise(r => setTimeout(r, 1200));
  } else console.log(`[${code}] short: up to date`);

  // Phase 2 — blog bodies (one call each, larger)
  if (!NO_BODIES) {
    for (const [k, v] of Object.entries(bodySrc)) {
      if (!FORCE && k in out) continue;
      console.log(`[${code}] body ${k}`);
      const t = await translate(lang, { [k]: v });
      if (t && t[k]) { out[k] = t[k]; writeFileSync(path, JSON.stringify(out, null, 2)); }
      else console.error(`[${code}] ${k} failed`);
      await new Promise(r => setTimeout(r, 1200));
    }
  }
  console.log(`[${code}] saved (${Object.keys(out).length} keys)`);
}

// ---- regenerate content/index.ts ------------------------------------------
const files = readdirSync(DIR).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, "")).sort();
const imports = files.map((c) => `import ${c} from "./${c}.json";`).join("\n");
const map = files.join(", ");
writeFileSync(`${DIR}/index.ts`,
`// AUTO-GENERATED by scripts/i18n-translate-content.mjs — do not edit by hand.
// Maps locale code → flat content overlay ({ "id:field": "translated" }).
${imports}

export const overlays: Record<string, Record<string, string>> = { ${map} };
`);
console.log(`index.ts regenerated with: ${files.join(", ") || "(none)"}`);
console.log("done");
