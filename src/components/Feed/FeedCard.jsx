import { Heart } from "lucide-react";
import { COLORS } from "../../styles/colors";
import { defaultPhotos } from "../../utils/products";
import PhotoCarousel from "../shared/PhotoCarousel";
import ProductArt from "../shared/ProductArt";

// One "just looking" feed entry — photo first, everything else minimal.
// Seduction happens here; information and configuration wait for the
// product detail sheet (progressive disclosure, per the brief).
export default function FeedCard({ product, isFavorite, onToggleFavorite, onOpen }) {
  const photos = defaultPhotos(product);

  return (
    <article className="fade-up">
      {/* A plain div, not a button: PhotoCarousel already has its own
          prev/next buttons for multi-photo products, and buttons can't
          nest. The name/description button below is the keyboard- and
          screen-reader-accessible way to open the product. */}
      <div onClick={() => onOpen(product)} className="relative rounded-3xl overflow-hidden cursor-pointer">
        {photos && photos.length > 0 ? (
          <PhotoCarousel photos={photos} alt={product.name} />
        ) : (
          <ProductArt kind={product.kind} tint={product.tint} />
        )}
      </div>
      <div className="flex items-start justify-between gap-3 mt-3">
        <button onClick={() => onOpen(product)} className="text-left min-w-0 flex-1">
          <h3 className="text-lg font-display text-brand-ink leading-tight">{product.name}</h3>
          <p className="text-sm mt-0.5 text-brand-inkSoft leading-snug line-clamp-2">{product.sensory}</p>
          <p className="text-sm font-medium mt-1 text-brand-caramelDark">{product.price}</p>
        </button>
        <button
          onClick={() => onToggleFavorite(product.id)}
          className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-transform active:scale-90"
          aria-label={isFavorite ? `Remover ${product.name} dos salvos` : `Salvar ${product.name}`}
          aria-pressed={isFavorite}
        >
          <Heart size={22} fill={isFavorite ? COLORS.caramelDark : "none"} stroke={COLORS.caramelDark} />
        </button>
      </div>
    </article>
  );
}
