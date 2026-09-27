import { ChevronRight, Heart, Search, Sparkles } from "lucide-react";
import { REAL_PHOTOS } from "../../data/photos";
import SiteHeader from "../shared/SiteHeader";
import Photo from "../shared/Photo";

// The two paths that answer the Home question directly ("Me ajuda a
// escolher" / "Já sei o que quero") — same routes/behavior as before
// (onSelect(id) → App.jsx's screen state), now rendered as editorial rows
// inside the photo composition instead of standalone white cards. `primary`
// only nudges the discovery path's own row slightly (never a solid CTA) —
// "Ver todos os doces" further down stays a plain, smaller link.
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

// Vertical gradient the actions sit on — warm cream/beige (the app's own
// `brand.subtle` → `brand.beige` tokens), never black. Fully transparent
// through the photo's upper half so the product stays the clear visual
// protagonist, then ramps up gradually (not a hard band) so text has a
// comfortably solid, on-brand surface to sit on by the bottom third.
const PHOTO_GRADIENT =
  "linear-gradient(to bottom, rgba(244,235,218,0) 0%, rgba(244,235,218,0) 30%, rgba(244,235,218,0.45) 46%, rgba(244,235,218,0.8) 60%, rgba(244,235,218,0.94) 74%, rgba(255,252,245,0.98) 88%, rgba(255,252,245,0.99) 100%)";

// Home's composition, top to bottom: pergunta → escolha (na própria foto) →
// desejo. Foto + ações agora são uma única peça editorial — a fotografia é
// o palco onde a decisão acontece, não mais uma foto solta depois de um
// bloco de cards. Mesma foto, mesmas rotas de antes; só a apresentação (e a
// remoção da linha de retirada/entrega, que não pertence a este ponto da
// jornada) mudou.
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

      {/* The single editorial stage — photo, gradient and the three exits
          layered as one piece. aspect-mc-portrait (4:5, an existing token)
          keeps most of the photo visible above the actions without turning
          into a full-screen hero — and, unlike a wider ratio (e.g. 16:9),
          stays narrow enough relative to the source photo (640×480) that
          object-cover always crops horizontally, which is what hides the
          raw photo's own dark edge on its right side. Kept the same ratio
          at every width instead of a md-only override, since this task's
          scope is the mobile composition, not a separate desktop layout. */}
      <div className="relative mt-5 rounded-3xl overflow-hidden aspect-mc-portrait">
        <Photo
          src={REAL_PHOTOS.casadinhoGoiabada}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 pointer-events-none" style={{ background: PHOTO_GRADIENT }} />

        <div className="absolute inset-x-0 bottom-0 px-gutter pb-4 pt-9">
          <div className="flex flex-col">
            {ACTIONS.map((a, i) => (
              <button
                key={a.id}
                onClick={() => onSelect(a.id)}
                className={`w-full flex items-center gap-3 py-3 text-left transition-transform duration-150 active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100 ${
                  i > 0 ? "border-t border-brand-caramelDark/10" : ""
                }`}
                style={{ minHeight: 44 }}
              >
                <a.Icon size={19} strokeWidth={2} className="shrink-0 text-brand-caramelDark" />
                <span className="min-w-0 flex-1">
                  <span
                    className={`block font-display text-brand-ink leading-snug ${
                      a.primary ? "text-[17px] font-medium" : "text-base"
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

          {/* Clearly tertiary — smaller, no underline, doesn't sit inside
              the same row rhythm as the two actions above. Reuses the
              existing catalog route (same one MomentScreen's own "Explore
              toda a coleção" link points to). */}
          <button
            onClick={() => onSelect("catalogo")}
            className="inline-flex items-center gap-1 py-3.5 text-xs font-medium text-brand-caramelDark/75"
          >
            Ver todos os doces <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
