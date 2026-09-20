// Generates a WebP sibling (same basename, .webp) for every .jpg under
// public/images/products — run this again whenever new product photos are
// added. src/components/shared/Photo.jsx expects that sibling to exist for
// every photo referenced in the app (it derives the WebP path from the .jpg
// path passed in) and falls back to the original .jpg on browsers that
// don't support WebP.
//
// Quality 50 (effort 6) was chosen empirically: high enough that these
// photographic images still look good at the sizes they're actually shown
// at (cards, feed, detail sheet — never full-bleed desktop hero), while
// reliably beating the size of the already-compressed source JPEGs (a
// naive re-encode at higher quality can end up *larger* than the source).
//
// Usage: npm run images:webp
import sharp from "sharp";
import { readdirSync, statSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "..", "public", "images", "products");
const files = readdirSync(dir).filter((f) => f.endsWith(".jpg"));

let jpgTotal = 0;
let webpTotal = 0;

for (const f of files) {
  const src = path.join(dir, f);
  const dest = path.join(dir, f.replace(/\.jpg$/, ".webp"));
  const jpgSize = statSync(src).size;
  await sharp(src).webp({ quality: 50, effort: 6 }).toFile(dest);
  const webpSize = statSync(dest).size;
  jpgTotal += jpgSize;
  webpTotal += webpSize;
}

console.log(`${files.length} images converted.`);
console.log(`JPG total:  ${(jpgTotal / 1024).toFixed(0)} KB`);
console.log(`WebP total: ${(webpTotal / 1024).toFixed(0)} KB (${Math.round((100 * webpTotal) / jpgTotal)}% of original)`);
