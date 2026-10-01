import { ChevronRight, Heart, Search, Sparkles } from "lucide-react";
import { REAL_PHOTOS } from "../../data/photos";
import { COLORS } from "../../styles/colors";
import SiteHeader from "../shared/SiteHeader";
import Photo from "../shared/Photo";

// The two paths that answer the Home question directly ("Me ajuda a
// escolher" / "Já sei o que quero") — same routes/behavior as before
// (onSelect(id) → App.jsx's screen state). Home now offers exactly these
// two decisions and nothing else (no third exit) — `primary` only nudges
// the discovery path's own title weight slightly; both buttons otherwise
// share the exact same dark-brown surface (consistency over an artificial
// second shade).
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

// Vertical gradient the two buttons sit on — warm cream/beige (the app's
// own `brand.subtle` → `brand.beige` tokens), never black. Fully
// transparent through nearly the whole top half of the photo so the
// product stays the clear protagonist there; the buttons themselves are
// solid dark brown now (see BUTTON_BG), so this gradient no longer carries
// legibility duty — it just keeps the transition from photo to button
// looking like one continuous surface instead of a hard seam.
const PHOTO_GRADIENT =
  "linear-gradient(to bottom, rgba(244,235,218,0) 0%, rgba(244,235,218,0) 48%, rgba(244,235,218,0.4) 62%, rgba(244,235,218,0.75) 74%, rgba(244,235,218,0.92) 85%, rgba(255,252,245,0.97) 94%, rgba(255,252,245,0.99) 100%)";

// Same dark brown MomentPicker's own "Quero isso →" button already uses
// (see MomentPicker.jsx) — the existing token for a CTA on Mon Caramel,
// reused rather than inventing a second one.
const BUTTON_BG = COLORS.caramelDarker;

// Home's composition, top to bottom: pergunta → escolha (na própria foto).
// Foto + gradient + ações continuam como uma única peça editorial (essa
// estrutura está aprovada) — hero photo restored to casadinhoGoiabada
// (the approved original) after two rounds of photo swaps; buttons stay
// solid dark brown.
export default function HomeScreen({ onSelect }) {
  return (
    <div className="w-full md:max-w-2xl lg:max-w-3xl xl:max-w-4xl md:mx-auto px-gutter pt-2 pb-8 fade-up">
      {/* Same logo size/row height as every other screen (SiteHeader's own
          defaults) — the previous "homeCompact" 52px override made the logo
          read as a micro decoration instead of a brand signature. 92px is
          still well within the cropped asset's native 332px height even at
          3x DPR (no upscaling), and it's the exact size already used and
          already validated everywhere else, not a new arbitrary value. */}
      <SiteHeader
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
          keeps "hoje?" and "💛" glued together as one unit. Fraunces roman
          medium, not italic — italic is an accent elsewhere in the system
          now, not the default voice for a headline this prominent. */}
      <h1 className="text-mc-home-hero mt-3 font-display font-medium text-brand-ink">O que a gente vai adoçar hoje?&nbsp;💛</h1>
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
          edge of the photo itself. Restored to casadinhoGoiabada — the
          original Home hero photo, approved before the last two rounds'
          photo swaps. */}
      <div className="relative mt-5 rounded-3xl overflow-hidden aspect-mc-portrait">
        <Photo
          src={REAL_PHOTOS.casadinhoGoiabada}
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
                className="w-full flex items-center gap-3 rounded-2xl px-3.5 py-3 text-left transition-transform duration-150 active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100"
                style={{ minHeight: 44, backgroundColor: BUTTON_BG, boxShadow: "0 3px 10px rgba(61,36,24,0.22)" }}
              >
                <a.Icon size={19} strokeWidth={2} className="shrink-0 text-brand-beige" />
                <span className="min-w-0 flex-1">
                  {/* Button label — DM Sans, not Fraunces: this is an
                      action/CTA, not an editorial moment (personality lives
                      in the headline above, not in the buttons). */}
                  <span
                    className={`block text-brand-beige leading-snug ${
                      a.primary ? "text-[16.5px] font-semibold" : "text-[15.5px] font-medium"
                    }`}
                  >
                    {a.title}
                  </span>
                  <span className="block text-xs text-brand-beige/80 mt-0.5 leading-snug">{a.subtitle}</span>
                </span>
                <ChevronRight size={16} className="shrink-0 text-brand-beige/85" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
