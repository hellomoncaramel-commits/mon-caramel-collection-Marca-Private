import { useMemo } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { PRODUCTS } from "../../data/products";
import { MIMO_SHOWCASE } from "../../data/inspirationGalleries";
import { COLORS } from "../../styles/colors";
import { useSnapCarousel } from "../../hooks/useSnapCarousel";
import SiteHeader from "../shared/SiteHeader";
import Photo from "../shared/Photo";

// Slide width — same technique as InspirationCarousel/MomentPicker
// (min(vw,px), capped once there's room to spare), written as a literal
// class string everywhere it's used (track padding, each slide, both
// arrows) since Tailwind's build-time scanner needs the real class text,
// not a template-literal interpolation of a shared JS constant.

// Visual rework, 2026-10 (polish round): the old layout was a bare photo
// with name/description trailing loose below it in a free drag-scroll
// strip — lots of leftover vertical space under short descriptions, and no
// sense of "this text belongs to this photo." Rebuilt as a one-at-a-time
// snap carousel reusing Caixas/Bandejas's own InspirationCarousel
// mechanics (useSnapCarousel — same track/scroll-tracking, same arrow
// goTo, same keyboard support), with each slide now a single bordered card
// (photo + name + description inside one frame, same "photograph mounted
// on a card" language as ProductCard) instead of a bare photo frame — so
// the carousel itself is new, but its navigation behavior is the site's
// one existing pattern, not a third one.
function MimoSlide({ item, product, onOpen }) {
  if (!product) return null;
  return (
    <div className="shrink-0 snap-center w-[min(78vw,300px)] lg:w-[320px]">
      <button
        onClick={() => onOpen(product)}
        className="text-left w-full block rounded-3xl overflow-hidden bg-white border transition-transform duration-200 lg:hover:-translate-y-0.5 active:scale-[0.98]"
        style={{ borderColor: COLORS.border }}
      >
        <div className="relative aspect-photo bg-brand-subtle">
          <Photo
            src={item.photo}
            alt={item.name}
            className="w-full h-full object-cover"
            style={item.objectPosition ? { objectPosition: item.objectPosition } : undefined}
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <p className="font-display text-base text-brand-ink leading-tight">{item.name}</p>
          <p className="text-xs mt-1 leading-relaxed text-brand-inkSoft">{item.description}</p>
        </div>
      </button>
    </div>
  );
}

// Doces Mimos — a one-at-a-time carousel of inspirations (7 approved
// items), each a complete card (photo + name + description bound
// together), with a peek of the next card on both sides for discoverability
// and the same arrow/dot/counter chrome InspirationCarousel already uses on
// Caixas and Bandejas.
export default function MimosScreen({ onBack, onOpenProduct, onGoSelection, selection }) {
  const productsById = useMemo(() => new Map(PRODUCTS.map((p) => [p.id, p])), []);
  const { trackRef, index, goTo, onTrackKeyDown } = useSnapCarousel(MIMO_SHOWCASE.length);

  return (
    <div className="max-w-xl md:max-w-3xl lg:max-w-6xl mx-auto px-gutter lg:px-8 xl:px-12 pt-2 pb-10 fade-up">
      <SiteHeader onBack={onBack} />
      <h1 className="mc-page-title">Doces mimos 💛</h1>
      <p className="mc-page-subtitle">Porque toda ocasião merece ser lembrada com um docinho.</p>

      <div className="relative mt-6">
        <div
          ref={trackRef}
          onKeyDown={onTrackKeyDown}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Inspirações de Doces Mimos"
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar focus:outline-none pl-[calc((100%-min(78vw,300px))/2)] pr-[calc((100%-min(78vw,300px))/2)] lg:pl-[calc((100%-320px)/2)] lg:pr-[calc((100%-320px)/2)]"
        >
          {MIMO_SHOWCASE.map((item) => (
            <MimoSlide key={item.id} item={item} product={productsById.get(item.productId)} onOpen={(p) => onOpenProduct(p)} />
          ))}
        </div>

        {MIMO_SHOWCASE.length > 1 && (
          <>
            <button
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              aria-label="Mimo anterior"
              className="absolute top-[calc(50%-28px)] -translate-y-1/2 left-1 w-11 h-11 rounded-full bg-white/90 flex items-center justify-center disabled:opacity-0 disabled:pointer-events-none transition-opacity shadow-md"
            >
              <ChevronLeft size={18} className="text-brand-ink" />
            </button>
            <button
              onClick={() => goTo(index + 1)}
              disabled={index === MIMO_SHOWCASE.length - 1}
              aria-label="Próximo mimo"
              className="absolute top-[calc(50%-28px)] -translate-y-1/2 right-1 w-11 h-11 rounded-full bg-white/90 flex items-center justify-center disabled:opacity-0 disabled:pointer-events-none transition-opacity shadow-md"
            >
              <ChevronRight size={18} className="text-brand-ink" />
            </button>
          </>
        )}
      </div>

      <p className="text-center text-xs mt-3 text-brand-muted">
        {index + 1} de {MIMO_SHOWCASE.length}
      </p>

      {MIMO_SHOWCASE.length > 1 && (
        <div className="flex items-center justify-center mt-1" role="tablist" aria-label="Ir para mimo">
          {MIMO_SHOWCASE.map((item, i) => {
            const active = i === index;
            return (
              <button
                key={item.id}
                onClick={() => goTo(i)}
                role="tab"
                aria-selected={active}
                aria-label={`Ir para mimo ${i + 1}`}
                className="flex items-center justify-center shrink-0 w-8 h-8"
              >
                <span
                  className="block rounded-full"
                  style={{ width: active ? 9 : 6, height: active ? 9 : 6, backgroundColor: active ? COLORS.caramelDark : COLORS.border }}
                />
              </button>
            );
          })}
        </div>
      )}

      {selection.length > 0 && (
        <div className="mt-8 rounded-2xl border border-brand-caramelDark p-4 bg-white/95 backdrop-blur lg:max-w-md lg:mx-auto">
          <p className="text-xs uppercase tracking-wide mb-2 text-brand-muted">Você escolheu ({selection.length})</p>
          <button
            onClick={onGoSelection}
            className="w-full text-sm font-medium text-white bg-brand-caramelDark rounded-full py-3 flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Heart size={15} />
            Ver Minha Seleção
          </button>
        </div>
      )}
    </div>
  );
}
