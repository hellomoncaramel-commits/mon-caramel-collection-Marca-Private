import { ChevronRight, Heart, Search, Sparkles } from "lucide-react";
import { REAL_PHOTOS } from "../../data/photos";
import { PRODUCTS } from "../../data/products";
import { defaultPhotos } from "../../utils/products";
import { COLORS } from "../../styles/colors";
import SiteHeader from "../shared/SiteHeader";
import Photo from "../shared/Photo";

// The two paths that answer the Home question directly ("Me ajuda a
// escolher" / "Já sei o que quero") — same routes/behavior as before
// (onSelect(id) → App.jsx's screen state). Home now offers exactly these
// two decisions and nothing else (no third exit) — `primary` only nudges
// the discovery path's own title weight slightly; both buttons otherwise
// share the exact same dark-brown surface (consistency over an artificial
// second shade). MOBILE ONLY — see the `lg:hidden` block below. The lg+
// hero has its own, separate three-item array (DESKTOP_HERO_ACTIONS)
// further down; this one is untouched.
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

// lg+ hero only — three real journeys, same destinations/handler
// (onSelect(id) → App.jsx's screen state) as everywhere else in the app.
// "feed" already exists as a screen in App.jsx (FeedScreen, "Só quero
// olhar e passar vontade") but had no entry point from Home — this
// restores one, desktop-only, per this round's reference design.
const DESKTOP_HERO_ACTIONS = [
  { id: "momentos", emoji: "💛", title: "Me ajuda a escolher", subtitle: "Escolho pelo momento." },
  { id: "feed", emoji: "👀", title: "Só quero olhar e passar vontade", subtitle: "Por sua conta e risco." },
  { id: "busca", Icon: Search, title: "Já sei o que quero", subtitle: "Me leva pros doces." },
];

// Four real, strongly-photographed products for the "Nossos doces
// favoritos" strip below the hero — same PRODUCTS data/photos/price
// convention as every other card in the app (ProductCard, FeedCard,
// SearchScreen all just render `p.price` raw, including "Sob consulta 💬"
// — Brownlito here follows that same existing pattern, not a new one).
const FAVORITE_PRODUCT_IDS = ["chocobomb", "cone-trufado", "brownlito", "casadinho"];

// Vertical gradient the two buttons sit on — warm cream/beige (the app's
// own `brand.subtle` → `brand.beige` tokens), never black. Fully
// transparent through nearly the whole top half of the photo so the
// product stays the clear protagonist there; the buttons themselves are
// solid dark brown now (see BUTTON_BG), so this gradient no longer carries
// legibility duty — it just keeps the transition from photo to button
// looking like one continuous surface instead of a hard seam.
const PHOTO_GRADIENT =
  "linear-gradient(to bottom, rgba(244,235,218,0) 0%, rgba(244,235,218,0) 48%, rgba(244,235,218,0.4) 62%, rgba(244,235,218,0.75) 74%, rgba(244,235,218,0.92) 85%, rgba(255,252,245,0.97) 94%, rgba(255,252,245,0.99) 100%)";

// lg+ hero only — horizontal fade, left to right: opaque over the text
// zone, fully clear by ~70% so the photo reads uninterrupted behind the
// center/right and behind the journey cards at the bottom.
const HERO_GRADIENT =
  "linear-gradient(90deg, rgba(255,249,241,0.98) 0%, rgba(255,249,241,0.92) 18%, rgba(255,249,241,0.72) 31%, rgba(255,249,241,0.34) 44%, rgba(255,249,241,0.08) 58%, rgba(255,249,241,0) 70%)";

// Same dark brown MomentPicker's own "Quero isso →" button already uses
// (see MomentPicker.jsx) — the existing token for a CTA on Mon Caramel,
// reused rather than inventing a second one. Mobile only.
const BUTTON_BG = COLORS.caramelDarker;

// Shared pieces between the mobile photo-overlay composition and the lg+
// two-column one — same markup, reused instead of copy-pasted twice.
function ActionIcon({ a }) {
  return <a.Icon size={19} strokeWidth={2} className="shrink-0 text-brand-beige" />;
}

// Home's composition, top to bottom: pergunta → escolha (na própria foto).
// Foto + gradient + ações continuam como uma única peça editorial no mobile
// (essa estrutura está aprovada, INTOCADA abaixo de lg — ver o bloco
// `lg:hidden`). A partir de lg (>=1024px) a composição muda para duas
// colunas editoriais (texto | foto limpa, sem overlay) — um bloco `hidden
// lg:grid` separado, reaproveitando os mesmos ACTIONS/REAL_PHOTOS/onSelect,
// não uma refatoração do mobile.
export default function HomeScreen({ onSelect, onOpenProduct }) {
  const favoriteProducts = FAVORITE_PRODUCT_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);
  // Hidden at lg+: DesktopNav's own "Salvos" link already covers this
  // exact action there, so this would otherwise be a second, redundant way
  // to do the same thing right under the unified header.
  const favoritesButton = (
    <button
      onClick={() => onSelect("salvos")}
      aria-label="Ver salvos"
      className="w-11 h-11 flex items-center justify-center lg:hidden"
    >
      <Heart size={20} className="text-brand-caramelDark" />
    </button>
  );

  return (
    // lg+: max-width dropped (was lg:max-w-6xl xl:max-w-7xl) and the gutter
    // narrowed to ~24px (was 32/48px) — this round's reference wants Home
    // to read as a wide, edge-to-edge page, not a centered column. This is
    // a Home-specific override; every other screen keeps its own existing
    // container system untouched.
    <div className="w-full md:max-w-2xl lg:max-w-none md:mx-auto px-gutter lg:px-6 pt-2 pb-8 fade-up">
      {/* Same logo size/row height as every other screen (SiteHeader's own
          defaults) — the previous "homeCompact" 52px override made the logo
          read as a micro decoration instead of a brand signature. 92px is
          still well within the cropped asset's native 332px height even at
          3x DPR (no upscaling), and it's the exact size already used and
          already validated everywhere else, not a new arbitrary value.
          lg+: DesktopNav is now the one complete header (logo + nav +
          search + Salvos/Seleção) — this row would just be a second, empty
          76px band underneath it, so it's hidden entirely on desktop. */}
      <div className="lg:hidden">
        <SiteHeader rightSlot={favoritesButton} />
      </div>

      {/* ============================= MOBILE/TABLET (<lg) — UNCHANGED ============================= */}
      <div className="lg:hidden">
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
                  <ActionIcon a={a} />
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

      {/* ============================= DESKTOP (>=lg) ============================= */}
      {/* Recomposed this round from a two-column (text | photo) layout to a
          single panoramic photo hero, per the approved reference: there is
          no left/right split — one photo covers the entire hero, with the
          headline/subtext and the three journey cards sitting ON TOP of it
          (readability via HERO_GRADIENT, not a separate image panel). Same
          handlers as mobile (onSelect(id) → App.jsx's screen state); the
          third journey ("feed") already exists as a real screen, just
          without a Home entry point before this round. */}
      <div className="hidden lg:block relative mt-4 overflow-hidden" style={{ height: 635 }}>
        <Photo
          src={REAL_PHOTOS.brigadeiroDiaDificil}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "42% 55%", transform: "scale(1.22)", transformOrigin: "42% 55%" }}
          loading="eager"
        />
        <div className="absolute inset-0 pointer-events-none" style={{ background: HERO_GRADIENT }} />

        <div className="absolute" style={{ left: 60, top: 130, maxWidth: 600 }}>
          <h1
            className="font-display font-semibold text-brand-ink"
            style={{ fontSize: 72, lineHeight: 0.98 }}
          >
            O que a gente vai adoçar hoje?&nbsp;💛
          </h1>
          <p className="text-brand-inkSoft" style={{ fontSize: 21, lineHeight: 1.4, maxWidth: 500, marginTop: 24 }}>
            Escolha pelo momento, procure alguma coisa específica ou simplesmente fique olhando...
          </p>
        </div>

        <div className="absolute grid grid-cols-3 gap-4" style={{ left: 58, right: 58, bottom: 55 }}>
          {DESKTOP_HERO_ACTIONS.map((a) => (
            <button
              key={a.id}
              onClick={() => onSelect(a.id)}
              className="flex items-center gap-4 text-left transition-transform duration-150 active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100"
              style={{ height: 135, borderRadius: 20, padding: "24px 26px", backgroundColor: COLORS.caramelDark, boxShadow: "0 4px 14px rgba(61,36,24,0.22)" }}
            >
              {a.emoji ? (
                <span className="shrink-0" style={{ fontSize: 40, lineHeight: 1 }}>
                  {a.emoji}
                </span>
              ) : (
                <a.Icon size={40} strokeWidth={1.75} className="shrink-0 text-brand-beige" />
              )}
              <span className="min-w-0 flex-1">
                <span className="block text-brand-beige font-semibold leading-snug" style={{ fontSize: 19 }}>
                  {a.title}
                </span>
                <span className="block text-brand-beige/85 mt-1 leading-snug" style={{ fontSize: 15.5 }}>
                  {a.subtitle}
                </span>
              </span>
              <ChevronRight size={28} className="shrink-0 text-brand-beige/85" />
            </button>
          ))}
        </div>
      </div>

      {/* "Nossos doces favoritos" — starts right after the hero, no empty
          band between them. Real products/photos/prices, ProductDetail on
          click (same openProductDetail App.jsx already uses everywhere
          else). First row is allowed to run past the fold at 900px tall —
          that's the point, it signals there's more page below. */}
      <div className="hidden lg:block mt-10">
        <div className="flex items-end justify-between mb-5">
          <h2 className="font-display font-medium text-brand-ink" style={{ fontSize: 32 }}>
            Nossos doces favoritos&nbsp;💛
          </h2>
          <button
            onClick={() => onSelect("catalogo")}
            className="text-sm font-medium shrink-0"
            style={{ color: COLORS.caramelDark }}
          >
            Ver todos os doces →
          </button>
        </div>
        <div className="grid grid-cols-4 gap-5">
          {favoriteProducts.map((p) => (
            <button key={p.id} onClick={() => onOpenProduct?.(p)} className="text-left">
              <div className="rounded-2xl overflow-hidden aspect-square">
                <Photo src={defaultPhotos(p)?.[0]} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="mt-2.5 text-base font-display text-brand-ink leading-tight">{p.name}</p>
              <p className="text-sm font-medium mt-0.5" style={{ color: COLORS.caramelDark }}>
                {p.price}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
