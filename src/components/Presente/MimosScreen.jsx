import { MIMO_INSPIRATIONS } from "../../data/inspirationGalleries";
import SiteHeader from "../shared/SiteHeader";
import InspirationCarousel from "../shared/InspirationCarousel";
import PresenteCTA from "./PresenteCTA";

// Same carousel as Caixas/Bandejas ("para inspirar") — mimos moved from an
// individually-selectable product grid to pure browsing, no per-photo
// action. The closing CTA sends the customer to Minha Seleção — the site's
// existing WhatsApp flow — generically, not tied to any specific mimo.
export default function MimosScreen({ onBack, onGoSelection }) {
  return (
    <div className="max-w-xl md:max-w-3xl mx-auto px-gutter pt-2 pb-10 fade-up">
      <SiteHeader onBack={onBack} />
      <h1 className="mc-page-title">Pequenos mimos 💛</h1>
      {/* Plain style, matching Caixas/Bandejas' subtitle exactly — was the
          only one of the three sibling screens set in italic Cormorant. */}
      <p className="mc-page-subtitle">Um jeitinho pequeno de fazer alguém sorrir.</p>

      <InspirationCarousel items={MIMO_INSPIRATIONS} ariaLabel="Fotos de mimos" />

      <PresenteCTA onAction={onGoSelection} />
    </div>
  );
}
