import { Heart } from "lucide-react";
import { COLORS } from "../../styles/colors";

// The real Mon Caramel wordmark — "MON ♥ CARAMEL", the heart standing in
// place of a word between "MON" and "CARAMEL", per the Canva brand kit
// (Brand Guidelines Presentation, Logo page). Built as text + icon rather
// than a raster export: it's fundamentally typographic, so this stays crisp
// at any size and needs no image asset.
export default function Logo({ size = "md", withTagline = false }) {
  const heartSize = size === "lg" ? 22 : size === "md" ? 16 : 12;
  const textSize = size === "lg" ? "text-3xl sm:text-4xl" : size === "md" ? "text-xl" : "text-base";

  return (
    <div className="inline-flex flex-col items-center">
      <div className={`inline-flex items-center gap-1.5 font-display tracking-wide text-brand-caramelDark ${textSize}`}>
        <span>MON</span>
        <Heart size={heartSize} fill={COLORS.caramelDark} stroke={COLORS.caramelDark} />
        <span>CARAMEL</span>
      </div>
      {withTagline && (
        <p className="mt-1 text-xs italic font-subtitle text-brand-inkSoft">Not your average sweet.</p>
      )}
    </div>
  );
}
