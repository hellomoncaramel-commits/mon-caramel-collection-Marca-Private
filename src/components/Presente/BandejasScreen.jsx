import { useState } from "react";
import { COLORS } from "../../styles/colors";
import { getInspiration, BANDEJA_OCCASIONS, BANDEJA_CONTENTS } from "../../data/giftOptions";
import BackButton from "../shared/BackButton";
import SwipeGallery from "./SwipeGallery";
import GiftIdeaWizard from "./GiftIdeaWizard";

export default function BandejasScreen({ onBack, isSelected, addToSelection, removeFromSelection }) {
  const [showWizard, setShowWizard] = useState(false);
  const inspiration = getInspiration("bandejas");

  const toggleSave = (item) => {
    const entry = { kind: "inspiration", id: item.id, group: "bandejas", title: item.caption, photo: item.photo };
    if (isSelected(entry)) removeFromSelection(entry);
    else addToSelection(entry);
  };

  if (showWizard) {
    return (
      <GiftIdeaWizard
        onBack={() => setShowWizard(false)}
        groupKey="bandejas"
        groupLabel="Bandeja"
        title="Monte sua bandeja"
        occasionStep={{ question: "Qual é a ocasião?", options: BANDEJA_OCCASIONS }}
        itemsStep={{ question: "O que você gostaria de incluir?", options: BANDEJA_CONTENTS }}
        onAdd={addToSelection}
      />
    );
  }

  return (
    <div className="max-w-xl mx-auto px-5 pt-8 pb-10 fade-up">
      <BackButton onClick={onBack} label="Voltar" />
      <h1 className="text-2xl font-display text-brand-ink mb-1">Bandejas para celebrar 🎈</h1>
      <p className="text-sm mb-6 text-brand-inkSoft">Também são inspiração — a sua pode ganhar a cara que você quiser.</p>

      <SwipeGallery items={inspiration} isSaved={isSelected} onToggleSave={toggleSave} />

      <div className="mt-10 rounded-3xl p-5 text-center" style={{ backgroundColor: COLORS.subtle }}>
        <p className="text-lg font-display text-brand-ink mb-1">Vamos montar a ideia?</p>
        <p className="text-sm mb-4 text-brand-inkSoft">Conta a ocasião, o que incluir e a gente cuida do resto.</p>
        <button
          onClick={() => setShowWizard(true)}
          className="text-sm font-medium text-white rounded-full px-6 py-3 min-h-11"
          style={{ backgroundColor: COLORS.caramelDark }}
        >
          Montar minha bandeja →
        </button>
      </div>
    </div>
  );
}
