/**
 * JS mirror of the `brand.*` colors in tailwind.config.js.
 *
 * Tailwind classes only work with static, known-at-build-time class names —
 * they can't express things like an SVG `fill` attribute or a computed
 * `${tint}22` alpha-channel string. Those cases use these hex values
 * directly via inline style/props instead of arbitrary-value classes.
 */
export const COLORS = {
  beige: "#FFFCF5",
  border: "#EADFC8",
  subtle: "#F4EBDA",
  ink: "#3D2418",
  inkSoft: "#5B4A3D",
  muted: "#8A7A68",
  caramelDark: "#AB6233",
  caramelLight: "#ECC15C",
  creamYellow: "#EFC970",
  black: "#000000",
  white: "#FFFFFF",
};
