import { BADGES } from "../../data/badges";

// Small "insight" chips about a product — never a filter or a category,
// just something a customer might like to know at a glance. Every badge
// shares the exact same soft, quiet styling regardless of type (per the
// brief: no per-type colors) so they read as one family of small facts,
// never competing with the photo, name or price above/around them. Wraps
// naturally to a second line on narrow phones; renders nothing at all for
// a product with no badges.
//
// `onSubtle`: opt-in, default false — Dias de luta's card (ProductCard.jsx)
// sits directly on COLORS.subtle now, the exact same value this badge's
// default bg-brand-subtle resolves to, which left the badge with no visible
// pill at all (only its text/emoji showed). White at low opacity restores a
// hairline of contrast without adding a strong color. Every other caller
// (Product Detail, which sits on the plain beige page) is unaffected.
export default function ProductBadges({ badges, onSubtle = false }) {
  if (!badges || badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {badges.map((key) => {
        const badge = BADGES[key];
        if (!badge) return null;
        return (
          <span
            key={key}
            className={`inline-flex items-center gap-1 text-3xs font-medium rounded-full px-2 py-0.5 text-brand-inkSoft ${
              onSubtle ? "bg-white/60" : "bg-brand-subtle"
            }`}
          >
            <span aria-hidden="true">{badge.emoji}</span>
            {badge.label}
          </span>
        );
      })}
    </div>
  );
}
