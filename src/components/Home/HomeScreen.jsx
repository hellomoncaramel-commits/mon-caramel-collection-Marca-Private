import { REAL_PHOTOS } from "../../data/photos";
import Logo from "../shared/Logo";
import Photo from "../shared/Photo";

// Three ways in, weighted differently on purpose — a stack of three
// identical white cards reads like a form. "Só quero olhar" leads with a
// real, appetizing photo because the home page shouldn't be all text and
// buttons; the other two carry their own visual weight through color, not
// through more copy.
export default function HomeScreen({ onSelect }) {
  return (
    <div className="max-w-xl mx-auto px-5 pt-8 pb-10 fade-up">
      <div className="text-center mb-5">
        <Logo size="sm" />
      </div>
      <h1 className="text-3xl text-center mb-2 font-display italic text-brand-ink">O que a gente vai adoçar hoje? 💛</h1>
      <p className="text-sm text-center mb-7 leading-relaxed text-brand-inkSoft">
        Escolha pelo momento, procure alguma coisa específica ou simplesmente fique olhando...
      </p>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => onSelect("feed")}
          className="relative rounded-3xl overflow-hidden text-left min-h-44 flex flex-col justify-end p-5"
        >
          <Photo
            src={REAL_PHOTOS.brigadeiroDiaDificil}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <span className="relative text-white text-xl font-display">👀 Só quero olhar e passar vontade</span>
          <span className="relative text-white/85 text-sm mt-0.5">Por sua conta e risco.</span>
        </button>

        <button
          onClick={() => onSelect("momentos")}
          className="rounded-3xl text-left p-5 min-h-24 bg-brand-caramelDark"
        >
          <span className="block text-white text-lg font-display">💛 Me ajuda a escolher</span>
          <span className="block text-white/85 text-sm mt-0.5">Escolha pelo momento.</span>
        </button>

        <button
          onClick={() => onSelect("busca")}
          className="rounded-3xl text-left p-5 min-h-24 bg-white border border-brand-border"
        >
          <span className="block text-brand-ink text-lg font-display">🔎 Já sei o que quero</span>
          <span className="block text-brand-muted text-sm mt-0.5">Me leva pros doces.</span>
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 mt-8 text-xs text-brand-muted">
        <span>📍 Retirada grátis — Ritson x Adelaide</span>
        <span className="w-1 h-1 rounded-full bg-brand-caramelLight" />
        <span>🚗 Entrega disponível</span>
      </div>
    </div>
  );
}
