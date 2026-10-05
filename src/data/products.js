import { COLORS } from "../styles/colors";
import { REAL_PHOTOS } from "./photos";

// ===========================================================================
// PRODUCTS — real catalog, cross-tagged to multiple emotional "moments".
// Price shown as "Sob consulta 💬" as a placeholder where the real price
// isn't set yet — Naia is still finalizing pricing in Excel (briefing
// section 6). Never use a numeric placeholder like "$1": parsePrice()
// (utils/pricing.js) reads any clean "$N" string as a real price and feeds
// it into Minha Seleção's per-item total, so a numeric placeholder shows up
// to the customer as an actual price instead of being excluded like
// "Sob consulta" correctly is.
//
// Optional field, not set on any product yet: `relatedProducts: string[]`,
// an array of other product ids to show as "já que você chegou até aqui"
// suggestions on that product's detail sheet. No relations are invented —
// add the field to a product once Naia tells us what actually pairs well.
//
// "freezer" survives as a co-tag in `moments` on a few products below (see
// e.g. brigadeiro, butter-cookies) purely to feed ProductDetailSheet.jsx's
// "Pode congelar" list item and the Feed's "Pode congelar" filter
// (Feed/FeedScreen.jsx), both still keyed off `moments.includes("freezer")`.
// It is NOT a navigable destination any more — "freezer" was removed from
// MOMENTS (data/moments.js), so nothing ever renders a MomentScreen for it.
// Don't read its presence here as "Freezer is still a journey"; it's just
// today's data source for those two spots.
//
// The Dias de luta card (ProductCard.jsx) no longer reads this tag: it now
// renders the `badges` field below (data/badges.js) instead — a manually
// curated list per product, deliberately not always the same as
// `moments.includes("freezer")` (e.g. "Mini Cake Donuts — assados e
// congelados" already says "congelados" in its own name, so it doesn't
// repeat that as a badge). `badges` is Dias de luta-only for now, by
// Naia's brief — not read anywhere else yet.
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
    badges: ["coffee", "freezer", "glutenFree"],
    experience: {
      teaser: "Dia difícil + brigadeiro. Não tenho estudos científicos, mas confio.",
      noteLabel: "Eu te conto:",
      note: "Você sabia que dá pra congelar? Eu deixaria alguns guardados para emergências. 😂",
      nextTemptation: { id: "chocobomb", line: "Agora… se você gosta de chocolate, deixa eu te apresentar o Chocobomb." },
    },
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
    price: "Sob consulta 💬",
    sensory:
      "Mini cake donut simples, sem recheio, nos sabores baunilha e chocolate — prático pra ter sempre no freezer.",
    kind: "cake",
    tint: COLORS.caramelLight,
    moments: ["dia-dificil", "freezer"],
    badges: ["coffee", "lunchbox"],
    experience: {
      teaser: "Para os dias em que até pensar no lanche dá preguiça.",
      noteLabel: "Seu eu do futuro agradece:",
      note: "Esse é muito prático. Já fica pronto no freezer pra quando você precisar.",
      nextTemptation: {
        id: "butter-cookies-congelado",
        line: "Se você gosta dessa praticidade, olha o biscoito congelado pra assar.",
      },
    },
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
    // Removed from Festa's curated menu (kept in the general catalog —
    // still browsable via Feed/Search) so Festa only surfaces the handful
    // of products meant to lead there.
    moments: [],
    photos: REAL_PHOTOS.brigadeiroPersonalizado,
  },
  {
    id: "mini-donut-decorado",
    name: "Mini Cake Donuts",
    unit: "unidade",
    price: "Sob consulta 💬",
    sensory: "Mini cake donut coberto de chocolate, decorado à mão no tema da sua festa — de flores ao fundo do mar.",
    kind: "cake",
    tint: COLORS.ink,
    moments: ["festa", "dia-dificil"],
    // Badges are Dias de luta-only (ProductCard gates on momentId — see
    // that component) — Festa's own card never reads this field.
    badges: ["freezer", "lunchbox"],
    experience: {
      teaser: "Pequeno o suficiente pra parecer inocente. 👀",
      noteLabel: "Entre a gente:",
      note: "Esse é daqueles que resolve um monte de coisa: café, lancheira, vontade de doce…",
      nextTemptation: { id: "butter-cookies", line: "Já provou os biscoitos amanteigados? Também são ótimos pra ter em casa." },
    },
    // General/day-to-day photo unchanged. Festa gets its own gallery of real
    // decorated/personalized donuts — the simple everyday presentation
    // above isn't the right protagonist there. Hero is the green/yellow
    // donut tower with cake pops and the "GOOL" plaque; the rest show a
    // variety of personalizations (not flavors) so a customer can picture
    // matching the donuts to their own party theme.
    photos: REAL_PHOTOS.miniDonutDecorado,
    photosByMoment: { festa: REAL_PHOTOS.miniDonutFesta },
  },
  {
    id: "cone-trufado",
    name: "Cones Trufados",
    // Commercial review confirmed: $8 cada (unit price, not a bundle),
    // pedido mínimo 2 unidades. `unit` carries the minimum as display copy
    // (same convention as Alfajor's "unidade (mín. 5)"); `minimumQuantity`
    // is the actual explicit, structured source the quantity logic reads
    // (see utils/products.js minimumQuantityOf) — never parsed from this
    // string. No recheios/coberturas options exist in the data today (no
    // `flavors`/`customizable` were ever set for this product) — nothing
    // to preserve or migrate; flagged in the PR for Naia to confirm if any
    // such options exist.
    unit: "unidade (mín. 2)",
    minimumQuantity: 2,
    price: "$8/un",
    // Gluten-free version confirmed available at the same price (no
    // surcharge). Not restated in `sensory` (kept to describing the
    // product itself) — communicated instead via the glutenFreeOption
    // badge (ProductCard/ProductDetailSheet commercial block) and the
    // discreet "mesmo preço" note next to the `versao` step inside
    // FlavorConfigurator, which is the actual mechanism that captures the
    // customer's real choice through to the selection/WhatsApp. This
    // product is NOT tagged with the plain `glutenFree` badge — that one
    // means the product itself is always gluten-free, which isn't the
    // case here.
    sensory: "Cone crocante recheado com o sabor à sua escolha e coberto com chocolate meio amargo ou branco.",
    kind: "cake",
    tint: COLORS.caramelDark,
    moments: ["festa", "dia-dificil"],
    badges: ["deserve", "glutenFreeOption"],
    // Recheio/cobertura/versão confirmed by Naia — 3 independent choices,
    // not a flavor list to multi-select-and-split like Brigadeiro (that
    // product's own `flavors` field/pattern is untouched and unused here).
    // `customizable: true` routes "Quero esse" to this configurator
    // everywhere the rest of the catalog already makes that distinction
    // (ProductCard/ProductDetail/Search/Feed) — same existing mechanism,
    // not a new one. No price changes by choice — the "Sem glúten" versão
    // never adds a surcharge (see FlavorConfigurator.jsx).
    customizable: true,
    optionGroups: [
      { key: "recheio", label: "Recheio", choices: ["Brigadeiro", "Morango", "Beijinho", "Maracujá", "Ninho com Nutella", "Limão"] },
      { key: "cobertura", label: "Cobertura", choices: ["Chocolate meio amargo", "Chocolate branco"] },
      { key: "versao", label: "Versão", choices: ["Tradicional", "Sem glúten"] },
    ],
    experience: {
      teaser: "Tem vontade de doce. E tem vontade de DOCE. Esse é pro segundo caso.",
      noteLabel: "Eu não julgo:",
      note: "Esse não é o docinho comportado. 😂 É pra quando você quer alguma coisa bem gostosa mesmo.",
      nextTemptation: { id: "brownlito", line: "E se hoje você estiver nesse nível, olha o Brownlito também." },
    },
    // `photos` is the general photo, still shown everywhere outside Festa
    // (dia-dificil, Feed/Search, etc.) — untouched. Festa gets its own
    // gallery, leading with the Minnie-personalized cone (communicates
    // theme/personalization far better than the plain cone), followed by
    // the other real decorated pairs.
    photos: [REAL_PHOTOS.coneTrufadoNovo],
    photosByMoment: { festa: REAL_PHOTOS.coneTrufadoFesta },
  },
  {
    id: "pirulito-decorado",
    name: "Pirulitos Decorados",
    unit: "unidade",
    price: "Sob consulta 💬",
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
    price: "Sob consulta 💬",
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
    price: "Sob consulta 💬",
    sensory: "Bala de coco caseira que derrete na boca, dentro de uma pirâmide personalizada no tema da sua festa.",
    kind: "candy",
    tint: COLORS.caramelDark,
    // Removed from Festa's curated menu (kept in the general catalog —
    // still browsable via Feed/Search) so Festa only surfaces the handful
    // of products meant to lead there.
    moments: [],
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
    badges: ["coffee"],
    experience: {
      teaser: "Café passado. Alfajor do lado. Agora ninguém me chama por cinco minutos.",
      noteLabel: "Eu adoro esse:",
      note: "É macio, tem doce de leite… com café fica muito bom.",
      nextTemptation: { id: "pao-de-mel", line: "Se você gosta de doce de leite, já provou nosso Pão de Mel?" },
    },
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
    // Commercial review confirmed: $5 cada (unit price), pedido mínimo 4
    // unidades — the old "3 unidades" read as a fixed pack size, which is
    // wrong on both counts (not the real minimum, and not how this product
    // is sold). `unit` carries the minimum as display copy only;
    // `minimumQuantity` is the explicit, structured field the quantity
    // logic actually reads (see utils/products.js minimumQuantityOf).
    unit: "unidade (mín. 4)",
    minimumQuantity: 4,
    price: "$5/un",
    sensory: "Pão de mel macio, recheado com doce de leite feito com leite condensado cozido e coberto com chocolate meio amargo.",
    kind: "cake",
    tint: COLORS.caramelDark,
    moments: ["dia-dificil"],
    badges: ["freezer", "deserve"],
    // noteLabel/note deliberately absent: the old aside here ("E uma
    // dica: compra alguns e congela...") just restated the "freezer"
    // badge already shown on the card — removed rather than invented a
    // replacement. MonCaramelNote (ProductDetailSheet) already renders
    // nothing when `note` is unset. teaser/nextTemptation unaffected.
    experience: {
      // Previous teaser ("Sabor de infância e aconchego em forma de
      // doce.") actually describes Bala de Coco, not this product —
      // corrected, not reused elsewhere.
      teaser: "Um dos favoritos por aqui — e não é por acaso.",
      nextTemptation: { id: "brownlito", line: "Mas você já provou o Brownlito? 👀" },
    },
    photos: [REAL_PHOTOS.visita, REAL_PHOTOS.paodemel2],
  },
  {
    id: "bolo-cenoura",
    name: "Bolo de Cenoura",
    unit: "fatia",
    price: "Sob consulta 💬",
    sensory: "Bolo de cenoura fofinho, coberto com chocolate cremoso e granulado — clássico que nunca falha.",
    kind: "cake",
    tint: COLORS.caramelLight,
    moments: ["dia-dificil"],
    badges: ["coffee", "freezer"],
    experience: {
      teaser: "Tem dias que pedem café. Tem dias que pedem café e bolo.",
      noteLabel: "Dica de amiga:",
      note: "Dá pra congelar. Então eu já faria o favor de guardar umas fatias pro seu eu do futuro.",
      nextTemptation: { id: "butter-cookies", line: "Pra acompanhar o próximo café, olha os amanteigados também." },
    },
    photos: [REAL_PHOTOS.boloCenouraTray, REAL_PHOTOS.boloCenouraFatias],
  },
  {
    id: "butter-cookies",
    name: "Biscoito Amanteigado",
    unit: "12 unidades",
    price: "Sob consulta 💬",
    sensory: "Biscoitinho amanteigado que derrete na boca — o queridinho pra acompanhar um café.",
    kind: "sandwich",
    tint: COLORS.creamYellow,
    moments: ["dia-dificil", "freezer"],
    badges: ["coffee", "lunchbox"],
    experience: {
      teaser: "Cinco minutinhos de paz também contam como autocuidado.",
      noteLabel: "Eu te conto:",
      note: "Esse é um dos que eu gosto de ter em casa. Pega o café e pronto.",
      nextTemptation: {
        id: "butter-cookies-congelado",
        line: "E já viu que também temos ele congelado pra você assar em casa?",
      },
    },
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
    badges: ["coffee", "lunchbox"],
    experience: {
      teaser: "Casa cheirando a biscoito sem precisar fazer a massa? Sim.",
      noteLabel: "Esse é esperto:",
      note: "Você deixa no freezer e assa quando quiser. Parece que você passou a tarde fazendo biscoito. Eu não conto. 😂",
      nextTemptation: { id: "mini-donut-simples", line: "Quer outra coisa prática pro freezer? Olha os mini donuts." },
    },
    // The real photo previously bundled into the regular Biscoito
    // Amanteigado's own gallery (see comment above) — raw dough disks in
    // a freezer bag, i.e. this exact unbaked/frozen product.
    photos: [REAL_PHOTOS.biscoitoAmanteigadoFreezer],
  },
  {
    id: "casadinho",
    name: "Casadinhos Goiabada",
    unit: "6 unidades",
    price: "Sob consulta 💬",
    sensory: "Biscoito amanteigado recheado de goiabada — outros sabores? É só chamar a gente.",
    kind: "sandwich",
    tint: COLORS.caramelLight,
    moments: ["dia-dificil"],
    badges: ["coffee"],
    experience: {
      teaser: "Um café, um casadinho e de repente a tarde ficou bem melhor.",
      noteLabel: "Entre a gente:",
      note: "Amanteigado com goiabada. Não precisava inventar muito porque essa combinação já funciona.",
      nextTemptation: { id: "butter-cookies", line: "Se você gosta de biscoitinho com café, olha o amanteigado também." },
    },
    photos: [REAL_PHOTOS.casadinhoGoiabada],
  },
  {
    id: "melties",
    name: "Sequilhos",
    unit: "250g",
    price: "Sob consulta 💬",
    sensory: "Derrete na boca, crocante por fora — sem glúten, o queridinho de sempre.",
    kind: "bites",
    tint: COLORS.creamYellow,
    moments: ["dia-dificil"],
    badges: ["coffee", "glutenFree"],
    experience: {
      teaser: "Você pega um. Depois outro. Depois a gente para de contar.",
      noteLabel: "Eu avisei:",
      note: "Eles derretem na boca e desaparecem do pote numa velocidade suspeita.",
      nextTemptation: { id: "alfajor", line: "Agora, se quiser continuar no território do café… já viu o Alfajor?" },
    },
    photos: [REAL_PHOTOS.sequilhoNatural, REAL_PHOTOS.sequilhoRosa],
  },
  {
    id: "chocobomb",
    name: "Chocobomb",
    // Commercial review confirmed: $4 cada — the price of ONE Chocobomb,
    // not a box of 4 — pedido mínimo 4 unidades. `unit` carries the
    // minimum as display copy only; `minimumQuantity` is the explicit,
    // structured field the quantity logic actually reads (see
    // utils/products.js minimumQuantityOf).
    unit: "unidade (mín. 4)",
    minimumQuantity: 4,
    price: "$4/un",
    // Gluten-free version confirmed available at the same price — same
    // treatment as Cone Trufado: not restated in `sensory`, communicated
    // via the glutenFreeOption badge + the discreet "mesmo preço" note
    // next to the `versao` step. No surcharge.
    sensory: "Oreo recheado com o brigadeiro da sua escolha e coberto com chocolate meio amargo ou branco.",
    kind: "dipped",
    tint: COLORS.caramelLight,
    moments: ["dia-dificil", "festa"],
    // Badges are Dias de luta-only (ProductCard gates on momentId — see
    // that component) — Festa's own card never reads this field.
    badges: ["deserve", "freezer", "glutenFreeOption"],
    // Same 3 independent choices as Cone Trufado, confirmed by Naia —
    // see that product's own comment for the full rationale.
    customizable: true,
    optionGroups: [
      { key: "recheio", label: "Recheio", choices: ["Brigadeiro", "Morango", "Beijinho", "Maracujá", "Ninho com Nutella", "Limão"] },
      { key: "cobertura", label: "Cobertura", choices: ["Chocolate meio amargo", "Chocolate branco"] },
      { key: "versao", label: "Versão", choices: ["Tradicional", "Sem glúten"] },
    ],
    // noteLabel/note deliberately absent: the old editorial aside here
    // ("Sem julgamentos: Oreo mergulhado em fudge...") described a fixed
    // fudge flavor that no longer matches the real, configurable product
    // (recheio/cobertura à escolha) — removed rather than replaced with
    // invented copy. MonCaramelNote (ProductDetailSheet) already renders
    // nothing when `note` is unset, so this needs no component change.
    // teaser/nextTemptation unaffected — still used by the card and by
    // "Próxima tentação" respectively.
    experience: {
      teaser: "Quando 'vou comer só um chocolatinho' não vai resolver.",
      nextTemptation: { id: "brownlito", line: "Se chegou nesse nível de vontade de chocolate, eu preciso te mostrar o Brownlito." },
    },
    // General/day-to-day photo unchanged. Festa gets its own gallery — real
    // decorated Chocobombs across several themes/personalizations, so a
    // customer can picture matching it to their own party.
    photos: [REAL_PHOTOS.chocobomb],
    photosByMoment: { festa: REAL_PHOTOS.chocobombFesta },
  },
  // Unit, price and any other options are pending real data from Naia —
  // left blank/"Sob consulta" rather than invented, same convention as
  // Bolo de Pote and Brownlito above.
  {
    id: "docinho-personalizado",
    name: "Docinho Personalizado",
    unit: "",
    price: "Sob consulta 💬",
    sensory: "Docinhos modelados à mão com pasta de leite em pó, personalizados para combinar com o tema da sua festa.",
    kind: "bites",
    tint: COLORS.creamYellow,
    moments: ["festa"],
    photos: REAL_PHOTOS.docinhoPersonalizado,
  },
  {
    id: "bala-de-coco",
    name: "Bala de Coco",
    unit: "150g",
    price: "$10",
    sensory: "Docinho de coco que derrete na boca — sem glúten, sem lactose, gostoso de qualquer jeito.",
    kind: "candy",
    tint: COLORS.creamYellow,
    moments: ["dia-dificil", "freezer"],
    badges: ["vegan", "freezer"],
    experience: {
      teaser: "Parece comportadinha. Aí você come uma.",
      noteLabel: "Depois não diz que eu não avisei:",
      note: "Ela derrete na boca e é perigosamente fácil de ficar beliscando.",
      nextTemptation: { id: "brigadeiro", line: "Quer outra coisa boa pra deixar guardada? Dá uma olhada nos brigadeiros." },
    },
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
    badges: ["deserve", "freezer"],
    experience: {
      teaser: "Colher na mão. Problemas em espera por alguns minutos.",
      noteLabel: "Entre a gente:",
      note: "Esse é pra sentar e comer feliz. E não, você não precisa dividir.",
      nextTemptation: { id: "chocobomb", line: "Mas já que hoje é dia de se agradar… você viu o Chocobomb?" },
    },
    photos: [REAL_PHOTOS.boloDePoteCamadas, REAL_PHOTOS.boloDePoteMorango, REAL_PHOTOS.boloDePoteVariedade],
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
    // "hardTimes" is a deliberate one-off personality moment for Brownlito
    // specifically — see src/data/badges.js. Do not reuse it elsewhere.
    badges: ["hardTimes", "freezer"],
    experience: {
      teaser: "Dia difícil? Eu não faço perguntas. Só te apresento o Brownlito.",
      noteLabel: "Amigo das horas difíceis:",
      note: "Brownie recheado no palito. Preciso explicar mais? 😂",
      nextTemptation: { id: "chocobomb", line: "Agora, se você é do time chocolate sem limites, olha o Chocobomb também." },
    },
    // "dia-dificil" gets its own curated gallery — brownlitoEmbalado
    // (individually wrapped, coconut on top) in, brownlitoInteiro (the
    // green-ribbon photo) out, at Naia's request; `photos` below stays
    // unchanged as the general fallback (Feed/Search/ProductDetailSheet —
    // see utils/products.js defaultPhotos), and the Mimos inspiration
    // carousel (MIMO_INSPIRATIONS, src/data/inspirationGalleries.js) is a
    // separate data source entirely, untouched by either.
    photosByMoment: {
      "dia-dificil": [REAL_PHOTOS.brownlitoEmbalado, REAL_PHOTOS.brownlitoRecheio],
    },
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
