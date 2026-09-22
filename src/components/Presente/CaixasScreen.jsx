import { useState } from "react";
import { getInspiration, CAIXA_MUST_HAVE_PRODUCTS } from "../../data/giftOptions";
import SiteHeader from "../shared/SiteHeader";
import InspirationGallery from "./InspirationGallery";
import PresenteCTA from "./PresenteCTA";
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
    <div className="max-w-xl md:max-w-3xl mx-auto px-4 pt-2 pb-10 fade-up">
      <SiteHeader onBack={onBack} />
      <h1 className="text-2xl font-display text-brand-ink mb-1">Caixas para inspirar</h1>
      <p className="text-sm mb-6 text-brand-inkSoft">
        Algumas ideias que já passaram por aqui. Escolha uma inspiração e a gente adapta do seu jeito.
      </p>

      <InspirationGallery items={inspiration} isSelected={isSelected} onToggleSave={toggleSave} />

      <PresenteCTA onAction={() => setShowWizard(true)} />
    </div>
  );
}
