import { useMemo, useRef } from "react";
import { Heart, Sparkles } from "lucide-react";
import { MOMENT_INTRO } from "../../data/moments";
import { pickForMoment, pickCrossSell } from "../../utils/products";
import { buildPartyMessage } from "../../utils/messages";
import { useParty } from "../../hooks/useParty";
import SiteHeader from "../shared/SiteHeader";
import Toast from "../shared/Toast";
import ProductCard from "./ProductCard";
import PartyPanel from "../Party/PartyPanel";
import PartyModal from "../Party/PartyModal";
import PartyFloatingButton from "../Party/PartyFloatingButton";

// Dias de luta only, lg+ only: breaks the product list into an alternating
// 2-up/3-up rhythm (2,3,2,3,...) instead of one uniform grid — a
// "controlled editorial grid," not masonry. Never reorders `matched` itself
// (same products, same sequence; this only decides how many sit in each
// row). With 15 dia-dificil products the pattern divides evenly (2+3
// repeated 3×=15); any other count just ends on a partial final row, which
// is fine — the rhythm doesn't need to land on a round number.
function chunkEditorialRhythm(items) {
  const pattern = [2, 3];
  const chunks = [];
  let i = 0;
  let p = 0;
  while (i < items.length) {
    const size = pattern[p % pattern.length];
    chunks.push(items.slice(i, i + size));
    i += size;
    p += 1;
  }
  return chunks;
}

// Matched products for the chosen moment (dia-dificil or festa —
// "presente" has its own dedicated PresenteScreen), plus cross-sell
// discovery and the "Minha Seleção" / "Minha Festa" baskets.
export default function MomentScreen({
  momentId,
  onBack,
  onSend,
  onOpenProduct,
  onGoCatalog,
  selection,
  addToSelection,
  removeFromSelection,
  onOpenSelection,
}) {
  const matched = useMemo(() => pickForMoment(momentId), [momentId]);
  const crossSell = useMemo(() => pickCrossSell(momentId, matched), [momentId, matched]);
  const isFesta = momentId === "festa";
  const isDiaDificil = momentId === "dia-dificil";

  const party = useParty();
  const partyPanelRef = useRef(null);

  const cardProps = {
    isFesta,
    selection,
    addToSelection,
    removeFromSelection,
    partyItems: party.items,
    onOpenPartyModal: party.openModal,
    // The Mon Caramel Experience layer (teaser styling aside, which lives
    // directly in ProductCard) is Dias de luta-only — Festa's card never
    // receives this, so tapping a Festa card can't open a detail sheet.
    onOpenDetail: isDiaDificil ? (p) => onOpenProduct(p, "dia-dificil") : undefined,
  };

  return (
    // pb-10: matches every other scrollable page's own bottom padding — the
    // app shell's outer pb-24 wrapper (App.jsx) already clears the fixed
    // bottom nav on its own, so this only needs to close out the content,
    // not double up on nav clearance (Festa's floating button is `fixed`,
    // independent of this padding either way).
    // Design-refinement pass: Dias de luta's desktop container is narrower
    // (max-w-[1180px] vs the shared 6xl/7xl) — a 3-up row at the old width
    // put ~380px+ cards on screen, and a 2-up row put ~580px ones, both far
    // past "card with real composition." Festa (and anything else reusing
    // this screen) keeps the original container untouched.
    <div
      className={`max-w-2xl mx-auto px-gutter pt-2 pb-10 fade-up ${
        isDiaDificil ? "lg:max-w-[1180px] lg:px-10" : "lg:max-w-6xl xl:max-w-7xl lg:px-8 xl:px-12"
      }`}
    >
      {/* Design-refinement pass: Dias de luta gets a compact header row,
          not the big centered Home lockup — the branding stays present but
          stops eating the first viewport. Festa keeps the default
          (unchanged).
          Visual-correction pass: logoSize bumped from the original "sm" to
          "diaDificilLogo" (Logo.jsx) — the same cropped+zoomed rendering
          MomentPicker's "heroLogo" uses, just a smaller box, so Dias de
          luta's branding reads as "intermediate" — clearly bigger than
          before, but deliberately less prominent than MomentPicker's own
          (the more brand-forward of the two screens). rowHeight nudged up
          to give it room; still clearly more compact than the 76px/"home"
          default every other screen's header uses. */}
      <SiteHeader onBack={onBack} logoSize={isDiaDificil ? "diaDificilLogo" : "home"} rowHeight={isDiaDificil ? 78 : 76} />

      {/* Simplification pass: Dias de luta no longer shows its own
          title/intro block here — products now enter the experience
          directly, right under the compact header above. MOMENT_SHORT/
          MOMENT_INTRO still exist and are used elsewhere (MomentPicker,
          nav shortcuts) — this is purely a "don't render it on this
          screen" change, not a data removal. Festa is untouched: same
          single intro paragraph at the same size it always had. */}
      {!isDiaDificil &&
        MOMENT_INTRO[momentId] && (
          <p className="text-lg sm:text-xl lg:text-2xl leading-snug mb-4 lg:mb-6 font-display text-brand-ink max-w-xs sm:max-w-md lg:max-w-xl">
            {MOMENT_INTRO[momentId]}
          </p>
        )}

      {/* Mobile/tablet (all moments) and the lg+ grid for every moment
          OTHER than dia-dificil (Festa explicitly keeps this same simple,
          uniform 3-column grid at desktop too — see section 11 of the
          brief: Festa is a portfolio, not the "controlled editorial grid"
          below). Below lg this is the only grid rendered.
          Simplification pass: the two editorial "chapter break" cards that
          used to interrupt this flow (DIA_DIFICIL_ASIDES) were removed —
          products now scroll continuously, same order, no inserted cards
          and no filler left in their place. Dias de luta no longer needs
          its own chunked/Fragment rendering here (that existed only to
          place those asides) — a plain flat map, same as every other
          moment. */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5 ${
          isDiaDificil ? "mt-3 lg:hidden" : "lg:grid-cols-3"
        }`}
      >
        {matched.map((p) => (
          <ProductCard key={p.id} p={p} momentId={momentId} {...cardProps} />
        ))}
      </div>

      {/* Dias de luta, lg+ only: the editorial 2-up/3-up rhythm grid — an
          alternating row size (not a uniform grid), kept as-is. Same
          `matched` array/order/ProductCard/cardProps as the grid above —
          just a different row structure.
          Simplification pass: the editorial aside cards that used to
          optionally fill a 2-item row's spare third track were removed
          (see note above) — every 2-item row's third track is now always
          true empty grid space, same negative space every other column
          already belongs to, never a custom-sized leftover or a filler
          message.
          Final-correction pass: a 2-item row used to be its own
          narrower grid (grid-cols-2, capped width), which made its cards a
          different width than every 3-up row's cards and left a block of
          plain negative space beside it that read as a missing third card,
          not a deliberate composition. Every row — 2-item or 3-item — now
          shares the exact same grid-cols-3 track, so card width never
          changes between rows. */}
      {isDiaDificil && (
        <div className="hidden lg:block lg:mt-4">
          {chunkEditorialRhythm(matched).map((chunk, i) => (
            <div key={i} className={`grid grid-cols-3 gap-5 ${i > 0 ? "mt-5" : ""}`}>
              {chunk.map((p) => (
                <ProductCard key={p.id} p={p} momentId={momentId} {...cardProps} />
              ))}
            </div>
          ))}
        </div>
      )}

      {crossSell.length > 0 && momentId !== "dia-dificil" && momentId !== "festa" && (
        <div className="mt-9">
          <div className="flex items-center gap-2 mb-1 text-brand-caramelDark">
            <Sparkles size={16} />
            <span className="text-2xs uppercase tracking-wide font-medium">Já que você tá por aqui...</span>
          </div>
          <p className="text-sm mb-4 text-brand-muted">Coisas que combinam com outros momentos, mas ninguém disse que era só um.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {crossSell.map((p) => (
              <ProductCard key={p.id} p={p} momentId={momentId} {...cardProps} />
            ))}
          </div>
        </div>
      )}

      {isFesta ? (
        // Capped at lg+ so the planner panel doesn't stretch across the
        // whole 7xl product grid.
        <div className="lg:max-w-2xl lg:mx-auto">
          <PartyPanel
            ref={partyPanelRef}
            items={party.items}
            theme={party.theme}
            notes={party.notes}
            onSubmit={() => onSend(buildPartyMessage({ items: party.items, theme: party.theme, notes: party.notes }))}
            onRemoveItem={party.removeItem}
          />
        </div>
      ) : (
        selection.length > 0 && (
          <div className="mt-6 rounded-2xl border border-brand-caramelDark p-4 bg-white/95 backdrop-blur lg:max-w-md lg:mx-auto">
            <p className="text-xs uppercase tracking-wide mb-2 text-brand-muted">Você escolheu ({selection.length})</p>
            <button
              onClick={onOpenSelection}
              className="w-full text-sm font-medium text-white bg-brand-caramelDark rounded-full py-3 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Heart size={15} />
              Ver Minha Seleção
            </button>
          </div>
        )
      )}

      {party.modalProduct && (
        <PartyModal
          product={party.modalProduct}
          sharedTheme={party.theme}
          sharedNotes={party.notes}
          existingQty={party.items.find((it) => it.id === party.modalProduct.id)?.qty}
          onCancel={party.closeModal}
          onConfirm={party.confirmAdd}
        />
      )}

      {/* Dias de luta is meant to be the whole day-to-day universe — no
          parallel "catalog" exit. Festa keeps this link. */}
      {!isDiaDificil && (
        <button onClick={onGoCatalog} className="w-full text-center text-xs mt-8 py-2 underline text-brand-muted lg:max-w-md lg:mx-auto lg:block">
          Não encontrou o que imaginava? Explore toda a coleção.
        </button>
      )}

      {isFesta && (
        <PartyFloatingButton
          count={party.items.length}
          onClick={() => partyPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
        />
      )}

      <Toast message={isFesta ? party.toast : null} />
    </div>
  );
}
