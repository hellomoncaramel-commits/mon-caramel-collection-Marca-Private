import { useMemo, useRef, useState } from "react";
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

// A cross-sell reaction line shouldn't fire on every single add — that
// reads as bombarding, not spontaneous. One is enough per stretch of
// browsing; this is how long before another is allowed to show.
const CROSS_SELL_COOLDOWN_MS = 60_000;

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

  // Dias de luta's own "reação Mon Caramel" on add — a quiet confirmation
  // that occasionally (never every time — see CROSS_SELL_COOLDOWN_MS below)
  // becomes a soft cross-sell nudge instead, reusing that same product's
  // hand-written `experience.nextTemptation` line rather than inventing new
  // copy for the toast.
  const [addReaction, setAddReaction] = useState(null);
  const reactionTimeoutRef = useRef(null);
  const lastCrossSellAtRef = useRef(0);

  const handleProductAdded = (product) => {
    const temptation = product.experience?.nextTemptation;
    const now = Date.now();
    // The cooldown alone would make the very first add of a session always
    // qualify (nothing shown yet to be "recent"), which isn't "occasional"
    // — the coin flip keeps it feeling spontaneous even then.
    const showCrossSell =
      Boolean(temptation) && now - lastCrossSellAtRef.current > CROSS_SELL_COOLDOWN_MS && Math.random() < 0.5;
    if (showCrossSell) lastCrossSellAtRef.current = now;
    const message = showCrossSell
      ? `Boa escolha. Agora eu vou fazer meu trabalho de te tentar: ${temptation.line}`
      : `${product.name} entrou pra sua seleção 💛`;
    setAddReaction(message);
    clearTimeout(reactionTimeoutRef.current);
    reactionTimeoutRef.current = setTimeout(() => setAddReaction(null), showCrossSell ? 3400 : 2200);
  };

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
    // receives these two, so tapping a Festa card can't open a detail sheet
    // and adding to Minha Festa never triggers the reaction toast.
    onOpenDetail: isDiaDificil ? (p) => onOpenProduct(p, "dia-dificil") : undefined,
    onAdded: isDiaDificil ? handleProductAdded : undefined,
  };

  return (
    // pb-10: matches every other scrollable page's own bottom padding — the
    // app shell's outer pb-24 wrapper (App.jsx) already clears the fixed
    // bottom nav on its own, so this only needs to close out the content,
    // not double up on nav clearance (Festa's floating button is `fixed`,
    // independent of this padding either way).
    <div className="max-w-2xl mx-auto px-gutter pt-2 pb-10 fade-up">
      <SiteHeader onBack={onBack} />

      {MOMENT_INTRO[momentId] && (
        <p className="text-base leading-relaxed mb-6 font-subtitle italic text-brand-inkSoft">{MOMENT_INTRO[momentId]}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {matched.map((p) => (
          <ProductCard key={p.id} p={p} momentId={momentId} {...cardProps} />
        ))}
      </div>

      {crossSell.length > 0 && momentId !== "dia-dificil" && momentId !== "festa" && (
        <div className="mt-9">
          <div className="flex items-center gap-2 mb-1 text-brand-caramelDark">
            <Sparkles size={16} />
            <span className="text-2xs uppercase tracking-wide font-medium">Já que você tá por aqui...</span>
          </div>
          <p className="text-sm mb-4 text-brand-muted">Coisas que combinam com outros momentos, mas ninguém disse que era só um.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {crossSell.map((p) => (
              <ProductCard key={p.id} p={p} momentId={momentId} {...cardProps} />
            ))}
          </div>
        </div>
      )}

      {isFesta ? (
        <PartyPanel
          ref={partyPanelRef}
          items={party.items}
          theme={party.theme}
          notes={party.notes}
          onSubmit={() => onSend(buildPartyMessage({ items: party.items, theme: party.theme, notes: party.notes }))}
        />
      ) : (
        selection.length > 0 && (
          <div className="mt-6 rounded-2xl border border-brand-caramelDark p-4 bg-white/95 backdrop-blur">
            <p className="text-xs uppercase tracking-wide mb-2 text-brand-muted">Você escolheu ({selection.length})</p>
            <button
              onClick={onOpenSelection}
              className="w-full text-sm font-medium text-white bg-brand-caramelDark rounded-full py-3 flex items-center justify-center gap-2"
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

      <button onClick={onGoCatalog} className="w-full text-center text-xs mt-8 py-2 underline text-brand-muted">
        Não encontrou o que imaginava? Explore toda a coleção.
      </button>

      {isFesta && (
        <PartyFloatingButton
          count={party.items.length}
          onClick={() => partyPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
        />
      )}

      <Toast message={isFesta ? party.toast : addReaction} />
    </div>
  );
}
