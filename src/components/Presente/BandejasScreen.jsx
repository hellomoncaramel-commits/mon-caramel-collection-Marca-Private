import { useState } from "react";
import { BANDEJA_OCCASIONS, BANDEJA_CONTENTS } from "../../data/giftOptions";
import { TRAY_INSPIRATIONS } from "../../data/inspirationGalleries";
import SiteHeader from "../shared/SiteHeader";
import InspirationCarousel from "../shared/InspirationCarousel";
import PresenteCTA from "./PresenteCTA";
import GiftIdeaWizard from "./GiftIdeaWizard";

// Same carousel as "Caixas para inspirar" (src/components/shared/
// InspirationCarousel.jsx) — one photo at a time, no per-photo save/title,
// "Quero montar o meu" always starts the wizard fresh, never tied to
// whichever photo was on screen.
export default function BandejasScreen({ onBack, addToSelection }) {
  const [showWizard, setShowWizard] = useState(false);

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

      <InspirationCarousel items={TRAY_INSPIRATIONS} ariaLabel="Fotos de bandejas" />

      <PresenteCTA onAction={() => setShowWizard(true)} />
    </div>
  );
}
