// One-off/reproducible: rasterizes the project's real, existing favicon.svg
// (the actual Mon Caramel mark — caramel circle + "MC", same colors.js
// caramelDark token) into the square PNG sizes iOS/Android/the web
// manifest need. No redesign, no new logo, no AI generation — same source
// art, just a format conversion, same convention as `images:webp` already
// uses sharp for. Not run automatically by `build`: run manually (`npm run
// icons:generate`) whenever favicon.svg itself changes; output PNGs are
// committed as regular static assets, like every other real image here.
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "..", "public", "favicon.svg");
const PUBLIC = path.join(__dirname, "..", "public");

const TARGETS = [
  { file: "apple-touch-icon.png", size: 180 },
  { file: "icon-192.png", size: 192 },
  { file: "icon-512.png", size: 512 },
];

async function main() {
  for (const { file, size } of TARGETS) {
    const out = path.join(PUBLIC, file);
    await sharp(SRC).resize(size, size).png().toFile(out);
    console.log(`generate-icons: ${file} (${size}x${size})`);
  }
}

main().catch((e) => {
  console.error("generate-icons:", e.message);
  process.exit(1);
});
