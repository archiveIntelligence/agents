// Convert the storefront PNGs to WebP to cut user bandwidth. Writes <name>.webp
// next to each <name>.png in public/products, public/blog, public/categories
// (skips the internal _options dir). The image components serve .webp.
//
//   node scripts/to-webp.mjs            # convert (skips up-to-date webp)
//   FORCE=1 node scripts/to-webp.mjs    # re-encode all

import sharp from "sharp";
import { readdirSync, statSync, existsSync } from "node:fs";

const DIRS = ["public/products", "public/blog", "public/categories"];
const FORCE = !!process.env.FORCE;
let pngBytes = 0, webpBytes = 0, n = 0;

for (const dir of DIRS) {
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".png")) continue;
    const src = `${dir}/${f}`;
    const out = src.replace(/\.png$/, ".webp");
    const sp = statSync(src);
    if (!FORCE && existsSync(out) && statSync(out).mtimeMs >= sp.mtimeMs) { continue; }
    await sharp(src).webp({ quality: 80, effort: 5 }).toFile(out);
    pngBytes += sp.size; webpBytes += statSync(out).size; n++;
    console.log(`✓ ${out}  ${(sp.size/1024|0)}KB → ${(statSync(out).size/1024|0)}KB`);
  }
}
console.log(`\nConverted ${n} images. ${(pngBytes/1e6).toFixed(1)}MB PNG → ${(webpBytes/1e6).toFixed(1)}MB WebP` +
  (pngBytes ? ` (−${(100-100*webpBytes/pngBytes).toFixed(0)}%)` : ""));
