import { useMemo, useRef } from "react";
import { Heart, Sparkles, PartyPopper } from "lucide-react";
import { pickForMoment, pickCrossSell } from "../../utils/products";
import { buildPartyMessage } from "../../utils/messages";
import { useParty } from "../../hooks/useParty";
import BackButton from "../shared/BackButton";
import Toast from "../shared/Toast";
import ProductCard from "./ProductCard";
import PresenteSection from "./PresenteSection";
import PartyPanel from "../Party/PartyPanel";
import PartyModal from "../Party/PartyModal";
import PartyFloatingButton from "../Party/PartyFloatingButton";

// Matched products for the chosen moment, plus cross-sell discovery and the
// "Minha Seleção" / "Minha Festa" baskets (briefing sections 4 and 5).
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
  const isPresente = momentId === "presente";

  const presenteCaixas = useMemo(() => matched.filter((p) => !p.presenteGroup || p.presenteGroup === "caixas"), [matched]);
  const presenteBandejas = useMemo(() => matched.filter((p) => p.presenteGroup === "bandejas"), [matched]);
  const presenteMimos = useMemo(() => matched.filter((p) => p.presenteGroup === "mimos"), [matched]);

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
    <div className="max-w-2xl mx-auto px-6 pt-10 pb-28 fade-up">
      <BackButton onClick={onBack} label="Voltar" />

      {isPresente && (
        <div className="mt-6 mb-1">
          <p className="text-lg mb-1 font-display text-brand-ink">Cada caixa é única.</p>
          <p className="text-sm text-brand-inkSoft">
            Escolha os doces, as cores e os detalhes que combinam com quem vai receber — e a gente cria algo
            especial. As fotos abaixo são inspiração: nenhuma caixa sai igual à outra.
          </p>
        </div>
      )}

      {isPresente ? (
        <>
          <PresenteSection products={presenteCaixas} momentId={momentId} cardProps={cardProps} />
          <PresenteSection
            header={{
              Icon: PartyPopper,
              eyebrow: "Bandejas para Celebrar",
              title: "Uma experiência completa, não só uma caixa.",
              description:
                "Bandejas maiores, com balão e decoração — pra aniversário, chá de bebê, formatura ou aquela comemoração que merece mesa própria.",
            }}
            products={presenteBandejas}
            momentId={momentId}
            cardProps={cardProps}
          />
          <PresenteSection
            header={{
              Icon: Sparkles,
              eyebrow: "Mimos",
              title: "Pequenos, mas cheios de carinho.",
              description: "Mimos rápidos pra qualquer ocasião — professora, colega, agradecimento. Personalizáveis do jeitinho que você quiser.",
            }}
            products={presenteMimos}
            momentId={momentId}
            cardProps={cardProps}
          />
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {matched.map((p) => (
            <ProductCard key={p.id} p={p} momentId={momentId} {...cardProps} />
          ))}
        </div>
      )}

      {crossSell.length > 0 && !isPresente && momentId !== "dia-dificil" && (
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
