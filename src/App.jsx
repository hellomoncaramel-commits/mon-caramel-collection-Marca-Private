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
import Toast from "./components/shared/Toast";

// "cafe" was a standalone moment, since folded into "dia-dificil" (see
// src/data/moments.js). Kept here so any stale link/state still holding
// screen="cafe" lands on the consolidated moment instead of an empty page.
const LEGACY_MOMENT_REDIRECTS = { cafe: "dia-dificil" };

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
  const { favorites, toggleFavorite, toast: favToast } = useFavorites();
  const { selection, addToSelection, removeFromSelection } = useSelection();

  const onGoSelection = () => setScreen("selecao");
  const onNavigate = (id) => setScreen(id === "home" ? null : id);
  const activeNav = screen === null ? "home" : BOTTOM_NAV_SCREENS.includes(screen) ? screen : undefined;

  return (
    <div className="min-h-screen bg-brand-beige font-body">
      <div className="pb-24 md:pb-0">
        {!screen && <HomeScreen onSelect={setScreen} />}

        {screen === "momentos" && <MomentPicker onBack={() => setScreen(null)} onSelectMoment={setScreen} />}

        {screen === "feed" && (
          <FeedScreen
            onBack={() => setScreen(null)}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            selection={selection}
            addToSelection={addToSelection}
            onOpenProduct={setOpenProduct}
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
            onOpenProduct={setOpenProduct}
            onGoFeed={() => setScreen("feed")}
          />
        )}

        {screen === "busca" && (
          <SearchScreen
            onBack={() => setScreen(null)}
            onGoCatalog={() => setScreen("catalogo")}
            selection={selection}
            addToSelection={addToSelection}
            onOpenProduct={setOpenProduct}
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
          <MimosScreen onBack={() => setScreen("presente")} onGoSelection={onGoSelection} />
        )}

        {screen && !NON_MOMENT_SCREENS.includes(screen) && (
          <MomentScreen
            momentId={LEGACY_MOMENT_REDIRECTS[screen] || screen}
            onBack={() => setScreen(null)}
            onGoCatalog={() => setScreen("catalogo")}
            onSend={setPendingMessage}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            selection={selection}
            addToSelection={addToSelection}
            removeFromSelection={removeFromSelection}
            onOpenSelection={onGoSelection}
          />
        )}
      </div>

      <BottomNav
        active={activeNav}
        onNavigate={onNavigate}
        selectionCount={selection.length}
        favoritesCount={favorites.length}
      />

      {/* Desktop-only fallback: BottomNav is hidden at md+, so Minha Seleção
          still needs a way in without the mobile nav. */}
      {selection.length > 0 && screen !== "selecao" && (
        <button
          onClick={onGoSelection}
          className="hidden md:flex fixed bottom-6 left-6 z-40 rounded-full px-5 py-3 text-sm font-medium text-white bg-brand-caramelDark items-center gap-2 shadow-lg"
        >
          <Heart size={15} fill="white" />
          Minha seleção · {selection.length}
        </button>
      )}

      {openProduct && (
        <ProductDetailSheet
          product={openProduct}
          onClose={() => setOpenProduct(null)}
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
