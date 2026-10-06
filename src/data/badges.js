/**
 * Product "insight" badges — small, editorial facts about a product (pode
 * congelar, bom com café, vegan...), not categories, not filters, not
 * allergen/dietary claims inferred from anywhere else. A product only wears
 * a badge because it's listed in its own `badges: [...]` array in
 * products.js — never derived from `moments`, `kind`, `sensory`, or any
 * other field.
 *
 * This is the single source of truth for each badge's label/emoji: add a
 * new key here once, reference it from as many products as make sense, and
 * every renderer (today: ProductCard in "Dias de luta") stays in sync
 * automatically. Foundation only, per Naia's brief — not wired into any
 * filter or the "Só olha" feed yet.
 */
export const BADGES = {
  coffee: { emoji: "☕", label: "Bom com café" },
  freezer: { emoji: "❄️", label: "Pode congelar" },
  lunchbox: { emoji: "🎒", label: "Vai bem na lancheira" },
  glutenFree: { emoji: "🌾", label: "Gluten Free" },
  // Distinct from glutenFree above: that one means the product itself is
  // gluten-free. This means a gluten-free VERSION is available as an
  // option, at the same price — only true for products that explicitly
  // carry it (today: Chocobomb, Cone Trufado, Mini Cake Donuts Cobertos
  // com Chocolate). Never merge the two or apply this to a product
  // without a confirmed commercial rule.
  // Label kept short ("Opção sem glúten") — the "mesmo preço" detail lives
  // once, discreetly, next to the `versao` step inside FlavorConfigurator,
  // not repeated here too.
  // Also used by Biscoito Amanteigado (butter-cookies), which has no
  // configurator at all (it's the "Sob consulta" / WhatsApp-inquiry
  // product) — there the option is communicated and confirmed over
  // WhatsApp rather than through a `versao` step, so this is the one
  // product where the badge doesn't correspond to an in-app choice.
  glutenFreeOption: { emoji: "🌾", label: "Opção sem glúten" },
  vegan: { emoji: "🌱", label: "Vegan" },
  deserve: { emoji: "💛", label: "Hoje eu mereço" },
  // A deliberate one-off personality moment on Brownlito specifically — see
  // that product's `badges` entry in products.js. Never apply this to
  // another product automatically.
  hardTimes: { emoji: "🫶", label: "Amigo das horas difíceis" },
  // Deliberate verbatim line (not "Bom com café" — distinct from `coffee`
  // above), requested by Naia product by product: today on Pão de Mel and
  // Mini Cake Donuts Cobertos com Chocolate (see each product's own
  // `badges` entry). Never apply to a product that wasn't explicitly
  // given this exact text.
  coffeePairing: { emoji: "☕", label: "Isso aqui com um café... hmmm" },
  // Deliberately distinct from `freezer` ("Pode congelar") above — that one
  // means a baked/ready product CAN be frozen afterward. This one means the
  // product is SOLD frozen, raw, for the customer to bake at home — a
  // different commercial fact, so reusing "Pode congelar" would read as the
  // same claim when it isn't. One-off: today only Biscoito Amanteigado
  // congelado (butter-cookies-congelado). Never apply to another product
  // without the same "sold frozen, bake at home" rule being true for it.
  freezerToOven: { emoji: "❄️", label: "Do freezer pro forno" },
};
