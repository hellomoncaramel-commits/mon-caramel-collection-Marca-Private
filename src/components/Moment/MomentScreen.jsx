import { Fragment, useMemo, useRef } from "react";
import { Heart, Sparkles } from "lucide-react";
import { COLORS } from "../../styles/colors";
import { MOMENT_INTRO, MOMENT_SHORT } from "../../data/moments";
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

// Short editorial asides dropped between a couple of the rhythm's rows —
// not filters, not categories, not product cards, just Mon Caramel's own
// voice breaking up the scroll. Keyed by chunk index (which row they sit
// before). Used sparingly on purpose (2 of this task's 3 approved lines) —
// dia-dificil, lg+ only; mobile is untouched.
const DIA_DIFICIL_ASIDES = {
  1: "Tá procurando alguma coisa pro café? ☕ Continua descendo. Tem coisa boa vindo.",
  4: "Chegamos oficialmente na parte \"hoje eu mereço\". 💛",
};

// Matched products for the chosen moment (dia-dificil or festa —
// "presente" has its own dedicated PresenteScreen), plus cross-sell
// discovery and the "Minha Seleção" / "Minha Festa" baskets.
export default function MomentScreen({
  momentId,
  onBack,
  onSend,
  onOpenProduct,
  favorites,
  toggleFavorite,
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
    favorites,
    toggleFavorite,
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
      {/* Design-refinement pass: Dias de luta gets the compact header every
          other catalog-style screen already uses (small logo, not the big
          centered Home lockup) — the branding stays present but stops
          eating the first viewport. Festa keeps the default (unchanged). */}
      <SiteHeader onBack={onBack} logoSize={isDiaDificil ? "sm" : "home"} rowHeight={isDiaDificil ? 56 : 76} />

      {/* Design-refinement pass: Dias de luta now gets an actual title —
          reusing the shared mc-page-title/mc-page-subtitle pair every other
          screen (Busca, Minha Seleção, Presentes, Caixas/Bandejas/Mimos)
          already uses, instead of letting the long intro paragraph alone
          carry headline weight. MOMENT_SHORT is existing copy (already the
          moment's own short name, used elsewhere for nav/shortcuts) — no
          new text invented. Festa is untouched: same single intro
          paragraph at the same size it always had. */}
      {isDiaDificil ? (
        <>
          <h1 className="mc-page-title">{MOMENT_SHORT[momentId]}</h1>
          <p className="mc-page-subtitle max-w-xs sm:max-w-md lg:max-w-xl">{MOMENT_INTRO[momentId]}</p>
        </>
      ) : (
        MOMENT_INTRO[momentId] && (
          <p className="text-lg sm:text-xl lg:text-2xl leading-snug mb-4 lg:mb-6 font-display text-brand-ink max-w-xs sm:max-w-md lg:max-w-xl">
            {MOMENT_INTRO[momentId]}
          </p>
        )
      )}

      {/* Mobile/tablet (all moments) and the lg+ grid for every moment
          OTHER than dia-dificil (Festa explicitly keeps this same simple,
          uniform 3-column grid at desktop too — see section 11 of the
          brief: Festa is a portfolio, not the "controlled editorial grid"
          below). Below lg this is the only grid rendered.
          Dias de luta only: 15 visually-identical cards in a row read as
          monotonous, so the same two editorial asides already used to
          break up the lg+ rhythm (DIA_DIFICIL_ASIDES below) now also land
          here, at the same product-count boundaries — reusing existing
          copy, not inventing new text. `col-span-full` breaks each aside
          across both the 1-col and sm:2-col widths so it never sits beside
          a product card. Festa (and anything else) keeps the plain flat
          map it always had. */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5 ${
          isDiaDificil ? "lg:hidden" : "lg:grid-cols-3"
        }`}
      >
        {isDiaDificil
          ? chunkEditorialRhythm(matched).map((chunk, i) => (
              <Fragment key={i}>
                {/* Design-refinement pass: this was a centered, full-bleed
                    band (py-6, text-lg, icon above text) reading as its own
                    mini-screen. Pulled down to a compact single-line-ish
                    note: small heart beside the text, left-aligned, meant
                    to be read in ~2 seconds, not a pause. */}
                {DIA_DIFICIL_ASIDES[i] && (
                  <div className="col-span-full -mx-gutter px-gutter py-5 flex items-center gap-2.5" style={{ backgroundColor: `${COLORS.caramelLight}1A` }}>
                    <Heart size={14} className="shrink-0" fill={COLORS.caramelDark} stroke={COLORS.caramelDark} />
                    <p className="font-display text-base leading-snug text-brand-ink">{DIA_DIFICIL_ASIDES[i]}</p>
                  </div>
                )}
                {chunk.map((p) => (
                  <ProductCard key={p.id} p={p} momentId={momentId} {...cardProps} />
                ))}
              </Fragment>
            ))
          : matched.map((p) => <ProductCard key={p.id} p={p} momentId={momentId} {...cardProps} />)}
      </div>

      {/* Dias de luta, lg+ only: the editorial 2-up/3-up rhythm grid, with
          at most a couple of short editorial asides breaking up the scroll.
          Same `matched` array/order/ProductCard/cardProps as the grid
          above — just a different row structure.
          Design-refinement pass: a 2-up row used to stretch both cards to
          fill the full container width (~580px cards) — exactly the "mobile
          card blown up" look that was flagged. A 2-item chunk now caps its
          own row width instead of stretching to fill the container.
          Final visual QA pass: that capped row was centered (mx-auto),
          which floated it in the middle of the container disconnected from
          everything else — the title, intro and every 3-up row above/below
          it all sit flush with the container's left edge. Left-aligning it
          instead anchors it to that same edge, with the negative space
          deliberately on the right, reading as one consistent composition
          rather than a centered block dropped into a left-aligned page. */}
      {isDiaDificil && (
        <div className="hidden lg:block">
          {chunkEditorialRhythm(matched).map((chunk, i) => (
            <div key={i}>
              {DIA_DIFICIL_ASIDES[i] && (
                <div className="px-8 py-5 my-5 rounded-2xl flex items-center justify-center gap-3" style={{ backgroundColor: `${COLORS.caramelLight}1A` }}>
                  <Heart size={16} className="shrink-0" fill={COLORS.caramelDark} stroke={COLORS.caramelDark} />
                  <p className="font-display text-lg leading-snug text-brand-ink max-w-lg">{DIA_DIFICIL_ASIDES[i]}</p>
                </div>
              )}
              <div
                className={`grid gap-5 ${
                  chunk.length === 2 ? "grid-cols-2 max-w-[720px]" : "grid-cols-3"
                } ${i > 0 && !DIA_DIFICIL_ASIDES[i] ? "mt-5" : ""}`}
              >
                {chunk.map((p) => (
                  <ProductCard key={p.id} p={p} momentId={momentId} {...cardProps} />
                ))}
              </div>
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
        // whole 7xl product grid — PartyPanel itself is untouched.
        <div className="lg:max-w-2xl lg:mx-auto">
          <PartyPanel
            ref={partyPanelRef}
            items={party.items}
            theme={party.theme}
            notes={party.notes}
            onSubmit={() => onSend(buildPartyMessage({ items: party.items, theme: party.theme, notes: party.notes }))}
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
