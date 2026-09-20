import { useMemo, useState } from "react";
import { PRODUCTS } from "../../data/products";
import { COLORS } from "../../styles/colors";
import { isBrowsable } from "../../utils/products";
import BackButton from "../shared/BackButton";
import FeedCard from "./FeedCard";
import FavoritesNudge from "./FavoritesNudge";

// Real, data-backed filters only — no invented categories. Once more
// products carry structured tags (chocolate, low sugar, etc.) this list
// can grow; for now it's exactly what the catalog can honestly support.
const FILTERS = [
  { id: "tudo", label: "Tudo", test: () => true },
  { id: "personalizados", label: "Personalizados", test: (p) => p.customizable === true },
  { id: "freezer", label: "Pode congelar", test: (p) => p.moments.includes("freezer") },
];

// "Só quero olhar e passar vontade" — an editorial, Instagram/Pinterest-
// style feed. Presente items sit this one out: they're inspiration, not
// individually browsable products, and already have their own experience.
export default function FeedScreen({ onBack, favorites, toggleFavorite, selection, addToSelection, onOpenProduct, onGoSaved }) {
  const [filter, setFilter] = useState("tudo");

  const items = useMemo(() => {
    const activeFilter = FILTERS.find((f) => f.id === filter) ?? FILTERS[0];
    return PRODUCTS.filter(isBrowsable).filter(activeFilter.test);
  }, [filter]);

  return (
    <div className="max-w-xl mx-auto px-5 pt-8 pb-10 fade-up">
      <BackButton onClick={onBack} label="Voltar" />
      <h1 className="text-2xl font-display text-brand-ink mb-1">Só olha... 👀</h1>
      <p className="text-sm mb-5 text-brand-muted">Vai rolando. A gente não conta pra ninguém se você ficar com vontade.</p>

      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 -mx-5 px-5">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className="shrink-0 text-sm font-medium rounded-full px-4 py-2 border min-h-11"
            style={{
              backgroundColor: filter === f.id ? COLORS.caramelDark : "white",
              color: filter === f.id ? "white" : COLORS.ink,
              borderColor: filter === f.id ? COLORS.caramelDark : COLORS.border,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-8">
        {items.map((p) => (
          <FeedCard
            key={p.id}
            product={p}
            isFavorite={favorites.includes(p.id)}
            onToggleFavorite={toggleFavorite}
            isAdded={selection.some((it) => it.kind === "product" && it.productId === p.id)}
            onQuickAdd={(product, qty) =>
              addToSelection({ kind: "product", productId: product.id, name: product.name, unit: product.unit, qty, flavors: null })
            }
            onOpen={onOpenProduct}
          />
        ))}
      </div>

      {items.length === 0 && <p className="text-sm text-center text-brand-muted mt-10">Nada por aqui com esse filtro ainda.</p>}

      <FavoritesNudge count={favorites.length} onGoSaved={onGoSaved} />

      <div className="text-center mt-10 pt-6 border-t border-dashed border-brand-border">
        <p className="text-lg font-display text-brand-ink mb-3">Ainda com fome?</p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-sm font-medium rounded-full px-5 py-2.5 border border-brand-caramelDark text-brand-caramelDark min-h-11"
        >
          Continuar olhando
        </button>
      </div>
    </div>
  );
}
