import { useState } from "react";
import { Heart } from "lucide-react";
import { useSelection } from "./hooks/useSelection";
import { useFavorites } from "./hooks/useFavorites";
import HomeScreen from "./components/Home/HomeScreen";
import MomentPicker from "./components/Home/MomentPicker";
import CatalogScreen from "./components/Catalog/CatalogScreen";
import MomentScreen from "./components/Moment/MomentScreen";
import PresenteEntryScreen from "./components/Presente/PresenteEntryScreen";
import CaixasScreen from "./components/Presente/CaixasScreen";
import BandejasScreen from "./components/Presente/BandejasScreen";
import MimosScreen from "./components/Presente/MimosScreen";
import FeedScreen from "./components/Feed/FeedScreen";
import SavedScreen from "./components/Feed/SavedScreen";
import ProductDetailSheet from "./components/Feed/ProductDetailSheet";
import SearchScreen from "./components/Search/SearchScreen";
import SelectionScreen from "./components/Selection/SelectionScreen";
import SendModal from "./components/shared/SendModal";
import BottomNav from "./components/shared/BottomNav";
import DesktopNav from "./components/shared/DesktopNav";
import Footer from "./components/shared/Footer";
import Toast from "./components/shared/Toast";

// "cafe" and "freezer" were standalone moments, both since folded into
// "dia-dificil" (see src/data/moments.js). Kept here so any stale
// link/state still holding screen="cafe" or screen="freezer" lands on the
// consolidated moment instead of an empty page.
const LEGACY_MOMENT_REDIRECTS = { cafe: "dia-dificil", freezer: "dia-dificil" };

const BOTTOM_NAV_SCREENS = ["salvos", "busca", "selecao"];
const NON_MOMENT_SCREENS = [
  "momentos",
  "feed",
  "salvos",
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
  const [openProduct, setOpenProduct] = useState(null);
  // Which journey opened the product detail sheet — only Dias de luta ever
  // sets this (to "dia-dificil"), which is what turns on the Mon Caramel
  // Experience layer inside ProductDetailSheet (badges/note/cross-sell).
  // Feed/Search/Salvos never pass a context, so the sheet renders exactly
  // as it always has for them.
  const [openProductContext, setOpenProductContext] = useState(null);
  const { favorites, toggleFavorite, toast: favToast } = useFavorites();
  const { selection, addToSelection, removeFromSelection } = useSelection();

  const onGoSelection = () => setScreen("selecao");
  const onNavigate = (id) => setScreen(id === "home" ? null : id);
  const activeNav = screen === null ? "home" : BOTTOM_NAV_SCREENS.includes(screen) ? screen : undefined;
  const openProductDetail = (product, context = null) => {
    setOpenProduct(product);
    setOpenProductContext(context);
  };
  const closeProductDetail = () => {
    setOpenProduct(null);
    setOpenProductContext(null);
  };

  return (
    <div className="min-h-screen bg-brand-beige font-body">
      <DesktopNav active={activeNav} onNavigate={onNavigate} selectionCount={selection.length} favoritesCount={favorites.length} />

      <div className="pb-24 md:pb-0">
        {!screen && (
          <HomeScreen
            onSelect={setScreen}
            onOpenProduct={openProductDetail}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            selection={selection}
          />
        )}

        {screen === "momentos" && <MomentPicker onBack={() => setScreen(null)} onSelectMoment={setScreen} />}

        {screen === "feed" && (
          <FeedScreen
            onBack={() => setScreen(null)}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            selection={selection}
            addToSelection={addToSelection}
            onOpenProduct={openProductDetail}
            onGoSaved={() => setScreen("salvos")}
          />
        )}

        {screen === "salvos" && (
          <SavedScreen
            onBack={() => setScreen(null)}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            selection={selection}
            addToSelection={addToSelection}
            onOpenProduct={openProductDetail}
            onGoFeed={() => setScreen("feed")}
          />
        )}

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
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            selection={selection}
            addToSelection={addToSelection}
            onOpenSelection={onGoSelection}
          />
        )}

        {screen === "selecao" && (
          <SelectionScreen
            selection={selection}
            removeFromSelection={removeFromSelection}
            addToSelection={addToSelection}
            onBack={() => setScreen(null)}
            onSend={setPendingMessage}
          />
        )}

        {screen === "presente" && <PresenteEntryScreen onBack={() => setScreen(null)} onSelect={setScreen} />}

        {screen === "presente-caixas" && (
          <CaixasScreen onBack={() => setScreen("presente")} addToSelection={addToSelection} />
        )}

        {screen === "presente-bandejas" && (
          <BandejasScreen onBack={() => setScreen("presente")} addToSelection={addToSelection} />
        )}

        {screen === "presente-mimos" && (
          <MimosScreen
            onBack={() => setScreen("presente")}
            selection={selection}
            addToSelection={addToSelection}
            onGoSelection={onGoSelection}
          />
        )}

        {screen && !NON_MOMENT_SCREENS.includes(screen) && (
          <MomentScreen
            momentId={LEGACY_MOMENT_REDIRECTS[screen] || screen}
            onBack={() => setScreen(null)}
            onGoCatalog={() => setScreen("catalogo")}
            onSend={setPendingMessage}
            onOpenProduct={openProductDetail}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            selection={selection}
            addToSelection={addToSelection}
            removeFromSelection={removeFromSelection}
            onOpenSelection={onGoSelection}
          />
        )}

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
        favoritesCount={favorites.length}
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
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />
      )}

      {pendingMessage && <SendModal message={pendingMessage} onClose={() => setPendingMessage(null)} />}

      <Toast message={favToast} />
    </div>
  );
}
