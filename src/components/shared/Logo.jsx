const SIZES = {
  sm: 72,
  // Home header logo height (px). The header row itself is pinned to 76px
  // (see HomeScreen.jsx) so the page never grows, but the logo is rendered
  // taller than that and allowed to overflow the row — centered on the
  // row's own vertical center, this is the largest height that still (a)
  // doesn't clip past the top of a 390px-wide viewport (8px of page
  // padding above the row means only 46px of headroom above that center)
  // and (b) doesn't reach the headline below. Uses the tightly-cropped
  // asset below, whose visible artwork nearly fills its own frame, unlike
  // the source file's ~15% transparent margin on every side.
  home: 92,
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
