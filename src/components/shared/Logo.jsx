const SIZES = {
  sm: 72,
  // Home header row height (px) — the header's height is driven by this
  // logo, so it's sized by height (not width) to fill the row without
  // growing it. Uses the tightly-cropped asset below, whose visible
  // artwork nearly fills its own frame, unlike the source file's ~15%
  // transparent margin on every side (sized for square/stacked layouts).
  home: 76,
  md: 120,
  lg: 200,
};

// The real Mon Caramel logo artwork (heart-shaped cookie mark, wordmark and
// "Not your average sweet." tagline all baked in), supplied directly by
// Naia — see public/images/brand/logo-mon-caramel.webp.
export default function Logo({ size = "md" }) {
  if (size === "home") {
    return (
      <img
        src="/images/brand/logo-mon-caramel-cropped.webp"
        alt="Mon Caramel — Not your average sweet."
        style={{ height: SIZES.home, width: "auto" }}
        className="mx-auto"
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
