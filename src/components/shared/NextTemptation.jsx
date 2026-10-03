import { ChevronRight } from "lucide-react";
import Photo from "./Photo";

// Manual, one-at-a-time cross-sell — Naia offering another doce mid-
// conversation, never an automated "you might also like" block. `line` and
// `product` come from a single hand-written pairing per product (see
// data/products.js `experience.nextTemptation`), never picked automatically.
//
// A real rectangular photo (same aspect-photo ratio as everywhere else on
// the site), not a small thumbnail — the whole point of "próxima tentação"
// is the next photo doing the tempting, so it gets to read as its own
// little card (soft shadow, same discreet value used elsewhere) instead of
// a thin row with an icon-sized crop.
export default function NextTemptation({ line, product, photo, onOpen }) {
  if (!product || !line) return null;

  return (
    <button
      onClick={() => onOpen(product)}
      className="w-full mt-6 rounded-2xl bg-white overflow-hidden flex items-stretch text-left"
      style={{ boxShadow: "0 1px 3px rgba(61,36,24,0.08)" }}
    >
      <div className="w-24 sm:w-28 shrink-0 aspect-photo overflow-hidden">
        {photo && <Photo src={photo} alt={product.name} className="w-full h-full object-cover" loading="lazy" />}
      </div>
      <div className="min-w-0 flex-1 p-3.5 flex flex-col justify-center">
        {/* The enticement line in Fraunces roman (personality); the product
            name below stays plain DM Sans (functional information). */}
        <p className="text-sm font-display leading-snug text-brand-ink">{line}</p>
        <p className="text-xs mt-1 text-brand-caramelDark">{product.name}</p>
      </div>
      <div className="flex items-center pr-3 shrink-0">
        <ChevronRight size={16} className="text-brand-muted" />
      </div>
    </button>
  );
}
