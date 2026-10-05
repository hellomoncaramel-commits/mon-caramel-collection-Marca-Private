import { Heart } from "lucide-react";
import { PRODUCTS } from "../../data/products";
import { COLORS } from "../../styles/colors";
import { defaultPhotos } from "../../utils/products";
import SiteHeader from "../shared/SiteHeader";
import ProductArt from "../shared/ProductArt";
import Photo from "../shared/Photo";

// Discreet alternate path for customers who already know what they want —
// no mood quiz, just the full list grouped by name (briefing section 4).
export default function CatalogScreen({ onBack, selection, addToSelection, onOpenProduct, onOpenSelection }) {
  const inSelection = (id) => selection.some((it) => it.productId === id);

  return (
    <div className="max-w-2xl lg:max-w-4xl mx-auto px-gutter pt-2 pb-10 fade-up">
      <SiteHeader onBack={onBack} />
      <h2 className="mc-page-title">Coleção completa</h2>
      <p className="mc-page-subtitle">Todos os produtos, num lugar só.</p>

      <div className="space-y-3">
        {PRODUCTS.map((p) => {
          const added = inSelection(p.id);
          const photo = defaultPhotos(p)?.[0];
          return (
            <div
              key={p.id}
              className="rounded-2xl border bg-white overflow-hidden flex gap-3"
              style={{ borderColor: added ? COLORS.caramelDark : COLORS.border, borderWidth: added ? "2px" : "1px" }}
            >
              <div className="w-24 shrink-0">
                {photo ? (
                  <Photo src={photo} alt={p.name} pictureClassName="block w-24 h-24" className="w-full h-full object-cover rounded-2xl" loading="lazy" />
                ) : (
                  <ProductArt kind={p.kind} tint={p.tint} h="h-24" />
                )}
              </div>
              <div className="p-3 flex-1 flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-display text-base text-brand-ink">{p.name}</h3>
                  <p className="text-xs text-brand-muted">
                    {p.unit} · {p.price}
                  </p>
                </div>
                <button
                  onClick={() =>
                    p.customizable
                      ? onOpenProduct?.(p)
                      : addToSelection({ kind: "product", productId: p.id, name: p.name, unit: p.unit, qty: 1, flavors: null })
                  }
                  aria-label={
                    p.customizable
                      ? `Ver sabores e opções de ${p.name}`
                      : added
                      ? `${p.name} já está na seleção`
                      : `Adicionar ${p.name} à seleção`
                  }
                  className="text-sm font-medium rounded-full w-11 h-11 shrink-0 border border-brand-caramelDark flex items-center justify-center"
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
