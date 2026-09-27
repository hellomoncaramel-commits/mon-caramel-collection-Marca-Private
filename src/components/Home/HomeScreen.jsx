import { ChevronRight, Heart } from "lucide-react";
import { REAL_PHOTOS } from "../../data/photos";
import SiteHeader from "../shared/SiteHeader";
import Photo from "../shared/Photo";

// The two paths that answer the Home question directly ("Me ajuda a
// escolher" / "Já sei o que quero") — same routes/behavior as before
// (onSelect(id) → App.jsx's screen state). `primary` only nudges the
// discovery path's own card slightly, never a third action of equal
// weight — "Ver todos os doces" further down is a plain link, not a card.
const ACTIONS = [
  {
    id: "momentos",
    emoji: "💛",
    title: "Me ajuda a escolher",
    subtitle: "Quero descobrir o que combina comigo.",
    primary: true,
  },
  { id: "busca", emoji: "🔎", title: "Já sei o que quero", subtitle: "Me leva direto pro doce." },
];

// Home's composition, top to bottom: pergunta → escolha → desejo. The
// photo used to sit between the headline and the two actions (a ~300px
// hero the reader had to scroll past before the choices even appeared);
// it now comes last, as the editorial close, so the decision is visible
// right under the subtitle instead of hidden below a big picture. Same
// data, routes, and photo as before — only the order and each block's own
// visual weight changed.
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

      {/* The two discovery actions — visible right after the subtitle, not
          buried under a hero photo. Cream cards with a soft border/shadow,
          not the old solid-caramel rectangles: caramel stays an accent
          (icon chip, primary card's border tint) instead of a heavy mass. */}
      <div className="flex flex-col gap-2.5 mt-5">
        {ACTIONS.map((a) => (
          <button
            key={a.id}
            onClick={() => onSelect(a.id)}
            className={`w-full flex items-center gap-3 rounded-2xl border bg-white p-3.5 text-left transition-transform duration-150 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 ${
              a.primary ? "border-brand-caramelDark/35" : "border-brand-border"
            }`}
            style={{ boxShadow: "0 2px 10px rgba(61,36,24,0.07)", minHeight: 64 }}
          >
            <span
              className={`shrink-0 rounded-full flex items-center justify-center ${
                a.primary ? "bg-brand-caramelDark/12" : "bg-brand-subtle"
              }`}
              style={{ width: 38, height: 38, fontSize: 17 }}
            >
              {a.emoji}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-base font-display text-brand-ink leading-snug">{a.title}</span>
              <span className="block text-sm text-brand-muted mt-0.5 leading-snug">{a.subtitle}</span>
            </span>
            <ChevronRight size={16} className="shrink-0 text-brand-muted" />
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-3.5 text-mc-home-meta text-brand-muted">
        <span>📍 Retirada grátis — Ritson x Adelaide</span>
        <span className="w-1 h-1 rounded-full shrink-0 bg-brand-caramelLight" />
        <span>🚗 Entrega disponível</span>
      </div>

      {/* Secondary exit — an editorial/utility link, not a third card of
          the same weight as the two discovery actions above. Reuses the
          existing catalog route (same one MomentScreen's own "Explore toda
          a coleção" link points to) rather than inventing new catalog
          architecture. */}
      <button
        onClick={() => onSelect("catalogo")}
        className="mt-1 inline-flex items-center gap-1 py-3 text-sm font-medium text-brand-caramelDark underline decoration-brand-caramelDark/40 underline-offset-2"
      >
        Ver todos os doces <span aria-hidden="true">→</span>
      </button>

      {/* Photography, last — desejo/editorial, not a barrier between the
          question and the choices above. Inset with rounded corners (no
          longer full-bleed/hero-sized), same real photo as before. */}
      <div className="rounded-3xl overflow-hidden aspect-photo md:aspect-[16/9]">
        <Photo
          src={REAL_PHOTOS.casadinhoGoiabada}
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>
    </div>
  );
}
