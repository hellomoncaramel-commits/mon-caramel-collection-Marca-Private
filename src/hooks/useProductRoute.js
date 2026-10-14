import { useCallback, useEffect, useRef, useState } from "react";
import { getColecaoCompletaProducts, defaultPhotos } from "../utils/products";
import { applyProductMeta, resetMeta } from "../utils/meta";

// Native History API, on purpose — no react-router. The only URL pattern
// this app needs is a single one (/doces/[slug], for the 24 Coleção
// completa products), layered on top of an app that otherwise still runs
// entirely on in-memory state (App.jsx's `screen`) — a routing library
// would mean re-architecting navigation to solve a problem that's really
// "one extra route."
//
// Products with no `slug` (anything outside Coleção completa — Caixas,
// Bandejas, festa-only items) never touch the URL at all: openProduct
// below just skips the pushState call, so their Detail sheet opens and
// closes exactly as it always has.
function slugFromPath(pathname) {
  const match = pathname.match(/^\/doces\/([^/]+)\/?$/);
  return match ? match[1] : null;
}

function findBySlug(slug) {
  return getColecaoCompletaProducts().find((p) => p.slug === slug) || null;
}

export function useProductRoute() {
  const [openProduct, setOpenProduct] = useState(null);
  const [openProductContext, setOpenProductContext] = useState(null);

  // Tracks whether the history entry for the CURRENTLY open product is one
  // this hook itself pushed in this session (safe to undo with
  // history.back()) — as opposed to the entry the browser already had
  // when we got control (a direct page load on /doces/[slug], or landing
  // here after the browser's own back/forward). Closing in that second
  // case must never call back(): there may be nothing of this site behind
  // it in session history, and back() would exit the site unexpectedly.
  // Always reset to false on every popstate — a browser-driven
  // back/forward is never "safe to pop again" from our side, regardless
  // of how we got there.
  const pushedByUsRef = useRef(false);

  // Only the initial mount, when the page itself loaded on a product URL,
  // needs the screen behind the Detail to become Coleção completa (so
  // closing lands there, not on Home) — App.jsx wires this.
  const onDirectOpenRef = useRef(null);

  useEffect(() => {
    const initialSlug = slugFromPath(window.location.pathname);
    if (initialSlug) {
      const product = findBySlug(initialSlug);
      if (product) {
        pushedByUsRef.current = false;
        setOpenProduct(product);
        setOpenProductContext(null);
        applyProductMeta(product, defaultPhotos(product)?.[0]);
        onDirectOpenRef.current?.();
      }
    }

    const onPopState = () => {
      pushedByUsRef.current = false;
      const slug = slugFromPath(window.location.pathname);
      if (!slug) {
        setOpenProduct(null);
        setOpenProductContext(null);
        resetMeta();
        return;
      }
      const product = findBySlug(slug);
      setOpenProduct(product);
      setOpenProductContext(null);
      if (product) applyProductMeta(product, defaultPhotos(product)?.[0]);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const openProductDetail = useCallback((product, context = null) => {
    setOpenProduct(product);
    setOpenProductContext(context);
    if (product?.slug) {
      pushedByUsRef.current = true;
      window.history.pushState({ mcProductSlug: product.slug }, "", `/doces/${product.slug}`);
      applyProductMeta(product, defaultPhotos(product)?.[0]);
    }
  }, []);

  const closeProductDetail = useCallback(() => {
    const slug = slugFromPath(window.location.pathname);
    if (slug && pushedByUsRef.current) {
      // We pushed this entry ourselves earlier in this same session —
      // back() consumes exactly that entry and the popstate handler above
      // clears state/meta, so there's nothing more to do here.
      pushedByUsRef.current = false;
      window.history.back();
      return;
    }
    if (slug) {
      // Direct-loaded /doces/[slug] (or reached via the browser's own
      // back/forward) — never call back() here, it could leave the site
      // entirely. Move to "/" ourselves instead.
      window.history.pushState({}, "", "/");
    }
    pushedByUsRef.current = false;
    setOpenProduct(null);
    setOpenProductContext(null);
    resetMeta();
  }, []);

  const setOnDirectOpen = useCallback((fn) => {
    onDirectOpenRef.current = fn;
  }, []);

  return { openProduct, openProductContext, openProductDetail, closeProductDetail, setOnDirectOpen };
}
