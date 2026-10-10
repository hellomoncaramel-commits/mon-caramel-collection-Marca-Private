import { useMemo } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { PRODUCTS } from "../../data/products";
import { MIMO_SHOWCASE } from "../../data/inspirationGalleries";
import { useDragScroll } from "../../hooks/useDragScroll";
import SiteHeader from "../shared/SiteHeader";
import Photo from "../shared/Photo";

// One slide — photo as protagonist, name + short approved description
// below, no price/button on the card itself (briefing: "evitar repetição
// de botões, preços e textos comerciais na apresentação inicial"). The
// whole card is the tap target, same "whole row/card opens Detail" ethos
// CatalogScreen's ProductRow already uses — clicking opens that mimo's
// real product in the standard Detail sheet, which already knows whether
// to show the WhatsApp inquiry CTA or the normal add-to-selection flow
// (via whatsappInquiryMessage on the product record), so this component
// never needs its own routing logic.
function MimoSlide({ item, product, onOpen, widthClassName }) {
  if (!product) return null;
  return (
    <button
      onClick={() => onOpen(product)}
      className={`text-left shrink-0 snap-start transition-transform duration-200 lg:hover:scale-[1.02] active:scale-[0.98] ${widthClassName}`}
    >
      <div className="relative aspect-photo rounded-3xl overflow-hidden bg-brand-subtle">
        <Photo
          src={item.photo}
          alt={item.name}
          className="w-full h-full object-cover"
          style={item.objectPosition ? { objectPosition: item.objectPosition } : undefined}
          loading="lazy"
        />
      </div>
      <p className="font-display text-base text-brand-ink leading-tight mt-3">{item.name}</p>
      <p className="text-xs mt-1 leading-relaxed text-brand-inkSoft">{item.description}</p>
    </button>
  );
}

// Pequenos Mimos — a horizontal carousel of inspirations (7 approved
// items, round 2026-10), replacing the old grid-of-cards-with-buttons.
// Mobile: native horizontal snap-scroll, next card peeking at the edge.
// Desktop: same scroll-strip mechanism (so all 7 stay reachable, unlike a
// static grid that would just wrap to a second row and stop being a
// carousel), widened cards + click-and-drag via useDragScroll (same
// pattern as Home's "Nossos doces favoritos" strip) plus small chevron
// buttons borrowed from InspirationCarousel's own for discoverability —
// reusing both of the site's existing carousel mechanics rather than
// inventing a third visual style.
export default function MimosScreen({ onBack, onOpenProduct, onGoSelection, selection }) {
  const productsById = useMemo(() => new Map(PRODUCTS.map((p) => [p.id, p])), []);
  const dragScroll = useDragScroll();

  const scrollBy = (dir) => {
    const el = dragScroll.ref.current;
    if (!el) return;
    const card = el.querySelector(":scope > button");
    const step = card ? card.offsetWidth + 16 : 300;
    el.scrollBy({ left: dir * step, behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <div className="max-w-xl md:max-w-3xl lg:max-w-6xl mx-auto px-gutter lg:px-8 xl:px-12 pt-2 pb-10 fade-up">
      <SiteHeader onBack={onBack} />
      <h1 className="mc-page-title">Pequenos mimos 💛</h1>
      <p className="mc-page-subtitle">Pequenos detalhes que transformam qualquer ocasião em um momento especial.</p>

      <div className="relative mt-6">
        <div
          ref={dragScroll.ref}
          onPointerDown={dragScroll.onPointerDown}
          onPointerMove={dragScroll.onPointerMove}
          onPointerUp={dragScroll.onPointerUp}
          onPointerLeave={dragScroll.onPointerLeave}
          onClickCapture={dragScroll.onClickCapture}
          role="region"
          aria-label="Inspirações de Pequenos Mimos"
          className={`flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-gutter px-gutter lg:mx-0 lg:px-0 ${dragScroll.className}`}
        >
          {MIMO_SHOWCASE.map((item) => (
            <MimoSlide
              key={item.id}
              item={item}
              product={productsById.get(item.productId)}
              onOpen={(p) => onOpenProduct(p)}
              widthClassName="w-[78vw] max-w-[320px] lg:w-[280px]"
            />
          ))}
        </div>

        {/* Desktop-only chevrons — same small floating-button treatment as
            InspirationCarousel's own prev/next, just not disabled-aware
            (this is a free-scroll strip, not a snap-to-index carousel with
            a fixed slide count to clamp against). */}
        <button
          onClick={() => scrollBy(-1)}
          aria-label="Ver mimos anteriores"
          className="hidden lg:flex absolute top-[calc(50%-20px)] -translate-y-1/2 -left-5 w-11 h-11 rounded-full bg-white shadow-md items-center justify-center"
        >
          <ChevronLeft size={18} className="text-brand-ink" />
        </button>
        <button
          onClick={() => scrollBy(1)}
          aria-label="Ver mais mimos"
          className="hidden lg:flex absolute top-[calc(50%-20px)] -translate-y-1/2 -right-5 w-11 h-11 rounded-full bg-white shadow-md items-center justify-center"
        >
          <ChevronRight size={18} className="text-brand-ink" />
        </button>
      </div>

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
