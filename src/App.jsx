import { useEffect, useRef, useState } from "react";
import { useSelection } from "./hooks/useSelection";
import { useAppRoute } from "./hooks/useAppRoute";
import { MOMENTS } from "./data/moments";
import Toast from "./components/shared/Toast";
import HomeScreen from "./components/Home/HomeScreen";
import MomentPicker from "./components/Home/MomentPicker";
import CatalogScreen from "./components/Catalog/CatalogScreen";
import MomentScreen from "./components/Moment/MomentScreen";
import PresenteEntryScreen from "./components/Presente/PresenteEntryScreen";
import PresenteRapido from "./components/Presente/PresenteRapido";
import CaixasScreen from "./components/Presente/CaixasScreen";
import BandejasScreen from "./components/Presente/BandejasScreen";
import MimosScreen from "./components/Presente/MimosScreen";
import ProductDetailSheet from "./components/Feed/ProductDetailSheet";
import SearchScreen from "./components/Search/SearchScreen";
import SelectionScreen from "./components/Selection/SelectionScreen";
import SendModal from "./components/shared/SendModal";
import BottomNav from "./components/shared/BottomNav";
import DesktopNav from "./components/shared/DesktopNav";
import Footer from "./components/shared/Footer";

// "cafe" and "freezer" were standalone moments, both since folded into
// "dia-dificil" (see src/data/moments.js). Kept here so any stale
// link/state still holding screen="cafe" or screen="freezer" lands on the
// consolidated moment instead of an empty page.
const LEGACY_MOMENT_REDIRECTS = { cafe: "dia-dificil", freezer: "dia-dificil" };

const BOTTOM_NAV_SCREENS = ["busca", "selecao"];
const NON_MOMENT_SCREENS = [
  "momentos",
  "busca",
  "catalogo",
  "selecao",
  "presente",
  "presente-rapido",
  "presente-caixas",
  "presente-bandejas",
  "presente-mimos",
];

// Every screen id a direct URL load or a browser back/forward is allowed
// to resolve to — anything else falls back to Home instead of rendering a
// broken page (see useAppRoute.js's screenFromPath). Real moment ids come
// from data/moments.js itself, never hand-duplicated here, so a moment
// added there is automatically a valid direct-loadable screen too.
const KNOWN_SCREEN_IDS = new Set([...NON_MOMENT_SCREENS, ...MOMENTS.map((m) => m.id), ...Object.keys(LEGACY_MOMENT_REDIRECTS)]);
const isValidScreen = (id) => KNOWN_SCREEN_IDS.has(id);

export default function App() {
  const [pendingMessage, setPendingMessage] = useState(null);

  // Shared, app-wide toast (today only "Me tenta"'s direct-add feedback
  // uses it — see MeTenta.jsx) — a plain auto-dismissing message, not a
  // blocking modal, reusing Toast.jsx exactly as Minha Festa already does.
  // `id` (not just the text) forces the dismiss timer to restart even if
  // the same message fires again right after the previous one cleared.
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);
  const showToast = (text) => {
    clearTimeout(toastTimerRef.current);
    setToast({ id: Date.now(), text });
  };
  useEffect(() => {
    if (!toast) return;
    toastTimerRef.current = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(toastTimerRef.current);
  }, [toast]);
  // Which journey opened the product detail sheet — only Dias de luta ever
  // sets this (to "dia-dificil"), which is what turns on the Mon Caramel
  // Experience layer inside ProductDetailSheet (badges/note/cross-sell).
  // Catalog/Search never pass a context, so the sheet renders exactly as it
  // always has for them. Screen AND product open/close state both live in
  // useAppRoute (native History API — see that file): every internal
  // navigation (screens included, not just the 24 Coleção completa
  // products at /doces/[slug]) now has a real history entry/URL, so the
  // browser's own back/forward work everywhere, not just on product links.
  const { screen, navigateToScreen, goBack, openProduct, openProductContext, openProductDetail, closeProductDetail } = useAppRoute(isValidScreen);
  const { selection, addToSelection, removeFromSelection } = useSelection();

  // Presente Rápido (Fase 2): the quantity/package it suggested for a
  // configurable product, carried through to the Product Detail sheet that
  // opens right after — see ProductDetailSheet.jsx's own comment on how it
  // merges this with a real already-selected entry. Cleared whenever the
  // sheet closes so it can never leak into some later, unrelated open of
  // the same product.
  const [pendingGiftIntent, setPendingGiftIntent] = useState(null);
  const openProductWithIntent = (product, intent) => {
    setPendingGiftIntent(intent);
    openProductDetail(product);
  };
  const closeProductDetailAndClearIntent = () => {
    setPendingGiftIntent(null);
    closeProductDetail();
  };

  const onGoSelection = () => navigateToScreen("selecao");
  const onNavigate = (id) => navigateToScreen(id === "home" ? null : id);
  const activeNav = screen === null ? "home" : BOTTOM_NAV_SCREENS.includes(screen) ? screen : undefined;

  return (
    <div className="min-h-screen bg-brand-beige font-body">
      <DesktopNav active={activeNav} onNavigate={onNavigate} selectionCount={selection.length} />

      <div className="pb-24 lg:pb-0">
        {/* Single <main> landmark for whichever screen is current — Footer
            stays a sibling, not nested inside (it's already its own
            <footer> landmark, see Footer.jsx), and ProductDetailSheet/
            SendModal are separate fixed overlays below, outside this div
            entirely. */}
        <main>
          {!screen && (
            <HomeScreen
              onSelect={navigateToScreen}
              onOpenProduct={openProductDetail}
              selection={selection}
              onSend={setPendingMessage}
            />
          )}

          {screen === "momentos" && <MomentPicker onBack={() => goBack(null)} onSelectMoment={navigateToScreen} />}

          {screen === "busca" && (
            <SearchScreen
              onBack={() => goBack(null)}
              onGoCatalog={() => navigateToScreen("catalogo")}
              selection={selection}
              addToSelection={addToSelection}
              onOpenProduct={openProductDetail}
              onSend={setPendingMessage}
            />
          )}

          {screen === "catalogo" && (
            <CatalogScreen
              onBack={() => goBack(null)}
              selection={selection}
              onOpenProduct={openProductDetail}
              onOpenSelection={onGoSelection}
            />
          )}

          {screen === "selecao" && (
            <SelectionScreen
              selection={selection}
              removeFromSelection={removeFromSelection}
              addToSelection={addToSelection}
              onBack={() => goBack(null)}
              onSend={setPendingMessage}
              onOpenProduct={openProductDetail}
            />
          )}

          {screen === "presente" && <PresenteEntryScreen onBack={() => goBack(null)} onSelect={navigateToScreen} />}

          {screen === "presente-rapido" && (
            <PresenteRapido
              onBack={() => goBack("presente")}
              onSelect={navigateToScreen}
              addToSelection={addToSelection}
              onOpenProductWithIntent={openProductWithIntent}
              onShowToast={showToast}
            />
          )}

          {screen === "presente-caixas" && (
            <CaixasScreen onBack={() => goBack("presente")} addToSelection={addToSelection} />
          )}

          {screen === "presente-bandejas" && (
            <BandejasScreen onBack={() => goBack("presente")} addToSelection={addToSelection} onSend={setPendingMessage} />
          )}

          {screen === "presente-mimos" && (
            <MimosScreen onBack={() => goBack("presente")} onSend={setPendingMessage} />
          )}

          {screen && !NON_MOMENT_SCREENS.includes(screen) && (
            <MomentScreen
              momentId={LEGACY_MOMENT_REDIRECTS[screen] || screen}
              onBack={() => goBack(null)}
              onGoCatalog={() => navigateToScreen("catalogo")}
              onSend={setPendingMessage}
              onOpenProduct={openProductDetail}
              selection={selection}
              addToSelection={addToSelection}
              removeFromSelection={removeFromSelection}
              onOpenSelection={onGoSelection}
            />
          )}
        </main>

        {/* One global footer, rendered once here — not per-screen, not
            inside ProductDetailSheet/SendModal (those are separate `fixed`
            overlays below, outside this wrapper entirely, so the footer
            never shows through or duplicates behind them). Sits inside
            this same pb-24 lg:pb-0 wrapper every screen's own content
            already uses, so it inherits the exact clearance that already
            keeps content clear of the fixed BottomNav (visible up to the
            same lg breakpoint BottomNav itself hides at) — no separate
            padding hack needed. */}
        <Footer />
      </div>

      <BottomNav
        active={activeNav}
        onNavigate={onNavigate}
        selectionCount={selection.length}
      />

      {openProduct && (
        <ProductDetailSheet
          // Remounts cleanly when "próxima tentação" switches to a
          // different product (see NextTemptation.jsx) — otherwise local
          // state like the quantity stepper would carry over from whatever
          // product was open before.
          key={openProduct.id}
          product={openProduct}
          onClose={closeProductDetailAndClearIntent}
          momentId={openProductContext}
          onOpenProduct={openProductDetail}
          selection={selection}
          addToSelection={addToSelection}
          removeFromSelection={removeFromSelection}
          pendingIntent={pendingGiftIntent}
        />
      )}

      {pendingMessage && <SendModal message={pendingMessage} onClose={() => setPendingMessage(null)} />}

      <Toast message={toast?.text} />
    </div>
  );
}
