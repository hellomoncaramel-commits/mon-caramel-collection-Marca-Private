const SIZES = {
  sm: 72,
  // Home header logo — tempered down from a straight 30%-of-width
  // measurement (115px): combined with a large hero photo, that pushed
  // the first screen below the fold on a real device. Still clearly
  // bigger than the earlier 58px attempt.
  home: 90,
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
