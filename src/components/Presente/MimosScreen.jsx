import { useMemo } from "react";
import { Heart } from "lucide-react";
import { COLORS } from "../../styles/colors";
import { PRODUCTS } from "../../data/products";
import { defaultPhotos } from "../../utils/products";
import SiteHeader from "../shared/SiteHeader";
import Photo from "../shared/Photo";

// A single, compact card — photo, name, short line, price, quick-add. No
// quantity/flavor picker (these are "combinação personalizada" items, one
// of each), no border/shadow (same photo-forward finish as the rest of
// this round's polish pass).
function MimoCard({ p, added, onAdd }) {
  const photo = defaultPhotos(p)?.[0];

  return (
    <div className="flex flex-col">
      <div className="relative aspect-photo rounded-3xl overflow-hidden bg-brand-subtle">
        {photo && <Photo src={photo} alt={p.name} className="w-full h-full object-cover" loading="lazy" />}
      </div>
      <div className="pt-3 flex flex-col flex-1">
        <h3 className="font-display text-base text-brand-ink leading-tight">{p.name}</h3>
        <p className="text-xs mt-1 leading-relaxed text-brand-inkSoft flex-1">{p.sensory}</p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 mt-2.5">
          <span className="text-xs font-medium text-brand-caramelDark">{p.price}</span>
          <button
            onClick={() => onAdd(p)}
            className="shrink-0 text-xs font-medium rounded-full px-3 min-h-11 inline-flex items-center gap-1.5 transition-transform active:scale-95"
            style={{
              backgroundColor: added ? COLORS.caramelDark : `${COLORS.caramelDark}15`,
              color: added ? "white" : COLORS.caramelDark,
            }}
          >
            <Heart size={12} fill={added ? "white" : "none"} />
            {added ? "Adicionado ✓" : "Quero esse"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Pequenos Mimos are real, individually-selectable products (see
// presenteGroup: "mimos" in data/products.js) — unlike Caixas/Bandejas,
// there's no custom wizard here, so this reads closer to a small catalog
// than to the "inspiration as protagonist" carousel those two use.
export default function MimosScreen({ onBack, selection, addToSelection, onGoSelection }) {
  const products = useMemo(() => PRODUCTS.filter((p) => p.presenteGroup === "mimos"), []);

  const isAdded = (p) => selection.some((it) => it.kind === "product" && it.productId === p.id);
  const add = (p) => addToSelection({ kind: "product", productId: p.id, name: p.name, unit: p.unit, qty: 1, flavors: null });

  return (
    <div className="max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto px-gutter lg:px-8 xl:px-12 pt-2 pb-10 fade-up">
      <SiteHeader onBack={onBack} />
      <h1 className="mc-page-title">Pequenos mimos 💛</h1>
      <p className="mc-page-subtitle">Um jeitinho pequeno de fazer alguém sorrir.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-6">
        {products.map((p) => (
          <MimoCard key={p.id} p={p} added={isAdded(p)} onAdd={add} />
        ))}
      </div>

      {selection.length > 0 && (
        <div className="mt-8 rounded-2xl border border-brand-caramelDark p-4 bg-white/95 backdrop-blur lg:max-w-md lg:mx-auto">
          <p className="text-xs uppercase tracking-wide mb-2 text-brand-muted">Você escolheu ({selection.length})</p>
          <button
            onClick={onGoSelection}
            className="w-full text-sm font-medium text-white bg-brand-caramelDark rounded-full py-3 flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Heart size={15} />
            Ver Minha Seleção
          </button>
        </div>
      )}
    </div>
  );
}
