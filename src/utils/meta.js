// Client-side <head> sync for in-app ("soft") navigation: when someone
// opens a product from Home/Catálogo/Busca without a full page load, the
// URL changes (see hooks/useProductRoute.js) but the document the browser
// already has is whatever page it actually loaded — this keeps
// title/description/canonical/OG in sync with whatever product is open,
// for the browser tab and for Google's own JS-rendered indexing pass.
//
// Crawlers that never execute JavaScript (WhatsApp, Facebook, Twitter,
// etc.) never see this file run at all — they always get the right values
// already baked into the static HTML of /doces/[slug] itself, generated
// by scripts/generate-static-pages.mjs from the exact same product data.
// This module is only ever the *second*, client-side source of the same
// facts, never the only one.
import { SITE_URL } from "../config/site";
import { productDescription } from "./products";

export const DEFAULT_TITLE = "Mon Caramel | Doces artesanais em Oshawa";
export const DEFAULT_DESCRIPTION =
  "Doces artesanais por encomenda em Oshawa e Durham Region. Brigadeiros, presentes, lembrancinhas e muito mais. Escolha o seu e fale comigo.";
export const DEFAULT_OG_TITLE = "Mon Caramel — Not your average sweets";
export const DEFAULT_OG_DESCRIPTION =
  "Doces artesanais feitos em pequenos lotes, para matar a vontade, presentear e comemorar. Feitos em Oshawa. 🤎";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/products/bolo-de-pote-camadas.jpg`;

function setNamedMeta(name, content) {
  const el = document.head.querySelector(`meta[name="${name}"]`);
  if (el) el.setAttribute("content", content);
}

function setPropertyMeta(property, content) {
  const el = document.head.querySelector(`meta[property="${property}"]`);
  if (el) el.setAttribute("content", content);
}

function setCanonical(href) {
  const el = document.head.querySelector('link[rel="canonical"]');
  if (el) el.setAttribute("href", href);
}

// Called whenever a Coleção completa product opens (any entry point —
// Catálogo, Busca, Home favorites, Dias de luta). `photoPath` is the same
// value already shown as the product's card/Detail photo (defaultPhotos),
// kept as a separate argument instead of re-importing it here so this
// module stays a pure DOM-writer, not another place that decides which
// photo represents a product.
export function applyProductMeta(product, photoPath) {
  if (!product?.slug) return;
  const url = `${SITE_URL}/doces/${product.slug}`;
  const title = `${product.name} | Mon Caramel`;
  const description = productDescription(product);
  document.title = title;
  setNamedMeta("description", description);
  setCanonical(url);
  setPropertyMeta("og:title", title);
  setPropertyMeta("og:description", description);
  setPropertyMeta("og:url", url);
  if (photoPath) setPropertyMeta("og:image", `${SITE_URL}${photoPath}`);
}

// Called on close (back to Home/Catálogo/wherever) and on mount when the
// page didn't load on a product URL — restores the site-wide defaults
// that live statically in index.html.
export function resetMeta() {
  document.title = DEFAULT_TITLE;
  setNamedMeta("description", DEFAULT_DESCRIPTION);
  setCanonical(`${SITE_URL}/`);
  setPropertyMeta("og:title", DEFAULT_OG_TITLE);
  setPropertyMeta("og:description", DEFAULT_OG_DESCRIPTION);
  setPropertyMeta("og:url", `${SITE_URL}/`);
  setPropertyMeta("og:image", DEFAULT_OG_IMAGE);
}
