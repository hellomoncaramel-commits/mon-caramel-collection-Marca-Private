import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { COLORS } from "../../styles/colors";
import { GIFT_BUDGET_TIERS, getGiftQuickPicks } from "../../utils/giftQuickPicks";
import { needsConfiguration } from "../../utils/products";
import Photo from "../shared/Photo";
import SiteHeader from "../shared/SiteHeader";

// "Precisa de uma ideia rapidinho?" — Fase 2 (pós-revisão ChatGPT, 2026-10).
// Uma pergunta só: orçamento. A "Estilo" como segundo passo foi removida
// pela revisão — a inteligência mora na curadoria (src/data/
// giftQuickPicks.js), não na quantidade de perguntas. Nenhuma foto carrega
// antes de uma faixa ser escolhida — mesma disciplina de performance do
// Me Tenta.
function ResultCard({ pick, onWantIt }) {
  const { product, totalPrice, quantityLabel } = pick;
  const teaser = product.catalogTeaser ?? product.sensory;
  const photo = product.photos?.[0] ?? Object.values(product.photosByMoment ?? {})[0]?.[0];

  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: COLORS.subtle, border: `1px solid ${COLORS.border}` }}>
      <div className="relative w-full aspect-photo">
        <Photo src={photo} alt={product.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg text-brand-ink leading-tight">{product.name}</h3>
        {teaser && <p className="text-sm mt-1 text-brand-inkSoft leading-snug">{teaser}</p>}
        {/* Quantidade + preço TOTAL juntos — nunca só "$X cada" quando a
            ideia é de uma quantidade maior que 1 (brief, item 6): "4
            unidades · $20", nunca "$5 cada" sozinho. `quantityLabel` é
            null só pra Bolo de Cenoura (singleItem — um preço só, uma
            unidade só, nada a listar antes dele). */}
        <p className="text-base font-medium mt-2 text-brand-caramelDark">
          {quantityLabel ? `${quantityLabel} · $${totalPrice}` : `$${totalPrice}`}
        </p>
        <button
          onClick={() => onWantIt(pick)}
          className="w-full mt-3 text-sm font-medium text-white rounded-full py-3 min-h-11 flex items-center justify-center gap-2 transition-transform active:scale-95"
          style={{ backgroundColor: COLORS.caramelDark }}
        >
          Quero essa ideia
        </button>
      </div>
    </div>
  );
}

export default function PresenteRapido({ onBack, onSelect, addToSelection, onOpenProductWithIntent, onShowToast }) {
  const [tierKey, setTierKey] = useState(null);
  const picks = tierKey ? getGiftQuickPicks(tierKey) : [];

  const handleWantIt = (pick) => {
    const { product, qty, packageLabel } = pick;
    if (needsConfiguration(product)) {
      // Preserva a quantidade/pacote sugerido sem pular a configuração
      // obrigatória nem pré-selecionar um sabor/versão incompatível: o
      // Product Detail recebe isso como se fosse um `existing` (mesmo
      // mecanismo que já pré-preenche o configurador ao reabrir um
      // produto já selecionado) — FlavorConfigurator.jsx já sabe usar
      // `existing.qty`/`existing.packageLabel` pra pré-marcar só a
      // quantidade/pacote, nunca uma escolha de sabor/cobertura/versão
      // (essas continuam em branco, exigindo toque explícito).
      onOpenProductWithIntent(product, { productId: product.id, qty, packageLabel });
      return;
    }
    addToSelection({ kind: "product", productId: product.id, name: product.name, unit: product.unit, qty, flavors: null });
    onShowToast("Boa escolha 🤎 Já guardei pra você.");
  };

  return (
    <div className="max-w-xl md:max-w-2xl mx-auto px-gutter lg:px-8 pt-2 pb-10 fade-up">
      <SiteHeader onBack={onBack} />
      <h1 className="mc-page-title">Precisa de uma ideia rapidinho?</h1>
      <p className="mc-page-subtitle">Me diz seu orçamento — eu já separo 2 ou 3 ideias boas.</p>

      <div className="flex flex-wrap gap-2 mt-4">
        {GIFT_BUDGET_TIERS.map((tier) => {
          const on = tierKey === tier.key;
          return (
            <button
              key={tier.key}
              onClick={() => setTierKey(tier.key)}
              className="text-sm font-medium rounded-full px-4 py-2.5 min-h-11 transition-colors"
              style={{
                backgroundColor: on ? COLORS.caramelDark : "white",
                color: on ? "white" : COLORS.ink,
                border: on ? `1.5px solid ${COLORS.caramelDark}` : `1px solid ${COLORS.border}`,
              }}
            >
              {tier.label}
            </button>
          );
        })}
      </div>

      {tierKey && picks.length > 0 && (
        <div className="mt-6 fade-up">
          <p className="font-display text-xl text-brand-ink mb-4">Com esse orçamento, eu iria por aqui 👀</p>
          {/* O grid se adapta à quantidade real de ideias (1, 2 ou 3) — uma
              faixa com só 1 ou 2 ideias boas (curadoria honesta, ver
              data/giftQuickPicks.js) nunca tenta simular 3 colunas com
              espaço vazio ao lado. 1 ideia: card único, largura contida,
              não esticado nem "perdido" num grid de 3 colunas. */}
          <div
            className={
              picks.length === 1
                ? "max-w-sm"
                : picks.length === 2
                  ? "grid gap-4 sm:grid-cols-2 max-w-2xl"
                  : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            }
          >
            {picks.map((pick) => (
              <ResultCard key={`${pick.product.id}-${pick.packageLabel ?? pick.qty}`} pick={pick} onWantIt={handleWantIt} />
            ))}
          </div>

          {/* Saída discreta pra composição personalizada — nunca inventa que
              o orçamento escolhido compra uma Cesta/Caixa, só leva pra
              arquitetura existente de Presentes. Ganha um pouco mais de
              peso em $50+ (ainda sem sugerir preço de Cesta/Caixa), per
              brief item 8. */}
          <button
            onClick={() => onSelect("presente")}
            className={
              tierKey === "50-mais"
                ? "w-full mt-6 text-sm font-medium rounded-full py-3 min-h-11 flex items-center justify-center gap-1.5 border"
                : "mt-6 text-sm font-medium text-brand-muted inline-flex items-center gap-1"
            }
            style={tierKey === "50-mais" ? { borderColor: COLORS.caramelDark, color: COLORS.caramelDark } : undefined}
          >
            Quer algo mais montado?
            <ChevronRight size={tierKey === "50-mais" ? 15 : 12} />
          </button>
        </div>
      )}
    </div>
  );
}
