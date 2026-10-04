import { useEffect } from "react";
import { ChevronRight, Search, ShoppingBag } from "lucide-react";
import { REAL_PHOTOS } from "../../data/photos";
import { PRODUCTS } from "../../data/products";
import { defaultPhotos } from "../../utils/products";
import { COLORS } from "../../styles/colors";
import Logo from "../shared/Logo";
import Photo from "../shared/Photo";
import HeroMedia from "../shared/HeroMedia";
import { useDragScroll } from "../../hooks/useDragScroll";

// The Home's two real decisions — same ids/handler (onSelect(id) →
// App.jsx's screen state) on mobile and desktop, so the two don't diverge
// on what Home offers. "momentos" opens MomentPicker; "busca" already
// exists as a real screen in App.jsx. Card 2 uses the lucide Search icon
// (not an emoji) to match the approved reference on both breakpoints.
// Feed ("Só quero olhar e passar vontade") is no longer one of Home's
// headline choices — it stays a real, reachable screen (see App.jsx), just
// not offered here anymore.
const HERO_ACTIONS = [
  { id: "momentos", emoji: "💛", title: "Me ajuda a escolher", subtitle: "Quero descobrir o que combina comigo." },
  { id: "busca", Icon: Search, title: "Já sei o que quero", subtitle: "Me leva direto pro doce." },
];

// Four real, strongly-photographed products for the "Nossos doces
// favoritos" strip — same PRODUCTS data/photos/price convention as every
// other card in the app (ProductCard, FeedCard, SearchScreen all just
// render `p.price` raw, including "Sob consulta 💬" — Brownlito here
// follows that same existing pattern, not a new one).
const FAVORITE_PRODUCT_IDS = ["chocobomb", "cone-trufado", "brownlito", "casadinho"];

// Mobile hero overlay — a dark scrim, not a wash: just enough contrast
// behind the headline/copy for the cream text to read, clearing well before
// the journey cards (opaque caramel surfaces that need no help from the
// photo underneath). No light/cream wash here — that's what flattened the
// previous brigadeiro photo.
const MOBILE_HERO_GRADIENT =
  "linear-gradient(to bottom, rgba(28,16,9,0.68) 0%, rgba(28,16,9,0.48) 24%, rgba(28,16,9,0.18) 42%, rgba(28,16,9,0) 54%)";

// lg+ hero only — a light scrim, not a wash: just enough to keep the
// headline readable, clearing fast so the photo stays visible behind and
// around the text instead of half the hero reading as flat cream.
const HERO_GRADIENT =
  "linear-gradient(90deg, rgba(255,249,241,0.72) 0%, rgba(255,249,241,0.5) 15%, rgba(255,249,241,0.22) 30%, rgba(255,249,241,0.05) 42%, rgba(255,249,241,0) 55%)";

function HeroActionCard({ a, onSelect, height, radius, iconSize, emojiSize, titleSize, subtitleSize, chevronSize, padding, bg = COLORS.caramelDark }) {
  return (
    <button
      onClick={() => onSelect(a.id)}
      className="w-full flex items-center gap-3 text-left transition-transform duration-150 active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100"
      style={{ minHeight: height, borderRadius: radius, padding, backgroundColor: bg, boxShadow: "0 2px 8px rgba(61,36,24,0.14)" }}
    >
      {a.emoji ? (
        <span className="shrink-0" style={{ fontSize: emojiSize, lineHeight: 1 }}>
          {a.emoji}
        </span>
      ) : (
        <a.Icon size={iconSize} strokeWidth={2} className="shrink-0 text-brand-beige" />
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-brand-beige font-semibold leading-snug" style={{ fontSize: titleSize }}>
          {a.title}
        </span>
        <span className="block text-brand-beige/80 mt-0.5 leading-snug" style={{ fontSize: subtitleSize }}>
          {a.subtitle}
        </span>
      </span>
      <ChevronRight size={chevronSize} className="shrink-0 text-brand-beige/70" />
    </button>
  );
}

function FavoriteProductCard({ p, onOpen, className, style }) {
  const photo = defaultPhotos(p)?.[0];
  return (
    <button onClick={() => onOpen?.(p)} className={`text-left transition-transform duration-200 lg:hover:scale-[1.03] active:scale-[0.98] ${className}`} style={style}>
      <div className="relative rounded-2xl overflow-hidden aspect-square">
        <Photo src={photo} alt="" className="w-full h-full object-cover" loading="lazy" />
      </div>
      <p className="mt-2 text-xs font-display text-brand-ink leading-tight truncate">{p.name}</p>
      <p className="text-3xs font-medium mt-0.5" style={{ color: COLORS.caramelDark }}>
        {p.price}
      </p>
    </button>
  );
}

// Home: one hero (photo + headline + 2 journey cards, all one composed
// piece) followed by "Nossos doces favoritos" — same structure on mobile
// and desktop now, each with its own sizing/layout (mobile: full-bleed
// photo + stacked cards + horizontal scroll strip; desktop: contained,
// capped hero + a 4-column grid — see the `lg:hidden`/`hidden lg:block`
// blocks below). No more two-button mobile overlay + separate headline.
export default function HomeScreen({ onSelect, onOpenProduct, selection }) {
  const favoriteProducts = FAVORITE_PRODUCT_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);
  const selectionCount = selection?.length ?? 0;
  const dragScroll = useDragScroll();

  // Screens are swapped by conditional rendering (see App.jsx), not
  // routing, so the window keeps whatever scroll position the previous
  // screen was left at — reset it on arrival, same behavior SiteHeader
  // already provides everywhere else (Home no longer renders SiteHeader
  // itself, see below, so this replaces that effect for Home specifically).
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    // lg+: max-width dropped (was lg:max-w-6xl xl:max-w-7xl) and the gutter
    // widened to 32px/side (64px total) — the hero itself then caps at
    // max-w-[1376px] and centers within this, so at 1440 it runs edge to
    // edge (1440-64=1376) and at wider viewports it stays capped instead
    // of stretching. Home-specific override; every other screen keeps its
    // own existing container system untouched.
    <div className="w-full md:max-w-2xl lg:max-w-none md:mx-auto px-gutter lg:px-8 pt-2 pb-8 fade-up">
      {/* ============================= MOBILE/TABLET (<lg) ============================= */}
      <div className="lg:hidden">
        {/* Home-specific brand header — not the generic SiteHeader (no back
            button here; Home is the root screen). Logo gets real size/
            presence (same "home" preset used by every other screen's
            SiteHeader), Seleção on the right is the one real, existing
            personal-state destination — no invented hamburger/menu/account. */}
        <div className="flex items-center justify-between" style={{ height: 76 }}>
          <div className="w-11" />
          <Logo size="home" />
          <div className="flex items-center">
            <button onClick={() => onSelect("selecao")} aria-label="Ver seleção" className="relative w-11 h-11 flex items-center justify-center transition-transform active:scale-90">
              <ShoppingBag size={20} className="text-brand-caramelDark" />
              {selectionCount > 0 && (
                <span
                  className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full text-white text-3xs font-medium flex items-center justify-center"
                  style={{ backgroundColor: COLORS.caramelDark }}
                >
                  {selectionCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* One composed hero: full-bleed photo (breaks out of the page's
            own px-gutter via -mx-gutter), headline/subtitle sitting
            directly on it (legible via MOBILE_HERO_GRADIENT, concentrated
            at the top), two journey cards over the bottom — a single
            editorial piece, not a title block + a separate photo card +
            buttons underneath. */}
        <div className="relative -mx-gutter mt-2 overflow-hidden" style={{ height: 528 }}>
          {/* brownlitoInteiro — a single, clearly-identifiable dark-chocolate
              product in the foreground (plate + table behind it, not a
              texture/mosaic of many small pieces). Portrait source (900×1200,
              ratio ~0.75) already near-matches this container's own ratio
              (390×528, ~0.74), so object-cover needs almost no crop — the
              photo shows essentially uncropped. Rejected before this:
              boloCenouraTray ("mar de granulado", no identifiable single
              product), brigadeiroDiaDificil (production-tray texture),
              chocobomb/alfajorClassico (mosaics of repeated pieces). Still a
              placeholder per the brief — may be swapped again later.
              Rotation widened from 2 to 5 real frames for variety across
              product families, not just this one dessert: brownlitoRecheio
              (same product, cut open), presenteRosas (wrapped gift box —
              totally different composition, no plate/stick), pirulitoAlfajor
              (lollipop-shaped alfajores, overhead flat lay), and
              boloDePoteCamadas (borrowed from the desktop hero below, a
              third distinct product family). Interleaved deliberately so
              the two Brownlito frames never land back to back in the loop.
              Each needs its own crop since they're unrelated photos — see
              the per-frame `style` overrides. HeroMedia crossfades slowly
              between them; still no real video asset to plug in instead
              (see HeroMedia.jsx). */}
          <HeroMedia
            frames={[
              { src: REAL_PHOTOS.brownlitoInteiro, style: { objectPosition: "50% 38%" } },
              { src: REAL_PHOTOS.presenteRosas, style: { objectPosition: "50% 38%" } },
              { src: REAL_PHOTOS.brownlitoRecheio, style: { objectPosition: "50% 38%" } },
              { src: REAL_PHOTOS.pirulitoAlfajor, style: { objectPosition: "50% 42%" } },
              { src: REAL_PHOTOS.boloDePoteCamadas, style: { objectPosition: "48% 58%" } },
            ]}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 pointer-events-none" style={{ background: MOBILE_HERO_GRADIENT }} />

          <div className="absolute left-5 right-5" style={{ top: 26 }}>
            <h1 className="font-display font-semibold text-brand-beige" style={{ fontSize: 43, lineHeight: 0.98, maxWidth: 300 }}>
              O que a gente vai adoçar hoje?&nbsp;💛
            </h1>
            <p className="text-brand-beige/85" style={{ fontSize: 14, lineHeight: 1.3, maxWidth: 300, marginTop: 8 }}>
              Me conta o que você precisa. A gente acha um doce pra isso.
            </p>
          </div>

          {/* Two cards now, not three — height nudged up slightly (84→92)
              and the gap widened (gap-2.5→gap-3.5) so the pair reads as a
              deliberate, balanced pairing low in the hero rather than a
              shrunken stack with empty photo where a third card used to
              sit. Still well short of stretching each card to fill the old
              three-card footprint. */}
          <div className="absolute left-5 right-5 flex flex-col gap-3.5" style={{ bottom: 22 }}>
            {HERO_ACTIONS.map((a) => (
              <HeroActionCard
                key={a.id}
                a={a}
                onSelect={onSelect}
                height={92}
                radius={17}
                iconSize={20}
                emojiSize={21}
                titleSize={15.5}
                subtitleSize={12.5}
                chevronSize={16}
                padding="12px 16px"
                bg={COLORS.caramelDarker}
              />
            ))}
          </div>
        </div>

        {/* "Nossos doces favoritos" — horizontal scroll strip, real
            products/photos/prices, ProductDetail on tap (same
            openProductDetail App.jsx already uses everywhere else). */}
        <div className="mt-7">
          <div className="flex items-center justify-between mb-3.5 gap-2">
            <h2 className="font-display font-medium text-brand-ink whitespace-nowrap" style={{ fontSize: 26 }}>
              Nossos doces favoritos&nbsp;💛
            </h2>
            <button onClick={() => onSelect("catalogo")} className="text-xs font-medium shrink-0" style={{ color: COLORS.caramelDark }}>
              Ver todos →
            </button>
          </div>
          <div
            ref={dragScroll.ref}
            onPointerDown={dragScroll.onPointerDown}
            onPointerMove={dragScroll.onPointerMove}
            onPointerUp={dragScroll.onPointerUp}
            onPointerLeave={dragScroll.onPointerLeave}
            onClickCapture={dragScroll.onClickCapture}
            className={`flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-gutter px-gutter ${dragScroll.className}`}
          >
            {favoriteProducts.map((p) => (
              <FavoriteProductCard
                key={p.id}
                p={p}
                onOpen={onOpenProduct}
                className="shrink-0 snap-start"
                style={{ width: 140 }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ============================= DESKTOP (>=lg) ============================= */}
      {/* One panoramic photo hero, capped at max-w-[1376px] and centered —
          at 1440 (this round's primary target) that's edge to edge within
          the 32px/side gutter above; at wider viewports it stays capped
          rather than stretching. Headline/subtext/journey cards sit ON TOP
          of the photo (readability via the light HERO_GRADIENT scrim, not
          a separate image panel or a second transform/scale crop trick).
          APPROVED (PR #96) — not touched this round. */}
      <div className="hidden lg:block relative mt-5 mx-auto overflow-hidden" style={{ maxWidth: 1376, height: 665, borderRadius: 24 }}>
        {/* bolo-de-pote-camadas: chosen after comparing several real
            candidates (brigadeiro trays, chocobomb, cone trufado, alfajor,
            bolo de cenoura) — this is the one real photo in the catalog
            that already has genuine depth of field (soft, out-of-focus
            kitchen behind) instead of a flat, edge-to-edge texture/mosaic,
            with the jars' rich chocolate/strawberry layers reading as a
            real protagonist on the right. No scale()/distortion — only
            object-position picks which vertical band of the (portrait)
            source shows. Rotation widened from 2 to 5 real frames —
            boloDePoteMorango (same family, different jar), presenteRosas
            (gift box) and pirulitoAlfajor (lollipop alfajores) for real
            product variety, plus brownlitoInteiro borrowed from the mobile
            hero above. Interleaved so the two bolo-de-pote frames don't
            land back to back. Wide 2.07:1 crop favors landscape sources
            here (less vertical loss than the portrait ones), so
            presenteRosas/pirulitoAlfajor — both 4:3 — actually fit this
            container better than the desktop's own original pair. No real
            video exists yet to plug in via HeroMedia's `videoSrc` prop. */}
        <HeroMedia
          frames={[
            { src: REAL_PHOTOS.boloDePoteCamadas, style: { objectPosition: "48% 58%" } },
            { src: REAL_PHOTOS.presenteRosas, style: { objectPosition: "55% 42%" } },
            { src: REAL_PHOTOS.boloDePoteMorango, style: { objectPosition: "48% 58%" } },
            { src: REAL_PHOTOS.pirulitoAlfajor, style: { objectPosition: "50% 40%" } },
            { src: REAL_PHOTOS.brownlitoInteiro, style: { objectPosition: "50% 38%" } },
          ]}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 pointer-events-none" style={{ background: HERO_GRADIENT }} />

        <div className="absolute" style={{ left: 64, top: 84, maxWidth: 560 }}>
          <h1 className="font-display font-semibold text-brand-ink" style={{ fontSize: 80, lineHeight: 0.97 }}>
            O que a gente vai adoçar hoje?&nbsp;💛
          </h1>
          <p className="text-brand-inkSoft" style={{ fontSize: 19, lineHeight: 1.45, maxWidth: 430, marginTop: 20 }}>
            Me conta o que você precisa. A gente acha um doce pra isso.
          </p>
        </div>

        {/* grid-cols-3 → grid-cols-2: same two decisions as mobile, same
            left/right/bottom footprint — just one fewer, wider column
            instead of a 3-up grid with an empty third slot. */}
        <div className="absolute grid grid-cols-2 gap-4" style={{ left: 64, right: 64, bottom: 40 }}>
          {HERO_ACTIONS.map((a) => (
            <HeroActionCard key={a.id} a={a} onSelect={onSelect} height={116} radius={18} iconSize={22} emojiSize={25} titleSize={17} subtitleSize={13} chevronSize={18} padding="18px 20px" />
          ))}
        </div>
      </div>

      {/* "Nossos doces favoritos" — real products/photos/prices,
          ProductDetail on click (same openProductDetail App.jsx already
          uses everywhere else). First row is allowed to run past the fold
          at 900px tall — that's the point, it signals there's more page
          below (same as the reference). APPROVED (PR #96) — not touched
          this round beyond reusing the same FavoriteProductCard/
          favoriteProducts the mobile strip above now also uses. */}
      <div className="hidden lg:block" style={{ marginTop: 48 }}>
        <div className="flex items-end justify-between mb-5">
          <h2 className="font-display font-medium text-brand-ink" style={{ fontSize: 34 }}>
            Nossos doces favoritos&nbsp;💛
          </h2>
          <button onClick={() => onSelect("catalogo")} className="text-sm font-medium shrink-0" style={{ color: COLORS.caramelDark }}>
            Ver todos os doces →
          </button>
        </div>
        <div className="grid grid-cols-4 gap-5">
          {favoriteProducts.map((p) => (
            <button key={p.id} onClick={() => onOpenProduct?.(p)} className="text-left group">
              <div className="rounded-2xl overflow-hidden aspect-square transition-transform duration-200 group-hover:scale-[1.02]">
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
