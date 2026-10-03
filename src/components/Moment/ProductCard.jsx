import { useState } from "react";
import { Heart, Sparkles } from "lucide-react";
import { COLORS } from "../../styles/colors";
import { MOMENT_ICON } from "../../data/moments";
import { photosForMoment, parseQuantityOptions } from "../../utils/products";
import PhotoCarousel from "../shared/PhotoCarousel";
import ProductArt from "../shared/ProductArt";
import ProductBadges from "../shared/ProductBadges";
import FlavorConfigurator from "./FlavorConfigurator";

// A single product card — photo first, everything else light. Doubles as
// the "Minha Seleção" flavor configurator entry point outside Festa, and as
// a plain "add to Minha Festa" trigger inside Festa (these two flows never
// mix — see hooks/useParty.js).
//
// Visual-correction pass: an earlier round gave repeated "featured" cards
// (bigger photo, name overlaid) to the lead item of every editorial-rhythm
// chunk — with 6 chunks that meant 6 featured products, which defeats
// hierarchy (when everything is emphasized, nothing is). Removed entirely:
// every card now uses the same compact composition, matching the approved
// reference density. Hierarchy in Dias de luta now comes from the editorial
// asides and intro, not from inflating individual cards.
//
// Photo/composition-balance pass: the photo alone was still reading as
// nearly the whole card, with the name/price/CTA underneath feeling like
// loose metadata rather than part of one designed piece. For Dias de luta,
// the photo is now inset inside a warm beige card (p-2, COLORS.subtle)
// instead of bleeding to the card's own edges — "a photograph mounted on a
// card," not "a photo that is the card" — and the text block below got a
// real type-scale bump (name/price/CTA) so it carries enough visual weight
// to balance the photo instead of trailing off as small print. Festa is
// untouched: still bg-white, border, photo flush to the card's top edge.
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
  onOpenDetail,
}) {
  const isFav = favorites.includes(p.id);
  const isCustomizable = p.customizable === true;
  const existing = selection.find((it) => it.kind === "product" && it.productId === p.id);
  const [open, setOpen] = useState(false);
  const partyEntry = partyItems?.find((it) => it.id === p.id);
  // Only Dias de luta gets this round's lighter, photo-forward treatment —
  // Festa (and anything else reusing this card) keeps the exact border/
  // shadow it already had. Never infer this from `!isFesta`: that would
  // also catch a hypothetical future non-festa, non-dia-dificil caller and
  // silently change its look too.
  const isDiaDificil = momentId === "dia-dificil";

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
      className={`rounded-3xl overflow-hidden transition-all duration-200 h-full flex flex-col lg:hover:-translate-y-0.5 ${
        // Dias de luta: no resting border/shadow — the photo and the
        // gap between cards (see MomentScreen.jsx) do the work of
        // separating one card from the next, not a box around each one.
        // The "already selected" ring stays — that border means something
        // (it's feedback, not decoration).
        // Festa keeps its border on purpose — it's a portfolio of finished
        // pieces shown edge to edge in a tight 3-column grid, and the frame
        // reads as "mounted photograph," not decoration-for-decoration's-
        // sake; explicitly NOT converging on Dias de luta's borderless look.
        isDiaDificil ? "p-2" : isFesta ? "bg-white border lg:hover:shadow-md" : "bg-white border lg:hover:shadow-lg"
      }`}
      style={
        isDiaDificil
          ? {
              backgroundColor: COLORS.subtle,
              ...(existing ? { outline: `2px solid ${COLORS.caramelDark}`, outlineOffset: "-2px" } : {}),
            }
          : { borderColor: existing ? COLORS.caramelDark : COLORS.border, borderWidth: existing ? "2px" : "1px" }
      }
    >
      <div
        className={`relative ${isDiaDificil ? "rounded-2xl overflow-hidden" : ""} ${onOpenDetail ? "cursor-pointer" : ""}`}
        onClick={onOpenDetail ? () => onOpenDetail(p) : undefined}
      >
        {photos && photos.length > 0 ? (
          <PhotoCarousel photos={photos} alt={p.name} />
        ) : (
          <ProductArt kind={p.kind} tint={p.tint} contextIcon={MOMENT_ICON[momentId]} />
        )}
        {!isFesta && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(p.id);
            }}
            className="absolute top-2 right-2 w-11 h-11 rounded-full bg-white/90 flex items-center justify-center"
            aria-label={isFav ? `Remover ${p.name} dos salvos` : `Salvar ${p.name}`}
            aria-pressed={isFav}
          >
            <Heart size={16} fill={isFav ? COLORS.caramelDark : "none"} stroke={COLORS.caramelDark} />
          </button>
        )}
      </div>
      <div className={`flex flex-col flex-1 ${isDiaDificil ? "pt-3 px-0.5 pb-1" : "p-4 lg:p-5"}`}>
        {onOpenDetail ? (
          <button onClick={() => onOpenDetail(p)} className="text-left">
            <h3 className={`font-display text-brand-ink leading-tight ${isDiaDificil ? "text-xl" : "text-lg"}`}>{p.name}</h3>
          </button>
        ) : (
          <h3 className={`font-display text-brand-ink leading-tight ${isDiaDificil ? "text-xl" : "text-lg"}`}>{p.name}</h3>
        )}
        {!isFesta && <p className="text-xs mt-0.5 text-brand-muted">{p.unit}</p>}

        {/* Dias de luta: the short "teaser" carries the vitrine — the full
            sensory description now lives in the detail sheet only (see
            progressive-disclosure split in the brief). Fraunces roman, not
            italic — personality comes from the family + copy, not from
            treating every teaser like a literary quote. Festa keeps
            showing its own sensory line, kept compact at lg+ (2-line
            clamp) so the photo stays the protagonist instead of growing
            text. */}
        {!isFesta ? (
          <p className="text-sm leading-snug mt-1 flex-1 font-display text-brand-ink">{p.experience?.teaser ?? p.sensory}</p>
        ) : (
          <p className="text-xs mt-2 leading-relaxed flex-1 text-brand-inkSoft lg:line-clamp-2">{p.sensory}</p>
        )}

        {/* "Insight" badges — Dias de luta only (per Naia's brief); Festa's
            card never renders this, even for a product that also carries a
            `badges` array (e.g. Mini Cake Donuts, Cones Trufados, Chocobomb
            are cross-tagged to both moments). */}
        {!isFesta && <ProductBadges badges={p.badges} />}

        {!isFesta && isCustomizable && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <span
              className="inline-flex items-center gap-1 text-3xs font-medium rounded-full px-2 py-1"
              style={{ backgroundColor: `${COLORS.caramelLight}30`, color: COLORS.caramelDark }}
            >
              <Sparkles size={10} /> Escolha seus sabores ✨
            </span>
          </div>
        )}

        {isFesta ? (
          <button
            onClick={() => onOpenPartyModal(p)}
            className="w-full mt-2.5 text-sm font-medium rounded-full px-3.5 min-h-11 flex items-center justify-center gap-1.5 border border-brand-caramelDark"
            style={{
              backgroundColor: partyEntry ? COLORS.caramelDark : "transparent",
              color: partyEntry ? "white" : COLORS.caramelDark,
            }}
          >
            🎉 {partyEntry ? `Na minha festa (${partyEntry.qty})` : "Adicionar à Minha Festa"}
          </button>
        ) : (
          <>
            {/* CTA restored to real presence — a prior round made this a
                quiet text link for Dias de luta, which went too discreet:
                "Quero esse" is the one important action on the card and
                reads better as a small filled pill, same as Festa's own
                CTA and the approved reference, not a plain word in the
                corner. */}
            <div className="flex items-center justify-between mt-2.5 gap-2">
              <span className={`font-medium text-brand-caramelDark ${isDiaDificil ? "text-base" : "text-sm"}`}>{p.price}</span>
              <button
                onClick={() =>
                  isCustomizable
                    ? setOpen((o) => !o)
                    : existing
                    ? removeFromSelection(existing)
                    : confirmAdd({ qty: defaultQty, flavorBreakdown: [] })
                }
                className={`font-medium rounded-full px-3.5 min-h-11 inline-flex items-center gap-1.5 ${isDiaDificil ? "text-sm" : "text-xs"}`}
                style={{
                  backgroundColor: COLORS.caramelDark,
                  color: "white",
                }}
              >
                <Heart size={12} fill="white" />
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
