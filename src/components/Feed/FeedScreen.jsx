import { useMemo, useState } from "react";
import { PRODUCTS } from "../../data/products";
import { COLORS } from "../../styles/colors";
import { isBrowsable } from "../../utils/products";
import SiteHeader from "../shared/SiteHeader";
import FeedCard from "./FeedCard";

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
export default function FeedScreen({ onBack, selection, addToSelection, onOpenProduct }) {
  const [filter, setFilter] = useState("tudo");

  const items = useMemo(() => {
    const activeFilter = FILTERS.find((f) => f.id === filter) ?? FILTERS[0];
    return PRODUCTS.filter(isBrowsable).filter(activeFilter.test);
  }, [filter]);

  return (
    <div className="max-w-xl lg:max-w-3xl mx-auto px-gutter pt-2 pb-10 fade-up">
      <SiteHeader onBack={onBack} />
      <h1 className="mc-page-title">Só olha... 👀</h1>
      <p className="mc-page-subtitle">Vai rolando. A gente não conta pra ninguém se você ficar com vontade.</p>

      {/* -mx-4/px-4 matches this page's own 16px gutter (px-gutter), so the
          chip row bleeds flush to the real viewport edge — was -mx-5/px-5
          (20px), 4px short of the actual edge. */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 -mx-4 px-4">
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
            isAdded={selection.some((it) => it.kind === "product" && it.productId === p.id)}
            onQuickAdd={(product, qty) =>
              addToSelection({ kind: "product", productId: product.id, name: product.name, unit: product.unit, qty, flavors: null })
            }
            onOpen={onOpenProduct}
          />
        ))}
      </div>

      {items.length === 0 && <p className="text-sm text-center text-brand-muted mt-10">Nada por aqui com esse filtro ainda.</p>}

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
