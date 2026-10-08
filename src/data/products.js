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
// curated list per product. `badges` is Dias de luta-only for now, by
// Naia's brief — not read anywhere else yet.
//
// Separately: a "sold frozen" commercial variant of a regular product is a
// DIFFERENT concept from the "Pode congelar" badge above — one is a
// characteristic of the regular product, the other is its own purchasable
// option, modeled as its own product entry (never a badge on the regular
// one). Two exist today:
//   - "mini-donut-simples" ("Mini Cake Donuts"), right after its
//     chocolate-covered counterpart "mini-donut-decorado" ("Mini Cake
//     Donuts Cobertos com Chocolate") — this was real pre-existing
//     data/photo, previously named "Mini Cake Donuts — assados e
//     congelados" and not positioned next to the regular one.
//   - "butter-cookies-congelado" ("Biscoito Amanteigado — congelado para
//     assar"), right after "butter-cookies" — newly added as its own
//     entry once a real, previously-misfiled photo (raw dough disks in a
//     freezer bag, formerly bundled into the regular product's own
//     gallery) was found for it. Now has confirmed commercial data: $1
//     por biscoito, sold only in the fixed batches its own
//     `quantityOptions` lists (never a free stepper).
// Both pairs are kept adjacent via MOMENT_ORDER["dia-dificil"]
// (data/moments.js), not by array position — see that file's comment.
// ===========================================================================
export const PRODUCTS = [
  {
    id: "brigadeiro",
    name: "Brigadeiros",
    // unit/price are superseded by `packageOptions` below for commercial
    // display (ProductDetailSheet suppresses its own price block for any
    // product with packageOptions) — left as legacy/historical values,
    // never read once packageOptions is present. Real commercial data:
    // these packages have their OWN price each, never a per-unit price
    // multiplied by quantity (6 ≠ 12 × half, etc.) — see packageOptions.
    unit: "6, 12 ou 24 unidades",
    price: "A partir de $14",
    sensory: "Um clássico que vai bem, literalmente, a qualquer hora.",
    kind: "bites",
    tint: COLORS.ink,
    moments: ["dia-dificil", "freezer"],
    badges: ["coffee", "freezer", "glutenFree"],
    customizable: true,
    // Each package has its own confirmed price — never computed by
    // multiplying a per-unit price (see FlavorConfigurator.jsx's
    // PackageConfigurator and ProductDetailSheet/SelectionScreen's use of
    // `packagePrice`, captured at the moment of choosing, not derived
    // later from `price` × qty).
    packageOptions: [
      { label: "6 brigadeiros", qty: 6, price: 10 },
      { label: "12 brigadeiros", qty: 12, price: 18 },
      { label: "24 brigadeiros", qty: 24, price: 36 },
      { label: "50 brigadeiros", qty: 50, price: 75 },
      { label: "100 brigadeiros", qty: 100, price: 130 },
    ],
    // flavors: [] (sabores) deliberately NOT modeled this round — the
    // real flavor list is still pending a separate review (Naia's brief).
    // This round only adds the commercial quantity/price structure; no
    // flavor step exists in the configurator yet (see
    // FlavorConfigurator.jsx — `packageOptions` routes to its own
    // single-step configurator, bypassing the old empty-flavors path
    // entirely, so nothing here invents or shows a flavor list).
    experience: {
      teaser: "Dia difícil + brigadeiro = não tenho dados científicos, mas confio no resultado.",
      // noteLabel/note deliberately absent: the old boxed aside here
      // ("Eu te conto: Você sabia que dá pra congelar?...") is replaced
      // by `detailAside` below — same discreet, box-free treatment
      // already approved for Mini Cake Donuts simples, not the
      // MonCaramelNote box/quote/label device.
      detailAside: "É sempre bom pedir alguns a mais e ter brigadeiro congelado para emergências. 😉",
      nextTemptation: { id: "chocobomb", line: "Agora… se você gosta de chocolate, deixa eu te apresentar o Chocobomb." },
    },
    // "dia-dificil" now carries its own real photo plus the ones
    // previously shown only under the (now-removed) "cafe" and "freezer"
    // moments — see src/data/moments.js: all consolidated into this
    // single id, so nothing that used to live under those two is lost.
    photosByMoment: {
      "dia-dificil": [REAL_PHOTOS.brigadeiroDiaDificil, REAL_PHOTOS.cafe, REAL_PHOTOS.freezer],
    },
  },
  {
    id: "mini-donut-simples",
    name: "Mini Cake Donuts",
    // Commercial review confirmed: $1.50 cada (unit price), pedido mínimo
    // 12 unidades — same convention as every other migrated product.
    unit: "unidade (mín. 12)",
    minimumQuantity: 12,
    price: "$1.50/un",
    sensory:
      "Assados, fofinhos e macios, com poucos ingredientes e pouca adição de açúcar. Uma opção prática para a lancheira ou para aquele snack das crianças ao longo do dia.",
    kind: "cake",
    tint: COLORS.caramelLight,
    moments: ["dia-dificil", "freezer"],
    // No "coffee"/coffeePairing badge on this one by design — its
    // positioning is lancheira/snack infantil, not café (that's the
    // chocolate-covered donut's own thing — see "mini-donut-decorado").
    badges: ["lunchbox", "freezer"],
    // Single-group configurator — just the flavor choice, no
    // cobertura/versão (this product doesn't have either). Reuses the
    // exact same OptionGroupsConfigurator mechanism as Chocobomb/Cone/the
    // chocolate-covered donut above, just with one group: step 1 is
    // "Escolha o sabor" (STEP_INTRO in FlavorConfigurator.jsx), step 2 is
    // the ordinary quantity stepper that component already renders after
    // every group.
    customizable: true,
    optionGroups: [{ key: "sabor", label: "Sabor", choices: ["Baunilha", "Chocolate", "Pão de Mel"] }],
    // Commercially sold only in these exact batch sizes — never a free
    // ±1 stepper (see FlavorConfigurator.jsx's OptionGroupsConfigurator,
    // which renders this as one more single-select chip step, same visual
    // language as the sabor step above). `minimumQuantity` above still
    // stands as the accurate "Pedido mínimo" fact for Product Detail's own
    // commercial block (its lowest value, 12, already matches); it's just
    // no longer what drives the quantity control itself.
    quantityOptions: [12, 18, 24, 36, 50, 75, 100],
    experience: {
      teaser: "Poucos ingredientes, pouca adição de açúcar e tamanho perfeito para os pequenos.",
      // Short, discreet freezer tip — plain secondary-weight text right
      // under the description (see ProductDetailSheet.jsx), deliberately
      // NOT routed through MonCaramelNote: that component's box/quote/
      // label treatment read as a full editorial block again, the exact
      // weight this round's other Product Details moved away from.
      // Replaces (not duplicates) the old "Seu eu do futuro agradece:"
      // aside that used to live here with different wording.
      detailAside: "Faz alguns a mais e congela. Seu eu do futuro agradece. 😉",
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
    name: "Mini Cake Donuts Cobertos com Chocolate",
    // Commercial review confirmed: $2.50 cada (unit price), pedido mínimo
    // 12 unidades — same explicit-field convention as every other migrated
    // product (see minimumQuantity below / utils/products.js
    // minimumQuantityOf). `unit` carries the minimum as display copy only.
    unit: "unidade (mín. 12)",
    minimumQuantity: 12,
    price: "$2.50/un",
    // NOTE: this `sensory` string also feeds Festa's own flat-grid card
    // (ProductCard.jsx's isFesta branch reads p.sensory directly, since
    // this product is cross-tagged to both moments) — there is no
    // Festa-specific description field today, so Festa's card now shows
    // this same approved Detail copy instead of its old, festa-flavored
    // line ("...decorado à mão no tema da sua festa — de flores ao fundo
    // do mar."). Flagged for Naia: this round's brief covered Dias de
    // luta's card/Detail only, not Festa's.
    sensory: "Assados, super fofinhos e macios, cobertos com chocolate e perfeitos para acompanhar um café ou matar aquela vontade de um docinho depois do almoço.",
    kind: "cake",
    tint: COLORS.ink,
    moments: ["festa", "dia-dificil"],
    // Badges are Dias de luta-only (ProductCard gates on momentId — see
    // that component) — Festa's own card never reads this field. No
    // "lunchbox" here (that's the plain/simples donut's positioning, not
    // this one's) — see data/products.js "mini-donut-simples" below.
    badges: ["freezer", "coffeePairing", "glutenFreeOption"],
    // Recheio/cobertura/versão-style configurator, same mechanism as
    // Chocobomb/Cone Trufado — "sabor" here instead of "recheio" since
    // there's no filling, just a flavor choice for the donut itself. No
    // surcharge for "Sem glúten" (see FlavorConfigurator.jsx's STEP_INTRO
    // and its "mesmo preço" caption, both already generic / keyed off
    // `g.key === "versao"`, not this specific product).
    customizable: true,
    optionGroups: [
      { key: "sabor", label: "Sabor", choices: ["Baunilha", "Chocolate", "Pão de Mel"] },
      { key: "cobertura", label: "Cobertura", choices: ["Chocolate meio amargo", "Chocolate branco"] },
      { key: "versao", label: "Versão", choices: ["Tradicional", "Sem glúten"] },
    ],
    // Same fixed-batch convention as mini-donut-simples above — see its
    // own `quantityOptions` comment for the full rationale.
    quantityOptions: [12, 18, 24, 36, 50, 75, 100],
    // noteLabel/note deliberately absent: the old aside here ("Entre a
    // gente: Esse é daqueles que resolve um monte de coisa...") is
    // removed, not replaced — same treatment as Pão de Mel/Cone Trufado.
    // MonCaramelNote already renders nothing when `note` is unset.
    experience: {
      teaser: "Seu cafezinho da tarde não será mais o mesmo. ☕",
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
    // "freezer" is card-only, same as every other product's badges (see
    // ProductBadges/ProductDetailSheet — Detail's commercial block never
    // renders the `badges` array). Same badge set shape as Chocobomb.
    badges: ["deserve", "freezer", "glutenFreeOption"],
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
    // noteLabel/note deliberately absent: the old aside here ("Eu não
    // julgo: Esse não é o docinho comportado...") is removed, not replaced
    // — same treatment as Pão de Mel. MonCaramelNote already renders
    // nothing when `note` is unset. teaser/nextTemptation unaffected.
    experience: {
      teaser: "Tem vontade de doce. E tem vontade de DOCE. Esse é pro segundo caso.",
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
    // Commercial review confirmed: $3 cada (unit price), pedido mínimo 3
    // unidades — same explicit-field convention as every other migrated
    // product. `unit` carries the minimum as display copy only.
    unit: "unidade (mín. 3)",
    minimumQuantity: 3,
    price: "$3/un",
    sensory:
      "Receita macia original, com toque de mel e limão, recheado com doce de leite condensado cozido. Pode ser coberto ou não por chocolate.",
    kind: "sandwich",
    tint: COLORS.caramelDark,
    moments: ["dia-dificil"],
    badges: ["coffee", "deserve"],
    // Same price either way — no surcharge for the chocolate-covered
    // version (see sensory above, which already describes both).
    customizable: true,
    optionGroups: [{ key: "versao", label: "Versão", choices: ["Sem cobertura", "Com cobertura de chocolate"] }],
    experience: {
      teaser: "Não sei o que dizer. Só apreciar.",
      // noteLabel/note deliberately absent: the old aside here ("Eu
      // adoro esse: É macio, tem doce de leite…") is removed, not
      // replaced — same treatment as Pão de Mel/Cone Trufado earlier.
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
    // Trimmed "Pão de mel" off the front — the name right above it already
    // says that; starting with "Macio..." avoids restating it immediately.
    sensory: "Macio, recheado com doce de leite feito com leite condensado cozido e coberto com chocolate meio amargo.",
    kind: "cake",
    tint: COLORS.caramelDark,
    moments: ["dia-dificil"],
    // "coffeePairing" is a deliberate one-off (see badges.js) — card-only,
    // same as every other badge here.
    badges: ["freezer", "deserve", "coffeePairing"],
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
    // Commercial review confirmed: ONE whole cake form (not sold by the
    // slice), $30 flat — same price whatever cobertura is chosen. `unit`
    // repurposed from the old "fatia" (no longer accurate — see
    // `singleItem` below, which drops the quantity step entirely) to the
    // approved size, shown as the commercial block's second line exactly
    // like every other migrated product's unit text.
    unit: "forma aprox. 27 × 23 cm",
    price: "$30",
    sensory: "Bolo de cenoura caseiro, fofinho e feito para dividir — ou não. 😉",
    kind: "cake",
    tint: COLORS.caramelLight,
    moments: ["dia-dificil"],
    badges: ["coffee", "freezer"],
    // Single whole-cake product — one cobertura choice, no quantity step
    // at all (see FlavorConfigurator.jsx's OptionGroupsConfigurator,
    // which skips its own quantity section entirely when `singleItem` is
    // set, instead of either a stepper or discrete quantity chips).
    customizable: true,
    singleItem: true,
    optionGroups: [
      { key: "cobertura", label: "Cobertura", choices: ["Tradicional crocante", "Brigadeiro", "Ganache de chocolate meio amargo"] },
    ],
    experience: {
      teaser: "Tem coisa melhor que cheiro de bolo fresquinho pela casa? Hmmm.",
      // noteLabel/note deliberately absent: the old aside here ("Dica de
      // amiga: ...guardar umas fatias pro seu eu do futuro") assumed the
      // old per-slice sale this product no longer has (now sold as one
      // whole, undivided form) — removed as factually outdated, not
      // replaced.
      nextTemptation: { id: "butter-cookies", line: "Pra acompanhar o próximo café, olha os amanteigados também." },
    },
    photos: [REAL_PHOTOS.boloCenouraTray, REAL_PHOTOS.boloCenouraFatias],
  },
  {
    id: "butter-cookies",
    name: "Biscoito Amanteigado",
    // Genuinely open-ended — many flavor/filling/shape combinations exist,
    // not a fixed catalog pack, so `unit` stays blank rather than
    // restating a stale "12 unidades" that would contradict "Sob
    // consulta" below. No minimumQuantity/quantityOptions either: this
    // product never reaches a quantity step at all (see
    // `whatsappInquiryMessage` below — it routes straight to WhatsApp
    // instead of the normal qty/"Eu quero" flow).
    unit: "",
    price: "Sob consulta 💬",
    sensory: "Crocante, doce na medida certa. Escolha seu favorito e seja feliz.",
    // Short, practical explainer — not an editorial aside (unlike
    // experience.detailAside elsewhere), so it's rendered unconditionally
    // by ProductDetailSheet.jsx whenever `whatsappInquiryMessage` is set,
    // regardless of entry context (Search/Feed included, not just Dias de
    // luta) — this product's WhatsApp-only flow has to work the same way
    // everywhere it can be opened from.
    inquiryNote: "Sabores, recheios e formatos variam — me conta o que você está imaginando e eu te mostro as opções.",
    // Routes the Detail's bottom CTA straight to WhatsApp (reusing the
    // same number/URL pattern Footer.jsx and SendModal.jsx already use —
    // see ProductDetailSheet.jsx) instead of the normal qty stepper +
    // "Eu quero" flow. This product never gets added to Minha Seleção;
    // the whole point is see → understand the possibilities → talk to
    // Naia directly.
    whatsappInquiryMessage: "Oi! Quero ver as opções de Biscoito Amanteigado 🍪",
    kind: "sandwich",
    tint: COLORS.creamYellow,
    moments: ["dia-dificil", "freezer"],
    // "lunchbox" removed — this product's open-ended, many-combinations
    // nature doesn't map to a single fixed claim like "vai bem na
    // lancheira" the way Biscoito Amanteigado congelado's fixed recipe
    // does. "glutenFreeOption" added: a gluten-free version is available,
    // confirmed and chosen over WhatsApp rather than an in-app `versao`
    // step (see badges.js's own comment on this one exception).
    badges: ["coffee", "glutenFreeOption"],
    experience: {
      teaser: "O tipo de snack que desaparece do potinho sem você perceber.",
      // noteLabel/note deliberately absent: the old aside here ("Eu te
      // conto: Esse é um dos que eu gosto de ter em casa...") assumed the
      // old fixed-pack/add-to-selection flow this product no longer has
      // — removed, not replaced.
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
    // Commercial review confirmed: $1 por biscoito, vendido somente nos
    // lotes abaixo (quantityOptions) — same "explicit field, never
    // inferred" convention as every other migrated product.
    // No minimumQuantity/unit "mín." text here on purpose: this product
    // doesn't work conceptually as "free quantity with a floor" at all —
    // the four quantityOptions below already make 24 read as the lowest
    // available choice on their own, so Product Detail's commercial block
    // shows only the price ("$1 cada"), never a redundant "Pedido
    // mínimo" line restating what the chips already say.
    unit: "",
    price: "$1/un",
    sensory:
      "Feitos com apenas 3 ingredientes e 2g de açúcar. Uma opção prática para ter no freezer e assar quando quiser — perfeita para o snack ou a lancheira das crianças.",
    kind: "sandwich",
    tint: COLORS.creamYellow,
    moments: ["dia-dificil", "freezer"],
    // Full replacement, not additive: this product's positioning is
    // lancheira/snack infantil + "vendido congelado", not café — same
    // differentiation already applied between the two Mini Cake Donuts.
    // "freezerToOven" (not the plain "freezer"/"Pode congelar" badge) —
    // this product is SOLD frozen for the customer to bake, a different
    // claim than "a baked product can be frozen afterward" (see that
    // badge's own comment in badges.js).
    badges: ["lunchbox", "freezerToOven"],
    customizable: true,
    optionGroups: [{ key: "sabor", label: "Sabor", choices: ["Baunilha", "Chocolate"] }],
    // Fixed batches, same mechanism as the two Mini Cake Donuts —
    // FlavorConfigurator.jsx renders this as a chip step, never a free
    // stepper. `quantityUnitWord` is the one opt-in difference: each chip
    // spells out its own total ("24 biscoitos · $24"), computed from this
    // product's own `price` via entryPrice() — never a hand-typed number.
    quantityOptions: [24, 50, 75, 100],
    quantityUnitWord: "biscoitos",
    experience: {
      teaser: "3 ingredientes, 2g de açúcar e um freezer feliz.",
      // noteLabel/note deliberately absent: the old aside here ("Esse é
      // esperto: Você deixa no freezer e assa quando quiser...") is
      // removed, not replaced — the main description already covers the
      // freezer practicality, and the editorial box between price and
      // configurator added weight this round moved away from (same
      // treatment as Pão de Mel/Cone Trufado/Chocobomb earlier).
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
    // unit/price superseded by `packageOptions` below — see Brigadeiro's
    // own comment on this same convention (never read once packageOptions
    // is present; each package has its own confirmed price, never a
    // per-unit price × qty).
    unit: "6 unidades",
    price: "Sob consulta 💬",
    // Trimmed the "— outros sabores? É só chamar a gente" clause: this
    // product is goiabada only, no other flavor/filling exists to offer
    // (see explicit scope below) — not inventing a new sentence, just
    // removing the part that no longer applies.
    sensory: "Biscoito amanteigado recheado de goiabada.",
    kind: "sandwich",
    tint: COLORS.caramelLight,
    moments: ["dia-dificil"],
    badges: ["coffee", "deserve"],
    customizable: true,
    packageOptions: [
      { label: "12 casadinhos", qty: 12, price: 18 },
      { label: "24 casadinhos", qty: 24, price: 35 },
    ],
    experience: {
      teaser: "Difícil resistir. Ainda bem que a gente não precisa.",
      // noteLabel/note deliberately absent: the old aside here ("Entre a
      // gente: Amanteigado com goiabada...") is removed, not replaced —
      // same treatment as Pão de Mel/Cone Trufado earlier.
      nextTemptation: { id: "butter-cookies", line: "Se você gosta de biscoitinho com café, olha o amanteigado também." },
    },
    photos: [REAL_PHOTOS.casadinhoGoiabada],
  },
  {
    id: "melties",
    name: "Sequilhos",
    // unit/price superseded by `packageOptions` below — see Brigadeiro's
    // own comment on this same convention.
    unit: "250g",
    price: "Sob consulta 💬",
    sensory: "Leve, delicado e daquele tipo que desmancha na boca.",
    kind: "bites",
    tint: COLORS.creamYellow,
    moments: ["dia-dificil"],
    badges: ["coffee", "glutenFree"],
    customizable: true,
    // Weight-based packages, not unit counts — `qty` stays 1 for both
    // (one bag bought), the real distinguishing fact is `label`/price.
    // Step heading overridden below to "Escolha o tamanho" (not
    // "Escolha a quantidade" — 300g/500g are never meant to read as a
    // quantity of individual biscoits, see FlavorConfigurator.jsx).
    packageOptions: [
      { label: "300g", qty: 1, price: 10 },
      { label: "500g", qty: 1, price: 15 },
    ],
    packageStepLabel: "Escolha o tamanho",
    experience: {
      teaser: "Come um. Depois a gente conversa sobre parar.",
      // noteLabel/note deliberately removed per round-12 micro-adjustment —
      // the main sensory description already covers it, no replacement.
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
    // Detail's main description — replaces the old "Docinho de coco que
    // derrete na boca — sem glúten, sem lactose..." (redundant with the
    // teaser below and with the glutenFree badge now on the card).
    sensory: "Perigosamente macia e perfeita para beliscar quando a vontade de doce chega.",
    kind: "candy",
    tint: COLORS.creamYellow,
    moments: ["dia-dificil", "freezer"],
    badges: ["vegan", "freezer", "glutenFree"],
    // noteLabel/note deliberately absent: the old aside here ("Depois não
    // diz que eu não avisei...") repeated the same idea as the teaser and
    // the new sensory line — removed, not replaced. MonCaramelNote already
    // renders nothing when `note` is unset.
    experience: {
      teaser: "Sabor de infância em formato de doce.",
      nextTemptation: { id: "brigadeiro", line: "Quer outra coisa boa pra deixar guardada? Dá uma olhada nos brigadeiros." },
    },
    // No minimumQuantity — Bala de Coco is sold by the 150g unit, not a
    // commercial minimum (never invent one; see utils/products.js
    // minimumQuantityOf, which only trusts an explicit field).
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
    // "freezer" badge removed: whether it can be frozen depends on the
    // recheio chosen (sob consulta), not a fixed claim this product can
    // make — see commercial review this round.
    badges: ["deserve"],
    // Sabores sob consulta pelo WhatsApp — no `flavors`/`optionGroups`
    // exists to represent (not inventing one), so this routes straight to
    // the same WhatsApp-only flow as Biscoito Amanteigado (whatsappInquiryMessage
    // below) instead of a quantity stepper + "Eu quero". Never added to
    // Minha Seleção, same as that product.
    inquiryNote:
      "Pensando em pedir vários potinhos do mesmo sabor? Me chama! Dependendo da quantidade, pode valer mais a pena fazer uma sobremesa inteira na forma de aproximadamente 27 × 23 cm — e sair mais em conta. 💛",
    whatsappInquiryMessage:
      "Oi! Quero saber mais sobre os sabores do Bolo de Pote — e também sobre a possibilidade de fazer uma sobremesa inteira na forma de aproximadamente 27 × 23 cm em vez de potinhos. 🍰",
    // Overrides ProductDetailSheet's default WhatsApp-inquiry CTA label
    // ("Quero ver as opções") — this product's conversation is specifically
    // about sabores, not a general "options" browse.
    inquiryButtonLabel: "Quero conversar sobre os sabores",
    experience: {
      teaser: "Colher na mão. Problemas em espera por alguns minutos.",
      // noteLabel/note deliberately absent: the old aside here ("Entre a
      // gente: Esse é pra sentar e comer feliz...") is removed, not
      // replaced, per this round's request.
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
    // Commercial review confirmed: $7 cada (unit price), no minimum
    // confirmed yet — plain free stepper starting at 1, same pattern as
    // Pirulito de Alfajor (unit price + no minimumQuantity). Recheio
    // confirmed as Prestígio exclusively for now — no other recheio exists
    // to offer, so no seletor/optionGroups here (would be a choice of one).
    unit: "unidade",
    price: "$7/un",
    sensory: "Brownie recheado de Prestígio, no palito.",
    kind: "dipped",
    tint: COLORS.ink,
    moments: ["dia-dificil"],
    presenteGroup: "mimos",
    // "hardTimes" is a deliberate one-off personality moment for Brownlito
    // specifically — see src/data/badges.js. Do not reuse it elsewhere.
    badges: ["hardTimes", "freezer"],
    experience: {
      teaser: "Dia difícil? Eu não faço perguntas. Só te apresento o Brownlito.",
      // noteLabel/note deliberately removed per round-13 micro-adjustment —
      // the main sensory description already covers it, no replacement.
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
