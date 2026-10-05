import { Fragment, useMemo, useRef } from "react";
import { Heart, Sparkles } from "lucide-react";
import { COLORS } from "../../styles/colors";
import { MOMENT_INTRO } from "../../data/moments";
import { REAL_PHOTOS } from "../../data/photos";
import { pickForMoment, pickCrossSell } from "../../utils/products";
import { buildPartyMessage } from "../../utils/messages";
import { useParty } from "../../hooks/useParty";
import SiteHeader from "../shared/SiteHeader";
import Toast from "../shared/Toast";
import Photo from "../shared/Photo";
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
// shown on mobile AND desktop now (see EditorialAside below).
//
// Real-photos pass: each aside now carries a real product photo instead of
// reading as plain text — the product was picked because it actually
// carries the badge the aside is about (never an unrelated photo standing
// in for a vibe). No AI, no stock — both are existing files already used
// elsewhere in the catalog (see data/photos.js / data/products.js).
//
// Third visual-audit pass (the split-card concept rejected outright):
// two earlier rounds kept trying to fix the aside by inflating one half of
// a text-panel + photo-panel split (bigger photo, bigger photo again,
// bigger/bolder text) — Naia's call: "o problema não foi resolvido... o
// EditorialAside continua parecendo um bloco/template... a direção visual
// do split card está descartada." Replaced entirely with a single
// full-bleed photo card (MomentPicker's own proven language — photo fills
// the box, a localized scrim behind the text only, nothing else) instead
// of a beige panel beside a photo panel. `photo` swapped for the crop that
// actually reads well full-bleed (tested both biscoitoAmanteigadoCafe and
// biscoitoVariedade for the café aside — amanteigado-cafe's round plate
// leaves bare counter/plate at the frame edges at this card's short+wide
// ratio, biscoitoVariedade is a dense edge-to-edge tray with no dead space
// anywhere it gets cropped). Copy trimmed too — "Tá procurando alguma
// coisa pro café?" added words without adding desire, per Naia's note;
// cut down to the eyebrow + one direct line each.
//
// Fourth visual-audit pass: the second aside used REAL_PHOTOS.chocobomb
// at first, but that's the exact same photo Chocobomb's own ProductCard
// shows a few rows down — Naia's call: it made the aside read as a
// preview/repeat of that product card instead of a separate editorial
// moment. Swapped to REAL_PHOTOS.brownlitoRecheio (the cross-section shot
// — dark chocolate shell, visible cream filling, strawberry slices) purely
// as indulgent editorial photography, not a claim that Brownlito itself
// carries a "hoje eu mereço" badge (it doesn't — see its own "hardTimes"
// badge below). Not used by any nearby ProductCard's default photo, so no
// repeat-preview problem here.
const DIA_DIFICIL_ASIDES = {
  // Biscoito Amanteigado ("butter-cookies" in products.js) carries the
  // "coffee" badge — the one dia-dificil product most directly about café.
  1: {
    eyebrow: "☕ Pro café",
    headline: "Continua descendo que tem mais coisa boa vindo.",
    photo: REAL_PHOTOS.biscoitoVariedade,
    photoAlt: "Biscoitos amanteigados variados",
  },
  4: {
    eyebrow: "💛 Hoje eu mereço",
    headline: "Agora a gente entrou nessa parte.",
    photo: REAL_PHOTOS.brownlitoRecheio,
    photoAlt: "Brownlito recheado, cortado ao meio, com morango",
    // Source photo is a tall portrait crop (whole strawberries + plate up
    // top, the actual cut cross-section — chocolate shell, cream, morango
    // — lower in frame). This card's row layout is short and very wide, so
    // object-cover only ever shows a thin horizontal slice of the source;
    // biased down to ~63% to land that slice on the cross-section itself,
    // not the bare plate above it or the whole uncut strawberries.
    objectPosition: "center 63%",
  },
};

// A small full-bleed editorial "chapter break" — a real photo filling the
// whole card, a scrim localized just behind the text (not the whole
// photo), no CTA, no separate beige panel. Same language MomentPicker's
// own approved moment cards already use (photo → localized scrim → text),
// just in this card's own short/wide (row) or taller (column) shape,
// built differently from ProductCard on purpose (no price, no badges) so
// it never reads as just another product.
//
// `layout="row"` (mobile full-width band, desktop standalone band before a
// 3-item row): short and wide (h-36, ~144px) — text sits top-left-ish in a
// clear zone, scrim fades left-to-right so the photo reads clearly on the
// right. `layout="column"` (folded into a 2-item row's spare third grid
// track on desktop): taller, portrait-leaning (aspect-[4/5]) to sit
// comfortably beside a ProductCard — scrim fades bottom-to-top instead,
// same "MomentPicker card" logic turned 90°, text anchored at the bottom.
const EDITORIAL_SCRIM_ROW = `linear-gradient(to right, ${COLORS.ink}DE 0%, ${COLORS.ink}B3 28%, ${COLORS.ink}4D 52%, ${COLORS.ink}00 74%)`;
const EDITORIAL_SCRIM_COLUMN = `linear-gradient(to top, ${COLORS.ink}E0 0%, ${COLORS.ink}B3 30%, ${COLORS.ink}40 58%, ${COLORS.ink}00 78%)`;

function EditorialAside({ aside, layout = "row" }) {
  const isColumn = layout === "column";
  return (
    <div className={`relative overflow-hidden rounded-2xl ${isColumn ? "h-full" : "h-36"}`}>
      <Photo
        src={aside.photo}
        alt={aside.photoAlt}
        className="absolute inset-0 w-full h-full object-cover"
        style={aside.objectPosition ? { objectPosition: aside.objectPosition } : undefined}
        loading="lazy"
      />
      <div className="absolute inset-0" style={{ background: isColumn ? EDITORIAL_SCRIM_COLUMN : EDITORIAL_SCRIM_ROW }} />
      <div
        className={`absolute flex flex-col ${isColumn ? "inset-x-0 bottom-0 justify-end p-4" : "inset-y-0 left-0 justify-center pl-5 pr-3"}`}
        style={{ maxWidth: isColumn ? undefined : "64%" }}
      >
        <span className="text-3xs font-semibold uppercase tracking-wider mb-1.5 text-white/85">{aside.eyebrow}</span>
        <p className="font-display leading-snug text-white" style={{ fontSize: 21 }}>
          {aside.headline}
        </p>
      </div>
    </div>
  );
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
          isDiaDificil ? "mt-3 lg:hidden" : "lg:grid-cols-3"
        }`}
      >
        {isDiaDificil
          ? chunkEditorialRhythm(matched).map((chunk, i) => (
              <Fragment key={i}>
                {/* Real-photos pass: this was plain text in a tinted band
                    (no photo) — now a real-photo mini-card (EditorialAside,
                    "row" layout), so it reads as a small chapter of the
                    catalog rather than a banner cutting across the grid. */}
                {DIA_DIFICIL_ASIDES[i] && (
                  <div className="col-span-full">
                    <EditorialAside aside={DIA_DIFICIL_ASIDES[i]} layout="row" />
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
          Final-correction pass: a 2-item row used to be its own
          narrower grid (grid-cols-2, capped width), which made its cards a
          different width than every 3-up row's cards and left a block of
          plain negative space beside it that read as a missing third card,
          not a deliberate composition. Every row — 2-item or 3-item — now
          shares the exact same grid-cols-3 track, so card width never
          changes between rows. A 2-item row's third track either carries
          the next DIA_DIFICIL_ASIDES line (existing copy, no filler
          invented) when one lines up with that row, or is left as true
          empty grid space — negative space that belongs to the same system
          as every other column, not a custom-sized leftover. */}
      {isDiaDificil && (
        <div className="hidden lg:block lg:mt-4">
          {chunkEditorialRhythm(matched).map((chunk, i) => {
            const aside = DIA_DIFICIL_ASIDES[i];
            // Only fold the aside into the row when it actually has a
            // spare third track to sit in — a 3-item row already fills all
            // three, so its aside (if any) stays as its own compact band
            // above the row, just width-capped instead of stretched edge
            // to edge.
            const asideInRow = Boolean(aside) && chunk.length === 2;
            return (
              <div key={i}>
                {aside && !asideInRow && (
                  <div className="max-w-xl my-5">
                    <EditorialAside aside={aside} layout="row" />
                  </div>
                )}
                <div className={`grid grid-cols-3 gap-5 ${i > 0 && (!aside || asideInRow) ? "mt-5" : ""}`}>
                  {chunk.map((p) => (
                    <ProductCard key={p.id} p={p} momentId={momentId} {...cardProps} />
                  ))}
                  {asideInRow && <EditorialAside aside={aside} layout="column" />}
                </div>
              </div>
            );
          })}
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
