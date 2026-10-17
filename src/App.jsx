import { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";
import { useSelection } from "./hooks/useSelection";
import { useProductRoute } from "./hooks/useProductRoute";
import Toast from "./components/shared/Toast";
import HomeScreen from "./components/Home/HomeScreen";
import MomentPicker from "./components/Home/MomentPicker";
import CatalogScreen from "./components/Catalog/CatalogScreen";
import MomentScreen from "./components/Moment/MomentScreen";
import PresenteEntryScreen from "./components/Presente/PresenteEntryScreen";
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
  "presente-caixas",
  "presente-bandejas",
  "presente-mimos",
];

export default function App() {
  const [screen, setScreen] = useState(null);
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
  // always has for them. Product open/close state itself now lives in
  // useProductRoute (native History API — see that file): it also keeps
  // the URL in sync for the 24 Coleção completa products (/doces/[slug]),
  // while every other product (no `slug`) opens/closes exactly as before.
  const { openProduct, openProductContext, openProductDetail, closeProductDetail, setOnDirectOpen } = useProductRoute();
  const { selection, addToSelection, removeFromSelection } = useSelection();

  // A page load that lands directly on /doces/[slug] (e.g. a shared link)
  // has no "origin screen" to return to when the Detail closes — this
  // makes that case land on Coleção completa instead of Home. Plain
  // synchronous ref assignment (not an effect): useProductRoute's own
  // mount effect, which may call this, runs after render completes, so
  // the ref is already set by then.
  setOnDirectOpen(() => setScreen("catalogo"));

  const onGoSelection = () => setScreen("selecao");
  const onNavigate = (id) => setScreen(id === "home" ? null : id);
  const activeNav = screen === null ? "home" : BOTTOM_NAV_SCREENS.includes(screen) ? screen : undefined;

  return (
    <div className="min-h-screen bg-brand-beige font-body">
      <DesktopNav active={activeNav} onNavigate={onNavigate} selectionCount={selection.length} />

      <div className="pb-24 md:pb-0">
        {/* Single <main> landmark for whichever screen is current — Footer
            stays a sibling, not nested inside (it's already its own
            <footer> landmark, see Footer.jsx), and ProductDetailSheet/
            SendModal are separate fixed overlays below, outside this div
            entirely. */}
        <main>
          {!screen && (
            <HomeScreen
              onSelect={setScreen}
              onOpenProduct={openProductDetail}
              selection={selection}
              addToSelection={addToSelection}
              onShowToast={showToast}
            />
          )}
  
          {screen === "momentos" && <MomentPicker onBack={() => setScreen(null)} onSelectMoment={setScreen} />}
  
          {screen === "busca" && (
            <SearchScreen
              onBack={() => setScreen(null)}
              onGoCatalog={() => setScreen("catalogo")}
              selection={selection}
              addToSelection={addToSelection}
              onOpenProduct={openProductDetail}
              onSend={setPendingMessage}
            />
          )}
  
          {screen === "catalogo" && (
            <CatalogScreen
              onBack={() => setScreen(null)}
              selection={selection}
              onOpenProduct={openProductDetail}
              onOpenSelection={onGoSelection}
              onSelect={setScreen}
            />
          )}
  
          {screen === "selecao" && (
            <SelectionScreen
              selection={selection}
              removeFromSelection={removeFromSelection}
              addToSelection={addToSelection}
              onBack={() => setScreen(null)}
              onSend={setPendingMessage}
              onOpenProduct={openProductDetail}
            />
          )}
  
          {screen === "presente" && <PresenteEntryScreen onBack={() => setScreen(null)} onSelect={setScreen} />}
  
          {screen === "presente-caixas" && (
            <CaixasScreen onBack={() => setScreen("presente")} addToSelection={addToSelection} />
          )}
  
          {screen === "presente-bandejas" && (
            <BandejasScreen onBack={() => setScreen("presente")} addToSelection={addToSelection} onSend={setPendingMessage} />
          )}
  
          {screen === "presente-mimos" && (
            <MimosScreen onBack={() => setScreen("presente")} onSend={setPendingMessage} />
          )}
  
          {screen && !NON_MOMENT_SCREENS.includes(screen) && (
            <MomentScreen
              momentId={LEGACY_MOMENT_REDIRECTS[screen] || screen}
              onBack={() => setScreen(null)}
              onGoCatalog={() => setScreen("catalogo")}
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
            this same pb-24 md:pb-0 wrapper every screen's own content
            already uses, so it inherits the exact clearance that already
            keeps content clear of the fixed mobile BottomNav — no separate
            padding hack needed. */}
        <Footer />
      </div>

      <BottomNav
        active={activeNav}
        onNavigate={onNavigate}
        selectionCount={selection.length}
      />

      {/* Tablet-only fallback: BottomNav is hidden at md+, and DesktopNav
          only takes over at lg+ (tablet keeps its existing, unredesigned
          behavior per this round's scope) — so this covers the md–lg gap.
          Hidden at lg+ since DesktopNav's own "Seleção" link/count makes it
          redundant there. */}
      {selection.length > 0 && screen !== "selecao" && (
        <button
          onClick={onGoSelection}
          className="hidden md:flex lg:hidden fixed bottom-6 left-6 z-40 rounded-full px-5 py-3 text-sm font-medium text-white bg-brand-caramelDark items-center gap-2 shadow-lg"
        >
          <Heart size={15} fill="white" />
          Minha seleção · {selection.length}
        </button>
      )}

      {openProduct && (
        <ProductDetailSheet
          // Remounts cleanly when "próxima tentação" switches to a
          // different product (see NextTemptation.jsx) — otherwise local
          // state like the quantity stepper would carry over from whatever
          // product was open before.
          key={openProduct.id}
          product={openProduct}
          onClose={closeProductDetail}
          momentId={openProductContext}
          onOpenProduct={openProductDetail}
          selection={selection}
          addToSelection={addToSelection}
          removeFromSelection={removeFromSelection}
        />
      )}

      {pendingMessage && <SendModal message={pendingMessage} onClose={() => setPendingMessage(null)} />}

      <Toast message={toast?.text} />
    </div>
  );
}
