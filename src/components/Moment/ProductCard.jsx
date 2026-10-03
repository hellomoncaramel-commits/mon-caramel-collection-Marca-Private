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
  // shadow/photo-ratio it already had. Never infer this from `!isFesta`:
  // that would also catch a hypothetical future non-festa, non-dia-dificil
  // caller and silently change its look too.
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
      className={`rounded-3xl bg-white overflow-hidden transition-all duration-200 h-full flex flex-col lg:hover:-translate-y-0.5 ${
        // Dias de luta: no resting border/shadow — the photo and the
        // generous gap between cards (see MomentScreen.jsx) do the work of
        // separating one card from the next, not a box around each one.
        // The "already selected" ring stays — that border means something
        // (it's feedback, not decoration).
        // Festa keeps its border on purpose — it's a portfolio of finished
        // pieces shown edge to edge in a tight 3-column grid, and the frame
        // reads as "mounted photograph," not decoration-for-decoration's-
        // sake; explicitly NOT converging on Dias de luta's borderless look
        // (brief section 11). Only the hover shadow got a touch lighter
        // (shadow-lg → shadow-md), per the global "shadows stay discreet"
        // rule — composition does the depth work, the shadow is just a
        // hover cue.
        isDiaDificil ? "" : isFesta ? "border lg:hover:shadow-md" : "border lg:hover:shadow-lg"
      }`}
      style={
        isDiaDificil
          ? existing
            ? { outline: `2px solid ${COLORS.caramelDark}`, outlineOffset: "-2px" }
            : undefined
          : { borderColor: existing ? COLORS.caramelDark : COLORS.border, borderWidth: existing ? "2px" : "1px" }
      }
    >
      <div
        className={`relative ${onOpenDetail ? "cursor-pointer" : ""}`}
        onClick={onOpenDetail ? () => onOpenDetail(p) : undefined}
      >
        {photos && photos.length > 0 ? (
          <PhotoCarousel photos={photos} alt={p.name} aspectClassName={isDiaDificil ? "aspect-square lg:aspect-photo" : "aspect-photo"} />
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
      <div className={`flex flex-col flex-1 ${isDiaDificil ? "p-3.5 lg:p-5" : "p-4 lg:p-5"}`}>
        {onOpenDetail ? (
          <button onClick={() => onOpenDetail(p)} className="text-left">
            <h3 className="text-lg lg:text-xl font-display text-brand-ink leading-tight">{p.name}</h3>
          </button>
        ) : (
          <h3 className="text-lg font-display text-brand-ink leading-tight">{p.name}</h3>
        )}
        {!isFesta && <p className="text-xs mt-0.5 text-brand-muted">{p.unit}</p>}

        {/* Dias de luta: the short "teaser" carries the vitrine — the full
            sensory description now lives in the detail sheet only (see
            progressive-disclosure split in the brief). Fraunces roman, not
            italic — personality comes from the family + copy, not from
            treating every teaser like a literary quote. Given more
            presence at lg+ (was reading as metadata, not the desire-copy it
            actually is) — size/spacing only, same text. Tightened top
            margin on dia-dificil so name→teaser reads as one block, not two
            stacked elements. Festa keeps showing its own sensory line, kept
            compact at lg+ (2-line clamp) so the photo stays the protagonist
            instead of growing text. */}
        {!isFesta ? (
          <p className={`text-sm lg:text-base leading-relaxed lg:leading-[1.5] flex-1 font-display text-brand-ink ${isDiaDificil ? "mt-1.5 lg:mt-2" : "mt-2 lg:mt-2.5"}`}>
            {p.experience?.teaser ?? p.sensory}
          </p>
        ) : (
          <p className="text-xs mt-2 leading-relaxed flex-1 text-brand-inkSoft lg:line-clamp-2">{p.sensory}</p>
        )}

        {/* "Insight" badges — Dias de luta only (per Naia's brief); Festa's
            card never renders this, even for a product that also carries a
            `badges` array (e.g. Mini Cake Donuts, Cones Trufados, Chocobomb
            are cross-tagged to both moments). */}
        {!isFesta && <ProductBadges badges={p.badges} />}

        {!isFesta && isCustomizable && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
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
            className="w-full mt-3 text-sm font-medium rounded-full px-3.5 min-h-11 flex items-center justify-center gap-1.5 border border-brand-caramelDark"
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
              <span className={isDiaDificil ? "text-xs font-medium text-brand-caramelDark" : "text-sm font-medium text-brand-caramelDark"}>
                {p.price}
              </span>
              <button
                onClick={() =>
                  isCustomizable
                    ? setOpen((o) => !o)
                    : existing
                    ? removeFromSelection(existing)
                    : confirmAdd({ qty: defaultQty, flavorBreakdown: [] })
                }
                className={`font-medium rounded-full min-h-11 inline-flex items-center gap-1 ${
                  // Dias de luta: a quiet text-link affordance, not a bordered
                  // pill competing with the photo above it — the selected
                  // state still needs a filled, obviously-different look, so
                  // that one case keeps a background (just no border).
                  isDiaDificil ? "text-xs px-2.5" : "text-sm px-3.5 border border-brand-caramelDark"
                }`}
                style={{
                  backgroundColor: existing ? COLORS.caramelDark : "transparent",
                  color: existing ? "white" : COLORS.caramelDark,
                }}
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
