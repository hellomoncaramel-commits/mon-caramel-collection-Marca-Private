import { ChevronRight } from "lucide-react";
import { COLORS } from "../../styles/colors";
import { PRODUCTS } from "../../data/products";
import { getActiveCampaign } from "../../utils/campaigns";
import Photo from "../shared/Photo";

// Um pequeno card editorial sazonal — não um banner, não um alerta/
// notification bar. A foto é grande o suficiente pra gerar vontade (não um
// ícone de 36×36), o CTA é uma frase editorial, nunca um aviso. Sempre
// entre o Hero e o conteúdo seguinte da Home (hoje, logo antes do Me
// Tenta) — nunca acima do Hero, nunca empurrando Momentos/Me Tenta quando
// não há campanha (ver HomeScreen.jsx).
//
// Renderiza nada — nenhum wrapper, nenhuma imagem pedida — quando não há
// campanha ativa, que é o único estado que CAMPAIGNS (src/data/
// campaigns.js) ships neste PR: zero DOM, zero espaço reservado, zero
// bytes de imagem.
export default function SeasonalFeature({ onSelect, onOpenProduct, onSend }) {
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
      className="w-full flex items-stretch overflow-hidden rounded-2xl text-left transition-transform active:scale-[0.99] motion-reduce:transition-none"
      style={{ backgroundColor: COLORS.subtle, border: `1px solid ${COLORS.border}` }}
    >
      {/* Foto com presença editorial real — não um ícone. Quadrada, cresce
          um pouco em telas maiores (lg+), sempre a imagem real da
          campanha. */}
      <div className="relative w-28 sm:w-32 lg:w-44 aspect-square shrink-0">
        <Photo src={campaign.photo} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center p-4 lg:p-6">
        <p className="text-sm lg:text-base text-brand-ink leading-snug">{campaign.line}</p>
        <span
          className="inline-flex items-center gap-1 mt-2.5 text-sm font-medium self-start"
          style={{ color: COLORS.caramelDark }}
        >
          {campaign.cta}
          <ChevronRight size={14} />
        </span>
      </div>
    </button>
  );
}
