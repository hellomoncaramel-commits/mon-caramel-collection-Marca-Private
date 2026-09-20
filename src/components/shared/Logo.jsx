const SIZES = {
  sm: 72,
  // Compact Home header logo (spec target: 58px displayed width). Since
  // the artwork is a square canvas, its rendered height is also ~58px —
  // taller than a 46px header row would allow, an unavoidable tradeoff of
  // hitting the logo-width target on a square, uncropped asset.
  home: 58,
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
