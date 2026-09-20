import { Heart, Plus, Check } from "lucide-react";
import { COLORS } from "../../styles/colors";
import { defaultPhotos, parseQuantityOptions } from "../../utils/products";
import PhotoCarousel from "../shared/PhotoCarousel";
import ProductArt from "../shared/ProductArt";

// One "just looking" feed entry — photo first, everything else minimal.
// Seduction happens here; information and configuration wait for the
// product detail sheet (progressive disclosure, per the brief). The heart
// lives right on the photo, and "+" is a one-tap quick add for products
// that don't need any configuring — customizable ones open the detail
// sheet instead, since they need a flavor choice before they can be added.
export default function FeedCard({ product, isFavorite, onToggleFavorite, isAdded, onQuickAdd, onOpen }) {
  const photos = defaultPhotos(product);
  const isCustomizable = product.customizable === true;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (isCustomizable) {
      onOpen(product);
      return;
    }
    onQuickAdd(product, parseQuantityOptions(product.unit)[0]);
  };

  return (
    <article className="fade-up">
      {/* A plain div, not a button: PhotoCarousel already has its own
          prev/next buttons for multi-photo products, and buttons can't
          nest. The name button below is the keyboard- and screen-reader-
          accessible way to open the product. */}
      <div onClick={() => onOpen(product)} className="relative rounded-3xl overflow-hidden cursor-pointer">
        {photos && photos.length > 0 ? (
          <PhotoCarousel photos={photos} alt={product.name} />
        ) : (
          <ProductArt kind={product.kind} tint={product.tint} />
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product.id);
          }}
          className="absolute top-2 right-2 z-10 w-11 h-11 rounded-full bg-white/90 flex items-center justify-center transition-transform active:scale-90"
          aria-label={isFavorite ? `Remover ${product.name} dos salvos` : `Salvar ${product.name}`}
          aria-pressed={isFavorite}
        >
          <Heart size={18} fill={isFavorite ? COLORS.caramelDark : "none"} stroke={COLORS.caramelDark} />
        </button>
      </div>
      <div className="flex items-end justify-between gap-3 mt-3">
        <button onClick={() => onOpen(product)} className="text-left min-w-0 flex-1">
          <h3 className="text-lg font-display text-brand-ink leading-tight">{product.name}</h3>
          <p className="text-sm mt-0.5 text-brand-inkSoft leading-snug line-clamp-2">{product.sensory}</p>
          <p className="text-sm font-medium mt-1 text-brand-caramelDark">{product.price}</p>
        </button>
        <button
          onClick={handleQuickAdd}
          aria-label={isAdded ? `${product.name} já está na seleção` : `Adicionar ${product.name} à seleção`}
          className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-transform active:scale-90"
          style={{ backgroundColor: isAdded ? COLORS.caramelDark : `${COLORS.caramelDark}15` }}
        >
          {isAdded ? <Check size={18} className="text-white" /> : <Plus size={18} style={{ color: COLORS.caramelDark }} />}
        </button>
      </div>
    </article>
  );
}
