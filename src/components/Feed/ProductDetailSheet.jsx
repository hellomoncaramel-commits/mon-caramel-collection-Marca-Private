import { useState } from "react";
import { X, Heart, Snowflake, Sparkles, Share2 } from "lucide-react";
import { COLORS } from "../../styles/colors";
import { PRODUCTS } from "../../data/products";
import { defaultPhotos, parseQuantityOptions } from "../../utils/products";
import PhotoCarousel from "../shared/PhotoCarousel";
import ProductArt from "../shared/ProductArt";
import Photo from "../shared/Photo";
import QuantityStepper from "../shared/QuantityStepper";
import ProductBadges from "../shared/ProductBadges";
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

  // The unit text's own lowest number is the real floor (e.g. "mín. 5",
  // "unidade (mín. 5)", "12 unidades") — QuantityStepper used to default to
  // a flat min={1}, letting the stepper go below a stated minimum.
  const minQty = Math.min(...parseQuantityOptions(p.unit));
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
          <p className="text-sm mt-0.5 text-brand-muted">{p.unit}</p>
          {/* Price right under the name — reads as the first two facts
              about the product together, the way the approved reference
              shows it, not pushed down to sit beside the CTA. Bumped from
              text-lg: with the photo no longer a dominant square, this is
              now one of two things carrying real visual weight on first
              screen, alongside the name. */}
          <p className="text-xl font-medium mt-1 text-brand-caramelDark">{p.price}</p>
          <p className="text-sm mt-2 leading-snug text-brand-inkSoft">{p.sensory}</p>

          {/* Dias de luta only — the curated badge matrix. Suppresses the
              older `canFreeze` list item just below when it's showing
              (that one's less precise: it fires off `moments.includes
              ("freezer")` for every context, which doesn't always match
              the hand-curated badge list — e.g. products whose name
              already says "congelado" deliberately skip the badge). */}
          {showExperience && <ProductBadges badges={p.badges} />}

          {((canFreeze && !showExperience) || isCustomizable) && (
            <ul className="flex flex-col gap-1.5 mt-2.5">
              {canFreeze && !showExperience && (
                <li className="flex items-center gap-2 text-sm text-brand-inkSoft">
                  <span className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center bg-brand-subtle">
                    <Snowflake size={13} className="text-brand-caramelDark" />
                  </span>
                  Pode congelar
                </li>
              )}
              {isCustomizable && (
                <li className="flex items-center gap-2 text-sm text-brand-inkSoft">
                  <span
                    className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${COLORS.caramelLight}30` }}
                  >
                    <Sparkles size={13} className="text-brand-caramelDark" />
                  </span>
                  Escolha seus sabores
                </li>
              )}
            </ul>
          )}

          {/* Mon Caramel's own voice — a short editorial aside, Dias de
              luta only, right before the purchase decision. */}
          {showExperience && <MonCaramelNote label={p.experience?.noteLabel} note={p.experience?.note} />}

          {/* Configuração + CTA — directly on the page, no extra panel
              around it (a prior round wrapped this in its own tinted box;
              the reference just places it right after the note, closely
              spaced, so it reads as the next step, not a separate card). */}
          {isCustomizable ? (
            <div className="mt-4 pt-3 border-t border-dashed border-brand-border">
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
            <div className="flex items-center justify-between mt-4 gap-3">
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
