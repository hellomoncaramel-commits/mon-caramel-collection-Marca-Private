// Dedicated data for "inspiration" photo carousels — Caixas, Bandejas and
// Mimos today, all rendered by the same shared InspirationCarousel
// (src/components/shared/InspirationCarousel.jsx). Deliberately NOT
// derived from PRODUCTS: an inspiration photo isn't a SKU — it doesn't
// need a price, a description, or a moments/tag list, so it shouldn't
// require creating a product to add one. Adding a new photo to either
// gallery is exactly two steps:
//
//   1. Drop the .jpg (+ matching .webp) into /public/images/products/
//   2. Add one { id, src, alt } entry to the relevant array below
//
// InspirationCarousel derives everything else (slide count, dots, counter)
// from the array's length — no other file needs to change, and no photo
// here needs its own CSS: InspirationImage
// (src/components/shared/InspirationImage.jsx) renders every entry at its
// own natural aspect ratio, so a portrait, a square, or an unusually-shaped
// future photo all just work.
export const BOX_INSPIRATIONS = [
  {
    id: "presente-caixa-mix",
    src: "/images/products/presente-mix.jpg",
    alt: "Brigadeiros, cookies e docinhos variados, num mix alegre e colorido.",
  },
  {
    id: "presente-caixa-rosas",
    src: "/images/products/presente-rosas.jpg",
    alt: "Docinhos em formato de flor, num estilo romântico e delicado.",
  },
  {
    id: "presente-caixa-flor",
    src: "/images/products/presente-flor.jpg",
    alt: "Brigadeiros com apliques de flor e uma bandeja lisa, pra quem gosta de um clima suave.",
  },
  {
    id: "presente-caixa-namorados",
    src: "/images/products/presente-namorados.jpg",
    alt: "Docinhos com corações e detalhes vermelhos — clima de romance.",
  },
  {
    id: "presente-caixa-pao-de-mel",
    // PROOF OF CONCEPT (this one entry only): pointed at the prepared 4:3
    // canvas asset from scripts/prepare-inspiration-images.mjs instead of
    // the raw product photo — see that script for what generated it and
    // why. Original photo (presente-pao-mel.jpg) is untouched; this is a
    // derived, centered version of the exact same photograph.
    src: "/images/inspirations/boxes/display/box-005-inspiration.jpg",
    alt: "Pão de mel coberto de chocolate, com um potinho de doce de leite pra acompanhar.",
  },
  {
    id: "presente-caixa-butter-cookies",
    src: "/images/products/presente-butter-cookies.jpg",
    alt: "Butter cookies e docinhos, embalados com laço — simples e elegante.",
  },
  {
    id: "presente-caixa-individual",
    src: "/images/products/presente-flex2.jpg",
    alt: "Cada docinho embrulhado com seu próprio laço — ótimo pra distribuir ou compor uma mesa de lembrancinhas.",
  },
  {
    id: "presente-caixa-cha-de-bebe",
    // Replacement photo (presente-cha-de-bebe-2.jpg — the original
    // presente-cha-de-bebe.jpg this replaced is untouched, just no longer
    // referenced here). Prepared via scripts/prepare-inspiration-images.mjs
    // with rotate: "auto" (this source has a real EXIF orientation tag,
    // unlike every other photo here). Wider than the photo it replaced,
    // but still only shows the box's left edge in frame — top/right/bottom
    // are cut by the camera's own framing, not something a display fix can
    // recover. Good enough to use; swap for an even wider shot if one
    // becomes available.
    src: "/images/inspirations/boxes/display/box-008-inspiration.jpg",
    alt: "Cookies decorados no tema ursinho — body, pezinho e placa personalizável, ideal pra chá de bebê ou revelação.",
  },
];

export const TRAY_INSPIRATIONS = [
  {
    id: "bandeja-baby-shower",
    src: "/images/products/bandeja-baby-shower.jpg",
    alt: "Docinhos e cookies decorados, com plaquinha personalizada e ursinho de pelúcia — clima de chá de bebê.",
  },
  {
    id: "bandeja-mario",
    src: "/images/products/bandeja-mario.jpg",
    alt: "Bolo personalizado, docinhos temáticos e balões — festa completa em forma de bandeja.",
  },
  {
    id: "bandeja-formatura",
    src: "/images/products/bandeja-formatura.jpg",
    alt: "Docinhos, brigadeiros no palito e toppers personalizados — pra comemorar aquela conquista.",
  },
  {
    id: "bandeja-dia-dos-pais",
    src: "/images/products/bandeja-dia-dos-pais.jpg",
    alt: "Docinhos, cookies e balões nas cores do tema — surpresa completa pra comemorar.",
  },
  {
    id: "bandeja-cidadania",
    src: "/images/products/bandeja-cidadania.jpg",
    alt: "Docinhos, bandeirinhas e um bolinho no potinho — comemoração personalizada pra uma conquista grande.",
  },
];

// Pequenos Mimos moved from an individually-selectable product grid
// (Heart per photo → add that exact item to Minha Seleção) to pure
// inspiration, same as Caixas/Bandejas — browsing only, no per-photo
// action. Same 5 real photos already shown on that page before (each
// product's photos[0] — brownlito has a second photo, brownlitoRecheio,
// that was never surfaced there either, so it's left out here too, not
// newly excluded).
export const MIMO_INSPIRATIONS = [
  {
    id: "brownlito",
    src: "/images/products/brownlito-inteiro.jpg",
    alt: "Brownlito.",
  },
  {
    id: "presentinho-macas",
    src: "/images/products/presentinho-macas.jpg",
    alt: "Docinho embalado em formatinho de maçã, com nome personalizado — perfeito pra presentear professoras.",
  },
  {
    id: "presentinho-obrigada",
    src: "/images/products/presentinho-obrigada.jpg",
    alt: "Docinhos num coninho com cartão de agradecimento — ideal pra dar um obrigada especial.",
  },
  {
    id: "presentinho-pirulito",
    src: "/images/products/presentinho-pirulito.jpg",
    alt: "Chocolate no palito, laço de cetim — simples, bonito e rápido de entregar.",
  },
  {
    id: "presentinho-variedade",
    src: "/images/products/presentinho-variedade.jpg",
    alt: "Caneca Mon Caramel, cookies e mini donuts — um mimo mais completo pra quem merece um mix.",
  },
];
