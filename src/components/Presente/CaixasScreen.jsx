import { useState } from "react";
import { CAIXA_MUST_HAVE_PRODUCTS } from "../../data/giftOptions";
import { BOX_INSPIRATIONS } from "../../data/inspirationGalleries";
import SiteHeader from "../shared/SiteHeader";
import CaixasCarousel from "./CaixasCarousel";
import PresenteCTA from "./PresenteCTA";
import GiftIdeaWizard from "./GiftIdeaWizard";

// A single carousel, not a grid+lightbox: the inspiration here isn't a
// specific composition to reproduce (no per-photo title/description/save),
// it's just "here's the kind of thing we've made" — one photo at a time is
// the whole browsing experience, and "Montar a sua" always starts the
// wizard fresh, never tied to whichever photo was on screen.
export default function CaixasScreen({ onBack, addToSelection }) {
  const [showWizard, setShowWizard] = useState(false);

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

      <CaixasCarousel items={BOX_INSPIRATIONS} />

      <PresenteCTA
        onAction={() => setShowWizard(true)}
        title="Gostou de alguma ideia?"
        body="A sua pode ser completamente diferente. Escolha os doces, cores e detalhes do seu jeito."
        label="Montar a sua →"
      />
    </div>
  );
}
