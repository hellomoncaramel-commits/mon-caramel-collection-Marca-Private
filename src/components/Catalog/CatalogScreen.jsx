import { Heart } from "lucide-react";
import { PRODUCTS } from "../../data/products";
import { COLORS } from "../../styles/colors";
import BackButton from "../shared/BackButton";
import ProductArt from "../shared/ProductArt";

// Discreet alternate path for customers who already know what they want —
// no mood quiz, just the full list grouped by name (briefing section 4).
export default function CatalogScreen({ onBack, favorites, toggleFavorite, selection, addToSelection, onOpenSelection }) {
  const inSelection = (id) => selection.some((it) => it.productId === id);

  return (
    <div className="max-w-2xl mx-auto px-6 pt-10 pb-28 fade-up">
      <BackButton onClick={onBack} label="Voltar" />
      <h2 className="text-2xl mb-1 font-display text-brand-ink">Coleção completa</h2>
      <p className="text-sm mb-6 text-brand-muted">Todos os produtos, num lugar só.</p>

      <div className="space-y-3">
        {PRODUCTS.map((p) => {
          const added = inSelection(p.id);
          const isFav = favorites.includes(p.id);
          return (
            <div
              key={p.id}
              className="rounded-2xl border bg-white overflow-hidden flex gap-3"
              style={{ borderColor: added ? COLORS.caramelDark : COLORS.border, borderWidth: added ? "2px" : "1px" }}
            >
              <div className="w-24 shrink-0">
                <ProductArt kind={p.kind} tint={p.tint} h="h-24" />
              </div>
              <div className="p-3 flex-1 flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display text-base text-brand-ink">{p.name}</h3>
                    <button onClick={() => toggleFavorite(p.id)} aria-label="Guardar pra depois">
                      <Heart size={13} fill={isFav ? COLORS.caramelDark : "none"} stroke={COLORS.caramelDark} />
                    </button>
                  </div>
                  <p className="text-xs text-brand-muted">
                    {p.unit} · {p.price}
                  </p>
                </div>
                <button
                  onClick={() => addToSelection({ productId: p.id, name: p.name, unit: p.unit, qty: 1, flavors: null })}
                  className="text-xs font-medium rounded-full px-3 py-1.5 shrink-0 border border-brand-caramelDark"
                  style={{ backgroundColor: added ? COLORS.caramelDark : "transparent", color: added ? "white" : COLORS.caramelDark }}
                >
                  {added ? "✓" : "♡"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selection.length > 0 && (
        <div className="mt-6 rounded-2xl border border-brand-caramelDark p-4 bg-white/95 backdrop-blur">
          <p className="text-xs uppercase tracking-wide mb-2 text-brand-muted">Você escolheu ({selection.length})</p>
          <button
            onClick={onOpenSelection}
            className="w-full text-sm font-medium text-white bg-brand-caramelDark rounded-full py-3 flex items-center justify-center gap-2"
          >
            <Heart size={15} />
            Ver Minha Seleção
          </button>
        </div>
      )}
    </div>
  );
}
