import { useState } from "react";
import { Heart } from "lucide-react";
import { useSelection } from "./hooks/useSelection";
import { useFavorites } from "./hooks/useFavorites";
import HomeScreen from "./components/Home/HomeScreen";
import CatalogScreen from "./components/Catalog/CatalogScreen";
import MomentScreen from "./components/Moment/MomentScreen";
import SelectionScreen from "./components/Selection/SelectionScreen";
import SendModal from "./components/shared/SendModal";

export default function App() {
  const [screen, setScreen] = useState(null); // null = home, "catalogo", "selecao", or a moment id
  const [pendingMessage, setPendingMessage] = useState(null);
  const { favorites, toggleFavorite } = useFavorites();
  const { selection, addToSelection, removeFromSelection } = useSelection();

  const onGoSelection = () => setScreen("selecao");

  return (
    <div className="min-h-screen bg-brand-beige font-body">
      {!screen && <HomeScreen onSelect={setScreen} favorites={favorites} />}

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
          onBack={() => setScreen(null)}
          onSend={setPendingMessage}
        />
      )}

      {screen && screen !== "catalogo" && screen !== "selecao" && (
        <MomentScreen
          momentId={screen}
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

      {selection.length > 0 && screen !== "selecao" && (
        <button
          onClick={onGoSelection}
          className="fixed bottom-6 left-6 z-40 rounded-full px-5 py-3 text-sm font-medium text-white bg-brand-caramelDark flex items-center gap-2 shadow-lg"
        >
          <Heart size={15} fill="white" />
          Minha Seleção ({selection.length})
        </button>
      )}

      {pendingMessage && <SendModal message={pendingMessage} onClose={() => setPendingMessage(null)} />}
    </div>
  );
}
