// Prepares "display" assets for the Caixas inspiration carousel: every
// source photo gets resized (never cropped, never upscaled beyond its own
// pixels) to fit fully inside a fixed 4:3 canvas, centered, with any
// leftover space filled by the Mon Caramel cream (#F4EBDA — brand.subtle,
// see src/styles/colors.js). The carousel then never needs to know or care
// whether the original photo was portrait, landscape, square, or an odd
// phone-camera ratio: every display asset it's given already has the same
// external 4:3 proportions.
//
// Source photos are read straight from their real location
// (public/images/products/ — where every product/inspiration photo already
// lives and is referenced elsewhere in the app) and are NEVER modified;
// only the derived canvas asset is written, into a separate folder, so
// there is exactly one place each original photo lives.
//
// Usage: npm run images:inspirations
import sharp from "sharp";
import { mkdirSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const sourceDir = path.join(root, "public", "images", "products");
const displayDir = path.join(root, "public", "images", "inspirations", "boxes", "display");

const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 1200;
const CREAM_BACKGROUND = "#F4EBDA";

// [source filename in public/images/products, output basename in display/]
// Proof-of-concept round: only slide 5 (pão de mel). The other 7 box photos
// get added here once this one is confirmed to look right in the carousel.
const SOURCES = [["presente-pao-mel.jpg", "box-005-inspiration"]];

if (!existsSync(displayDir)) mkdirSync(displayDir, { recursive: true });

for (const [srcName, outName] of SOURCES) {
  const srcPath = path.join(sourceDir, srcName);
  const meta = await sharp(srcPath).metadata();

  const scale = Math.min(CANVAS_WIDTH / meta.width, CANVAS_HEIGHT / meta.height);
  const newWidth = Math.round(meta.width * scale);
  const newHeight = Math.round(meta.height * scale);

  const resized = await sharp(srcPath)
    .resize(newWidth, newHeight, { fit: "inside", withoutEnlargement: false })
    .toBuffer();

  const canvas = () =>
    sharp({
      create: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT, channels: 3, background: CREAM_BACKGROUND },
    }).composite([{ input: resized, gravity: "center" }]);

  const jpgPath = path.join(displayDir, `${outName}.jpg`);
  const webpPath = path.join(displayDir, `${outName}.webp`);
  await canvas().jpeg({ quality: 92 }).toFile(jpgPath);
  await canvas().webp({ quality: 90 }).toFile(webpPath);

  console.log(`${srcName} (${meta.width}x${meta.height}) -> ${outName} (${CANVAS_WIDTH}x${CANVAS_HEIGHT}), photo drawn at ${newWidth}x${newHeight} centered`);
}
