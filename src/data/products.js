import { COLORS } from "../styles/colors";
import { REAL_PHOTOS } from "./photos";

// ===========================================================================
// PRODUCTS — real catalog, cross-tagged to multiple emotional "moments".
// Price fixed at $1 as a placeholder where the real price isn't set yet —
// Naia is still finalizing pricing in Excel (briefing section 6).
//
// Optional field, not set on any product yet: `relatedProducts: string[]`,
// an array of other product ids to show as "já que você chegou até aqui"
// suggestions on that product's detail sheet. No relations are invented —
// add the field to a product once Naia tells us what actually pairs well.
//
// "freezer" survives as a co-tag in `moments` on a few products below (see
// e.g. brigadeiro, butter-cookies) purely to feed the existing "Pode
// congelar" badge (ProductCard.jsx, ProductDetailSheet.jsx) and the Feed's
// "Pode congelar" filter (Feed/FeedScreen.jsx), both keyed off
// `moments.includes("freezer")` already. It is NOT a navigable destination
// any more — "freezer" was removed from MOMENTS (data/moments.js), so
// nothing ever renders a MomentScreen for it. Don't read its presence here
// as "Freezer is still a journey"; it's just today's data source for that
// one badge, until a dedicated `badges` field replaces it (briefing
// section 9 — not built yet, by design).
//
// Separately: a "sold frozen" commercial variant of a regular product is a
// DIFFERENT concept from the "Pode congelar" badge above — one is a
// characteristic of the regular product, the other is its own purchasable
// option, modeled as its own product entry (never a badge on the regular
// one). Two exist today:
//   - "mini-donut-simples" ("Mini Cake Donuts — assados e congelados"),
//     right after its regular counterpart "mini-donut-decorado" ("Mini
//     Cake Donuts") — this was real pre-existing data/photo, previously
//     named just "Mini Donuts" and not positioned next to the regular one.
//   - "butter-cookies-congelado" ("Biscoito Amanteigado — congelado para
//     assar"), right after "butter-cookies" — newly added as its own
//     entry once a real, previously-misfiled photo (raw dough disks in a
//     freezer bag, formerly bundled into the regular product's own
//     gallery) was found for it. unit/price/sensory are left blank/"Sob
//     consulta" (the same established placeholder convention as
//     bolo-de-pote and brownlito below) since no real values exist yet —
//     never invented.
// Both pairs are kept adjacent via MOMENT_ORDER["dia-dificil"]
// (data/moments.js), not by array position — see that file's comment.
// ===========================================================================
export const PRODUCTS = [
  {
    id: "brigadeiro",
    name: "Brigadeiros",
    unit: "6, 12 ou 24 unidades",
    price: "A partir de $14",
    sensory: "Docinho de chocolate cremoso, do jeito que a vó fazia — pode congelar por até 90 dias.",
    kind: "bites",
    tint: COLORS.ink,
    moments: ["dia-dificil", "freezer"],
    // "dia-dificil" now carries its own real photo plus the ones
    // previously shown only under the (now-removed) "cafe" and "freezer"
    // moments — see src/data/moments.js: all consolidated into this
    // single id, so nothing that used to live under those two is lost.
    photosByMoment: {
      "dia-dificil": [REAL_PHOTOS.brigadeiroDiaDificil, REAL_PHOTOS.cafe, REAL_PHOTOS.freezer],
    },
    customizable: true,
    flavors: [], // TODO: Naia to confirm real flavors (ex. "Tradicional", "Ninho", "Pistache")
  },
  {
    id: "mini-donut-simples",
    name: "Mini Cake Donuts — assados e congelados",
    unit: "unidade",
    price: "$1",
    sensory:
      "Mini cake donut simples, sem recheio, nos sabores baunilha e chocolate — prático pra ter sempre no freezer.",
    kind: "cake",
    tint: COLORS.caramelLight,
    moments: ["dia-dificil", "freezer"],
    photos: [REAL_PHOTOS.donutFreezer],
  },
  {
    id: "briganinho-personalizado",
    name: "Briganinhos Personalizados",
    unit: "mín. 12 un",
    price: "$3.00/un",
    sensory: "Mini brigadeiros personalizados — perfeitos pra compor a mesa de doces ou virar lembrancinha.",
    kind: "bites",
    tint: COLORS.caramelLight,
    moments: ["festa"],
    photos: [REAL_PHOTOS.festaOptions[0], REAL_PHOTOS.festaOptions[1], ...REAL_PHOTOS.briganinhoPersonalizado],
  },
  {
    id: "brigadeiro-personalizado",
    name: "Brigadeiros Personalizados",
    unit: "mín. 25 un",
    price: "$2.50/un",
    sensory: "Decorados com apliques artesanais em pasta de leite em pó, feitos sob medida pro tema da festa.",
    kind: "bites",
    tint: COLORS.caramelDark,
    moments: ["festa"],
    photos: REAL_PHOTOS.brigadeiroPersonalizado,
  },
  {
    id: "mini-donut-decorado",
    name: "Mini Cake Donuts",
    unit: "unidade",
    price: "$1",
    sensory: "Mini cake donut coberto de chocolate, decorado à mão no tema da sua festa — de flores ao fundo do mar.",
    kind: "cake",
    tint: COLORS.ink,
    moments: ["festa", "dia-dificil"],
    photos: REAL_PHOTOS.miniDonutDecorado,
  },
  {
    id: "cone-trufado",
    name: "Cones Trufados",
    unit: "unidade",
    price: "$1",
    sensory: "Cone crocante coberto de trufa cremosa, decorado à mão no tema da sua festa.",
    kind: "cake",
    tint: COLORS.caramelDark,
    moments: ["festa", "dia-dificil"],
    photos: [REAL_PHOTOS.coneTrufadoNovo],
  },
  {
    id: "pirulito-decorado",
    name: "Pirulitos Decorados",
    unit: "unidade",
    price: "$1",
    sensory:
      "Chocolate coberto com pasta de leite em pó, decorado à mão no tema da sua festa — de flores a futebol, tem pra tudo.",
    kind: "cake",
    tint: COLORS.caramelLight,
    moments: ["festa"],
    photos: REAL_PHOTOS.pirulitoDecorado,
  },
  {
    id: "bolo-palito",
    name: "Bolo no Palito",
    unit: "unidade",
    price: "$1",
    sensory:
      "Bolinho de pão de mel com especiarias e recheio de doce de leite, coberto com Fondelle (pasta de leite em pó) — customizado pro tema da sua festa.",
    kind: "cake",
    tint: COLORS.caramelLight,
    moments: ["festa"],
    photos: REAL_PHOTOS.boloPalito,
  },
  {
    id: "piramide",
    name: "Lembrancinhas Pirâmide",
    unit: "~60g bala de coco por unidade",
    price: "$1",
    sensory: "Bala de coco caseira que derrete na boca, dentro de uma pirâmide personalizada no tema da sua festa.",
    kind: "candy",
    tint: COLORS.caramelDark,
    moments: ["festa"],
    photos: REAL_PHOTOS.piramide,
  },
  {
    id: "alfajor",
    name: "Alfajor",
    unit: "unidade (mín. 5)",
    price: "$3/un",
    sensory:
      "Receita macia original, com toque de mel e limão, recheado com doce de leite condensado cozido. Pode ser coberto ou não por chocolate.",
    kind: "sandwich",
    tint: COLORS.caramelDark,
    moments: ["dia-dificil"],
    photos: [REAL_PHOTOS.alfajorCoco],
  },
  {
    id: "pirulito-alfajor",
    name: "Pirulito de Alfajor",
    unit: "unidade",
    price: "$5/un",
    sensory:
      "Alfajor no palito, coberto de chocolate — ideal pra lembrancinha de última hora, dar pra professores, alunos ou colegas de trabalho.",
    kind: "cake",
    tint: COLORS.ink,
    moments: [],
    photos: [REAL_PHOTOS.pirulitoAlfajor],
  },
  {
    id: "pao-de-mel",
    name: "Pão de Mel",
    unit: "3 unidades",
    price: "$1",
    sensory: "Bolinho macio de mel e especiarias, recheado com doce de leite, coberto de chocolate.",
    kind: "cake",
    tint: COLORS.caramelDark,
    moments: ["dia-dificil", "festa"],
    photos: [REAL_PHOTOS.visita, REAL_PHOTOS.paodemel2],
  },
  {
    id: "bolo-cenoura",
    name: "Bolo de Cenoura",
    unit: "fatia",
    price: "$1",
    sensory: "Bolo de cenoura fofinho, coberto com chocolate cremoso e granulado — clássico que nunca falha.",
    kind: "cake",
    tint: COLORS.caramelLight,
    moments: ["dia-dificil"],
    photos: [REAL_PHOTOS.boloCenouraTray, REAL_PHOTOS.boloCenouraFatias],
  },
  {
    id: "butter-cookies",
    name: "Biscoito Amanteigado",
    unit: "12 unidades",
    price: "$1",
    sensory: "Biscoitinho amanteigado que derrete na boca — o queridinho pra acompanhar um café.",
    kind: "sandwich",
    tint: COLORS.creamYellow,
    moments: ["dia-dificil", "freezer"],
    // "dia-dificil" surfaces the real photo previously shown only under
    // the (now-removed) "cafe" moment, alongside this product's other
    // real photos — one single gallery, nothing lost. `photos` below
    // stays as the general fallback used outside a moment context
    // (Feed/Search default — see utils/products.js defaultPhotos).
    //
    // REAL_PHOTOS.biscoitoAmanteigadoFreezer (raw dough disks in a
    // freezer bag) used to sit in both arrays here too, but it's a photo
    // of the UNBAKED, sold-frozen product, not this (baked, ready-to-eat)
    // one — moved to its own product, "butter-cookies-congelado", right
    // below.
    photosByMoment: {
      "dia-dificil": [REAL_PHOTOS.biscoitoAmanteigadoCafe, REAL_PHOTOS.biscoitoVariedade, REAL_PHOTOS.alfajorClassico],
    },
    photos: [REAL_PHOTOS.biscoitoVariedade, REAL_PHOTOS.alfajorClassico],
  },
  {
    id: "butter-cookies-congelado",
    name: "Biscoito Amanteigado — congelado para assar",
    // unit/price/sensory: no real data yet — Naia to confirm weight/count,
    // price and a proper description. Left blank/"Sob consulta" (same
    // established convention as bolo-de-pote and brownlito below), not
    // invented.
    unit: "", // TODO: Naia to confirm real quantity/weight
    price: "Sob consulta 💬",
    sensory: "", // TODO: Naia to confirm real description
    kind: "sandwich",
    tint: COLORS.creamYellow,
    moments: ["dia-dificil", "freezer"],
    // The real photo previously bundled into the regular Biscoito
    // Amanteigado's own gallery (see comment above) — raw dough disks in
    // a freezer bag, i.e. this exact unbaked/frozen product.
    photos: [REAL_PHOTOS.biscoitoAmanteigadoFreezer],
  },
  {
    id: "casadinho",
    name: "Casadinhos Goiabada",
    unit: "6 unidades",
    price: "$1",
    sensory: "Biscoito amanteigado recheado de goiabada — outros sabores? É só chamar a gente.",
    kind: "sandwich",
    tint: COLORS.caramelLight,
    moments: ["festa", "dia-dificil"],
    photos: [REAL_PHOTOS.casadinhoGoiabada],
  },
  {
    id: "melties",
    name: "Sequilhos",
    unit: "250g",
    price: "$1",
    sensory: "Derrete na boca, crocante por fora — sem glúten, o queridinho de sempre.",
    kind: "bites",
    tint: COLORS.creamYellow,
    moments: ["dia-dificil"],
    photos: [REAL_PHOTOS.sequilhoNatural, REAL_PHOTOS.sequilhoRosa],
  },
  {
    id: "chocobomb",
    name: "Chocobomb",
    unit: "unidade",
    price: "$1",
    sensory: "Oreo mergulhado em fudge cremoso — pra quando bate aquela vontade impossível de ignorar.",
    kind: "dipped",
    tint: COLORS.caramelLight,
    moments: ["dia-dificil"],
    photos: [REAL_PHOTOS.chocobomb],
  },
  {
    id: "bala-de-coco",
    name: "Bala de Coco",
    unit: "150g",
    price: "$10",
    sensory: "Docinho de coco que derrete na boca — sem glúten, sem lactose, gostoso de qualquer jeito.",
    kind: "candy",
    tint: COLORS.creamYellow,
    moments: ["dia-dificil", "freezer", "festa"],
    photos: [REAL_PHOTOS.balaDeCoco],
  },
  // Unit and sensory are still pending real data from Naia — left blank
  // rather than invented. Price reuses the project's existing "not a fixed
  // number yet" convention (see every presenteGroup item below, and
  // entryPrice/parsePrice in utils/pricing.js, which already treats any
  // non-"$12"-shaped price as "not orderable yet" and excludes it from the
  // selection subtotal) — not a real price, just the same placeholder the
  // app already shows for "sob consulta" items.
  {
    id: "bolo-de-pote",
    name: "Bolo de Pote",
    unit: "",
    price: "Sob consulta 💬",
    sensory: "",
    kind: "cake",
    tint: COLORS.caramelDark,
    moments: ["dia-dificil"],
    photos: [REAL_PHOTOS.boloDePoteCamadas, REAL_PHOTOS.boloDePoteMorango],
  },
  // Brownlito belongs to two journeys at once (the "dia-dificil" moment
  // catalog and Presentes → Pequenos Mimos, via its matching entry in
  // MIMO_INSPIRATIONS — src/data/inspirationGalleries.js) — a single
  // product with both `moments` and `presenteGroup` set, not two separate
  // entries. Every other presenteGroup item so far only ever carries
  // moments: ["presente"]; this is the first to also carry a real moment
  // tag, which pickForMoment() already supports without change.
  {
    id: "brownlito",
    name: "Brownlito",
    unit: "",
    price: "Sob consulta 💬",
    sensory: "",
    kind: "dipped",
    tint: COLORS.ink,
    moments: ["dia-dificil"],
    presenteGroup: "mimos",
    photos: [REAL_PHOTOS.brownlitoInteiro, REAL_PHOTOS.brownlitoRecheio],
  },

  // --- Caixas Personalizadas — fotos reais de caixas já montadas, aqui como
  // inspiração de estilo/combinação, não como SKUs fixos. Preço sempre
  // "sob consulta": cada caixa é montada na hora, conforme conversa no WhatsApp.
  {
    id: "presente-caixa-mix",
    name: "Caixas Personalizadas",
    unit: "combinação personalizada",
    price: "Sob consulta 💬",
    sensory: "Brigadeiros, cookies e docinhos variados, num mix alegre e colorido.",
    kind: "cake",
    tint: COLORS.caramelLight,
    moments: ["presente"],
    presenteGroup: "caixas",
    photos: [REAL_PHOTOS.presenteMix],
  },
  {
    id: "presente-caixa-rosas",
    name: "Caixa Rosas",
    unit: "combinação personalizada",
    price: "Sob consulta 💬",
    sensory: "Docinhos em formato de flor, num estilo romântico e delicado.",
    kind: "cake",
    tint: COLORS.caramelDark,
    moments: ["presente"],
    presenteGroup: "caixas",
    photos: [REAL_PHOTOS.presenteRosas],
  },
  {
    id: "presente-caixa-flor",
    name: "Caixa Florida",
    unit: "combinação personalizada",
    price: "Sob consulta 💬",
    sensory: "Brigadeiros com apliques de flor e uma bandeja lisa, pra quem gosta de um clima suave.",
    kind: "bites",
    tint: COLORS.creamYellow,
    moments: ["presente"],
    presenteGroup: "caixas",
    photos: [REAL_PHOTOS.presenteFlor],
  },
  {
    id: "presente-caixa-namorados",
    name: "Caixa Dia dos Namorados",
    unit: "combinação personalizada",
    price: "Sob consulta 💬",
    sensory: "Docinhos com corações e detalhes vermelhos — clima de romance.",
    kind: "dipped",
    tint: COLORS.ink,
    moments: ["presente"],
    presenteGroup: "caixas",
    photos: [REAL_PHOTOS.presenteNamorados],
  },
  {
    id: "presente-caixa-pao-de-mel",
    name: "Caixa Pão de Mel",
    unit: "combinação personalizada",
    price: "Sob consulta 💬",
    sensory: "Pão de mel coberto de chocolate, com um potinho de doce de leite pra acompanhar.",
    kind: "cake",
    tint: COLORS.caramelDark,
    moments: ["presente"],
    presenteGroup: "caixas",
    photos: [REAL_PHOTOS.presentePaoMel],
  },
  {
    id: "presente-caixa-butter-cookies",
    name: "Caixa Butter Cookies",
    unit: "combinação personalizada",
    price: "Sob consulta 💬",
    sensory: "Butter cookies e docinhos, embalados com laço — simples e elegante.",
    kind: "sandwich",
    tint: COLORS.creamYellow,
    moments: ["presente"],
    presenteGroup: "caixas",
    // Was REAL_PHOTOS.presenteFlex1 — an already-cropped close-up shot of a
    // *different* box (the legacy prototype used flex1 for "Caixa
    // Clássica", a chocolates/alfajores mix, not this product). No CSS
    // display fix can recover what a wrong source photo never had: the box's
    // own edges. presenteButterCookies is the real, correctly-oriented,
    // full-composition photo of this exact box — already extracted to
    // /public/images/products but never wired to a product. See
    // src/data/photos.js.
    photos: [REAL_PHOTOS.presenteButterCookies],
  },
  {
    id: "presente-caixa-individual",
    name: "Docinhos Embalados Individualmente",
    unit: "combinação personalizada",
    price: "Sob consulta 💬",
    sensory: "Cada docinho embrulhado com seu próprio laço — ótimo pra distribuir ou compor uma mesa de lembrancinhas.",
    kind: "dipped",
    tint: COLORS.caramelLight,
    moments: ["presente"],
    presenteGroup: "caixas",
    photos: [REAL_PHOTOS.presenteFlex2],
  },
  {
    id: "presente-caixa-cha-de-bebe",
    name: "Caixa Chá de Bebê",
    unit: "combinação personalizada",
    price: "Sob consulta 💬",
    sensory: "Cookies decorados no tema ursinho — body, pezinho e placa personalizável, ideal pra chá de bebê ou revelação.",
    kind: "sandwich",
    tint: COLORS.caramelLight,
    moments: ["presente"],
    presenteGroup: "caixas",
    photos: [REAL_PHOTOS.presenteChaDeBebe],
  },

  // --- Cestas para Todos os Momentos — bandejas reais já montadas,
  // inspiração de estilo/tema, não SKUs fixos. Preço sempre "sob consulta".
  {
    id: "bandeja-baby-shower",
    name: "Cestas para Todos os Momentos",
    unit: "combinação personalizada",
    price: "Sob consulta 💬",
    sensory: "Docinhos e cookies decorados, com plaquinha personalizada e ursinho de pelúcia — clima de chá de bebê.",
    kind: "cake",
    tint: COLORS.creamYellow,
    moments: ["presente"],
    presenteGroup: "bandejas",
    photos: [REAL_PHOTOS.bandejaBabyShower],
  },
  {
    id: "bandeja-mario",
    name: "Bandeja Bora Celebrar! (tema games)",
    unit: "combinação personalizada",
    price: "Sob consulta 💬",
    sensory: "Bolo personalizado, docinhos temáticos e balões — festa completa em forma de bandeja.",
    kind: "cake",
    tint: COLORS.caramelDark,
    moments: ["presente"],
    presenteGroup: "bandejas",
    photos: [REAL_PHOTOS.bandejaMario],
  },
  {
    id: "bandeja-formatura",
    name: "Bandeja Formatura",
    unit: "combinação personalizada",
    price: "Sob consulta 💬",
    sensory: "Docinhos, brigadeiros no palito e toppers personalizados — pra comemorar aquela conquista.",
    kind: "bites",
    tint: COLORS.ink,
    moments: ["presente"],
    presenteGroup: "bandejas",
    photos: [REAL_PHOTOS.bandejaFormatura],
  },
  {
    id: "bandeja-dia-dos-pais",
    name: "Bandeja Dia dos Pais",
    unit: "combinação personalizada",
    price: "Sob consulta 💬",
    sensory: "Docinhos, cookies e balões nas cores do tema — surpresa completa pra comemorar.",
    kind: "dipped",
    tint: COLORS.caramelLight,
    moments: ["presente"],
    presenteGroup: "bandejas",
    photos: [REAL_PHOTOS.bandejaDiaDosPais],
  },
  {
    id: "bandeja-cidadania",
    name: "Bandeja Cidadania Canadense",
    unit: "combinação personalizada",
    price: "Sob consulta 💬",
    sensory: "Docinhos, bandeirinhas e um bolinho no potinho — comemoração personalizada pra uma conquista grande.",
    kind: "cake",
    tint: COLORS.caramelDark,
    moments: ["presente"],
    presenteGroup: "bandejas",
    photos: [REAL_PHOTOS.bandejaCidadania],
  },

  // --- Mimos que Encantam — mimos pequenos pra qualquer ocasião (professora,
  // colega de trabalho, agradecimento). Inspiração, preço sob consulta.
  {
    id: "presentinho-macas",
    name: "Mimos que Encantam",
    unit: "combinação personalizada",
    price: "Sob consulta 💬",
    sensory: "Docinho embalado em formatinho de maçã, com nome personalizado — perfeito pra presentear professoras.",
    kind: "candy",
    tint: COLORS.caramelDark,
    moments: ["presente"],
    presenteGroup: "mimos",
    photos: [REAL_PHOTOS.presentinhoMacas],
  },
  {
    id: "presentinho-obrigada",
    name: "Cone Obrigada",
    unit: "combinação personalizada",
    price: "Sob consulta 💬",
    sensory: "Docinhos num coninho com cartão de agradecimento — ideal pra dar um obrigada especial.",
    kind: "cake",
    tint: COLORS.caramelLight,
    moments: ["presente"],
    presenteGroup: "mimos",
    photos: [REAL_PHOTOS.presentinhoObrigada],
  },
  {
    id: "presentinho-pirulito",
    name: "Pirulito de Chocolate com Laço",
    unit: "combinação personalizada",
    price: "Sob consulta 💬",
    sensory: "Chocolate no palito, laço de cetim — simples, bonito e rápido de entregar.",
    kind: "cake",
    tint: COLORS.ink,
    moments: ["presente"],
    presenteGroup: "mimos",
    photos: [REAL_PHOTOS.presentinhoPirulito],
  },
  {
    id: "presentinho-variedade",
    name: "Mix Variedade",
    unit: "combinação personalizada",
    price: "Sob consulta 💬",
    sensory: "Caneca Mon Caramel, cookies e mini donuts — um mimo mais completo pra quem merece um mix.",
    kind: "sandwich",
    tint: COLORS.creamYellow,
    moments: ["presente"],
    presenteGroup: "mimos",
    photos: [REAL_PHOTOS.presentinhoVariedade],
  },
];
