import { useState } from "react";
import { MIMO_SHOWCASE } from "../../data/inspirationGalleries";
import SiteHeader from "../shared/SiteHeader";
import InspirationCarousel from "../shared/InspirationCarousel";
import PresenteCTA from "./PresenteCTA";

// Doces mimos — pure inspiration gallery (post-UX/UI-audit redesign,
// 2026-10). Reuses the exact same InspirationCarousel + PresenteCTA
// composition Caixas/Cestas already use (see CaixasScreen.jsx/
// BandejasScreen.jsx) — same navigation mechanics, same "carousel left,
// copy+CTA right" 2-column desktop layout, nothing new invented. Real
// photos only (MIMO_SHOWCASE — no name/description/price rendered per
// slide, no ProductCard, no opening a product Detail sheet on tap/swipe);
// a single explicit CTA below the carousel is the only action, and it
// always opens WhatsApp with a fixed, contextual message — never a
// per-product one, since nothing here is a SKU to point at.
export default function MimosScreen({ onBack, onSend }) {
  // Which slide is on screen right now — InspirationCarousel reports this
  // via onIndexChange (fires on mount too), so the first tap of "Falar
  // sobre personalização" already references the right slide.
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = MIMO_SHOWCASE[currentIndex] || MIMO_SHOWCASE[0];

  const talkAboutPersonalization = () =>
    onSend(
      `Oi! Vi ${current.reference} no site da Mon Caramel e queria saber mais sobre as opções de personalização 😊`
    );

  return (
    <div className="max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto px-gutter lg:px-8 xl:px-12 pt-2 pb-10 fade-up">
      <SiteHeader onBack={onBack} />
      <h1 className="mc-page-title">Doces mimos 💛</h1>
      <p className="mc-page-subtitle">Porque toda ocasião merece ser lembrada com um docinho.</p>

      {/* lg+: carousel left, copy+CTA right — same treatment as Caixas/
          Cestas. Below lg: plain block, photo then CTA band below. */}
      <div className="lg:grid lg:grid-cols-12 lg:gap-10 xl:gap-14 lg:items-center">
        <div className="lg:col-span-7">
          <InspirationCarousel items={MIMO_SHOWCASE} ariaLabel="Fotos de doces mimos" onIndexChange={setCurrentIndex} />
        </div>
        <div className="lg:col-span-5">
          <PresenteCTA
            onAction={talkAboutPersonalization}
            title="Gostou de alguma inspiração?"
            body="Cada mimo pode ser do seu jeito — cores, tema, mensagem. Fala com a gente pra criar o seu."
            label="Falar sobre personalização →"
          />
        </div>
      </div>
    </div>
  );
}
