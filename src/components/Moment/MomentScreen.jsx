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

// Matched products for the chosen moment (dia-dificil or festa —
// "presente" has its own dedicated PresenteScreen), plus cross-sell
// discovery and the "Minha Seleção" / "Minha Festa" baskets.
export default function MomentScreen({
  momentId,
  onBack,
  onSend,
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
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pt-2 pb-28 fade-up">
      <SiteHeader onBack={onBack} />

      {MOMENT_INTRO[momentId] && (
        <p className="text-base leading-relaxed mb-6 font-subtitle italic text-brand-inkSoft">{MOMENT_INTRO[momentId]}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {matched.map((p) => (
          <ProductCard key={p.id} p={p} momentId={momentId} {...cardProps} />
        ))}
      </div>

      {crossSell.length > 0 && momentId !== "dia-dificil" && (
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

      <Toast message={party.toast} />
    </div>
  );
}
