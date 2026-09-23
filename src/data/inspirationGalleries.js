// Dedicated data for "inspiration" photo carousels (currently just Caixas —
// "Bandejas para inspirar" still uses getInspiration()/InspirationGallery,
// untouched). Deliberately NOT derived from PRODUCTS: an inspiration photo
// isn't a SKU — it doesn't need a price, a description, or a moments/tag
// list, so it shouldn't require creating a product to add one. Adding a
// new box photo is exactly two steps:
//
//   1. Drop the .jpg (+ matching .webp) into /public/images/products/
//   2. Add one { id, src, alt } entry below
//
// CaixasCarousel derives everything else (slide count, dots, counter) from
// this array's length — no other file needs to change, and no photo here
// needs its own CSS: InspirationImage (src/components/shared/InspirationImage.jsx)
// renders every entry at its own natural aspect ratio, so a portrait, a
// square, or an unusually-shaped future photo all just work.
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
