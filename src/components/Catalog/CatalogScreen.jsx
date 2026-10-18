import { Heart } from "lucide-react";
import { COLORS } from "../../styles/colors";
import { REAL_PHOTOS, PHOTO_OBJECT_POSITION } from "../../data/photos";
import { defaultPhotos, getColecaoCompletaProducts, cardPriceLine } from "../../utils/products";
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
// in the project — no new images, nothing AI-generated or stock, no photo
// file ever edited. Caixas keeps the exact photo+crop already approved in
// PresenteEntryScreen.jsx. Bandejas is back to bandejaMario (see its own
// comment below). Festa was swapped after visual review (festaOptions[0]
// read as too generic/didn't convey "comemoração") — miniDonutFesta[0] is
// itself exactly 4:3, matching this card's own aspect-photo ratio pixel-
// for-pixel, so a plain object-position crop is a no-op (cover on equal
// ratios never overflows the box). Its `photoZoom` is a display-only
// `transform: scale()` around a chosen `transformOrigin` — zooms toward
// that point, cropped by the wrapper's overflow-hidden — instead of
// object-position, since that source doesn't have cover's usual slack to
// pan in. Never touches the source file.
// Copy aligned with the canonical "Entrada de Presentes"/Home experiences
// (post-UX/UI-audit, 2026-10) rather than independently invented —
// title/tagline/CTA reuse the exact canonical text wherever it already
// fits a card this size, so there's no drift between what a shortcut
// promises here and what the destination screen actually delivers. Not a
// verbatim copy of the full Presentes page everywhere (not required), but
// never a different promise than the canonical one either.
// Explicit display order for Coleção completa (Fase 3 fechamento, 2026-10
// — audit finding: the list had no deliberate commercial order at all,
// just raw PRODUCTS-array/data-entry order). Scoped to THIS screen only —
// getColecaoCompletaProducts() itself (utils/products.js) is untouched, so
// Busca, static /doces/[slug] pages and every other consumer of that list
// keep their own existing order exactly as before. Balances: strong,
// appetite-driving photos and popular everyday staples first (Alfajor, Pão
// de Mel, Chocobomb); Brownlito pulled up from its old #18 despite a B
// photo — it's the single most internally cross-sold product in the whole
// catalog (4 other products' `experience.nextTemptation` point to it, see
// data/products.js) yet had zero presence in Me Tenta or Presente Rápido
// (audit finding P1-3) — this is the one surface that can give it real
// exposure without touching either of those pools, which the brief
// explicitly rules out doing directly; package/pacote items (Casadinhos,
// Brigadeiro) and festa-tagged items (Chocobomb, Mini Donut Decorado, Cone
// Trufado) deliberately spread apart rather than clustered; every
// fixed/clean-priced product before every "Sob consulta" one, EXCEPT
// Biscoito Amanteigado — Sob consulta but an A-grade photo and one of the
// most universally popular everyday items, so pulled forward past several
// priced products rather than applying one single rule mechanically (the
// brief's own "não faça simplesmente best-sellers primeiro" instruction);
// the 8 Sob-consulta items close the list, in roughly strongest-to-weakest
// photo order, ending on Maçã Personalizada — the one item with no photo
// at all right now (see its own comment in data/products.js).
const CATALOG_DISPLAY_ORDER = [
  "alfajor",
  "pao-de-mel",
  "chocobomb",
  "brownlito",
  "casadinho",
  "mini-donut-decorado",
  "bala-de-coco",
  "pirulito-alfajor",
  "cone-trufado",
  "melties",
  "brigadeiro-personalizado",
  "butter-cookies",
  "mini-donut-simples",
  "bolo-cenoura",
  "butter-cookies-congelado",
  "brigadeiro",
  "bolo-de-pote",
  "piramide",
  "presentinho-pirulito",
  "presentinho-obrigada",
  "oreo-chocobomb-personalizado",
  "mini-donuts-personalizados",
  "brownlito-personalizado",
  "presentinho-macas",
];

const DISCOVERY_CARDS = [
  {
    id: "discover-caixas",
    screen: "presente-caixas",
    title: "Caixas",
    // Canonical copy (PresenteEntryScreen.jsx) — Caixas = presente
    // personalizado.
    tagline: "Um presente personalizado para fazer alguém se sentir especial.",
    cta: "Quero ver ideias →",
    photo: REAL_PHOTOS.presenteRosas,
    photoPosition: "object-[20%_25%]",
  },
  {
    id: "discover-bandejas",
    screen: "presente-bandejas",
    title: "Cestas especiais",
    // Canonical copy (PresenteEntryScreen.jsx) — Cestas = composição de
    // produtos Mon Caramel, não "surpresa" genérica.
    tagline: "Uma seleção dos nossos doces, montada e personalizada pra ocasião.",
    cta: "Quero ver ideias →",
    // bandeja-mario.jpg, de volta — a troca anterior para bandeja-
    // formatura.jpg (com zoom pesado pra recortar a faixa de texto) saiu
    // desfocada e mostrava só um detalhe ampliado, não a cesta como um
    // todo. Esta foto já é exatamente 4:3, igual à proporção do card
    // (aspect-photo), então object-fit:cover nela é um no-op — nenhum
    // recorte, a composição inteira (balões, cartão, docinhos) aparece
    // sem zoom e na resolução original.
    photo: REAL_PHOTOS.bandejaMario,
  },
  {
    id: "discover-festa",
    screen: "festa",
    title: "Festas",
    // Aligned with Festa's canonical promise (moments.js MOMENT_TAGLINE/
    // MOMENT_INTRO: planejar os doces junto, personalizados pro tema) —
    // "Pequenos detalhes para grandes comemorações" dropped per the audit.
    tagline: "Doces personalizados para celebrar junto.",
    cta: "Quero planejar →",
    // mini-donut-festa-torre.jpg — a torre de mini donuts em si; o zoom
    // recorta as margens cremes das laterais (a foto fonte já tem esse
    // espaço vazio embutido) e a placa "GOO!" do topo.
    photo: REAL_PHOTOS.miniDonutFesta[0],
    photoZoom: { scale: 1.75, origin: "50% 51%" },
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
      {/* photoZoom cards get their own crop viewport (absolute +
          overflow-hidden) so the img's own static `transform: scale()`
          stays clipped to the card's rounded corners — the group-hover
          "breathing" scale moves to this wrapper instead of the img itself
          so the two transforms never collide on the same element.
          photoPosition cards (object-fit crop only, no resize) don't need
          any of this and keep the simpler original markup. */}
      {card.photoZoom ? (
        <div className="absolute inset-0 overflow-hidden transition-transform duration-300 lg:group-hover:scale-[1.03]">
          <Photo
            src={card.photo}
            alt=""
            className="w-full h-full object-cover"
            style={{ transform: `scale(${card.photoZoom.scale})`, transformOrigin: card.photoZoom.origin }}
            loading="lazy"
          />
        </div>
      ) : (
        <Photo
          src={card.photo}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-300 lg:group-hover:scale-[1.03]${
            card.photoPosition ? ` ${card.photoPosition}` : ""
          }`}
          loading="lazy"
        />
      )}
      <div className="absolute inset-0 pointer-events-none" style={{ background: SCRIM }} />
      <div className="absolute left-4 right-4 bottom-3.5">
        <p className="font-display text-lg text-white leading-tight">{card.title}</p>
        <p className="text-xs leading-snug text-white/85 mt-0.5">{card.tagline}</p>
        <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-white">{card.cta}</span>
      </div>
    </button>
  );
}

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
// no mood quiz, just the full list (briefing section 4). Caixas/Bandejas/
// festa-only products are represented by the three DISCOVERY_CARDS above
// instead of appearing one by one — everything else (including products
// that are ALSO sold for festas, like Cones Trufados or Chocobomb) keeps
// its own row exactly as before.
export default function CatalogScreen({ onBack, selection, onOpenProduct, onOpenSelection, onSelect }) {
  const inSelection = (id) => selection.some((it) => it.productId === id);

  // The exact same 24 products a /doces/[slug] page gets generated for
  // (see utils/products.js getColecaoCompletaProducts) — one definition,
  // read from both places, so a product can't be listed here without
  // also being indexable, or vice versa.
  const individualProducts = getColecaoCompletaProducts();

  // Reorder to the explicit curated display order above — getColecaoCompletaProducts()
  // itself is untouched (still raw PRODUCTS order for every other consumer,
  // see CATALOG_DISPLAY_ORDER's own comment). Same ia/ib fallback shape as
  // pickForMoment()'s sort (utils/products.js) — a future product not yet
  // added to CATALOG_DISPLAY_ORDER sorts after every listed one instead of
  // throwing or silently vanishing.
  individualProducts.sort((a, b) => {
    const ia = CATALOG_DISPLAY_ORDER.indexOf(a.id);
    const ib = CATALOG_DISPLAY_ORDER.indexOf(b.id);
    if (ia === -1 && ib === -1) return 0;
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

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
    <div className="max-w-2xl lg:max-w-6xl mx-auto px-gutter pt-2 pb-10 fade-up">
      <SiteHeader onBack={onBack} />
      <h2 className="mc-page-title">Coleção completa</h2>
      <p className="mc-page-subtitle">Todos os produtos, num lugar só.</p>

      {/* Mobile/tablet (<lg): a lista compacta original, intocada. */}
      <div className="space-y-3 lg:hidden">
        {rendered.map((item) =>
          item.type === "product" ? (
            <ProductRow key={item.product.id} p={item.product} added={inSelection(item.product.id)} onOpenProduct={onOpenProduct} />
          ) : (
            <DiscoveryCard key={item.card.id} card={item.card} onSelect={onSelect} />
          )
        )}
      </div>

      {/* Desktop (lg+): grid de cards verticais com foto em destaque — uma
          composição própria pro espaço disponível, não a lista mobile
          esticada. 2 colunas até xl, 3 a partir daí, mesmos dados/
          comportamento da lista mobile. */}
      <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {rendered.map((item) =>
          item.type === "product" ? (
            <ProductCardDesktop key={item.product.id} p={item.product} added={inSelection(item.product.id)} onOpenProduct={onOpenProduct} />
          ) : (
            <DiscoveryCard key={item.card.id} card={item.card} onSelect={onSelect} />
          )
        )}
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
