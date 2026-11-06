import { Heart } from "lucide-react";
import { COLORS } from "../../styles/colors";
import { PHOTO_OBJECT_POSITION } from "../../data/photos";
import { defaultPhotos, getColecaoCompletaListingProducts, cardPriceLine } from "../../utils/products";
import SiteHeader from "../shared/SiteHeader";
import ProductArt from "../shared/ProductArt";
import Photo from "../shared/Photo";

// Explicit, hand-picked commercial order for Coleção completa — scoped to
// this screen only. getColecaoCompletaProducts() itself stays in its own
// (unordered) shape, so Busca, the static /doces/[slug] pages and every
// other consumer are unaffected.
const CATALOG_DISPLAY_ORDER = [
  "brigadeiro",
  "pao-de-mel",
  "brownlito",
  "alfajor",
  "casadinho",
  "chocobomb",
  "cone-trufado",
  "mini-donut-decorado",
  "bolo-cenoura",
  "bala-de-coco",
  "pirulito-alfajor",
  "melties",
  "mini-donut-simples",
  "butter-cookies",
  "butter-cookies-congelado",
  "brigadeiro-personalizado",
  "bolo-de-pote",
];

// Photo+name together sit inside one real <button> (opens the Detail)
// rather than wrapping the whole row in a div[role=button] — keeps the
// markup to real, non-nested
// interactive elements. Favorites heart is a separate, smaller, quieter
// control next to it — but it ALWAYS opens the Detail too, exactly like
// the photo/name button, never a direct addToSelection shortcut. A prior
// version of this heart quick-added non-customizable products straight to
// Minha Seleção with qty hardcoded to 1 — silently skipping a real
// minimumQuantity (e.g. Pão de Mel, mín. 4) for any product not flagged
// `customizable`, and incorrectly adding Bolo de Pote (a whatsappInquiry-
// only product, never meant to reach Minha Seleção at all) as a normal
// cart entry. The Detail sheet is the one place that already knows each
// product's real flow — configurator, stepper with its real minimum, or
// the WhatsApp-only CTA — so every entry point here routes through it
// instead of re-implementing (and risking re-breaking) that logic.
// Desktop-only (lg+) — a vertical, photo-led card instead of ProductRow's
// horizontal mobile-list row, laid out in a real grid (see CatalogScreen's
// own lg:grid block below) so the Coleção uses the width a desktop
// viewport actually has, instead of the same narrow list just centered in
// empty space. Same data, same price source (cardPriceLine), same
// catalogTeaser, same "whole card opens Detail, heart is a separate quiet
// control" behavior as ProductRow — a different composition of the exact
// same information, not a new interaction model. Heart badge reuses the
// white/90 circle-over-photo language ProductDetailSheet's own X/share
// buttons and PhotoCarousel's arrows already use, so it reads as the same
// design system, not an invented new control.
function ProductCardDesktop({ p, added, onOpenProduct }) {
  const photo = defaultPhotos(p)?.[0];
  const priceLine = cardPriceLine(p);

  return (
    <div
      className="relative rounded-2xl border bg-white overflow-hidden flex flex-col transition-transform duration-200 lg:hover:-translate-y-0.5"
      style={{ borderColor: added ? COLORS.caramelDark : COLORS.border, borderWidth: added ? "2px" : "1px" }}
    >
      <button onClick={() => onOpenProduct?.(p)} className="relative aspect-photo w-full overflow-hidden text-left group">
        {photo ? (
          <Photo
            src={photo}
            alt=""
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            style={PHOTO_OBJECT_POSITION[photo] ? { objectPosition: PHOTO_OBJECT_POSITION[photo] } : undefined}
            loading="lazy"
          />
        ) : (
          <ProductArt kind={p.kind} tint={p.tint} />
        )}
      </button>
      <button
        onClick={() => onOpenProduct?.(p)}
        aria-label={added ? `${p.name} já está na seleção — ver detalhes` : `Ver detalhes de ${p.name}`}
        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center transition-transform active:scale-90"
      >
        <Heart size={16} strokeWidth={2} color={added ? COLORS.caramelDark : COLORS.muted} fill={added ? COLORS.caramelDark : "none"} />
      </button>
      <button onClick={() => onOpenProduct?.(p)} className="flex-1 text-left p-4 flex flex-col">
        <h3 className="font-display text-lg text-brand-ink leading-tight">{p.name}</h3>
        {p.catalogTeaser && <p className="text-sm text-brand-inkSoft leading-snug mt-1.5">{p.catalogTeaser}</p>}
        {priceLine && <p className="text-sm text-brand-muted mt-auto pt-2.5">{priceLine}</p>}
      </button>
    </div>
  );
}

function ProductRow({ p, added, onOpenProduct }) {
  const photo = defaultPhotos(p)?.[0];
  const priceLine = cardPriceLine(p);

  return (
    <div
      className="rounded-2xl border bg-white overflow-hidden flex gap-3"
      style={{ borderColor: added ? COLORS.caramelDark : COLORS.border, borderWidth: added ? "2px" : "1px" }}
    >
      <button onClick={() => onOpenProduct?.(p)} className="flex flex-1 min-w-0 gap-3 text-left">
        <div className="w-28 h-28 shrink-0">
          {photo ? (
            <Photo
              src={photo}
              alt=""
              pictureClassName="block w-28 h-28"
              className="w-full h-full object-cover"
              style={PHOTO_OBJECT_POSITION[photo] ? { objectPosition: PHOTO_OBJECT_POSITION[photo] } : undefined}
              loading="lazy"
            />
          ) : (
            <ProductArt kind={p.kind} tint={p.tint} h="h-28" />
          )}
        </div>
        <div className="py-3 pr-1 flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="font-display text-base text-brand-ink leading-tight">{p.name}</h3>
          {/* Microfrase — card-only, name > microfrase > price in visual
              weight (text-brand-inkSoft, same secondary treatment already
              used for a product's blurb in SearchScreen's own result row,
              not a new style). No truncation: longer ones just wrap. */}
          {p.catalogTeaser && <p className="text-xs text-brand-inkSoft leading-snug mt-0.5">{p.catalogTeaser}</p>}
          {priceLine && <p className="text-xs text-brand-muted mt-0.5">{priceLine}</p>}
        </div>
      </button>
      <div className="flex items-center pr-2.5 shrink-0">
        <button
          onClick={() => onOpenProduct?.(p)}
          aria-label={added ? `${p.name} já está na seleção — ver detalhes` : `Ver detalhes de ${p.name}`}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-90"
        >
          <Heart size={16} strokeWidth={2} color={added ? COLORS.caramelDark : COLORS.muted} fill={added ? COLORS.caramelDark : "none"} />
        </button>
      </div>
    </div>
  );
}

// Discreet alternate path for customers who already know what they want —
// no mood quiz, just the full list (briefing section 4). No more
// Caixas/Cestas/Festa discovery cards interleaved here (QA pós-
// publicação, 2026-11) — those three already have their own, better
// entry points (PresenteEntryScreen.jsx for Caixas/Cestas, the Festa
// momento screen for Festas) and mixing a different-shaped editorial
// tile into a grid of same-size product cards was itself a source of
// row-height inconsistency. This screen is now exactly what its own
// heading promises: every individual product, nothing else.
export default function CatalogScreen({ onBack, selection, onOpenProduct, onOpenSelection }) {
  const inSelection = (id) => selection.some((it) => it.productId === id);

  // getColecaoCompletaListingProducts(), not getColecaoCompletaProducts()
  // itself — this grid deliberately leaves out giftPresentationOnly and
  // eventExclusive items (apresentações de presente/festa only reachable
  // here before, now exclusive to Presentes/Festa), while /doces/[slug]
  // routing and the static page generator still index every one of them
  // via the unfiltered function (see utils/products.js for both).
  const individualProducts = getColecaoCompletaListingProducts();

  // Same ia/ib fallback shape as pickForMoment()'s sort (utils/products.js)
  // — a product not yet added to CATALOG_DISPLAY_ORDER sorts after every
  // listed one instead of throwing or vanishing.
  individualProducts.sort((a, b) => {
    const ia = CATALOG_DISPLAY_ORDER.indexOf(a.id);
    const ib = CATALOG_DISPLAY_ORDER.indexOf(b.id);
    if (ia === -1 && ib === -1) return 0;
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  return (
    <div className="max-w-2xl lg:max-w-6xl mx-auto px-gutter pt-2 pb-10 fade-up">
      <SiteHeader onBack={onBack} />
      <h2 className="mc-page-title">Coleção completa</h2>
      <p className="mc-page-subtitle">Todos os produtos, num lugar só.</p>

      {/* Mobile/tablet (<lg): a lista compacta original, intocada. */}
      <div className="space-y-3 lg:hidden">
        {individualProducts.map((p) => (
          <ProductRow key={p.id} p={p} added={inSelection(p.id)} onOpenProduct={onOpenProduct} />
        ))}
      </div>

      {/* Desktop (lg+): grid de cards verticais com foto em destaque — uma
          composição própria pro espaço disponível, não a lista mobile
          esticada. Sempre 3 colunas a partir de lg (1024px) — não mais
          2 até xl — mesma largura/alinhamento de card em qualquer largura
          desktop, sem a inconsistência de um breakpoint intermediário. */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6">
        {individualProducts.map((p) => (
          <ProductCardDesktop key={p.id} p={p} added={inSelection(p.id)} onOpenProduct={onOpenProduct} />
        ))}
      </div>

      {selection.length > 0 && (
        <div className="mt-6 lg:mt-8 lg:max-w-sm rounded-2xl border border-brand-caramelDark p-4 bg-white/95 backdrop-blur">
          <p className="text-xs uppercase tracking-wide mb-2 text-brand-muted">Você escolheu ({selection.length})</p>
          <button
            onClick={onOpenSelection}
            className="w-full text-sm font-medium text-white bg-brand-caramelDark rounded-full py-3 flex items-center justify-center gap-2"
          >
            <Heart size={15} />
            Ver Minha Seleção
          </button>
        </div>
      )}
    </div>
  );
}
