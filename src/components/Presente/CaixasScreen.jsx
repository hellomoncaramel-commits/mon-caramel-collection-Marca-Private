import { useState } from "react";
import { COLORS } from "../../styles/colors";
import { getInspiration, CAIXA_MUST_HAVE_PRODUCTS } from "../../data/giftOptions";
import SiteHeader from "../shared/SiteHeader";
import SwipeGallery from "./SwipeGallery";
import GiftIdeaWizard from "./GiftIdeaWizard";

export default function CaixasScreen({ onBack, isSelected, addToSelection, removeFromSelection }) {
  const [showWizard, setShowWizard] = useState(false);
  const inspiration = getInspiration("caixas");

  const toggleSave = (item) => {
    const entry = { kind: "inspiration", id: item.id, group: "caixas", title: item.caption, photo: item.photo };
    if (isSelected(entry)) removeFromSelection(entry);
    else addToSelection(entry);
  };

  if (showWizard) {
    return (
      <GiftIdeaWizard
        onBack={() => setShowWizard(false)}
        groupKey="caixas"
        groupLabel="Caixa"
        title="Monte sua caixa"
        itemsStep={{ question: "O que não pode faltar?", products: CAIXA_MUST_HAVE_PRODUCTS, allowSurprise: true }}
        onAdd={addToSelection}
      />
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 pt-2 pb-10 fade-up">
      <SiteHeader onBack={onBack} />
      <h1 className="text-2xl font-display text-brand-ink mb-1">Caixas para presentear</h1>
      <p className="text-sm mb-6 italic font-subtitle text-brand-inkSoft">Inspire-se. A sua não precisa ser igual a nenhuma delas.</p>

      <SwipeGallery items={inspiration} isSaved={isSelected} onToggleSave={toggleSave} />

      <div className="mt-10 rounded-3xl p-5 text-center" style={{ backgroundColor: COLORS.subtle }}>
        <p className="text-lg font-display text-brand-ink mb-1">Agora vamos imaginar a sua 💛</p>
        <p className="text-sm mb-4 text-brand-inkSoft">Escolha o que não pode faltar, personalize e conte com os detalhes.</p>
        <button
          onClick={() => setShowWizard(true)}
          className="text-sm font-medium text-white rounded-full px-6 py-3 min-h-11"
          style={{ backgroundColor: COLORS.caramelDark }}
        >
          Montar minha caixa →
        </button>
      </div>
    </div>
  );
}
