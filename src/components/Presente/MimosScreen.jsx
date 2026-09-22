import SiteHeader from "../shared/SiteHeader";
import MimosSection from "./MimosSection";
import PresenteCTA from "./PresenteCTA";

// Small mimos are real, individual products — the one presente sub-flow
// that's genuinely a (tiny) catalog, not an inspiration builder. The closing
// CTA sends the customer to Minha Seleção — the site's existing WhatsApp
// flow — same as any other product screen, not a bespoke wizard.
export default function MimosScreen({ onBack, isSelected, addToSelection, removeFromSelection, onGoSelection }) {
  return (
    <div className="max-w-xl md:max-w-3xl mx-auto px-4 pt-2 pb-10 fade-up">
      <SiteHeader onBack={onBack} />
      <h1 className="text-2xl font-display text-brand-ink mb-1">Pequenos mimos 💛</h1>
      <p className="text-sm mb-6 italic font-subtitle text-brand-inkSoft">Um jeitinho pequeno de fazer alguém sorrir.</p>

      <MimosSection isSelected={isSelected} addToSelection={addToSelection} removeFromSelection={removeFromSelection} />

      <PresenteCTA onAction={onGoSelection} />
    </div>
  );
}
