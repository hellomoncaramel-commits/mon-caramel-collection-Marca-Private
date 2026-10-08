import { Heart } from "lucide-react";
import { PRODUCTS } from "../../data/products";
import { COLORS } from "../../styles/colors";
import { REAL_PHOTOS } from "../../data/photos";
import { defaultPhotos } from "../../utils/products";
import SiteHeader from "../shared/SiteHeader";
import ProductArt from "../shared/ProductArt";
import Photo from "../shared/Photo";

// Three "discovery" cards, intercalated through the individual-product
// list below instead of listing every box/cesta/festa item one by one —
// Home already offers dedicated paths for dia a dia/presentes/festas, so
// this isn't a second category nav, just a shortcut into the existing
// screens for the one part of the catalog that's naturally many near-
// identical combinações (briefing sections 2-4).
//
// Photos: real Mon Caramel photography only, reused from what's already
// in the project — no new images, nothing AI-generated or stock.
// Caixas/Bandejas reuse the exact same photos (and crops) already
// approved for these two groups in PresenteEntryScreen.jsx. Festa uses
// festaOptions[0] — an existing general "mesa de festa" shot (same
// gallery already used for briganinho-personalizado), chosen because it
// reads as "doces para festas" broadly rather than one single décor theme
// (Minnie, Mario, etc.) the way the per-product festa photos do.
const DISCOVERY_CARDS = [
  {
    id: "discover-caixas",
    screen: "presente-caixas",
    title: "Caixas para presentear",
    tagline: "Um presente doce para alguém especial.",
    cta: "Explorar caixas →",
    photo: REAL_PHOTOS.presenteRosas,
    photoPosition: "object-[20%_25%]",
  },
  {
    id: "discover-bandejas",
    screen: "presente-bandejas",
    title: "Cestas especiais",
    tagline: "Uma seleção de delícias para surpreender.",
    cta: "Explorar cestas →",
    photo: REAL_PHOTOS.bandejaMario,
    photoPosition: "object-[38%_35%]",
  },
  {
    id: "discover-festa",
    screen: "festa",
    title: "Doces para festas",
    tagline: "Pequenos detalhes para grandes comemorações.",
    cta: "Explorar festas →",
    photo: REAL_PHOTOS.festaOptions[0],
  },
];

// Same bottom-weighted scrim PresenteEntryScreen.jsx already uses for this
// exact photo-led-tile pattern — reused, not reinvented, so these three
// cards read as the same established "discovery tile" language instead of
// a new visual device.
const SCRIM = `linear-gradient(to top, ${COLORS.ink}CC 0%, ${COLORS.ink}4D 50%, ${COLORS.ink}00 78%)`;

function DiscoveryCard({ card, onSelect }) {
  return (
    <button onClick={() => onSelect(card.screen)} className="relative overflow-hidden rounded-2xl aspect-photo w-full text-left group">
      <Photo
        src={card.photo}
        alt=""
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-300 lg:group-hover:scale-[1.03]${
          card.photoPosition ? ` ${card.photoPosition}` : ""
        }`}
        loading="lazy"
      />
      <div className="absolute inset-0 pointer-events-none" style={{ background: SCRIM }} />
      <div className="absolute left-4 right-4 bottom-3.5">
        <p className="font-display text-lg text-white leading-tight">{card.title}</p>
        <p className="text-xs leading-snug text-white/85 mt-0.5">{card.tagline}</p>
        <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-white">{card.cta}</span>
      </div>
    </button>
  );
}

// Photo+name together sit inside one real <button> (opens the Detail,
// same as FeedCard.jsx's own name button) rather than wrapping the whole
// row in a div[role=button] — keeps the markup to real, non-nested
// interactive elements. Visually this still reads as "the whole card" set
// apart from only the small heart affordance, since the button spans the
// full photo+text area. Favorites heart is a separate, smaller, quieter
// control next to it — same dual-action logic the old single circle had
// (customizable → open Detail to choose options; simple products → quick
// add), just restyled down from a bold bordered circle to a plain icon.
function ProductRow({ p, added, onOpenProduct, addToSelection }) {
  const photo = defaultPhotos(p)?.[0];

  const handleHeart = (e) => {
    e.stopPropagation();
    if (p.customizable) {
      onOpenProduct?.(p);
    } else {
      addToSelection({ kind: "product", productId: p.id, name: p.name, unit: p.unit, qty: 1, flavors: null });
    }
  };

  return (
    <div
      className="rounded-2xl border bg-white overflow-hidden flex gap-3"
      style={{ borderColor: added ? COLORS.caramelDark : COLORS.border, borderWidth: added ? "2px" : "1px" }}
    >
      <button onClick={() => onOpenProduct?.(p)} className="flex flex-1 min-w-0 gap-3 text-left">
        <div className="w-28 h-28 shrink-0">
          {photo ? (
            <Photo src={photo} alt="" pictureClassName="block w-28 h-28" className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <ProductArt kind={p.kind} tint={p.tint} h="h-28" />
          )}
        </div>
        <div className="py-3 pr-1 flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="font-display text-base text-brand-ink leading-tight">{p.name}</h3>
          {/* Both unit and price preserved exactly as the data defines them
              (no commercial rule touched) — only the separator is now
              conditional, so a product with a blank `unit` (package-priced
              products' legacy field, "Sob consulta" items, etc.) doesn't
              show a stray leading " · ". */}
          {(p.unit || p.price) && (
            <p className="text-xs text-brand-muted mt-0.5">{p.unit && p.price ? `${p.unit} · ${p.price}` : p.unit || p.price}</p>
          )}
        </div>
      </button>
      <div className="flex items-center pr-2.5 shrink-0">
        <button
          onClick={handleHeart}
          aria-label={
            p.customizable
              ? `Ver sabores e opções de ${p.name}`
              : added
              ? `${p.name} já está na seleção`
              : `Adicionar ${p.name} à seleção`
          }
          className="w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-90"
        >
          <Heart size={16} strokeWidth={2} color={added ? COLORS.caramelDark : COLORS.muted} fill={added ? COLORS.caramelDark : "none"} />
        </button>
      </div>
    </div>
  );
}

// Discreet alternate path for customers who already know what they want —
// no mood quiz, just the full list (briefing section 4). Caixas/Bandejas/
// festa-only products are represented by the three DISCOVERY_CARDS above
// instead of appearing one by one — everything else (including products
// that are ALSO sold for festas, like Cones Trufados or Chocobomb) keeps
// its own row exactly as before.
export default function CatalogScreen({ onBack, selection, addToSelection, onOpenProduct, onOpenSelection, onSelect }) {
  const inSelection = (id) => selection.some((it) => it.productId === id);

  // "Festa-only" = moments is exactly ["festa"], nothing else — these
  // never show up outside the Festa journey, so they fold into the
  // "Doces para festas" card. A product tagged festa AND something else
  // (dia-dificil, etc.) is sold day-to-day too and stays in the main list,
  // same as the explicit brigadeiros/pão de mel/cones trufados examples.
  const isFestaOnly = (p) => p.moments?.length === 1 && p.moments[0] === "festa";

  const individualProducts = PRODUCTS.filter((p) => p.presenteGroup !== "caixas" && p.presenteGroup !== "bandejas" && !isFestaOnly(p));

  // Spread the three discovery cards through the list at even intervals —
  // never clustered together, never a separate section (briefing section
  // 5) — computed from the real list length rather than hand-picked
  // indices, so it stays correct if products are added/removed later.
  const rendered = [];
  const slot = Math.max(1, Math.floor(individualProducts.length / (DISCOVERY_CARDS.length + 1)));
  let cardIndex = 0;
  individualProducts.forEach((p, i) => {
    rendered.push({ type: "product", product: p });
    if (cardIndex < DISCOVERY_CARDS.length && i + 1 === slot * (cardIndex + 1)) {
      rendered.push({ type: "discovery", card: DISCOVERY_CARDS[cardIndex] });
      cardIndex += 1;
    }
  });
  while (cardIndex < DISCOVERY_CARDS.length) {
    rendered.push({ type: "discovery", card: DISCOVERY_CARDS[cardIndex] });
    cardIndex += 1;
  }

  return (
    <div className="max-w-2xl lg:max-w-4xl mx-auto px-gutter pt-2 pb-10 fade-up">
      <SiteHeader onBack={onBack} />
      <h2 className="mc-page-title">Coleção completa</h2>
      <p className="mc-page-subtitle">Todos os produtos, num lugar só.</p>

      <div className="space-y-3">
        {rendered.map((item) =>
          item.type === "product" ? (
            <ProductRow key={item.product.id} p={item.product} added={inSelection(item.product.id)} onOpenProduct={onOpenProduct} addToSelection={addToSelection} />
          ) : (
            <DiscoveryCard key={item.card.id} card={item.card} onSelect={onSelect} />
          )
        )}
      </div>

      {selection.length > 0 && (
        <div className="mt-6 rounded-2xl border border-brand-caramelDark p-4 bg-white/95 backdrop-blur">
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
