/**
 * Design tokens — Mon Caramel Collection
 *
 * Primary palette (brand.*) comes straight from the official Canva brand kit
 * (briefing section 2). Neutral tones (ink/inkSoft/muted/border/subtle) are
 * derived shades used for text and surfaces that aren't in the brand kit
 * itself, kept identical to the values already validated in the prototype.
 *
 * Everything referenced with an arbitrary bracket value in the old prototype
 * (colors, font sizes, letter spacing, aspect ratio, z-index) has a named
 * token here instead — see BRIEFING_COMPLETO_CLAUDE_CODE.md section 7.
 */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          // Official brand kit
          caramelDark: "#AB6233",
          caramelLight: "#ECC15C",
          creamYellow: "#EFC970",
          beige: "#FFFCF5",
          cream: "#FFFFFF",
          black: "#000000",
          // Derived neutrals (not in the brand kit, kept from the prototype)
          ink: "#3D2418",
          inkSoft: "#5B4A3D",
          // Darkened from the prototype's #8A7A68 (~4.04:1 on beige, fails
          // WCAG AA for normal text) to reach ~5:1 while staying in the
          // same warm-brown family.
          muted: "#7A6A57",
          border: "#EADFC8",
          subtle: "#F4EBDA",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        subtitle: ['"Cormorant Garamond"', "serif"],
        body: ["Roboto", "sans-serif"],
      },
      fontSize: {
        "3xs": ["0.65rem", { lineHeight: "0.9rem" }],
        "2xs": ["0.7rem", { lineHeight: "1rem" }],
        "moment-title": ["0.92rem", { lineHeight: "1.3rem" }],
        "moment-caption": ["0.78rem", { lineHeight: "1.1rem" }],
        // Editorial headline size — a real headline at real mobile width
        // (~28px), with the tight serif line-height that makes it read as
        // a headline rather than stacked body text.
        hero: ["1.75rem", { lineHeight: "1.1" }],
        // Home (V2) typographic scale — a single named hierarchy instead of
        // ad-hoc text-xs/text-sm choices per component: meta < small < body
        // < card < section < hero.
        "mc-meta": ["0.625rem", { lineHeight: "1.3" }],
        "mc-small": ["0.75rem", { lineHeight: "1.3" }],
        "mc-body": ["0.875rem", { lineHeight: "1.4" }],
        "mc-card": ["0.9375rem", { lineHeight: "1.3" }],
        "mc-section": ["1.25rem", { lineHeight: "1.2" }],
        "mc-hero": ["1.75rem", { lineHeight: "1.05" }],
      },
      letterSpacing: {
        kicker: "0.25em",
      },
      spacing: {
        // Home (V2) page gutter — every major block aligns to this same
        // left/right edge, nothing introduces its own arbitrary inset.
        gutter: "18px",
      },
      aspectRatio: {
        photo: "4 / 3",
        // Wide editorial banner ratio for the Home hero photo — appetite,
        // not a catalog thumbnail.
        hero: "1.9 / 1",
      },
      zIndex: {
        modal: "60",
      },
      borderRadius: {
        card: "1.5rem",
        // Home (V2) shared radius for cards, hero photo and product
        // images — one value, not a different roundness per component.
        mc: "15px",
      },
    },
  },
  plugins: [],
};
