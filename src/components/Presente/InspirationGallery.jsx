import { Heart } from "lucide-react";
import { COLORS } from "../../styles/colors";
import Photo from "../shared/Photo";

// Editorial inspiration grid for Caixas/Bandejas — a gallery to look at and
// save from, never a SKU list (no name, no price, no "add to cart"). Every
// source photo here is native 4:3 (see data/photos.js), so an aspect-photo
// box + object-cover shows each one whole with zero cropping — cover only
// ever crops when the box and image disagree on aspect, and here they don't.
export default function InspirationGallery({ items, isSelected, onToggleSave }) {
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {items.map((item) => {
        const saved = isSelected({ kind: "inspiration", id: item.id });
        return (
          <div key={item.id} className="relative rounded-2xl overflow-hidden aspect-photo bg-brand-subtle">
            <Photo src={item.photo} alt={item.caption || ""} className="w-full h-full object-cover" loading="lazy" />
            <button
              onClick={() => onToggleSave(item)}
              className="absolute top-2 right-2 z-10 w-11 h-11 rounded-full bg-white/90 flex items-center justify-center transition-transform active:scale-90"
              aria-label={saved ? "Remover dos salvos" : "Gostei dessa ideia"}
              aria-pressed={saved}
            >
              <Heart size={16} fill={saved ? COLORS.caramelDark : "none"} stroke={COLORS.caramelDark} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
