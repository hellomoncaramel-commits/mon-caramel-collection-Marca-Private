import { Heart, Check } from "lucide-react";
import { COLORS } from "../../styles/colors";
import { getMimos } from "../../data/giftOptions";
import Photo from "../shared/Photo";

// Small mimos are real, individual products (unlike Caixas/Bandejas, which
// are inspiration) — a light photo-first grid, not a heavy e-commerce card:
// just [FOTO GRANDE] + nome, per the brief. object-contain (not cover): the
// source photos mix landscape and portrait, so a fixed 4:5 card would crop
// the landscape ones badly under cover — contain always shows the whole
// product, with the card's own tint filling any leftover space.
export default function MimosSection({ isSelected, addToSelection, removeFromSelection }) {
  const mimos = getMimos();

  const toggle = (p) => {
    const entry = { kind: "product", productId: p.id, name: p.name, unit: p.unit, qty: 1, flavors: null };
    if (isSelected(entry)) removeFromSelection(entry);
    else addToSelection(entry);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {mimos.map((p) => {
        const added = isSelected({ kind: "product", productId: p.id });
        return (
          <div key={p.id}>
            <div className="relative rounded-2xl overflow-hidden aspect-mc-portrait bg-brand-subtle">
              <Photo src={p.photos[0]} alt={p.name} className="w-full h-full object-contain" loading="lazy" />
              <button
                onClick={() => toggle(p)}
                aria-label={added ? `Remover ${p.name} da seleção` : `Adicionar ${p.name} à seleção`}
                aria-pressed={added}
                className="absolute top-2 right-2 z-10 w-11 h-11 rounded-full bg-white/90 flex items-center justify-center transition-transform active:scale-90"
              >
                {added ? (
                  <Check size={18} className="text-brand-caramelDark" />
                ) : (
                  <Heart size={16} stroke={COLORS.caramelDark} />
                )}
              </button>
            </div>
            <p className="text-sm font-display text-brand-ink mt-2 text-center leading-tight">{p.name}</p>
          </div>
        );
      })}
    </div>
  );
}
