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

// Each entry: source filename in public/images/products, output basename
// in display/, plus two optional per-photo knobs — used only when a
// specific photo genuinely needs them, never as a default:
//   rotate: degrees clockwise to correct the source's orientation before
//     laying it out (e.g. a landscape box shot with the camera turned
//     sideways). Never applied to hide bad framing — only to undo an
//     actual camera-orientation mismatch.
//   scaleFactor: shrinks the photo further than a plain "fit inside the
//     canvas" would (1.0 = default, full contain-fit). A value like 0.82
//     leaves visibly more cream margin on every side, so more of the
//     composition reads as "the whole box" rather than filling the frame
//     edge-to-edge. Still never crops — only how small the fully-visible
//     photo is drawn.
const SOURCES = [
  { src: "presente-pao-mel.jpg", out: "box-005-inspiration" },
  // Shot with the camera rotated 90° from the box's natural orientation
  // (compare: every other box photo in this carousel has its ribbon/box
  // edge running horizontally — this one's ran vertically before
  // correction). rotate: 90 (clockwise) puts the box edge back on top,
  // matching the rest of the set. scaleFactor: 0.82 additionally shrinks
  // it within the canvas (vs. a plain contain-fit) so more of the box
  // reads clearly instead of filling the frame edge-to-edge.
  { src: "presente-cha-de-bebe.jpg", out: "box-008-inspiration", rotate: 90, scaleFactor: 0.82 },
];

if (!existsSync(displayDir)) mkdirSync(displayDir, { recursive: true });

for (const { src: srcName, out: outName, rotate = 0, scaleFactor = 1 } of SOURCES) {
  const srcPath = path.join(sourceDir, srcName);
  const rotated = sharp(srcPath).rotate(rotate);
  const meta = await rotated.metadata();
  // rotate(90/270) swaps the reported width/height only after the pixels
  // are actually re-encoded; re-read metadata from a materialized buffer
  // to get the POST-rotation dimensions reliably.
  const rotatedBuffer = await rotated.toBuffer();
  const rotatedMeta = await sharp(rotatedBuffer).metadata();

  const containScale = Math.min(CANVAS_WIDTH / rotatedMeta.width, CANVAS_HEIGHT / rotatedMeta.height);
  const scale = containScale * scaleFactor;
  const newWidth = Math.round(rotatedMeta.width * scale);
  const newHeight = Math.round(rotatedMeta.height * scale);

  const resized = await sharp(rotatedBuffer)
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

  const note = rotate ? ` (rotated ${rotate}° cw)` : "";
  console.log(
    `${srcName}${note} (${meta.width}x${meta.height} source, ${rotatedMeta.width}x${rotatedMeta.height} after rotation) -> ${outName} (${CANVAS_WIDTH}x${CANVAS_HEIGHT}), photo drawn at ${newWidth}x${newHeight} centered${scaleFactor !== 1 ? ` (scaleFactor ${scaleFactor})` : ""}`,
  );
}
