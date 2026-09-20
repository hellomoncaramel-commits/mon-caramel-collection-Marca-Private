import { Heart } from "lucide-react";
import { COLORS } from "../../styles/colors";
import { getMimos } from "../../data/giftOptions";
import Photo from "../shared/Photo";

// Small mimos are real, individual products (unlike Caixas/Bandejas, which
// are inspiration) — so this is the one presente sub-section that reads
// like an actual small catalog, per the brief.
export default function MimosSection({ selection, addToSelection }) {
  const mimos = getMimos();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {mimos.map((p) => {
        const existing = selection.some((it) => it.kind === "product" && it.productId === p.id);
        return (
          <div key={p.id} className="rounded-2xl overflow-hidden bg-white border border-brand-border flex flex-col">
            <div className="aspect-photo">
              <Photo src={p.photos[0]} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="p-3 flex flex-col flex-1">
              <h4 className="text-sm font-display text-brand-ink leading-tight">{p.name}</h4>
              <p className="text-3xs mt-1 leading-relaxed flex-1 text-brand-inkSoft">{p.sensory}</p>
              <p className="text-xs font-medium mt-2 text-brand-caramelDark">{p.price}</p>
              <button
                onClick={() =>
                  addToSelection({ kind: "product", productId: p.id, name: p.name, unit: p.unit, qty: 1, flavors: null })
                }
                aria-label={existing ? `${p.name} já está na seleção` : `Adicionar ${p.name} à seleção`}
                className="mt-2 w-full text-3xs font-medium rounded-full min-h-11 flex items-center justify-center gap-1 border"
                style={{
                  backgroundColor: existing ? COLORS.caramelDark : "transparent",
                  color: existing ? "white" : COLORS.caramelDark,
                  borderColor: COLORS.caramelDark,
                }}
              >
                <Heart size={10} fill={existing ? "white" : "none"} />
                {existing ? "Adicionado ✓" : "Adicionar"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
