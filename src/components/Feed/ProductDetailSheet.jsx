import { useState } from "react";
import { X, Heart, Snowflake, Share2 } from "lucide-react";
import { COLORS } from "../../styles/colors";
import { PRODUCTS } from "../../data/products";
import { BADGES } from "../../data/badges";
import { defaultPhotos, initialQuantity, displayPriceCada } from "../../utils/products";
import PhotoCarousel from "../shared/PhotoCarousel";
import ProductArt from "../shared/ProductArt";
import Photo from "../shared/Photo";
import QuantityStepper from "../shared/QuantityStepper";
import MonCaramelNote from "../shared/MonCaramelNote";
import NextTemptation from "../shared/NextTemptation";
import FlavorConfigurator from "../Moment/FlavorConfigurator";
import { useModalLock } from "../../hooks/useModalLock";

// Seduction happens in the feed; this is where information and the actual
// "quero esse" decision live (progressive disclosure). Opens as a mobile
// bottom sheet — same product, more room, no page navigation needed.
//
// `momentId` is which journey this sheet was opened from — Feed/Search
// never pass one, so `showExperience` stays false there and the sheet
// renders exactly as it always has. Only Dias de luta passes
// momentId="dia-dificil" (see MomentScreen.jsx), which turns on the Mon
// Caramel Experience layer: badges, the editorial note, and the manual
// "próxima tentação" cross-sell, replacing the older generic bits they'd
// otherwise duplicate (see the two `showExperience` gates below).
export default function ProductDetailSheet({
  product: p,
  onClose,
  selection,
  addToSelection,
  removeFromSelection,
  momentId,
  onOpenProduct,
}) {
  useModalLock(onClose);

  const isCustomizable = p.customizable === true;
  const existing = selection.find((it) => it.kind === "product" && it.productId === p.id);
  const canFreeze = p.moments.includes("freezer");
  const photos = defaultPhotos(p);
  const showExperience = momentId === "dia-dificil";

  // Both the starting quantity and the stepper's floor come from the same
  // place: the product's own explicit minimumQuantity (or the legacy
  // "mín." text marker for products not yet migrated), never a plain
  // pack/weight number ("12 unidades", "250g") the data doesn't actually
  // declare as a minimum (see initialQuantity/minimumQuantityOf).
  const minQty = initialQuantity(p);
  const [qty, setQty] = useState(existing?.qty ?? minQty);

  const related = (p.relatedProducts ?? []).map((id) => PRODUCTS.find((x) => x.id === id)).filter(Boolean).slice(0, 3);

  const temptation = p.experience?.nextTemptation;
  const temptationProduct = temptation ? PRODUCTS.find((x) => x.id === temptation.id) : null;
  const temptationAlreadySelected = temptationProduct
    ? selection.some((it) => it.kind === "product" && it.productId === temptationProduct.id)
    : false;

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
        className="relative bg-brand-beige w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl overflow-y-auto fade-up lg:max-w-4xl lg:grid lg:grid-cols-2 lg:overflow-hidden lg:max-h-[88vh]"
        style={{ maxHeight: "92vh" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-detail-title"
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-3 left-3 z-10 w-11 h-11 rounded-full bg-white/90 flex items-center justify-center transition-transform active:scale-90"
        >
          <X size={18} className="text-brand-ink" />
        </button>
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          <button
            onClick={share}
            aria-label="Compartilhar"
            className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center transition-transform active:scale-90"
          >
            <Share2 size={16} className="text-brand-ink" />
          </button>
        </div>

        {/* Desktop (lg+): this becomes the modal's left column via the
            panel's own lg:grid-cols-2 above — same PhotoCarousel/ProductArt,
            just centered in a fixed-height column instead of a full-width
            top band. The lg:p-6 inset keeps the photo from touching the
            panel's own edges, reading as a mounted photograph rather than a
            bleed — a small balance fix between the two columns.
            Photo/composition-balance pass: mobile/tablet dropped the
            dominant aspect-square (it made the photo read as nearly the
            whole first screen, with name/price/description trailing off as
            small print below) down to the site's own aspect-photo (4:3) —
            same ratio the feed and every card already use, so the sheet's
            hero photo is still the biggest single thing on screen without
            swallowing the screen. */}
        <div className="p-3 pb-0 lg:p-6 lg:h-full lg:overflow-hidden lg:flex lg:items-center lg:justify-center lg:bg-brand-subtle">
          {photos && photos.length > 0 ? (
            <div className="rounded-2xl overflow-hidden lg:rounded-none">
              <PhotoCarousel photos={photos} alt={p.name} aspectClassName="aspect-photo" />
            </div>
          ) : (
            <ProductArt kind={p.kind} tint={p.tint} />
          )}
        </div>

        <div className="p-4 lg:p-6 lg:h-full lg:overflow-y-auto">
          <h2 id="product-detail-title" className="text-2xl lg:text-2xl font-display text-brand-ink leading-tight">
            {p.name}
          </h2>
          {/* Description right after the name — this is the one place the
              customer actually reads what the product IS before any
              commercial fact. The card's own teaser already did its job
              getting them here; this is deliberately `sensory`, a
              different (fuller) string, never the teaser repeated. */}
          <p className="text-sm mt-2 leading-snug text-brand-inkSoft">{p.sensory}</p>

          {/* One soft, warm-tinted block for every OBJECTIVE commercial
              fact — price, minimum, "pode congelar," the gluten-free
              option — instead of a stack of separate lines on the plain
              page background. Same caramel-tint-card device MonCaramelNote
              already uses just below (one repeated signature, not a new
              look). Price shown as "$X cada" (displayPriceCada — pure
              presentation, the underlying `price` string is untouched),
              same humanized form the card already uses.
              Then (only) whichever of the two actually applies: an
              explicit commercial minimum (never inferred from unit text —
              see minimumQuantityOf) spelled out in full, or the plain sale
              unit for every other product (weight, pack, "por fatia",
              etc.) — never both, since for every product that has a real
              minQty today, `unit` is just that same minimum restated
              ("unidade (mín. N)"), which would otherwise show the same
              fact twice in two different phrasings right next to each
              other.
              Badges here are deliberately curated, same rule regardless of
              entry context (no more showExperience branch for this part):
              "pode congelar" (from either signal that ever meant it —
              `canFreeze`/moments or the "freezer" badge, so nothing a
              product used to show stops showing) and "glutenFreeOption"
              (as a plain "Opção sem glúten," no "(mesmo preço)" — that
              detail now lives once, discreetly, next to the `versao` step
              inside FlavorConfigurator, where it's actually useful) are
              always shown when they apply; "deserve"/"hardTimes" (mood/
              journey copy like "Hoje eu mereço") are excluded from this
              block — that kind of badge still has its place on the card,
              just not mixed into an objective commercial summary. Any
              other badge a product carries (coffee, lunchbox, vegan, the
              plain glutenFree) still renders here via its normal approved
              label — only the two cases above get special handling. */}
          <div className="mt-3 rounded-2xl p-4" style={{ backgroundColor: `${COLORS.caramelLight}1F` }}>
            <p className="text-xl font-medium text-brand-caramelDark">{displayPriceCada(p.price)}</p>
            {minQty > 1 ? (
              <p className="text-sm mt-0.5 text-brand-muted">Pedido mínimo: {minQty}</p>
            ) : (
              p.unit && <p className="text-sm mt-0.5 text-brand-muted">{p.unit}</p>
            )}

            {(() => {
              const showFreezer = canFreeze || p.badges?.includes("freezer");
              const hasGlutenFreeOption = p.badges?.includes("glutenFreeOption");
              const otherBadgeKeys = (p.badges ?? []).filter(
                (key) => key !== "freezer" && key !== "deserve" && key !== "hardTimes" && key !== "glutenFreeOption"
              );
              if (!showFreezer && !hasGlutenFreeOption && otherBadgeKeys.length === 0) return null;
              return (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {showFreezer && (
                    <span className="inline-flex items-center gap-1 text-3xs font-medium rounded-full px-2 py-0.5 text-brand-inkSoft bg-white/60">
                      <Snowflake size={11} className="text-brand-caramelDark" /> Pode congelar
                    </span>
                  )}
                  {otherBadgeKeys.map((key) => {
                    const badge = BADGES[key];
                    if (!badge) return null;
                    return (
                      <span key={key} className="inline-flex items-center gap-1 text-3xs font-medium rounded-full px-2 py-0.5 text-brand-inkSoft bg-white/60">
                        <span aria-hidden="true">{badge.emoji}</span> {badge.label}
                      </span>
                    );
                  })}
                  {hasGlutenFreeOption && (
                    <span className="inline-flex items-center gap-1 text-3xs font-medium rounded-full px-2 py-0.5 text-brand-inkSoft bg-white/60">
                      <span aria-hidden="true">🌾</span> Opção sem glúten
                    </span>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Mon Caramel's own voice — a short editorial aside, Dias de
              luta only, right before the purchase decision. */}
          {showExperience && <MonCaramelNote label={p.experience?.noteLabel} note={p.experience?.note} />}

          {/* Configuração + CTA — directly on the page, no extra panel
              around it (a prior round wrapped this in its own tinted box;
              the reference just places it right after the note, closely
              spaced, so it reads as the next step, not a separate card). */}
          {isCustomizable ? (
            <div className="mt-4 pt-3 border-t border-dashed border-brand-border">
              <FlavorConfigurator product={p} existing={existing} onConfirm={({ qty: q, flavorBreakdown, options }) => {
                addToSelection({
                  kind: "product",
                  productId: p.id,
                  name: p.name,
                  unit: p.unit,
                  qty: q,
                  flavors: flavorBreakdown?.length > 0 ? flavorBreakdown : null,
                  options: options ?? null,
                });
                onClose();
              }} />
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-sm font-medium text-brand-ink mb-2">Quantos?</p>
              <div className="flex items-center justify-between gap-3">
                <QuantityStepper value={qty} onChange={setQty} min={minQty} />
                <button
                  onClick={() => (existing ? removeFromSelection(existing) : add())}
                  className="flex-1 text-sm font-medium rounded-full py-3 min-h-11 flex items-center justify-center gap-2 transition-transform active:scale-95"
                  style={{ backgroundColor: COLORS.caramelDark, color: "white" }}
                >
                  <Heart size={14} fill="white" />
                  {existing ? "Adicionado ✓ — remover" : "Quero esse"}
                </button>
              </div>
            </div>
          )}

          {/* Dias de luta's manual, one-at-a-time cross-sell — replaces the
              generic auto-related block below for this context (never both
              at once). Hidden outright if the suggested product is already
              in the selection, per the brief, rather than insisting on it. */}
          {showExperience && temptationProduct && !temptationAlreadySelected && (
            <NextTemptation
              line={temptation.line}
              product={temptationProduct}
              photo={defaultPhotos(temptationProduct)?.[0]}
              onOpen={(product) => onOpenProduct?.(product, momentId)}
            />
          )}

          {!showExperience && related.length > 0 && (
            <div className="mt-5 pt-4 border-t border-brand-border">
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
