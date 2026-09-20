import { PRODUCTS } from "../../data/products";
import BackButton from "../shared/BackButton";
import FeedCard from "./FeedCard";

// Everything favorited from anywhere in the app (feed, search, moments,
// presente mimos) shows up here — a quiet holding pen, not a checkout step.
export default function SavedScreen({ onBack, favorites, toggleFavorite, onOpenProduct, onGoFeed }) {
  const items = PRODUCTS.filter((p) => favorites.includes(p.id));

  return (
    <div className="max-w-xl mx-auto px-5 pt-8 pb-10 fade-up">
      <BackButton onClick={onBack} label="Voltar" />
      <h1 className="text-2xl font-display text-brand-ink mb-1">♡ Salvos</h1>
      <p className="text-sm mb-6 text-brand-muted">
        {items.length === 0 ? "Ainda nada por aqui." : "As coisas que chamaram sua atenção."}
      </p>

      {items.length === 0 ? (
        <button
          onClick={onGoFeed}
          className="w-full text-sm font-medium rounded-full py-3 border border-brand-caramelDark text-brand-caramelDark min-h-11"
        >
          Só olhar... 👀
        </button>
      ) : (
        <div className="flex flex-col gap-8">
          {items.map((p) => (
            <FeedCard
              key={p.id}
              product={p}
              isFavorite={true}
              onToggleFavorite={toggleFavorite}
              onOpen={onOpenProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
}
