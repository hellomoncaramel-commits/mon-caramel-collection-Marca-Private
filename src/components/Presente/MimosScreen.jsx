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
    <div className="max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto px-gutter lg:px-8 xl:px-12 pt-2 pb-10 fade-up">
      <SiteHeader onBack={onBack} />
      <h1 className="mc-page-title">Pequenos mimos 💛</h1>
      {/* Plain style, matching Caixas/Bandejas' subtitle exactly — was the
          only one of the three sibling screens set in italic Cormorant. */}
      <p className="mc-page-subtitle">Um jeitinho pequeno de fazer alguém sorrir.</p>

      {/* lg+: carousel left, copy+CTA right — see CaixasScreen for the same
          treatment and its reasoning. Below lg: plain block, unchanged. */}
      <div className="lg:grid lg:grid-cols-12 lg:gap-10 xl:gap-14 lg:items-center">
        <div className="lg:col-span-7">
          <InspirationCarousel items={MIMO_INSPIRATIONS} ariaLabel="Fotos de mimos" />
        </div>
        <div className="lg:col-span-5">
          <PresenteCTA onAction={onGoSelection} />
        </div>
      </div>
    </div>
  );
}
