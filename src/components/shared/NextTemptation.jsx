import { ChevronRight } from "lucide-react";
import Photo from "./Photo";

// Manual, one-at-a-time cross-sell — Naia offering another doce mid-
// conversation, never an automated "you might also like" block. `line` and
// `product` come from a single hand-written pairing per product (see
// data/products.js `experience.nextTemptation`), never picked automatically.
//
// A small labeled section, matching the approved reference — a compact row
// (square thumbnail, not a bigger rectangular card) under a quiet "Próxima
// tentação" label, not its own featured block. Visual-correction pass:
// reverted from a taller shadowed mini-card back to this tighter row.
export default function NextTemptation({ line, product, photo, onOpen }) {
  if (!product || !line) return null;

  return (
    <div className="mt-4">
      <p className="text-3xs uppercase tracking-wide font-medium text-brand-muted mb-1.5">Próxima tentação</p>
      <button onClick={() => onOpen(product)} className="w-full flex items-center gap-2.5 text-left">
        <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-brand-subtle">
          {photo && <Photo src={photo} alt={product.name} className="w-full h-full object-cover" loading="lazy" />}
        </div>
        <div className="min-w-0 flex-1">
          {/* The enticement line in Fraunces roman (personality); the product
              name below stays plain DM Sans (functional information). */}
          <p className="text-sm font-display leading-snug text-brand-ink">{line}</p>
          <p className="text-xs mt-0.5 text-brand-caramelDark">{product.name}</p>
        </div>
        <ChevronRight size={16} className="shrink-0 text-brand-muted" />
      </button>
    </div>
  );
}
