import { useState } from "react";
import { Heart, Sparkles } from "lucide-react";
import { COLORS } from "../../styles/colors";
import { MOMENT_ICON } from "../../data/moments";
import { photosForMoment, initialQuantity } from "../../utils/products";
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
//
// Design-refinement pass: the beige card worked as a concept but still read
// as "a big rectangle," not an editorial frame — radius pulled in from 24px
// to 16/12px (card/photo), a near-invisible hairline border added for
// definition instead of relying on color contrast alone, no shadow. Every
// piece of chrome that used to compete with the photo for weight (the
// favorite circle, the carousel arrows, the CTA) got smaller — the visible
// circle/pill shrinks while the tap target stays >=44px via padding, not a
// smaller hit area. Festa untouched throughout.
//
// Final visual QA pass: the content block's own horizontal padding (px-1)
// sat on top of the card's outer p-2, insetting text 12px from the card
// edge while the photo above it (which only gets the outer p-2) sat at 8px
// — a 4px mismatch that read as an implementation seam. Content now shares
// the exact same inset as the photo (no extra horizontal padding of its
// own). Unit stepped down a size to read as true microinformation; teaser
// switched from ink to inkSoft so it's legible but clearly secondary to the
// name above it — hierarchy now comes from weight/color, not just size.
//
// Final-correction pass: the photo was still the single largest lever on
// how much of the card (and the viewport) it ate — stepped from 4:3 down to
// a wider 5:3 just for this card (opt-in via PhotoCarousel's own
// aspectClassName prop, the shared "aspect-photo" token and every other
// caller are untouched), ~20% shorter at the same card width. Card surface
// also eased back a notch so it reads less like a filled rectangle: the
// beige fill and the hairline border both dropped in opacity, and the
// content block got a touch more breathing room at the bottom.
export default function ProductCard({
  p,
  momentId,
  isFesta,
  selection,
  addToSelection,
  removeFromSelection,
  partyItems,
  onOpenPartyModal,
  onOpenDetail,
}) {
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
  // Non-customizable products have no quantity picker — they add at 1,
  // unless the unit text states an explicit minimum (e.g. "mín. 12 un").
  const defaultQty = initialQuantity(p.unit);

  return (
    <div
      className={`overflow-hidden transition-all duration-200 h-full flex flex-col lg:hover:-translate-y-0.5 ${
        // Dias de luta: tight editorial frame — small radius, hairline
        // border for definition, no shadow. The gap between cards (see
        // MomentScreen.jsx) still does most of the work of separating one
        // card from the next; the border is just enough to give this one
        // its own edge, not a heavy box.
        // Festa keeps its own border/shadow/radius on purpose — it's a
        // portfolio of finished pieces shown edge to edge in a tight
        // 3-column grid; explicitly NOT converging on Dias de luta's look.
        isDiaDificil ? "rounded-2xl border p-2" : isFesta ? "rounded-3xl bg-white border lg:hover:shadow-md" : "rounded-3xl bg-white border lg:hover:shadow-lg"
      }`}
      style={
        isDiaDificil
          ? { backgroundColor: existing ? COLORS.subtle : `${COLORS.subtle}D9`, borderColor: existing ? COLORS.caramelDark : `${COLORS.border}80`, borderWidth: existing ? "1.5px" : "1px" }
          : { borderColor: existing ? COLORS.caramelDark : COLORS.border, borderWidth: existing ? "2px" : "1px" }
      }
    >
      <div
        className={`relative ${isDiaDificil ? "rounded-xl overflow-hidden" : ""} ${onOpenDetail ? "cursor-pointer" : ""}`}
        onClick={onOpenDetail ? () => onOpenDetail(p) : undefined}
      >
        {photos && photos.length > 0 ? (
          <PhotoCarousel
            photos={photos}
            alt={p.name}
            compact={isDiaDificil}
            aspectClassName={isDiaDificil ? "aspect-[5/3]" : undefined}
          />
        ) : (
          <ProductArt kind={p.kind} tint={p.tint} contextIcon={MOMENT_ICON[momentId]} />
        )}
      </div>
      <div className={`flex flex-col flex-1 ${isDiaDificil ? "pt-2.5 pb-1.5" : "p-4 lg:p-5"}`}>
        {onOpenDetail ? (
          <button onClick={() => onOpenDetail(p)} className="text-left">
            <h3 className={`font-display text-brand-ink leading-tight ${isDiaDificil ? "text-xl" : "text-lg"}`}>{p.name}</h3>
          </button>
        ) : (
          <h3 className={`font-display text-brand-ink leading-tight ${isDiaDificil ? "text-xl" : "text-lg"}`}>{p.name}</h3>
        )}
        {!isFesta && <p className={`mt-0.5 text-brand-muted ${isDiaDificil ? "text-3xs" : "text-xs"}`}>{p.unit}</p>}

        {/* Dias de luta: the short "teaser" carries the vitrine — the full
            sensory description now lives in the detail sheet only (see
            progressive-disclosure split in the brief). Fraunces roman, not
            italic — personality comes from the family + copy, not from
            treating every teaser like a literary quote. Festa keeps
            showing its own sensory line, kept compact at lg+ (2-line
            clamp) so the photo stays the protagonist instead of growing
            text. */}
        {!isFesta ? (
          <p className={`text-sm leading-snug mt-1 flex-1 font-display ${isDiaDificil ? "text-brand-inkSoft" : "text-brand-ink"}`}>
            {p.experience?.teaser ?? p.sensory}
          </p>
        ) : (
          <p className="text-xs mt-2 leading-relaxed flex-1 text-brand-inkSoft lg:line-clamp-2">{p.sensory}</p>
        )}

        {/* "Insight" badges — Dias de luta only (per Naia's brief); Festa's
            card never renders this, even for a product that also carries a
            `badges` array (e.g. Mini Cake Donuts, Cones Trufados, Chocobomb
            are cross-tagged to both moments). */}
        {!isFesta && <ProductBadges badges={p.badges} onSubtle={isDiaDificil} />}

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
            <div className={`flex items-center justify-between gap-2 ${isDiaDificil ? "mt-2" : "mt-2.5"}`}>
              <span className={`font-medium text-brand-caramelDark ${isDiaDificil ? "text-base" : "text-sm"}`}>{p.price}</span>
              <button
                onClick={() =>
                  isCustomizable
                    ? setOpen((o) => !o)
                    : existing
                    ? removeFromSelection(existing)
                    : confirmAdd({ qty: defaultQty, flavorBreakdown: [] })
                }
                className={`font-medium rounded-full inline-flex items-center gap-1.5 ${
                  isDiaDificil ? "text-xs px-3.5 h-10" : "text-xs px-3.5 min-h-11"
                }`}
                style={{
                  backgroundColor: COLORS.caramelDark,
                  color: "white",
                }}
              >
                <Heart size={isDiaDificil ? 10 : 12} fill="white" />
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
