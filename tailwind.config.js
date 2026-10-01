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
          // Deeper shade used only for the Home discovery-choice buttons.
          caramelDarker: "#7A4524",
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
      // Two voices, consciously: Fraunces (personality/editorial — headlines,
      // product names, card titles) and DM Sans (functional/interface —
      // body text, buttons, prices, badges, nav). Cormorant Garamond
      // ("subtitle") and Roboto ("body") are retired — every former
      // font-subtitle use was migrated to font-display or plain body text,
      // not kept as a third/fourth voice.
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ['"DM Sans"', "sans-serif"],
      },
      fontSize: {
        "3xs": ["0.65rem", { lineHeight: "0.9rem" }],
        "2xs": ["0.7rem", { lineHeight: "1rem" }],
        "moment-title": ["0.92rem", { lineHeight: "1.3rem" }],
        "moment-caption": ["0.78rem", { lineHeight: "1.1rem" }],
        // Home typographic scale — four real hierarchy levels (main /
        // section / body / utility), not one size per component. Product
        // names/prices get their own two entries since they sit between
        // body and utility.
        // Home's hero still has to read as the page's clear textual
        // protagonist — personality/serif italic, 2-3 line wrap — but it no
        // longer needs to dominate the first viewport: the two discovery
        // actions must be visible right below it, not pushed down by a
        // headline sized like a magazine cover.
        "mc-home-hero": ["clamp(24px, 6.8vw, 29px)", { lineHeight: "1.08", letterSpacing: "-0.015em" }],
        "mc-home-section": ["18px", { lineHeight: "1.1" }],
        "mc-home-body": ["12.5px", { lineHeight: "1.35" }],
        // Card title/subtitle bumped alongside the card's own min-height
        // (50px → 62px, see HomeScreen.jsx) — same reasoning: the discovery
        // rows are the Home page's main content, not a compact utility list.
        "mc-home-card-title": ["15px", { lineHeight: "1.15" }],
        "mc-home-card-subtitle": ["11.5px", { lineHeight: "1.2" }],
        "mc-home-product": ["12px", { lineHeight: "1.2" }],
        "mc-home-price": ["10px", { lineHeight: "1.2" }],
        // Now the closing row of the choice panel (a bordered footer inside
        // it, not a lone floating footnote) — legible enough to read as
        // that panel's own content, still clearly the smallest tier.
        "mc-home-meta": ["10.5px", { lineHeight: "1.2" }],
        "mc-home-nav-label": ["9px", { lineHeight: "1.1" }],
      },
      letterSpacing: {
        kicker: "0.25em",
      },
      spacing: {
        // Home page gutter — every major block aligns to this same
        // left/right edge, nothing introduces its own arbitrary inset.
        gutter: "16px",
      },
      aspectRatio: {
        photo: "4 / 3",
        // Editorial portrait crop for the Home "Só olha" product preview.
        "mc-portrait": "4 / 5",
      },
      zIndex: {
        modal: "60",
      },
      borderRadius: {
        card: "1.5rem",
        // Home's overlapping choice panel — sits between the site's
        // "small card" (rounded-2xl/16px, used for the panel's own rows)
        // and "primary card" (rounded-3xl/24px) tiers, giving the page's
        // one hero panel a slightly distinct identity from an ordinary
        // product card elsewhere in the app.
        mc: "20px",
        // Home small radius for the "Só olha" product images.
        "mc-img": "11px",
      },
    },
  },
  plugins: [],
};
