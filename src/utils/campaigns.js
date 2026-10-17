import { PRODUCTS } from "../data/products.js";
import { CAMPAIGNS } from "../data/campaigns.js";

// Mon Caramel operates out of Oshawa, Ontario — a plain UTC comparison on
// "YYYY-MM-DD" strings could flip a campaign on/off up to a day early or
// late depending on the viewer's own device timezone. `Intl.DateTimeFormat`
// with an explicit `timeZone` sidesteps that without a library (handles
// EST/EDT's DST switch automatically, unlike a fixed UTC offset would):
// the "en-CA" locale is the one built-in format that renders a plain date
// as YYYY-MM-DD, so no manual string assembly is needed either.
const MON_CARAMEL_TIMEZONE = "America/Toronto";

export function getLocalDateString(date = new Date(), timeZone = MON_CARAMEL_TIMEZONE) {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

// Inclusive on both ends — "primeiro dia" and "último dia" from the brief.
// Plain string comparison is correct here precisely because both sides are
// always "YYYY-MM-DD" (zero-padded, same length) — lexicographic order and
// chronological order coincide for that exact shape.
export function isCampaignActive(campaign, todayStr) {
  return Boolean(campaign?.startDate && campaign?.endDate && campaign.startDate <= todayStr && todayStr <= campaign.endDate);
}

// Explicit allowlist, not every screen id App.jsx happens to recognize
// (NON_MOMENT_SCREENS there also includes "busca" and "selecao" — utility
// screens with no commercial content of their own to feature, never a
// sensible campaign destination). Each of these is a real id from
// App.jsx's screen state (src/App.jsx) or a real moment id (src/data/
// moments.js) that leads somewhere a seasonal campaign could honestly
// point a customer: an entry point, a format, or a moment — verified
// against both files, not guessed. Kept here (not imported from App.jsx)
// on purpose: this list is a deliberate commercial decision about what a
// campaign may feature, not a mechanical copy of every screen that exists.
const ALLOWED_CAMPAIGN_SCREENS = [
  "presente", // "É só uma lembrancinha" — entrada de Presentes
  "presente-rapido", // Fase 2 — produto real com preço
  "presente-caixas",
  "presente-bandejas",
  "presente-mimos",
  "catalogo", // Coleção completa
  "dia-dificil", // momento real (src/data/moments.js)
  "festa", // momento real (src/data/moments.js)
];

// A campaign whose destination can't actually be followed is treated as if
// it weren't configured at all — never rendered, never a dead CTA (brief
// item 13). `screen` must be one of ALLOWED_CAMPAIGN_SCREENS above (a
// non-empty string alone isn't enough — "banana" would otherwise pass);
// `product` is checked against the real catalog, since a typo'd or
// since-removed productId is the one failure mode that check can actually
// catch; `message` just needs to be a real, non-empty string (same as
// every other `onSend`/SendModal call in this app).
export function isValidCampaignDestination(destination) {
  if (!destination || typeof destination !== "object") return false;
  if (destination.type === "screen") return ALLOWED_CAMPAIGN_SCREENS.includes(destination.screen);
  if (destination.type === "product") return PRODUCTS.some((p) => p.id === destination.productId);
  if (destination.type === "whatsapp") return typeof destination.message === "string" && destination.message.length > 0;
  return false;
}

// The one active campaign to show right now, or null (no campaign, a
// future one, an expired one, or one with a broken destination — all
// render identically: nothing). When more than one is active at once,
// the lowest `priority` wins — never more than one campaign shown at a
// time. `campaigns`/`referenceDate` are overridable only so tests can pass
// fixtures without touching the real (empty-by-default) CAMPAIGNS array or
// the system clock.
export function getActiveCampaign(campaigns = CAMPAIGNS, referenceDate = new Date()) {
  const todayStr = getLocalDateString(referenceDate);
  const active = (campaigns || []).filter((c) => isCampaignActive(c, todayStr) && isValidCampaignDestination(c.destination));
  if (active.length === 0) return null;
  return active.reduce((best, c) => (c.priority < best.priority ? c : best));
}
