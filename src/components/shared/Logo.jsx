const SIZES = {
  sm: 72,
  // A delicate, compact size for the Home header — recognizable without
  // dominating the row (the artwork has built-in breathing room, so it
  // still reads clearly at this size).
  home: 68,
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
