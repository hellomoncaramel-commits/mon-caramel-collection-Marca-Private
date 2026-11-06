import { useCallback, useEffect, useRef, useState } from "react";
import { getColecaoCompletaProducts, defaultPhotos } from "../utils/products";
import { applyProductMeta, resetMeta } from "../utils/meta";

// Single native-History-API router for the whole app — no react-router.
// Replaces both the old bare `useState(null)` for App.jsx's `screen` and
// the old useProductRoute.js (which only covered /doces/[slug]): every
// "page" the app can show — a top-level screen (Catálogo/Busca/Presentes/
// Seleção/Momentos), a moment screen, or a product detail — is now one
// real entry in browser history with a real URL, so the browser's own
// back/forward buttons behave exactly like they do on any other site.
//
// QA pós-publicação (2026-11) — confirmed bug this fixes: Home → click
// "Nossos doces" → press the browser's native Back button left the site
// entirely. Root cause: screen navigation (plain setScreen) never touched
// history/the URL at all, so there was never an entry for the browser's
// Back button to undo — it skipped straight past the whole visit to
// whatever page was open before. Only /doces/[slug] product links ever
// got a real history entry.
//
// One shared safeguard (pushedByUsRef) for both screens and products —
// same idea the old useProductRoute.js already used for products alone,
// now covering every navigation this hook performs: true right after OUR
// OWN pushState call, reset to false on every popstate (a browser-driven
// back/forward is never "safe to pop again" from our side, since we can't
// know what's further behind the entry we just landed on). `goBack` and
// `closeProductDetail` only ever call history.back() when this is true;
// otherwise they PUSH a new forward entry to the known-correct fallback
// instead of going back — so nothing here can ever call history.back()
// its way out of the site, on any path, including a direct link with no
// history behind it at all.

function slugFromPath(pathname) {
  const match = pathname.match(/^\/doces\/([^/]+)\/?$/);
  return match ? match[1] : null;
}

function findBySlug(slug) {
  return getColecaoCompletaProducts().find((p) => p.slug === slug) || null;
}

// The URL for a screen is just `/${screen}` (or `/` for Home) — generic by
// design, no per-screen mapping table to keep in sync. `isValidScreen`
// (supplied by App.jsx, which already owns the list of real screen/moment
// ids) is the one gate against a garbage/unknown URL ever becoming a
// "screen" — an unrecognized path on a direct load or popstate falls back
// to Home instead of rendering a broken page.
function pathForScreen(screen) {
  return screen ? `/${screen}` : "/";
}

function screenFromPath(pathname, isValidScreen) {
  if (pathname === "/" || pathname === "") return null;
  const slug = pathname.replace(/^\/+|\/+$/g, "");
  return isValidScreen(slug) ? slug : null;
}

export function useAppRoute(isValidScreen) {
  const [screen, setScreen] = useState(() => {
    if (typeof window === "undefined") return null;
    if (slugFromPath(window.location.pathname)) return null; // resolved by the mount effect below, once the product itself is looked up
    return screenFromPath(window.location.pathname, isValidScreen);
  });
  const [openProduct, setOpenProduct] = useState(null);
  const [openProductContext, setOpenProductContext] = useState(null);

  const pushedByUsRef = useRef(false);

  useEffect(() => {
    const initialSlug = slugFromPath(window.location.pathname);
    if (initialSlug) {
      const product = findBySlug(initialSlug);
      if (product) {
        setOpenProduct(product);
        setOpenProductContext(null);
        applyProductMeta(product, defaultPhotos(product)?.[0]);
        // A direct product link has no in-app screen behind it — Coleção
        // completa is the one sensible background to land on once the
        // sheet closes (same choice this app has always made here).
        setScreen("catalogo");
      }
    }

    const onPopState = () => {
      pushedByUsRef.current = false;
      const pathname = window.location.pathname;
      const slug = slugFromPath(pathname);
      if (slug) {
        const product = findBySlug(slug);
        setOpenProduct(product);
        setOpenProductContext(null);
        if (product) applyProductMeta(product, defaultPhotos(product)?.[0]);
        return;
      }
      setOpenProduct(null);
      setOpenProductContext(null);
      resetMeta();
      setScreen(screenFromPath(pathname, isValidScreen));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
    // Mount-only, like the old useProductRoute.js — isValidScreen is a
    // stable predicate over data that doesn't change at runtime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Every nav click/CTA that moves to a NEW screen (top nav, Home's own
  // shortcuts, a moment card, "Ver Minha Seleção") — always pushes
  // forward, same mental model as clicking a link on any other site.
  const navigateToScreen = useCallback(
    (nextScreen) => {
      if (nextScreen === screen) return;
      pushedByUsRef.current = true;
      window.history.pushState({ mcScreen: nextScreen }, "", pathForScreen(nextScreen));
      setScreen(nextScreen);
    },
    [screen]
  );

  // Every "Voltar" affordance calls this with its intended fallback (a
  // screen id, or null for Home) instead of navigateToScreen directly:
  // history.back() when the current entry is one we pushed ourselves this
  // session (reveals the real entry behind it, which — for normal
  // forward navigation — already IS that same fallback), otherwise pushes
  // a new forward entry to the fallback instead of risking back().
  const goBack = useCallback(
    (fallback) => {
      if (pushedByUsRef.current) {
        pushedByUsRef.current = false;
        window.history.back();
        return;
      }
      navigateToScreen(fallback);
    },
    [navigateToScreen]
  );

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
      // entirely. Push forward to the screen already showing behind the
      // sheet instead (set on mount above, or whatever it currently is —
      // never a hardcoded "/").
      pushedByUsRef.current = true;
      window.history.pushState({ mcScreen: screen }, "", pathForScreen(screen));
    }
    setOpenProduct(null);
    setOpenProductContext(null);
    resetMeta();
  }, [screen]);

  return { screen, navigateToScreen, goBack, openProduct, openProductContext, openProductDetail, closeProductDetail };
}
