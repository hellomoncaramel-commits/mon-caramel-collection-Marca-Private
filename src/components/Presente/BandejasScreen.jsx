import { useState } from "react";
import { CESTA_OCCASIONS, CESTA_DOCES_PRODUCTS } from "../../data/giftOptions";
import { TRAY_INSPIRATIONS } from "../../data/inspirationGalleries";
import { buildCestaIdeaMessage } from "../../utils/messages";
import SiteHeader from "../shared/SiteHeader";
import InspirationCarousel from "../shared/InspirationCarousel";
import PresenteCTA from "./PresenteCTA";
import GiftIdeaWizard from "./GiftIdeaWizard";

// Same carousel as "Caixas para inspirar" (src/components/shared/
// InspirationCarousel.jsx) — one photo at a time, no per-photo save/title,
// "Quero montar o meu" always starts the wizard fresh, never tied to
// whichever photo was on screen.
export default function BandejasScreen({ onBack, addToSelection, onSend }) {
  const [showWizard, setShowWizard] = useState(false);

  if (showWizard) {
    return (
      <GiftIdeaWizard
        onBack={() => setShowWizard(false)}
        groupKey="cestas"
        groupLabel="Cesta especial"
        title="Vamos montar uma cesta?"
        occasionStep={{ question: "Qual é a ocasião?", options: CESTA_OCCASIONS }}
        fuseDetails
        detailsIntro="Se quiser, me conta mais sobre o presente."
        itemsStep={{
          question: "O que não pode faltar?",
          subtext: "Escolha os doces que você gostaria de incluir. Pode marcar mais de um.",
          products: CESTA_DOCES_PRODUCTS,
        }}
        budgetIntro="Com base nos doces que você escolheu, eu monto a melhor combinação dentro do seu orçamento."
        onAdd={addToSelection}
        onSend={onSend}
        buildMessage={buildCestaIdeaMessage}
      />
    );
  }

  return (
    <div className="max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto px-gutter lg:px-8 xl:px-12 pt-2 pb-10 fade-up">
      <SiteHeader onBack={onBack} />
      <h1 className="mc-page-title">Cestas especiais para inspirar</h1>
      <p className="mc-page-subtitle">
        Para comemorar, presentear ou simplesmente deixar o dia mais especial.
      </p>

      {/* lg+: carousel left, copy+CTA right — see CaixasScreen for the same
          treatment and its reasoning. Below lg: plain block, unchanged. */}
      <div className="lg:grid lg:grid-cols-12 lg:gap-10 xl:gap-14 lg:items-center">
        <div className="lg:col-span-7">
          <InspirationCarousel items={TRAY_INSPIRATIONS} ariaLabel="Fotos de cestas especiais" />
        </div>
        <div className="lg:col-span-5">
          <PresenteCTA onAction={() => setShowWizard(true)} />
        </div>
      </div>
    </div>
  );
}
