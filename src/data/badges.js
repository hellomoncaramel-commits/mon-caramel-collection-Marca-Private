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
  // carry it (today: Cone Trufado). Never merge the two or apply this to
  // a product without a confirmed commercial rule.
  glutenFreeOption: { emoji: "🌾", label: "Opção sem glúten (mesmo preço)" },
  vegan: { emoji: "🌱", label: "Vegan" },
  deserve: { emoji: "💛", label: "Hoje eu mereço" },
  // A deliberate one-off personality moment on Brownlito specifically — see
  // that product's `badges` entry in products.js. Never apply this to
  // another product automatically.
  hardTimes: { emoji: "🫶", label: "Amigo das horas difíceis" },
};
