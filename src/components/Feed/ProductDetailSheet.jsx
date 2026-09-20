import { useState } from "react";
import { X, Heart, Snowflake, Sparkles, Share2 } from "lucide-react";
import { COLORS } from "../../styles/colors";
import { PRODUCTS } from "../../data/products";
import { defaultPhotos, parseQuantityOptions } from "../../utils/products";
import PhotoCarousel from "../shared/PhotoCarousel";
import ProductArt from "../shared/ProductArt";
import Photo from "../shared/Photo";
import QuantityStepper from "../shared/QuantityStepper";
import FlavorConfigurator from "../Moment/FlavorConfigurator";

// Seduction happens in the feed; this is where information and the actual
// "quero esse" decision live (progressive disclosure). Opens as a mobile
// bottom sheet — same product, more room, no page navigation needed.
export default function ProductDetailSheet({ product: p, onClose, selection, addToSelection, removeFromSelection, favorites, toggleFavorite }) {
  const isCustomizable = p.customizable === true;
  const existing = selection.find((it) => it.kind === "product" && it.productId === p.id);
  const isFav = favorites.includes(p.id);
  const canFreeze = p.moments.includes("freezer");
  const photos = defaultPhotos(p);

  const [qty, setQty] = useState(existing?.qty ?? parseQuantityOptions(p.unit)[0]);

  const related = (p.relatedProducts ?? []).map((id) => PRODUCTS.find((x) => x.id === id)).filter(Boolean).slice(0, 3);

  const add = () => {
    addToSelection({ kind: "product", productId: p.id, name: p.name, unit: p.unit, qty, flavors: null });
  };

  const share = async () => {
    const shareData = { title: p.name, text: `${p.name} — Mon Caramel Collection`, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else await navigator.clipboard.writeText(shareData.url);
    } catch {
      // Cancelled or unsupported — no error state needed for a share action.
    }
  };

  return (
    <div className="fixed inset-0 z-modal flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="relative bg-brand-beige w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl overflow-y-auto fade-up"
        style={{ maxHeight: "92vh" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-detail-title"
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-3 left-3 z-10 w-11 h-11 rounded-full bg-white/90 flex items-center justify-center"
        >
          <X size={18} className="text-brand-ink" />
        </button>
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          <button
            onClick={() => toggleFavorite(p.id)}
            aria-label={isFav ? `Remover ${p.name} dos salvos` : `Salvar ${p.name}`}
            aria-pressed={isFav}
            className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center transition-transform active:scale-90"
          >
            <Heart size={18} fill={isFav ? COLORS.caramelDark : "none"} stroke={COLORS.caramelDark} />
          </button>
          <button
            onClick={share}
            aria-label="Compartilhar"
            className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center"
          >
            <Share2 size={16} className="text-brand-ink" />
          </button>
        </div>

        {photos && photos.length > 0 ? (
          <PhotoCarousel photos={photos} alt={p.name} />
        ) : (
          <ProductArt kind={p.kind} tint={p.tint} />
        )}

        <div className="p-5">
          <h2 id="product-detail-title" className="text-2xl font-display text-brand-ink leading-tight">
            {p.name}
          </h2>
          <p className="text-sm mt-0.5 text-brand-muted">{p.unit}</p>
          <p className="text-sm mt-3 leading-relaxed text-brand-inkSoft">{p.sensory}</p>

          <p className="text-xl font-medium mt-4 text-brand-caramelDark">{p.price}</p>

          {(canFreeze || isCustomizable) && (
            <ul className="flex flex-col gap-2 mt-4">
              {canFreeze && (
                <li className="flex items-center gap-2.5 text-sm text-brand-inkSoft">
                  <span className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center bg-brand-subtle">
                    <Snowflake size={14} className="text-brand-caramelDark" />
                  </span>
                  Pode congelar
                </li>
              )}
              {isCustomizable && (
                <li className="flex items-center gap-2.5 text-sm text-brand-inkSoft">
                  <span
                    className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${COLORS.caramelLight}30` }}
                  >
                    <Sparkles size={14} className="text-brand-caramelDark" />
                  </span>
                  Escolha seus sabores
                </li>
              )}
            </ul>
          )}

          {isCustomizable ? (
            <div className="mt-4 pt-4 border-t border-dashed border-brand-border">
              <FlavorConfigurator product={p} existing={existing} onConfirm={({ qty: q, flavorBreakdown }) => {
                addToSelection({
                  kind: "product",
                  productId: p.id,
                  name: p.name,
                  unit: p.unit,
                  qty: q,
                  flavors: flavorBreakdown.length > 0 ? flavorBreakdown : null,
                });
                onClose();
              }} />
            </div>
          ) : (
            <div className="flex items-center justify-between mt-5 gap-3">
              <QuantityStepper value={qty} onChange={setQty} />
              <button
                onClick={() => (existing ? removeFromSelection(existing) : add())}
                className="flex-1 text-sm font-medium rounded-full py-3 min-h-11 flex items-center justify-center gap-2"
                style={{ backgroundColor: COLORS.caramelDark, color: "white" }}
              >
                <Heart size={14} fill="white" />
                {existing ? "Adicionado ✓ — remover" : "Quero esse"}
              </button>
            </div>
          )}

          {related.length > 0 && (
            <div className="mt-8 pt-6 border-t border-brand-border">
              <p className="text-sm font-display text-brand-ink mb-3">Já que você chegou até aqui... 👀</p>
              <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5">
                {related.map((r) => (
                  <div key={r.id} className="shrink-0 w-32">
                    <div className="rounded-2xl overflow-hidden aspect-photo">
                      <Photo src={defaultPhotos(r)?.[0]} alt={r.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <p className="text-xs mt-1.5 text-brand-ink">{r.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
