import { ChevronRight } from "lucide-react";
import { COLORS } from "../../styles/colors";
import { PRODUCTS } from "../../data/products";
import { getActiveCampaign } from "../../utils/campaigns";
import Photo from "../shared/Photo";

// A one-line notification strip, not a banner — deliberately smaller and
// quieter than the Hero/journey cards above it or Me Tenta below (Fase 2
// brief, item 10: no countdown/badge/urgency/popup/ticker/carousel). Sits
// right after the Hero block in HomeScreen.jsx (which already carries the
// Home's two "momentos" journey cards baked into its own composition —
// neither the Hero nor MomentPicker is touched here), before Me Tenta.
//
// Renders nothing — no wrapper, no image request — when there's no active
// campaign, which is the only state CAMPAIGNS (src/data/campaigns.js) ships
// in for this PR. getActiveCampaign already filters out an expired,
// not-yet-started, or misconfigured (broken destination) campaign, so this
// component never has to repeat that logic.
export default function CampaignStrip({ onSelect, onOpenProduct, onSend }) {
  const campaign = getActiveCampaign();
  if (!campaign) return null;

  const handleClick = () => {
    const { destination } = campaign;
    if (destination.type === "screen") {
      onSelect?.(destination.screen);
    } else if (destination.type === "product") {
      const product = PRODUCTS.find((p) => p.id === destination.productId);
      if (product) onOpenProduct?.(product);
    } else if (destination.type === "whatsapp") {
      onSend?.(destination.message);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left transition-transform active:scale-[0.99] motion-reduce:transition-none"
      style={{ backgroundColor: COLORS.subtle, border: `1px solid ${COLORS.border}` }}
    >
      <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0">
        <Photo src={campaign.photo} alt="" className="w-full h-full object-cover" loading="lazy" />
      </div>
      <p className="flex-1 text-sm text-brand-ink leading-snug">{campaign.line}</p>
      <ChevronRight size={16} className="shrink-0 text-brand-muted" />
    </button>
  );
}
