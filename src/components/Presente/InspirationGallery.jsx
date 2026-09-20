import { Heart } from "lucide-react";
import { COLORS } from "../../styles/colors";

// Editorial, Pinterest-style gallery of real photos from past work — pure
// inspiration, never a catalog of fixed products. No name, no price, no
// "buy this" affordance: just the photo, a discreet caption, and a way to
// save the idea for later ("♡ Gostei dessa ideia").
export default function InspirationGallery({ items, isSaved, onToggleSave }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {items.map((item) => {
        const saved = isSaved(item);
        return (
          <div key={item.id} className="fade-up">
            <div className="rounded-3xl overflow-hidden aspect-photo">
              <img src={item.photo} alt={item.caption} className="w-full h-full object-cover" loading="lazy" decoding="async" />
            </div>
            {item.caption && <p className="text-sm mt-3 leading-relaxed text-brand-inkSoft">{item.caption}</p>}
            <button
              onClick={() => onToggleSave(item)}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-3.5 min-h-11 border"
              style={{
                backgroundColor: saved ? COLORS.caramelDark : "transparent",
                color: saved ? "white" : COLORS.caramelDark,
                borderColor: COLORS.caramelDark,
              }}
            >
              <Heart size={12} fill={saved ? "white" : "none"} />
              {saved ? "Salvo na seleção" : "Gostei dessa ideia"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
