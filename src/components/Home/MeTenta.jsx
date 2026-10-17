import { useRef, useState } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import { COLORS } from "../../styles/colors";
import { ME_TENTA_PRODUCTS } from "../../data/meTentaPool";
import { pickMeTentaCandidate, needsConfiguration } from "../../utils/meTenta";
import { defaultPhotos, initialQuantity, displayPriceCada } from "../../utils/products";
import Photo from "../shared/Photo";

const SWAP_MS = 150; // metade do orçamento de 200–300ms pedido — fade-out + fade-in

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

// Pequena experiência própria, não um ProductCard reaproveitado: entra
// compacta (zero foto no DOM), revela um único produto real do pool curado
// (data/meTentaPool.js) ao toque. "Me tenta de novo" troca para outro
// elegível com uma transição curta (fade + scale sutil) — nunca navega,
// nunca sai do lugar onde está montada.
export default function MeTenta({ selection, addToSelection, onOpenProduct, onShowToast }) {
  const [revealed, setRevealed] = useState(false);
  const [current, setCurrent] = useState(null);
  const [swapping, setSwapping] = useState(false);
  const lastShownId = useRef(null);

  const selectedIds = selection.filter((it) => !it.kind || it.kind === "product").map((it) => it.productId);

  const pick = () => pickMeTentaCandidate(ME_TENTA_PRODUCTS, { lastShownId: lastShownId.current, selectedIds });

  const reveal = () => {
    const next = pick();
    if (!next) return;
    lastShownId.current = next.id;
    setCurrent(next);
    setRevealed(true);
  };

  const tryAgain = () => {
    const next = pick();
    if (!next) return;
    if (reducedMotion()) {
      lastShownId.current = next.id;
      setCurrent(next);
      return;
    }
    setSwapping(true);
    window.setTimeout(() => {
      lastShownId.current = next.id;
      setCurrent(next);
      setSwapping(false);
    }, SWAP_MS);
  };

  const handlePrimary = () => {
    if (!current) return;
    if (needsConfiguration(current)) {
      onOpenProduct(current);
      return;
    }
    addToSelection({
      kind: "product",
      productId: current.id,
      name: current.name,
      unit: current.unit,
      qty: initialQuantity(current),
      flavors: null,
    });
    onShowToast("Boa escolha 🤎 Já guardei pra você.");
  };

  if (!revealed) {
    return (
      <button
        onClick={reveal}
        className="w-full flex items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left transition-transform active:scale-[0.98] motion-reduce:transition-none"
        style={{ backgroundColor: COLORS.subtle, border: `1px solid ${COLORS.border}` }}
      >
        <span className="font-display text-base lg:text-lg text-brand-ink">Não sabe o que escolher?</span>
        <span
          className="inline-flex items-center gap-1.5 shrink-0 text-sm font-medium text-white rounded-full pl-4 pr-3.5 py-2.5"
          style={{ backgroundColor: COLORS.caramelDark }}
        >
          Me tenta
          <Sparkles size={14} />
        </span>
      </button>
    );
  }

  const photo = defaultPhotos(current)?.[0];
  const teaser = current.experience?.teaser ?? current.catalogTeaser ?? current.sensory;

  return (
    <div
      className="rounded-3xl overflow-hidden lg:grid lg:grid-cols-2 transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none"
      style={{
        backgroundColor: COLORS.subtle,
        border: `1px solid ${COLORS.border}`,
        opacity: swapping ? 0 : 1,
        transform: swapping ? "scale(0.985)" : "scale(1)",
      }}
    >
      <div className="relative w-full aspect-photo lg:aspect-auto lg:h-full">
        <Photo src={photo} alt={current.name} className="absolute inset-0 w-full h-full object-cover" loading="eager" />
      </div>
      <div className="p-5 lg:p-7 lg:flex lg:flex-col lg:justify-center">
        <p className="text-xs font-medium tracking-wide text-brand-caramelDark mb-1">Hoje eu iria nesse 👀</p>
        <h3 className="font-display text-xl lg:text-2xl text-brand-ink leading-tight">{current.name}</h3>
        {teaser && <p className="text-sm lg:text-base mt-1.5 text-brand-inkSoft leading-snug">{teaser}</p>}
        <p className="text-base font-medium mt-2.5 text-brand-caramelDark">{displayPriceCada(current.price)}</p>

        <button
          onClick={handlePrimary}
          className="w-full lg:w-auto mt-4 text-sm font-medium text-white rounded-full py-3 lg:px-8 min-h-11 flex items-center justify-center gap-2 transition-transform active:scale-95"
          style={{ backgroundColor: COLORS.caramelDark }}
        >
          Eu quero esse
        </button>
        <button onClick={tryAgain} className="mt-3 text-xs font-medium text-brand-muted inline-flex items-center gap-1 self-center lg:self-start">
          Me tenta de novo
          <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}
