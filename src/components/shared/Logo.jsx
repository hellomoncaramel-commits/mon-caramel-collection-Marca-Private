const SIZES = {
  sm: 72,
  // Home header logo — measured directly against the approved mockup's
  // own logo-to-screen-width ratio (~30% of a 390px screen ≈ 115px),
  // not an approximated number.
  home: 112,
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
