import { ChevronRight } from "lucide-react";
import Photo from "./Photo";

// Manual, one-at-a-time cross-sell — Naia offering another doce mid-
// conversation, never an automated "you might also like" block. `line` and
// `product` come from a single hand-written pairing per product (see
// data/products.js `experience.nextTemptation`), never picked automatically.
export default function NextTemptation({ line, product, photo, onOpen }) {
  if (!product || !line) return null;

  return (
    <button
      onClick={() => onOpen(product)}
      className="w-full mt-6 pt-5 border-t border-brand-border flex items-center gap-3 text-left"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-subtitle italic leading-snug text-brand-ink">{line}</p>
        <p className="text-xs mt-1 text-brand-caramelDark">{product.name}</p>
      </div>
      <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-brand-subtle">
        {photo && <Photo src={photo} alt={product.name} className="w-full h-full object-cover" loading="lazy" />}
      </div>
      <ChevronRight size={16} className="shrink-0 text-brand-muted" />
    </button>
  );
}
