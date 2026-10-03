import { COLORS } from "../../styles/colors";
import { REAL_PHOTOS } from "../../data/photos";
import SiteHeader from "../shared/SiteHeader";
import Photo from "../shared/Photo";

// Bottom-weighted scrim so the title/CTA overlaid on each photo stay
// legible regardless of what's in frame — same mechanism the Home
// MomentPicker cards already use (ink, not black, to stay in the brand's
// warm-brown family), reused here rather than inventing a second one.
const SCRIM = `linear-gradient(to top, ${COLORS.ink}CC 0%, ${COLORS.ink}4D 50%, ${COLORS.ink}00 78%)`;

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
    // Visual-correction pass: this tile moved from photo-above/text-below
    // to text overlaid on the photo (see below), which needs the photo to
    // fill the frame edge to edge — switched from contain to cover.
    // Positioned low to keep the three wrapped truffles in frame; only the
    // empty marble background at the top gets trimmed.
    photoPosition: "object-[center_75%]",
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
      {/* Visual-correction pass: reverted a one-off size bump here back to
          the shared mc-page-title default — same size every other
          catalog-style screen uses, consistent rather than one more
          variation. */}
      <h1 className="mc-page-title">É só uma lembrancinha.</h1>
      <p className="mc-page-subtitle">
        Pra gente, é muito mais que isso. Cada presente é único, pensado pra quem vai receber se sentir especial.
      </p>

      {/* Visual-correction pass: title/description/CTA moved from a
          separate block under the photo to an overlay directly on it (per
          the approved reference) — the three tiles read as one compact
          group now instead of three photo-then-text sections stacked with
          a lot of space between them. */}
      <div className="flex flex-col gap-3 md:grid md:grid-cols-3 md:gap-4">
        {OPTIONS.map((o) => (
          <button key={o.id} onClick={() => onSelect(o.id)} className="relative overflow-hidden rounded-2xl aspect-photo text-left group bg-brand-subtle">
            <Photo
              src={o.photo}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-300 lg:group-hover:scale-[1.03]${o.photoPosition ? ` ${o.photoPosition}` : ""}`}
              loading="lazy"
            />
            <div className="absolute inset-0 pointer-events-none" style={{ background: SCRIM }} />
            <div className="absolute left-3.5 right-3.5 bottom-3">
              <p className="font-display text-lg text-white leading-tight">
                <span className="mr-1.5">{o.emoji}</span>
                {o.title}
              </p>
              <p className="text-xs leading-snug text-white/85 mt-0.5">{o.description}</p>
              <span className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-white">{o.cta}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
