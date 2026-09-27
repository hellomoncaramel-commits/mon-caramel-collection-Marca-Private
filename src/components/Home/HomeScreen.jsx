import { ChevronRight, Heart, Search, Sparkles } from "lucide-react";
import { REAL_PHOTOS } from "../../data/photos";
import SiteHeader from "../shared/SiteHeader";
import Photo from "../shared/Photo";

// The two paths that answer the Home question directly ("Me ajuda a
// escolher" / "Já sei o que quero") — same routes/behavior as before
// (onSelect(id) → App.jsx's screen state). Home now offers exactly these
// two decisions and nothing else (no third exit) — `primary` only nudges
// the discovery path's own surface slightly (border/background/weight),
// never a solid CTA.
const ACTIONS = [
  {
    id: "momentos",
    Icon: Sparkles,
    title: "Me ajuda a escolher",
    subtitle: "Quero descobrir o que combina comigo.",
    primary: true,
  },
  { id: "busca", Icon: Search, title: "Já sei o que quero", subtitle: "Me leva direto pro doce." },
];

// Vertical gradient the action surfaces sit on — warm cream/beige (the
// app's own `brand.subtle` → `brand.beige` tokens), never black. Fully
// transparent through nearly the whole top half of the photo so the
// product stays the clear protagonist there; each action below is its own
// opaque card (see ACTION_STYLE), so this gradient no longer carries sole
// responsibility for text legibility — it only needs to warm the lower
// third enough that the cards read as sitting "in" the photo, not pasted
// on top of it.
const PHOTO_GRADIENT =
  "linear-gradient(to bottom, rgba(244,235,218,0) 0%, rgba(244,235,218,0) 48%, rgba(244,235,218,0.4) 62%, rgba(244,235,218,0.75) 74%, rgba(244,235,218,0.92) 85%, rgba(255,252,245,0.97) 94%, rgba(255,252,245,0.99) 100%)";

// Each action is its own compact, clearly-tappable surface — cream, a
// caramel hairline border and a very soft shadow — rather than either bare
// text on the photo (illegible/no affordance) or a solid caramel block (too
// heavy, reads as a generic app button). `primary` gets a slightly more
// present border and a touch more opacity, never a different shape.
const ACTION_STYLE = {
  primary: "bg-white/90 border-brand-caramelDark/40",
  secondary: "bg-white/78 border-brand-caramelDark/20",
};

// Home's composition, top to bottom: pergunta → escolha (na própria foto).
// Foto + gradient + ações continuam como uma única peça editorial (essa
// estrutura já está aprovada) — esta é uma correção cirúrgica: outra
// fotografia real (mais apetitosa e já quase no formato vertical certo),
// gradient adiado para preservar mais da imagem, ações com affordance de
// botão de novo, e a saída "Ver todos os doces" removida — a Home oferece
// só as duas decisões.
export default function HomeScreen({ onSelect }) {
  return (
    <div className="w-full md:max-w-2xl lg:max-w-3xl xl:max-w-4xl md:mx-auto px-gutter pt-2 pb-8 fade-up">
      <SiteHeader
        logoSize="homeCompact"
        rowHeight={60}
        rightSlot={
          <button
            onClick={() => onSelect("salvos")}
            aria-label="Ver salvos"
            className="w-11 h-11 flex items-center justify-center"
          >
            <Heart size={20} className="text-brand-caramelDark" />
          </button>
        }
      />

      {/* A regular space before the emoji risks it wrapping onto its own
          orphan line at some widths (e.g. 390px) — a non-breaking space
          keeps "hoje?" and "💛" glued together as one unit. */}
      <h1 className="text-mc-home-hero mt-3 font-display italic text-brand-ink">O que a gente vai adoçar hoje?&nbsp;💛</h1>
      {/* max-w keeps this a clearly shorter, subordinate line under the
          hero — it would otherwise stretch nearly full-width on a
          390–430px phone and start competing with the headline above it. */}
      <p className="text-[15px] leading-[1.45] mt-2 max-w-[300px] text-brand-inkSoft">
        Me conta o que você precisa. A gente acha um doce pra isso.
      </p>

      {/* The single editorial stage — photo, gradient and the two actions
          layered as one piece. aspect-mc-portrait (4:5, an existing token)
          keeps most of the photo visible above the actions without turning
          into a full-screen hero — and, unlike a wider ratio (e.g. 16:9),
          stays narrow enough relative to the source photo that
          object-cover always crops horizontally rather than exposing a raw
          edge of the photo itself. biscoitoVariedade is itself shot in
          portrait (900×1200, ~3:4) — the closest native ratio to 4:5 of any
          real photo in the catalog, so this crop is close to lossless. */}
      <div className="relative mt-5 rounded-3xl overflow-hidden aspect-mc-portrait">
        <Photo
          src={REAL_PHOTOS.biscoitoVariedade}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 pointer-events-none" style={{ background: PHOTO_GRADIENT }} />

        <div className="absolute inset-x-0 bottom-0 px-gutter pb-4 pt-8">
          <div className="flex flex-col gap-2.5">
            {ACTIONS.map((a) => (
              <button
                key={a.id}
                onClick={() => onSelect(a.id)}
                className={`w-full flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-transform duration-150 active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100 ${
                  a.primary ? ACTION_STYLE.primary : ACTION_STYLE.secondary
                }`}
                style={{ minHeight: 44, boxShadow: "0 2px 10px rgba(61,36,24,0.08)" }}
              >
                <a.Icon size={19} strokeWidth={2} className="shrink-0 text-brand-caramelDark" />
                <span className="min-w-0 flex-1">
                  <span
                    className={`block font-display text-brand-ink leading-snug ${
                      a.primary ? "text-[16.5px] font-semibold" : "text-[15.5px] font-medium"
                    }`}
                  >
                    {a.title}
                  </span>
                  <span className="block text-xs text-brand-inkSoft mt-0.5 leading-snug">{a.subtitle}</span>
                </span>
                <ChevronRight size={16} className="shrink-0 text-brand-caramelDark/70" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
