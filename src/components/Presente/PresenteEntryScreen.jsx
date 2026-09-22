import { COLORS } from "../../styles/colors";
import { REAL_PHOTOS } from "../../data/photos";
import SiteHeader from "../shared/SiteHeader";
import Photo from "../shared/Photo";

// Real Mon Caramel photography — no AI, no stock, no edited files.
const OPTIONS = [
  {
    id: "presente-caixas",
    emoji: "🎁",
    title: "Caixas",
    description: "Um presente montado do jeitinho que quem vai receber merece.",
    cta: "Quero ver ideias →",
    tint: COLORS.caramelDark,
    photo: REAL_PHOTOS.presenteRosas,
  },
  {
    id: "presente-bandejas",
    emoji: "🎈",
    title: "Bandejas",
    description: "Para transformar qualquer dia em uma comemoração.",
    cta: "Quero ver ideias →",
    tint: COLORS.creamYellow,
    photo: REAL_PHOTOS.bandejaMario,
    // Default (centered) cover crop puts the balloons front and center and
    // cuts off the cake — zoomed and anchored toward the cake instead, per
    // breakpoint since the card's photo slot has a different aspect ratio
    // on mobile vs. desktop.
    photoClassName: "scale-[1.71] origin-[91%_95%] md:scale-[1.82] md:origin-[74%_100%]",
  },
  {
    id: "presente-mimos",
    emoji: "✨",
    title: "Pequenos mimos",
    description: "Um jeitinho pequeno de fazer alguém sorrir.",
    cta: "Quero ver produtos →",
    tint: COLORS.caramelLight,
    photo: REAL_PHOTOS.presentinhoMacas,
  },
];

// Entry point for "É só uma lembrancinha" — three formats, three dedicated
// screens (never a rigid catalog of fixed boxes). Caixas/Bandejas lead into
// inspiration + a light idea-builder; Mimos, being real individual
// products, leads straight to a small catalog.
export default function PresenteEntryScreen({ onBack, onSelect }) {
  return (
    <div className="max-w-xl md:max-w-3xl mx-auto px-4 pt-2 pb-10 fade-up">
      <SiteHeader onBack={onBack} />
      <h1 className="text-2xl font-display text-brand-ink mb-1">É só uma lembrancinha.</h1>
      <p className="text-sm mb-6 text-brand-inkSoft">
        Pra gente, é muito mais que isso. Cada presente é único, pensado pra quem vai receber se sentir especial.
      </p>

      <div className="flex flex-col gap-3 md:grid md:grid-cols-3 md:gap-4">
        {OPTIONS.map((o) => (
          <button
            key={o.id}
            onClick={() => onSelect(o.id)}
            className="flex md:flex-col items-stretch rounded-2xl overflow-hidden text-left"
            style={{ backgroundColor: `${o.tint}22` }}
          >
            <div className="flex-1 min-w-0 p-4 md:p-4 flex flex-col justify-center gap-1 order-1 md:order-2">
              <span className="text-xl leading-none">{o.emoji}</span>
              <p className="font-display text-lg text-brand-ink leading-tight">{o.title}</p>
              <p className="text-xs leading-snug text-brand-inkSoft">{o.description}</p>
              <span
                className="inline-flex self-start items-center mt-2 rounded-full px-3.5 py-2 text-xs font-medium text-white"
                style={{ backgroundColor: COLORS.caramelDarker }}
              >
                {o.cta}
              </span>
            </div>
            <div className="w-[38%] md:w-full shrink-0 relative min-h-[130px] md:h-36 order-2 md:order-1">
              <Photo
                src={o.photo}
                alt=""
                className={`absolute inset-0 w-full h-full object-cover${o.photoClassName ? ` ${o.photoClassName}` : ""}`}
                loading="lazy"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
