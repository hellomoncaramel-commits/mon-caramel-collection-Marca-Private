const SIZES = {
  sm: 72,
  // The logo artwork is a square canvas with built-in breathing room
  // around the mark, so its rendered box needs to run a bit larger than
  // the mark itself to read as "immediately recognizable" in a compact
  // header (Home).
  home: 100,
  md: 120,
  lg: 200,
};

// The real Mon Caramel logo artwork (heart-shaped cookie mark, wordmark and
// "Not your average sweet." tagline all baked in), supplied directly by
// Naia — see public/images/brand/logo-mon-caramel.webp.
export default function Logo({ size = "md" }) {
  const width = SIZES[size] ?? SIZES.md;
  return (
    <img
      src="/images/brand/logo-mon-caramel.webp"
      alt="Mon Caramel — Not your average sweet."
      style={{ width }}
      className="mx-auto"
    />
  );
}
