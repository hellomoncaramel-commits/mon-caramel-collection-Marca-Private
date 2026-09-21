import SiteHeader from "../shared/SiteHeader";
import MimosSection from "./MimosSection";

// Small mimos are real, individual products — the one presente sub-flow
// that's genuinely a (tiny) catalog, not an inspiration builder.
export default function MimosScreen({ onBack, selection, addToSelection }) {
  return (
    <div className="max-w-xl mx-auto px-4 pt-2 pb-10 fade-up">
      <SiteHeader onBack={onBack} />
      <h1 className="text-2xl font-display text-brand-ink mb-1">Pequenos mimos 💛</h1>
      <p className="text-sm mb-6 italic font-subtitle text-brand-inkSoft">Um jeitinho pequeno de fazer alguém sorrir.</p>

      <MimosSection selection={selection} addToSelection={addToSelection} />
    </div>
  );
}
