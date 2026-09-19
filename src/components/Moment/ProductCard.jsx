import { useState } from "react";
import { Heart, Snowflake, Sparkles } from "lucide-react";
import { COLORS } from "../../styles/colors";
import { MOMENT_ICON } from "../../data/moments";
import { photosForMoment, parseQuantityOptions } from "../../utils/products";
import PhotoCarousel from "../shared/PhotoCarousel";
import ProductArt from "../shared/ProductArt";
import FlavorConfigurator from "./FlavorConfigurator";

// A single product card — photo first, everything else light. Doubles as
// the "Minha Seleção" flavor configurator entry point outside Festa, and as
// a plain "add to Minha Festa" trigger inside Festa (these two flows never
// mix — see hooks/useParty.js).
export default function ProductCard({
  p,
  momentId,
  isFesta,
  favorites,
  toggleFavorite,
  selection,
  addToSelection,
  removeFromSelection,
  partyItems,
  onOpenPartyModal,
}) {
  const isFav = favorites.includes(p.id);
  const isCustomizable = p.customizable === true;
  const existing = selection.find((it) => it.kind === "product" && it.productId === p.id);
  const [open, setOpen] = useState(false);
  const partyEntry = partyItems?.find((it) => it.id === p.id);

  // Badges are derived straight from real product data — never invented
  // labels — so a product only wears the ones that are actually true of it.
  const canFreeze = p.moments.includes("freezer");

  const confirmAdd = ({ qty, flavorBreakdown }) => {
    addToSelection({
      kind: "product",
      productId: p.id,
      name: p.name,
      unit: p.unit,
      qty,
      flavors: isCustomizable && flavorBreakdown.length > 0 ? flavorBreakdown : null,
    });
    setOpen(false);
  };

  const photos = photosForMoment(p, momentId);
  // Non-customizable products have no quantity picker — they add at the
  // first (or only) quantity parsed from their unit text, e.g. "12 unidades".
  const defaultQty = parseQuantityOptions(p.unit)[0];

  return (
    <div
      className="rounded-3xl border bg-white overflow-hidden transition-all h-full flex flex-col"
      style={{ borderColor: existing ? COLORS.caramelDark : COLORS.border, borderWidth: existing ? "2px" : "1px" }}
    >
      <div className="relative">
        {photos && photos.length > 0 ? (
          <PhotoCarousel photos={photos} alt={p.name} />
        ) : (
          <ProductArt kind={p.kind} tint={p.tint} contextIcon={MOMENT_ICON[momentId]} />
        )}
        {!isFesta && (
          <button
            onClick={() => toggleFavorite(p.id)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center"
            aria-label="Guardar pra depois"
          >
            <Heart size={15} fill={isFav ? COLORS.caramelDark : "none"} stroke={COLORS.caramelDark} />
          </button>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-display text-brand-ink leading-tight">{p.name}</h3>
        {!isFesta && <p className="text-xs mt-0.5 text-brand-muted">{p.unit}</p>}
        <p className="text-xs mt-2 leading-relaxed flex-1 text-brand-inkSoft">{p.sensory}</p>

        {!isFesta && (canFreeze || isCustomizable) && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {canFreeze && (
              <span className="inline-flex items-center gap-1 text-3xs font-medium rounded-full px-2 py-1 bg-brand-subtle text-brand-inkSoft">
                <Snowflake size={10} /> Pode congelar
              </span>
            )}
            {isCustomizable && (
              <span
                className="inline-flex items-center gap-1 text-3xs font-medium rounded-full px-2 py-1"
                style={{ backgroundColor: `${COLORS.caramelLight}30`, color: COLORS.caramelDark }}
              >
                <Sparkles size={10} /> Escolha seus sabores
              </span>
            )}
          </div>
        )}

        {isFesta ? (
          <button
            onClick={() => onOpenPartyModal(p)}
            className="w-full mt-3 text-xs font-medium rounded-full px-3.5 py-2 flex items-center justify-center gap-1.5 border border-brand-caramelDark"
            style={{
              backgroundColor: partyEntry ? COLORS.caramelDark : "transparent",
              color: partyEntry ? "white" : COLORS.caramelDark,
            }}
          >
            🎉 {partyEntry ? `Na minha festa (${partyEntry.qty})` : "Adicionar à Minha Festa"}
          </button>
        ) : (
          <>
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm font-medium text-brand-caramelDark">{p.price}</span>
              <button
                onClick={() =>
                  isCustomizable
                    ? setOpen((o) => !o)
                    : existing
                    ? removeFromSelection(existing)
                    : confirmAdd({ qty: defaultQty, flavorBreakdown: [] })
                }
                className="text-xs font-medium rounded-full px-3.5 py-1.5 inline-flex items-center gap-1 border border-brand-caramelDark"
                style={{ backgroundColor: existing ? COLORS.caramelDark : "transparent", color: existing ? "white" : COLORS.caramelDark }}
              >
                <Heart size={12} fill={existing ? "white" : "none"} />
                {existing
                  ? isCustomizable
                    ? `Na seleção (${existing.qty})`
                    : "Adicionado ✓"
                  : isCustomizable
                  ? "Escolher sabores"
                  : "Quero esse"}
              </button>
            </div>

            {isCustomizable && open && (
              <div className="mt-3 pt-3 border-t border-dashed border-brand-border">
                <FlavorConfigurator product={p} existing={existing} onConfirm={confirmAdd} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
