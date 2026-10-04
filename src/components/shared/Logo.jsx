const SIZES = {
  sm: 72,
  // Home header logo height (px). The header row itself is pinned to 76px
  // (see SiteHeader.jsx's default rowHeight) so the page never grows, but
  // the logo is rendered taller than that and allowed to overflow the row —
  // centered on the row's own vertical center, this is the largest height
  // that still (a) doesn't clip past the top of a 390px-wide viewport (8px
  // of page padding above the row means only 46px of headroom above that
  // center) and (b) doesn't reach the headline below. Uses the
  // tightly-cropped asset below, whose visible artwork nearly fills its own
  // frame, unlike the source file's ~15% transparent margin on every side.
  home: 92,
  // Unified desktop header (DesktopNav) — same tightly-cropped asset as
  // "home", sized so it reads as ~125px WIDE (the brand mark needs real
  // presence in the new ~100px-tall header, not a micro icon) — taller
  // than the 100px row on purpose, overflowing it centered the same way
  // SIZES.home already overflows its own row.
  header: 116,
  md: 120,
  lg: 200,
  // Bigger, more present brand mark for two specific headers — without
  // touching SIZES.home (every other SiteHeader caller, plus HomeScreen's
  // own direct <Logo size="home" />, relies on that default staying exactly
  // 92px). Both reuse CROP_SCALE below on the same tightly-cropped asset as
  // "home"/"header" — never a new or edited file.
  // MomentPicker ("Como você está hoje?") — the most brand-forward of the
  // two, deliberately bigger than Dias de luta's.
  heroLogo: 116,
  // Dias de luta's header — "intermediate" presence: clearly bigger than
  // the old 72px/92px headers, but visibly smaller than heroLogo so
  // MomentPicker still reads as the more branding-forward of the two.
  diaDificilLogo: 90,
};

// `heroLogo`/`diaDificilLogo` render visibly bigger than a plain height
// bump would: the cropped asset still carries a real empty margin above
// "MON" (the decorative heart-swirl needs room, but the wordmark itself
// only starts about a third of the way down — measured directly off the
// file: the dense wordmark+tagline spans roughly the bottom 85% once the
// top ~17% of empty margin is cropped away). CROP_SCALE renders the image
// taller than its box and anchors it to the box's bottom edge inside an
// overflow-hidden wrapper, pushing that top margin out of view — same
// "zoom and crop via CSS, never touch the source file" technique already
// used elsewhere in the app (MomentPicker's own MOMENT_PHOTO_STYLE,
// PresenteEntryScreen's photoPosition). Not used by "home"/"header": their
// context (Home's own header, DesktopNav) wasn't the one flagged as too
// small, so they keep rendering the file exactly as before.
const CROP_SCALE = 1.2;

function CroppedLogo({ size }) {
  const height = SIZES[size];
  // The wrapper's width must match the SCALED image's own rendered width
  // (not the box height's), or overflow-hidden would also clip the sides —
  // this crop is meant to trim empty margin off the top only.
  const renderedHeight = height * CROP_SCALE;
  const renderedWidth = (renderedHeight * 358) / 332;
  return (
    <div className="relative overflow-hidden mx-auto shrink-0" style={{ height, width: renderedWidth }}>
      <img
        src="/images/brand/logo-mon-caramel-cropped.webp"
        alt="Mon Caramel — Not your average sweet."
        style={{ height: renderedHeight, width: renderedWidth, position: "absolute", bottom: 0, left: 0 }}
      />
    </div>
  );
}

// The real Mon Caramel logo artwork (heart-shaped cookie mark, wordmark and
// "Not your average sweet." tagline all baked in), supplied directly by
// Naia — see public/images/brand/logo-mon-caramel.webp.
export default function Logo({ size = "md" }) {
  if (size === "heroLogo" || size === "diaDificilLogo") {
    return <CroppedLogo size={size} />;
  }
  if (size === "home" || size === "header") {
    return (
      <img
        src="/images/brand/logo-mon-caramel-cropped.webp"
        alt="Mon Caramel — Not your average sweet."
        style={{ height: SIZES[size], width: "auto" }}
        className="mx-auto shrink-0"
      />
    );
  }
  const width = SIZES[size] ?? SIZES.md;
  return (
    <img
      src="/images/brand/logo-mon-caramel.webp"
      alt="Mon Caramel — Not your average sweet."
      style={{ width, height: "auto" }}
      className="mx-auto"
    />
  );
}
