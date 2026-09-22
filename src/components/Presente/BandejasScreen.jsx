import { useState } from "react";
import { getInspiration, BANDEJA_OCCASIONS, BANDEJA_CONTENTS } from "../../data/giftOptions";
import SiteHeader from "../shared/SiteHeader";
import InspirationGallery from "./InspirationGallery";
import PresenteCTA from "./PresenteCTA";
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
    <div className="max-w-xl md:max-w-3xl mx-auto px-4 pt-2 pb-10 fade-up">
      <SiteHeader onBack={onBack} />
      <h1 className="text-2xl font-display text-brand-ink mb-1">Bandejas para inspirar</h1>
      <p className="text-sm mb-6 text-brand-inkSoft">
        Para comemorar, presentear ou simplesmente deixar o dia mais especial.
      </p>

      <InspirationGallery items={inspiration} isSelected={isSelected} onToggleSave={toggleSave} />

      <PresenteCTA onAction={() => setShowWizard(true)} />
    </div>
  );
}
