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
    photo: REAL_PHOTOS.presenteRosas,
    // Positioned toward the top-left to keep the ribbon knot and the rosas
    // in frame; only the empty wood-grain margin at the edges gets trimmed.
    photoPosition: "object-[20%_25%]",
  },
  {
    id: "presente-bandejas",
    emoji: "🎈",
    title: "Bandejas",
    description: "Para transformar qualquer dia em uma comemoração.",
    cta: "Quero ver ideias →",
    photo: REAL_PHOTOS.bandejaMario,
    // Positioned to keep the balloons, the cake and the treats box in
    // frame together — only the thin wall margin above them is trimmed.
    photoPosition: "object-[38%_35%]",
  },
  {
    id: "presente-mimos",
    emoji: "✨",
    title: "Pequenos mimos",
    description: "Um jeitinho pequeno de fazer alguém sorrir.",
    cta: "Quero ver produtos →",
    photo: REAL_PHOTOS.presentinhoTrufas,
    // Contain, not cover — this source has real empty margin around the
    // subject that cover would crop into; a local, per-card fit choice
    // (see Mimos' own screen for the same reasoning), not a change to
    // object-fit globally.
    photoFit: "contain",
  },
];

// Entry point for "É só uma lembrancinha" — three formats, three dedicated
// screens (never a rigid catalog of fixed boxes). Caixas/Bandejas lead into
// inspiration + a light idea-builder; Mimos, being real individual
// products, leads straight to a small catalog.
//
// Each option is a photo-led tile, not a tinted menu button: the photo
// (same aspect-photo ratio every other photo on the site uses) is the
// thing that actually sells the format, title sits right under it, and the
// CTA is a quiet text link — not a filled pill competing with the photo
// for attention. All three tiles read the same weight/size now (equally
// important, per the brief), with the photo itself — not a per-category
// tint color — doing the work of telling them apart.
export default function PresenteEntryScreen({ onBack, onSelect }) {
  return (
    <div className="max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto px-gutter lg:px-8 xl:px-12 pt-2 pb-10 fade-up">
      <SiteHeader onBack={onBack} />
      {/* mc-page-title at its own default size (text-2xl) still reads
          closer to a form-field label than a page the brief wants to feel
          "mais inspiracional" — a local override (not a change to the
          shared class, which 7 other screens also use) gives just this
          one headline real editorial scale. */}
      <h1 className="mc-page-title text-3xl lg:text-4xl">É só uma lembrancinha.</h1>
      <p className="mc-page-subtitle">
        Pra gente, é muito mais que isso. Cada presente é único, pensado pra quem vai receber se sentir especial.
      </p>

      <div className="flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-5">
        {OPTIONS.map((o) => (
          <button key={o.id} onClick={() => onSelect(o.id)} className="text-left group">
            <div className="relative overflow-hidden rounded-3xl aspect-photo bg-brand-subtle">
              <Photo
                src={o.photo}
                alt=""
                className={`w-full h-full transition-transform duration-300 lg:group-hover:scale-[1.03] ${
                  o.photoFit === "contain" ? "object-contain" : "object-cover"
                }${o.photoPosition ? ` ${o.photoPosition}` : ""}`}
                loading="lazy"
              />
            </div>
            <div className="pt-3 flex flex-col gap-1">
              <p className="font-display text-xl text-brand-ink leading-tight">
                <span className="mr-1.5">{o.emoji}</span>
                {o.title}
              </p>
              <p className="text-sm leading-snug text-brand-inkSoft">{o.description}</p>
              <span className="inline-flex items-center gap-1 mt-1 text-sm font-medium text-brand-caramelDark">{o.cta}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
